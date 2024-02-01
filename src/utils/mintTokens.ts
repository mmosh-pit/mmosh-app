import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";
import * as token from "@solana/spl-token";
import base58 from "bs58";
import { NextResponse } from "next/server";

export async function mintTokens(destination: string, points?: number) {
  try {
    const connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_CLUSTER || "",
      "confirmed"
    );
    const keyPair = Keypair.fromSecretKey(
      new Uint8Array(base58.decode(process.env.NEXT_PUBLIC_SECRET_KEY || ""))
    );
    const tokenDetails = await connection.getTokenSupply(
      new PublicKey(process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS || "")
    );
    const tokenAccount = await token.getOrCreateAssociatedTokenAccount(
      connection,
      keyPair,
      new PublicKey(process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS || ""),
      new PublicKey(destination)
    );

    await token.mintTo(
      connection,
      keyPair,
      new PublicKey(process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS || ""),
      tokenAccount.address,
      keyPair.publicKey,
      points
        ? points * 10 ** tokenDetails.value.decimals
        : parseInt(process.env.NEXT_PUBLIC_TOKEN_MINT_AMOUNT || "100000000000")
    );

    return NextResponse.json("Points transferred to wallet", { status: 200 });
  } catch (error) {
    return NextResponse.json("Error while transferring points", {
      status: 400,
    });
  }
}
