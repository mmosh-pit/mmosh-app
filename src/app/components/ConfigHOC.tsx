"use client";
import Script from "next/script";

import { ConnectionProvider } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";

const ConfigHOC = ({ children }: { children: React.ReactNode }) => {
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_CLUSTER!;

  const WalletProvider = dynamic(() => import("../lib/ClientWalletProvider"), {
    ssr: false,
  });

  return (
    <>
      <Script
        async
        onLoad={() => console.log("Loaded!")}
        strategy="beforeInteractive"
        type="text/javascript"
        src="https://telegram.org/js/telegram-widget.js?22"
      ></Script>
      <Script
        async
        strategy="beforeInteractive"
        type="text/javascript"
        src="https://www.google.com/recaptcha/enterprise.js?render=6Le3O1QpAAAAABxXfBkbNNFgyYbgOQYR43Ia8zcN"
      ></Script>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider autoConnect>
          <div>{children}</div>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
};

// function onClick(e) {
//     e.preventDefault();
//     grecaptcha.enterprise.ready(async () => {
//       const token = await grecaptcha.enterprise.execute('6Le3O1QpAAAAABxXfBkbNNFgyYbgOQYR43Ia8zcN', {action: 'LOGIN'});
//     });
//   }

export default ConfigHOC;
