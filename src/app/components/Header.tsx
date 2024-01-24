"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import { walletAddressShortener } from "../lib/walletAddressShortener";
import { useAtom } from "jotai";
import { UserStatus, accounts, points, status } from "../store";
import useCheckMobileScreen from "../lib/useCheckMobileScreen";
import HamburgerIcon from "@/assets/icons/HamburgerIcon";
import SearchIcon from "@/assets/icons/SearchIcon";

const progress = ["5%", "25%", "50%", "75%", "100%"];

const formatNumber = (value: number) => {
  const units = ["", "K", "M", "B", "T"];

  let absValue = Math.abs(value);

  let exponent = 0;
  while (absValue > 1000 && exponent < units.length - 1) {
    absValue /= 1000;
    exponent++;
  }

  const formattedNumber = absValue.toFixed(2);

  return `${formattedNumber}${units[exponent]}`;
};

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const wallet = useAnchorWallet();
  const [userStatus] = useAtom(status);
  const [totalAccounts] = useAtom(accounts);
  const [totalPoints] = useAtom(points);
  const isMobileScreen = useCheckMobileScreen();

  const getHeaderBackground = React.useCallback(() => {
    let defaultClass =
      "w-full flex flex-col justify-center items-center py-6 px-8 ";

    if (userStatus === UserStatus.fullAccount) {
      defaultClass += "bg-white bg-opacity-[0.07] backdrop-blur-[2px]";
    }

    return defaultClass;
  }, [userStatus]);

  const getProgress = React.useCallback(() => {
    return progress[userStatus];
  }, [userStatus]);

  return (
    <div className="flex flex-col">
      <div className={getHeaderBackground()}>
        <div className="flex w-full justify-between items-center mx-8">
          {isMobileScreen ? (
            <div className="drawer-content">
              <label htmlFor="my-drawer" className="btn drawer-button">
                <HamburgerIcon />
              </label>
            </div>
          ) : (
            <div className="w-[33%]">
              <Image
                src="https://storage.googleapis.com/hellbenders-public-c095b-assets/hellbendersWebAssets/logo.png"
                alt="logo"
                className="ml-8"
                width={isMobileScreen ? 40 : 80}
                height={isMobileScreen ? 40 : 80}
              />
            </div>
          )}

          {userStatus === UserStatus.fullAccount && !isMobileScreen && (
            <div className="flex w-[10%] justify-between">
              <p
                className="text-base text-white"
                onClick={() => router.replace("/")}
              >
                Home
              </p>

              <a
                target="_blank"
                href="https://mmosh.ai"
                className="text-base text-white"
              >
                Website
              </a>
            </div>
          )}

          <div className="flex justify-end items-center w-[33%]">
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
          <div className="w-full flex flex-col justify-center items-center mb-4">
            <div className="xs:w-[60%] sm:w-[50%] lg:w-[40%] h-[25px] bg-[#FFFFFF] bg-opacity-40 rounded-[20px] mb-12">
              <div
                className={`w-[${getProgress()}] h-full flex justify-end items-center`}
              >
                <div id="custom-progress" />
              </div>
            </div>

            <Image
              src="https://storage.googleapis.com/hellbenders-public-c095b-assets/hellbendersWebAssets/mmosh_box.jpeg"
              alt="mmosh"
              width={isMobileScreen ? 150 : 300}
              height={isMobileScreen ? 150 : 300}
            />
          </div>
        )}
      </div>

      {userStatus === UserStatus.fullAccount && pathname === "/" && (
        <div className="w-full flex justify-between items-end mt-12">
          <div className="flex w-[33%]">
            <div className="flex items-center bg-[#F4F4F4] bg-opacity-[0.15] border-[1px] border-[#C2C2C2] rounded-full p-1 backdrop-filter backdrop-blur-[5px]">
              <div className="bg-[#3C00FF] rounded-full px-8 py-4">
                <p className="text-white font-bold text-base">Total Accounts</p>
              </div>
              <p className="text-white font-bold text-base ml-4 px-8">
                {totalAccounts}
              </p>
            </div>

            <div className="flex items-center bg-[#F4F4F4] bg-opacity-[0.15] border-[1px] border-[#C2C2C2] rounded-full p-1 ml-8 backdrop-filter backdrop-blur-[5px]">
              <div className="bg-[#3C00FF] rounded-full px-8 py-4">
                <p className="text-white font-bold text-base">Total Points</p>
              </div>
              <p className="text-white font-bold text-base ml-4 px-8">
                {formatNumber(totalPoints)}
              </p>
            </div>
          </div>

          <Image
            src="https://storage.googleapis.com/hellbenders-public-c095b-assets/hellbendersWebAssets/mmosh_box.jpeg"
            alt="mmosh"
            width={isMobileScreen ? 150 : 300}
            height={isMobileScreen ? 150 : 300}
          />

          <div className="w-[33%] flex items-center bg-[#F4F4F4] bg-opacity-[0.15] border-[1px] border-[#C2C2C2] rounded-full p-1 backdrop-filter backdrop-blur-[5px]">
            <button className="flex bg-[#3C00FF] rounded-full px-12 py-4">
              <SearchIcon />

              <p className="text-white font-bold text-base ml-4">Search</p>
            </button>

            <input
              placeholder="Type your search terms"
              className="ml-4 w-full bg-transparent outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
