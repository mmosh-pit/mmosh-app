import { PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";

export interface FrostWallet {
  publicKey: PublicKey;
  signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T>;
  signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]>;
}