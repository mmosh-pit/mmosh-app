import { db } from "../../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import {
  Connection,
  Keypair,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import { Connectivity as UserConn } from "@/anchor/user";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { web3Consts } from "@/anchor/web3Consts";
import * as anchor from "@coral-xyz/anchor";
import { coinStats } from "@/app/store/coins";
import axios from "axios";

export async function POST(req: NextRequest) {
  console.log("inside the ocatane gas fees ==================>>");

  const { wallet, gasBalance, token } = await req.json();

  const userCollection = db.collection("mmosh-users");
  const gasBalanceCollection = db.collection("mmosh-app-gas-balance");
  try {
    const findUser = await userCollection.findOne({ wallet: wallet });

    if (!findUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    } else {
      let existingBalance = await gasBalanceCollection.findOne({
        wallet: wallet,
      });

      if (!existingBalance) {
        let insertGasBalance = await gasBalanceCollection.insertOne({
          wallet: wallet,
          gasBalance: gasBalance,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(insertGasBalance, "insertGasBalance ==========>");
        return NextResponse.json(insertGasBalance, { status: 200 });
      } else {
        const currentBalance = existingBalance.gasBalance;

        const newBalance = currentBalance + gasBalance;
        let updateGasBalance = await gasBalanceCollection.updateOne(
          { wallet },
          { $set: { gasBalance: newBalance, updatedAt: new Date() } }
        );
      }
      console.log('+')
      const adminPrivateKey = process.env.PTV_WALLET!;
      const private_buffer = bs58.decode(adminPrivateKey);
      const private_arrray = new Uint8Array(
        private_buffer.buffer,
        private_buffer.byteOffset,
        private_buffer.byteLength / Uint8Array.BYTES_PER_ELEMENT
      );
      let ptvOwner = Keypair.fromSecretKey(private_arrray); // get both public and private

      console.log(
        ptvOwner,
        "get the public key and private ==================>>"
      );
      console.log(
        "------------------------start-------------------------------------------"
      );

      // to connect the solana and creating anchor provider
      let rpcUrl: any = process.env.NEXT_PUBLIC_SOLANA_CLUSTER;
      let connection = new Connection(rpcUrl, {
        confirmTransactionInitialTimeout: 120000,
      });
      let adminWallet = new NodeWallet(ptvOwner); // which wallet to use sign the transcation
      const env = new anchor.AnchorProvider(connection, adminWallet, {
        preflightCommitment: "processed",
      });

      console.log(
        "-------------------------------step 1----------------------------- "
      );

      //to call particular solana smart contract uisng program i d
      let userConn: UserConn = new UserConn(env, web3Consts.programID);
      let txis = [];
      console.log(
        "---------------------go to transfer token ------------------------------"
      );
      let instructions: any = await userConn.baseSpl.transfer_token_modified({
        mint: new anchor.web3.PublicKey(web3Consts.usdcToken), //usdc token from env
        sender: new anchor.web3.PublicKey(wallet), // user address
        receiver: new anchor.web3.PublicKey(
          process.env.NEXT_PUBLIC_PTV_WALLET_KEY || ""
        ),
        init_if_needed: true,
        amount: Math.ceil(gasBalance * 10 ** 6), // 400000
      });

      console.log(
        "-------------------------step 2 -----------------------------------"
      );

      console.log(
        instructions,
        " instructions from the transfer token modified ==================>>"
      );

      for (let i = 0; i < instructions.length; i++) {
        txis.push(instructions[i]);
      }
      const freezeInstructions = await calculatePriorityFee(
        txis,
        new anchor.web3.PublicKey(wallet),
        userConn,
        token
      );

      console.log(
        freezeInstructions,
        "freezeInstructions from the calculate fee ========================>>"
      );
      for (let j = 0; j < freezeInstructions.length; j++) {
        const element = freezeInstructions[j];
        txis.push(element);
      }

      console.log(
        "go to the getlatest blockhas ===============================>"
      );

      const blockhash = (await connection.getLatestBlockhash()).blockhash;

      console.log(
        blockhash,
        "--------------------block hash ------------------------------------------"
      );
      const message = new anchor.web3.TransactionMessage({
        payerKey: new anchor.web3.PublicKey(wallet),
        recentBlockhash: blockhash,
        instructions: [...txis],
      }).compileToV0Message([]);

      console.log(
        message,
        "----------transcation message -----------------------------"
      );

      const tx = new anchor.web3.VersionedTransaction(message);
      console.log(
        tx,
        "--------------------------tx ------------------------------------"
      );
      const serialized = Buffer.from(tx.serialize()).toString("base64");

      console.log(serialized, "serialized =============================>");

      return NextResponse.json(
        {
          status: true,
          serialized: serialized,
          message: "Fee amount distributed to the pool",
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.log(error, "from the api ======================>");
    return NextResponse.json(
      { message: error.message || "something went wrong" },
      { status: 400 }
    );
  }
}

// fees calculation
const calculatePriorityFee = async (
  ixs: any,
  wallet: any,
  userConn: UserConn,
  token: string
) => {
  let rpcUrl: any = process.env.NEXT_PUBLIC_SOLANA_CLUSTER;

  let connection = new Connection(rpcUrl, {
    confirmTransactionInitialTimeout: 120000,
  });
  const blockhash = (await connection.getLatestBlockhash()).blockhash;
  const message = new anchor.web3.TransactionMessage({
    payerKey: userConn.provider.publicKey,
    recentBlockhash: blockhash,
    instructions: [...ixs],
  }).compileToV0Message([]);

  const tx = new anchor.web3.VersionedTransaction(message);
  const signedTx = await signTransaction(token, tx, wallet);

  const feeEstimate = await userConn.getPriorityFeeEstimate(signedTx);
  let feeIns: any = [];
  if (feeEstimate > 0) {
    feeIns.push(
      anchor.web3.ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: feeEstimate,
      })
    );
    feeIns.push(
      anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
        units: 1_400_000,
      })
    );
  } else {
    feeIns.push(
      anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
        units: 1_400_000,
      })
    );
  }

  return feeIns;
};

export const signTransaction = async (
  token: string,
  tx: VersionedTransaction,
  wallet: string
): Promise<VersionedTransaction> => {
  try {
    const clientInstance = client(token);
    const messageBytes: any = tx.message.serialize();
    const hex = Buffer.from(messageBytes).toString("hex");
    const result = await clientInstance.post("/sign", { message: hex });
    const signature: any = Buffer.from(result.data.data.signature, "hex");

    const signerIndex = tx.message.staticAccountKeys.findIndex((key) =>
      key.equals(new anchor.web3.PublicKey(wallet))
    );

    if (signerIndex === -1) {
      throw new Error("Signer public key not found in account keys");
    }

    tx.signatures[signerIndex] = signature;

    return tx;
  } catch (err) {
    console.error("Error signing transaction:", err);
    throw err;
  }
};

const client = (token: string) => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    timeout: 20000,
    headers: {
      "content-type": "application/json",
    },
  });

  client.interceptors.request.use(
    async (config) => {
      config.headers.authorization = `Bearer ${token}`;
      return config;
    },
    (error) => {
      console.error(error);
      return Promise.reject(error);
    }
  );
  return client;
};
