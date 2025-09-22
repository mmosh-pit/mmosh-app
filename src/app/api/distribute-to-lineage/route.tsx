import { db } from "@/app/lib/mongoClient";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { Connection, Keypair } from "@solana/web3.js";
import { Connectivity as UserConn } from "@/anchor/user";
import * as anchor from "@coral-xyz/anchor";
import { NextRequest, NextResponse } from "next/server";
import { web3Consts } from "@/anchor/web3Consts";

export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-app-staked-history");
  const { stakedAmount, userAddeess, purchaseId } = await req.json();
  if (!stakedAmount || !userAddeess || !purchaseId) {
    return NextResponse.json(
      {
        status: false,
        message: "All params are required.",
        result: null,
      },
      { status: 400 }
    );
  }
  const stakedHistory = await collection.findOne({ purchaseId: purchaseId });
  if (stakedHistory !== null) {
    return NextResponse.json(
      {
        status: false,
        message: "Purchase ID already exists.",
        result: null,
      },
      { status: 400 }
    );
  }

  const authHeader = req.headers.get("authorization");
  const adminPrivateKey = process.env.PTV_WALLET!;
  const private_buffer = bs58.decode(adminPrivateKey);
  const private_arrray = new Uint8Array(
    private_buffer.buffer,
    private_buffer.byteOffset,
    private_buffer.byteLength / Uint8Array.BYTES_PER_ELEMENT
  );
  let ptvOwner = Keypair.fromSecretKey(private_arrray);
  let rpcUrl: any = process.env.NEXT_PUBLIC_SOLANA_CLUSTER;
  let connection = new Connection(rpcUrl, {
    confirmTransactionInitialTimeout: 120000,
  });
  let wallet = new NodeWallet(ptvOwner);
  const env = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: "processed",
  });
  let userConn: UserConn = new UserConn(env, web3Consts.programID);
  let balance: any = await userConn.getUserBalance({
    address: wallet.publicKey,
    token: web3Consts.usdcToken.toBase58(),
    decimals: 6,
  });

  if (balance < stakedAmount) {
    return NextResponse.json(
      { error: "Insufficient USDC balance in admin wallet" },
      { status: 400 }
    );
  }

  const result = await userConn.distributeToLineage({
    parentProfile: wallet.publicKey.toBase58(),
    price: stakedAmount,
    token: authHeader,
  });

  if (result.Ok) {
    await collection.insertOne({
      category: "membership",
      stakedAmount: stakedAmount,
      unStakedAmount: 0,
      purchaseId: purchaseId,
      wallet: userAddeess,
      created_date: Date.now(),
    });
    return NextResponse.json(
      {
        status: true,
        message: "Funds successfully disbursed to lineage",
        result: result.Ok.signature,
      },
      { status: 200 }
    );
  }
  return NextResponse.json(
    {
      status: false,
      message: "Something went wrong, please try again later.",
      result: null,
    },
    { status: 500 }
  );
}
