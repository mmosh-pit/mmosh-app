"use client";

import React from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import { walletAddressShortener } from "../lib/walletAddressShortener";
import { useAtom } from "jotai";
import { UserStatus, status } from "../store";
import useCheckMobileScreen from "../lib/useCheckMobileScreen";
import HamburgerIcon from "@/assets/icons/HamburgerIcon";

const Header = () => {
  const wallet = useAnchorWallet();
  const [userStatus] = useAtom(status);
  const isMobileScreen = useCheckMobileScreen();

  const getHeaderBackground = React.useCallback(() => {
    let defaultClass =
      "w-full flex flex-col justify-center items-center py-6 px-8 ";

    if (userStatus === UserStatus.fullAccount) {
      console.log("Returning with extra");
      defaultClass += "bg-white bg-opacity-[0.07] backdrop-blur-[2px]";
    }

    return defaultClass;
  }, [userStatus]);

  return (
    <div className={getHeaderBackground()}>
      <div className="flex w-full justify-between items-center mx-8">
        {isMobileScreen ? (
          <div className="drawer-content">
            <label htmlFor="my-drawer" className="btn drawer-button">
              <HamburgerIcon />
            </label>
          </div>
        ) : (
          <Image
            src="https://storage.googleapis.com/hellbenders-public-c095b-assets/hellbendersWebAssets/logo.png"
            alt="logo"
            className="ml-8"
            width={isMobileScreen ? 40 : 80}
            height={isMobileScreen ? 40 : 80}
          />
        )}

        {userStatus === UserStatus.fullAccount && !isMobileScreen && (
          <div className="flex w-[10%] justify-between">
            <p className="text-base text-white">Home</p>

            <p className="text-base text-white">Website</p>
          </div>
        )}

        <div className="flex justify-between items-center">
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
        <div className="flex flex-col justify-center items-center mb-4">
          <Image
            src="https://storage.googleapis.com/hellbenders-public-c095b-assets/hellbendersWebAssets/mmosh_box.jpeg"
            alt="mmosh"
            width={isMobileScreen ? 150 : 300}
            height={isMobileScreen ? 150 : 300}
          />
        </div>
      )}
    </div>
  );
};

export default Header;
