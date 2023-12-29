"use client";

import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import { walletAddressShortener } from "../lib/walletAddressShortener";
import { useAtom } from "jotai";
import { UserStatus, status } from "../store";
import useCheckMobileScreen from "../lib/useCheckMobileScreen";

const Header = () => {
  const wallet = useAnchorWallet();
  const [userStatus] = useAtom(status);
  const isMobileScreen = useCheckMobileScreen();

  return (
    <div className="w-full flex flex-col justify-center items-center pt-12 px-8">
      <div className="flex w-full justify-between mx-8">
        <Image
          src="https://storage.googleapis.com/hellbenders-public-c095b-assets/hellbendersWebAssets/logo.png"
          alt="logo"
          width={isMobileScreen ? 40 : 80}
          height={isMobileScreen ? 40 : 80}
        />

        {wallet?.publicKey && (
          <WalletMultiButton
            startIcon={undefined}
            style={{
              backgroundColor: "#3C4854",
              padding: "1em 4em",
              borderRadius: 15,
            }}
          >
            <p className="text-lg">
              {walletAddressShortener(wallet.publicKey.toString())}
            </p>
          </WalletMultiButton>
        )}
      </div>

      {userStatus !== UserStatus.fullAccount && (
        <div>
          <Image
            src="https://storage.googleapis.com/hellbenders-public-c095b-assets/hellbendersWebAssets/mmosh.png"
            alt="mmosh"
            width={isMobileScreen ? 150 : 400}
            height={isMobileScreen ? 50 : 200}
          />
        </div>
      )}
    </div>
  );
};

export default Header;
