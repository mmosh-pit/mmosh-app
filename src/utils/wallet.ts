import { PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import axios from "axios";
import bs58 from "bs58";
import * as React from "react";
import { FrostWallet } from "./frostWallet";
import * as anchor from "@coral-xyz/anchor";

const useWallet = () => {
  const [wallet, setWallet] = React.useState<FrostWallet>();

  React.useEffect(() => {
     getMyWallet()
  },[]);

  const getMyWallet = async() => {
    try {
      const result = await axios.get("/api/frost/address")
      const frostWallet: FrostWallet = {
        publicKey: new PublicKey(result.data.data),
        signTransaction: async <T extends Transaction | VersionedTransaction>(tx: T): Promise<T> => {
          // mock or actual signing logic
          if ('version' in tx) {
            console.log("version transaction")
            const messageBytes:any = tx.message.serialize();
            const hex =  Buffer.from(messageBytes).toString('hex');
            console.log("message hex", hex);
            const result = await axios.post("/api/frost/sign",{message: hex});
            console.log("message address", result.data.address);
            console.log("message signature", result.data.signature);
            let signature:any = Buffer.from(result.data.signature, 'hex')
            tx.signatures = [signature];
          } else {
            console.log("normal transaction")
            const message:any = tx.compileMessage(); // ✅ works for legacy Transaction
            const messageBytes = message.serialize();
            const hex =  Buffer.from(messageBytes).toString('hex');
            console.log("message hex", hex);
            const result = await axios.post("/api/frost/sign",{message: hex});
            console.log("message address", result.data.address);
            console.log("message signature", result.data.signature);
            tx.addSignature(new anchor.web3.PublicKey(result.data.address), Buffer.from(result.data.signature, 'hex'));
          }

          return tx;
        },
        signAllTransactions: async <T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> => {
          // mock or actual signing logic
          console.log("signAllTransactions started")
          return txs;
        },
      };
      setWallet(frostWallet);
    } catch (err) {
      console.error(err);
    }
  }

  return wallet;
};

export default useWallet;

