"use client";

import { ConnectionProvider } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";

const ConfigHOC = ({ children }: { children: React.ReactNode }) => {
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_CLUSTER!;

  const WalletProvider = dynamic(() => import("../lib/ClientWalletProvider"), {
    ssr: false,
  });

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider autoConnect>{children}</WalletProvider>
    </ConnectionProvider>
  );
};

export default ConfigHOC;
