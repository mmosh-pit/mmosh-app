import {
  Connection,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

import * as anchor from "@coral-xyz/anchor";

import { AnchorWallet } from "@solana/wallet-adapter-react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
} from "forge-spl-token";
import { getExplorerLink } from "@solana-developers/helpers";

export async function transferAsset(
  wallet: AnchorWallet,
  mintAddress: string,
  receiver: string,
  amount: string,
  decimals: number,
  retries = 0,
): Promise<string> {
  try {
    // connection to Solana.
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_CLUSTER!);
    const env = new anchor.AnchorProvider(connection, wallet, {
      preflightCommitment: "processed",
    });

    // Mint address of the NFT.
    const mintPubkey = new PublicKey(mintAddress);
    // Recipient of the NFT.
    const receiverPubkey = new PublicKey(receiver);

    // Original Token Account
    const tokenAccount1Pubkey = await getAssociatedTokenAddress(
      mintPubkey,
      wallet.publicKey,
    );

    const associatedTokenTo = await getAssociatedTokenAddress(
      mintPubkey,
      receiverPubkey,
    );

    const decimalMultiplier = Number("1".padEnd(decimals, "0")) * 10;

    const blockhash = await connection
      .getLatestBlockhash()
      .then((res) => res.blockhash);

    const instructions = [
      createTransferCheckedInstruction(
        tokenAccount1Pubkey,
        mintPubkey,
        associatedTokenTo,
        wallet.publicKey,
        Number(amount) * decimalMultiplier,
        decimals,
        [],
        TOKEN_PROGRAM_ID,
      ),
    ];

    const messageV0 = new TransactionMessage({
      payerKey: wallet.publicKey,
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message();

    const transaction = new VersionedTransaction(messageV0);

    const txid = await env.sendAndConfirm(transaction);

    const explorerLink = getExplorerLink("transaction", txid, "mainnet-beta");

    return explorerLink;
  } catch (err) {
    if (retries < 3) {
      return transferAsset(
        wallet,
        mintAddress,
        receiver,
        amount,
        decimals,
        retries + 1,
      );
    }

    console.error("Got error trying to send: ", err);

    return "";
  }
}
