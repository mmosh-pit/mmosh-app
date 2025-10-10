import { db } from "../../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";
import { Connection, Keypair } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { Connectivity as UserConn } from "@/anchor/user";
import { web3Consts } from "@/anchor/web3Consts";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { PagesRouteModule } from "next/dist/server/future/route-modules/pages/module.compiled";

export async function POST(req: NextRequest) {
  console.log("inside the ocatane gas fees ==================>>");

  

  const userCollection = db.collection("mmosh-users");
  const userMemberShip = db.collection("mmosh-app-user-membership");
  const { userWallet, serialized,wallet } = await req.json();

  try {
    console.log(wallet, "wallet ========================>");
    console.log(serialized, "senrialized ============>>");

    const findUser = await userCollection.findOne({ wallet: userWallet });

    if (!findUser) {
      console.log("user not found =======================>");
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    } else {
      const findMembership = await userMemberShip.findOne({
        wallet: userWallet,
      });

      console.log("user as guest");
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
      let adminWallet = new NodeWallet(ptvOwner);
      const env = new anchor.AnchorProvider(connection, wallet, {
        preflightCommitment: "processed",
      });
      let userConn: UserConn = new UserConn(env, web3Consts.programID);




      console.log(
        serialized,
        "serialized from the api -------------------------------"
      );
      const tx = anchor.web3.VersionedTransaction.deserialize(serialized);
      const signature = await userConn.provider.sendAndConfirm(tx, []);

      console.log(signature, "signature");
      return NextResponse.json(signature, { status: 200 });
    }
  } catch (error) {
    console.error("Error finding user:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 400 }
    );
  }
}
