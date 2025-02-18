import { db } from "../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";
import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";


export async function GET(req: NextRequest) {
  const collection = db.collection("mmosh-app-tokens");
  const { searchParams } = new URL(req.url);
  const bonding = searchParams.get("bonding");
  if(!bonding) {
    return NextResponse.json({status: false}, {
      status: 200,
    });
  }

  const result = await collection.findOne({bonding});
  if(!result) {
    return NextResponse.json({status: false}, {
      status: 200,
    });
  }



  const privateKey = process.env.PTV_WALLET!;
  const private_buffer = bs58.decode(privateKey);
  const private_arrray = new Uint8Array(
    private_buffer.buffer,
    private_buffer.byteOffset,
    private_buffer.byteLength / Uint8Array.BYTES_PER_ELEMENT,
  );
  let ptvOwner = Keypair.fromSecretKey(private_arrray);

  let rpcUrl: any = process.env.NEXT_PUBLIC_SOLANA_CLUSTER;
  let connection = new Connection(rpcUrl, {
    confirmTransactionInitialTimeout: 120000
  });
  let wallet = new NodeWallet(ptvOwner);

  console.log("wallet.publicKey.toBase58() ", wallet.publicKey.toBase58());
  const env = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: "processed",
  });
  return NextResponse.json({status: true}, {
      status: 200,
  });
}