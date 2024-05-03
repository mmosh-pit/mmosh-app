"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import { walletAddressShortener } from "../lib/walletAddressShortener";
import { useAtom } from "jotai";
import {
  UserStatus,
  accounts,
  data,
  incomingWallet,
  isDrawerOpen,
  points,
  searchBarText,
  settings,
  status,
} from "../store";
import useCheckMobileScreen from "../lib/useCheckMobileScreen";
import SearchIcon from "@/assets/icons/SearchIcon";
import MobileDrawer from "./Profile/MobileDrawer";
import axios from "axios";

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
  const [currentUser] = useAtom(data);
  const [isOnSettings, setIsOnSettings] = useAtom(settings);
  const [totalAccounts, setTotalAccounts] = useAtom(accounts);
  const [incomingWalletToken, setIncomingWalletToken] = useAtom(incomingWallet);
  const [isDrawerShown] = useAtom(isDrawerOpen);
  const [totalRoyalties, setTotalRoyalties] = useAtom(points);
  const [_, setSearchText] = useAtom(searchBarText);
  const [localText, setLocalText] = React.useState("");
  const isMobileScreen = useCheckMobileScreen();

  const getHeaderBackground = React.useCallback(() => {
    let defaultClass =
      "w-full flex flex-col justify-center items-center py-6 px-8 ";

    if (pathname === "/create") {
      defaultClass += "bg-black bg-opacity-[0.56] backdrop-blur-[2px]";
    }

    if (pathname !== "/" || isOnSettings) {
      defaultClass += "bg-white bg-opacity-[0.07] backdrop-blur-[2px]";
    }

    if (pathname === "/" && !isOnSettings) {
      defaultClass += "bg-black bg-opacity-[0.56] backdrop-blur-[2px]";
    }

    return defaultClass;
  }, [userStatus, pathname]);

  const executeSearch = React.useCallback(() => {
    const text = localText.replace("@", "");
    setSearchText(text);
  }, [localText]);

  const getTotals = React.useCallback(async () => {
    const res = await axios.get("/api/get-header-analytics");

    setTotalAccounts(res.data.members);
    setTotalRoyalties(res.data.royalties);
  }, []);

  React.useEffect(() => {
    if (userStatus === UserStatus.fullAccount && pathname === "/") {
      getTotals();
    }
  }, [userStatus]);

  React.useEffect(() => {
    if (wallet?.publicKey && incomingWalletToken !== "") {
      (async () => {
        await axios.post("/api/link-social-wallet", {
          token: incomingWalletToken,
          wallet: wallet.publicKey.toString(),
        });
        setIncomingWalletToken("");
      })();
    }
  }, [wallet, incomingWalletToken]);

  return (
    <div className="flex flex-col">
      <div className={getHeaderBackground()}>
        <div className="flex w-full justify-between items-center mx-8">
          {isMobileScreen ? (
            <MobileDrawer />
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

          {!isMobileScreen && (
            <div className="flex w-[25%] justify-between items-center">
              <p
                className="text-base text-white cursor-pointer"
                onClick={() => router.replace("/")}
              >
                Home
              </p>

              <p
                className="text-base text-white cursor-pointer"
                onClick={() => {
                  if (isOnSettings) return setIsOnSettings(false);
                  router.push(`/${currentUser?.profile.username}`);
                }}
              >
                My Profile
              </p>

              <a
                target="_blank"
                href="https://www.mmosh.ai"
                className="text-base text-white cursor-pointer"
              >
                Website
              </a>

              <a
                href="https://forge.mmosh.app"
                className="text-base text-white cursor-pointer"
              >
                Forge
              </a>
            </div>
          )}

          <div className="flex justify-end items-center w-[33%]">
            {currentUser?.profile?.image && (
              <div className="relative w-[2.5vmax] h-[2.5vmax] mr-6">
                <Image
                  src={currentUser.profile.image}
                  alt="Profile Image"
                  className="rounded-full"
                  layout="fill"
                />
              </div>
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

            {userStatus === UserStatus.fullAccount &&
              !isMobileScreen &&
              currentUser?.telegram?.id && (
                <button
                  className="relative bg-[#03002B] px-6 py-3 rounded-xl ml-6"
                  onClick={() => setIsOnSettings(true)}
                >
                  <p className="text-base text-white font-bold settings-btn">
                    Settings
                  </p>
                </button>
              )}
          </div>
        </div>

        {userStatus !== UserStatus.fullAccount && pathname === "/" && (
          <div className="w-full flex flex-col justify-center items-center mb-4">
            <div
              className={`relative ${isDrawerShown ? "z-[-1]" : ""} ${isMobileScreen ? "w-[150px] h-[150px]" : "w-[16vmax] h-[16vmax]"}`}
            >
              <Image
                src="https://storage.googleapis.com/hellbenders-public-c095b-assets/hellbendersWebAssets/mmosh_box.jpeg"
                alt="mmosh"
                layout="fill"
              />
            </div>
          </div>
        )}
      </div>

      {userStatus === UserStatus.fullAccount &&
        pathname === "/" &&
        !isOnSettings && (
          <div className="w-full flex justify-center lg:justify-between items-end mt-12">
            {!isMobileScreen && (
              <div className="flex w-[33%]">
                <div className="flex items-center bg-[#F4F4F4] bg-opacity-[0.15] border-[1px] border-[#C2C2C2] rounded-full p-1 backdrop-filter backdrop-blur-[5px]">
                  <div className="bg-[#3C00FF] rounded-full px-8 py-4">
                    <p className="text-white font-bold text-base">
                      Total Members
                    </p>
                  </div>
                  <p className="text-white font-bold text-base ml-4 px-8">
                    {totalAccounts}
                  </p>
                </div>

                <div className="flex items-center bg-[#F4F4F4] bg-opacity-[0.15] border-[1px] border-[#C2C2C2] rounded-full p-1 ml-8 backdrop-filter backdrop-blur-[5px]">
                  <div className="bg-[#3C00FF] rounded-full px-8 py-4">
                    <p className="text-white font-bold text-base">
                      Total Royalties
                    </p>
                  </div>
                  <p className="text-white font-bold text-base ml-4 px-8">
                    {formatNumber(totalRoyalties)}
                  </p>
                </div>
              </div>
            )}

            <div className="relative w-[16vmax] h-[16vmax]">
              <Image
                src="https://storage.googleapis.com/hellbenders-public-c095b-assets/hellbendersWebAssets/mmosh_box.jpeg"
                alt="mmosh"
                layout="fill"
              />
            </div>

            {!isMobileScreen && (
              <div className="w-[33%] flex items-center bg-[#F4F4F4] bg-opacity-[0.15] border-[1px] border-[#C2C2C2] rounded-full p-1 backdrop-filter backdrop-blur-[5px]">
                <button
                  className="flex bg-[#3C00FF] rounded-full px-12 py-4 items-center"
                  onClick={executeSearch}
                >
                  <SearchIcon />

                  <p className="text-white font-bold text-base ml-4">Search</p>
                </button>

                <input
                  placeholder="Type your search terms"
                  className="ml-4 w-full bg-transparent outline-none"
                  value={localText}
                  onChange={(e) => setLocalText(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      executeSearch();
                    }
                  }}
                />
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default Header;
