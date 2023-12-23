"use client";

import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import { walletAddressShortener } from "../lib/walletAddressShortener";

const Header = () => {
  const wallet = useAnchorWallet();

  return (
    <div className="flex flex-col">
      <div className="flex w-full justify-between mx-8">
        <Image
          src="https://storage.googleapis.com/hellbenders-public-c095b-assets/hellbendersWebAssets/logo.png"
          alt="logo"
          width={80}
          height={80}
        />

        {wallet?.publicKey && (
          <WalletMultiButton
            startIcon={undefined}
            style={{
              backgroundColor: "#FCAE0E",
              padding: "1em 4em",
              borderRadius: 15,
            }}
          >
            <p className="text-black text-lg">
              {walletAddressShortener(wallet.publicKey.toString())}
            </p>
          </WalletMultiButton>
        )}
      </div>

      <div>
        <Image
          src="https://storage.googleapis.com/hellbenders-public-c095b-assets/hellbendersWebAssets/mmosh.png"
          alt="mmosh"
          width={400}
          height={200}
        />
      </div>
    </div>
  );
};

export default Header;
