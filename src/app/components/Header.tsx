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
          className="ml-8"
          width={isMobileScreen ? 40 : 80}
          height={isMobileScreen ? 40 : 80}
        />

        {userStatus === UserStatus.fullAccount && (
          <div className="flex w-[10%] justify-between">
            <p className="text-base text-white">Home</p>

            <p className="text-base text-white">Website</p>
          </div>
        )}

        <div>
          {userStatus === UserStatus.fullAccount && (
            <button className="bg-[#3A3488] bg-opacity-[0.54] px-6 py-3 rounded-xl mr-6">
              <p className="text-base text-white font-bold">Settings</p>
            </button>
          )}
          {(wallet?.publicKey || userStatus === UserStatus.fullAccount) && (
            <WalletMultiButton
              startIcon={undefined}
              style={{
                background:
                  "linear-gradient(91deg, #D858BC -3.59%, #3C00FF 102.16%)",
                padding: "0 2em",
                borderRadius: 15,
              }}
            >
              <p className="text-lg text-white">
                {wallet?.publicKey
                  ? walletAddressShortener(wallet.publicKey.toString())
                  : "Connect Wallet"}
              </p>
            </WalletMultiButton>
          )}
        </div>
      </div>

      {userStatus !== UserStatus.fullAccount && (
        <div className="flex flex-col justify-center items-center">
          <Image
            src="https://storage.googleapis.com/hellbenders-public-c095b-assets/hellbendersWebAssets/mmosh_white.png"
            alt="mmosh"
            width={isMobileScreen ? 150 : 400}
            height={isMobileScreen ? 50 : 200}
          />

          <p className="text-xl text-white font-goudy font-normal">
            {userStatus !== UserStatus.noProfile
              ? "Welcome to the MMOSH PIT!"
              : "Create Your MMOSH Account"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Header;
