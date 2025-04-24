import { Connection, PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import axios from "axios";
import bs58 from "bs58";
import * as React from "react";

interface ConnectionContextState {
    connection: Connection;
}

const useConnection = () => {
  const [connection] = React.useState<ConnectionContextState>({
    connection: new Connection(
        process.env.NEXT_PUBLIC_SOLANA_CLUSTER!,
        {
          confirmTransactionInitialTimeout: 120000,
        },
     )
  });

  return connection;
};

export default useConnection;

