"use client";
import * as React from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { useAtom } from "jotai";

import DesktopNavbar from "../components/Profile/DesktopNavbar";
import Image from "next/image";
import useCheckMobileScreen from "../lib/useCheckMobileScreen";

import { UserStatus, isDrawerOpen, settings, status } from "../store";
import { User } from "../models/user";
import TelegramAccount from "../components/Profile/TelegramAccount";
import TwitterAccount from "../components/Profile/TwitterAccount";
import { init } from "../lib/firebase";
import CopyIcon from "@/assets/icons/CopyIcon";
import Banner from "../components/Banner";
import { walletAddressShortener } from "../lib/walletAddressShortener";
import BotBanner from "../components/BotBanner";
import GuildList from "../components/GuildList";
import Settings from "../components/Settings";

const Profile = ({ params }: { params: { username: string } }) => {
  const isMobile = useCheckMobileScreen();
  const rendered = React.useRef(false);
  const wallet = useAnchorWallet();
  const [isOnSettings] = useAtom(settings);
  const [isDrawerShown] = useAtom(isDrawerOpen);
  const [isTooltipShown, setIsTooltipShown] = React.useState(false);
  const [isFirstTooltipShown, setIsFirstTooltipShown] = React.useState(false);
  const [isSecTooltipShown, setIsSecTooltipShown] = React.useState(false);
  const [userData, setUserData] = React.useState<User>();
  const [rankData, setRankData] = React.useState({
    points: 0,
    rank: 0,
  });
  const [lhcWallet, setLhcWallet] = React.useState("");
  const [_, setUserStatus] = useAtom(status);

  const getUserData = React.useCallback(async () => {
    const result = await axios.get(
      `/api/get-user-data?username=${params.username}`,
    );

    setUserData({
      ...result.data,
    });
  }, [params]);

  const getRankData = React.useCallback(async () => {
    const result = await axios.get(
      `/api/get-rank-data?user=${userData?.telegram.id}`,
    );

    setRankData(result.data);
  }, [userData]);

  const getLhcWallet = React.useCallback(async () => {
    const result = await axios.get(
      `/api/get-lhc-address?id=${userData?.telegram.id}`,
    );

    setLhcWallet(result.data?.addressPublicKey);
  }, [userData]);

  const isMyProfile = wallet?.publicKey?.toString() === userData?.wallet;

  const copyToClipboard = React.useCallback(
    async (text: string, textNumber: number) => {
      if (textNumber === 1) {
        setIsFirstTooltipShown(true);
      } else if (textNumber === 2) {
        setIsSecTooltipShown(true);
      } else {
        setIsTooltipShown(true);
      }
      await navigator.clipboard.writeText(text);

      setTimeout(() => {
        if (textNumber === 1) {
          setIsFirstTooltipShown(false);
        } else if (textNumber === 2) {
          setIsSecTooltipShown(false);
        } else {
          setIsTooltipShown(false);
        }
      }, 2000);
    },
    [],
  );

  React.useEffect(() => {
    setUserStatus(UserStatus.fullAccount);
    if (!params.username) return;
    getUserData();
  }, [params]);

  React.useEffect(() => {
    if (!userData) return;

    getRankData();
    getLhcWallet();
  }, [userData]);

  React.useEffect(() => {
    if (!rendered.current) {
      init();
      rendered.current = true;
    }
  }, []);

  if (!userData) return <></>;

  if (isOnSettings) {
    return <Settings />;
  }

  return (
    <div className="w-full h-screen flex flex-col">
      {wallet?.publicKey && <BotBanner />}
      {wallet?.publicKey && <Banner fromProfile />}
      <div
        className={`w-full flex flex-col md:flex-row ${isMyProfile ? "lg:justify-between" : "lg:justify-around"} px-6 md:px-12 mt-16`}
      >
        {!isMobile && isMyProfile && <DesktopNavbar />}

        <div
          className={`w-full flex flex-col items-center lg:items-start lg:flex-row lg:justify-around mt-16`}
        >
          <div className="flex flex-col lg:w-[80%] md:w-[90%] w-[100%]">
            <div className="w-full flex flex-col">
              <p className="text-lg text-white font-bold font-goudy">
                {isMyProfile
                  ? "My MMOSH Account"
                  : `${userData?.profile?.name}'s Hideout`}
              </p>

              <div
                className="w-full flex flex-col bg-[#6536BB] bg-opacity-20 rounded-tl-[3vmax] rounded-tr-md rounded-b-md pl-4 pt-4 pb-8 pr-8 mt-4"
                id={userData?.profilenft && "member-container"}
              >
                <div className="w-full grid" id="profile-info-image">
                  <div
                    className={`relative w-[8vmax] h-[8vmax] ${isDrawerShown ? "z-[-1]" : ""}`}
                  >
                    {userData?.profile?.image && (
                      <Image
                        src={userData?.profile?.image || ""}
                        alt="Profile Image"
                        className="rounded-full"
                        layout="fill"
                        objectFit="contain"
                      />
                    )}
                  </div>

                  <div className="flex flex-col ml-4">
                    <p className="flex text-lg text-white font-bold">
                      {userData?.profile?.name}
                    </p>
                    <p className="text-sm">{`@${userData?.profile?.username}`}</p>
                    <p className="text-base text-white mt-4 max-w-[60%] md:max-w-[80%]">
                      {userData?.profile?.bio}
                    </p>

                    <div className="flex items-center mt-4">
                      <a
                        className="text-base font-white underline"
                        href={`https://mmosh.app/${userData?.profile?.username}`}
                      >
                        {`mmosh.app/${userData?.profile?.username}`}
                      </a>

                      {lhcWallet && (
                        <div
                          className={`relative ml-4 px-4 rounded-[18px] bg-[#09073A] ${isDrawerShown ? "z-[-1]" : ""}`}
                        >
                          <div className="flex flex-col justify-center items-center">
                            <a
                              className="text-base text-white underline"
                              href={`https://xray.helius.xyz/account/${lhcWallet}?network=mainnet`}
                              target="_blank"
                            >
                              Social Wallet
                            </a>
                            <a
                              className="text-base text-white underline"
                              href={`https://xray.helius.xyz/account/${lhcWallet}?network=mainnet`}
                              target="_blank"
                            >
                              {walletAddressShortener(lhcWallet)}
                            </a>
                          </div>

                          <sup
                            className="absolute top-[-8px] right-[-8px] cursor-pointer"
                            onClick={() => copyToClipboard(lhcWallet, 1)}
                          >
                            <CopyIcon />
                            {isFirstTooltipShown && (
                              <div className="absolute z-10 mb-20 inline-block rounded-lg bg-gray-900 px-3 py-4 text-sm font-medium text-white shadow-sm dark:bg-gray-700">
                                Copied!
                              </div>
                            )}
                          </sup>
                        </div>
                      )}

                      <div
                        className={`relative ml-4 px-4 rounded-[18px] bg-[#09073A] ${isDrawerShown ? "z-[-1]" : ""}`}
                      >
                        <div className="flex flex-col items-center justify-center">
                          <a
                            className="text-base text-white underline"
                            href={`https://xray.helius.xyz/account/${userData.wallet}?network=mainnet`}
                            target="_blank"
                          >
                            Linked Wallet
                          </a>

                          <a
                            className="text-base text-white underline"
                            href={`https://xray.helius.xyz/account/${userData.wallet}?network=mainnet`}
                            target="_blank"
                          >
                            {walletAddressShortener(userData.wallet)}
                          </a>
                        </div>
                        <sup
                          className="absolute top-[-8px] right-[-8px] cursor-pointer"
                          onClick={() => copyToClipboard(userData.wallet, 2)}
                        >
                          <CopyIcon />
                          {isSecTooltipShown && (
                            <div className="absolute z-10 mb-20 inline-block rounded-lg bg-gray-900 px-3 py-4 text-sm font-medium text-white shadow-sm dark:bg-gray-700">
                              Copied!
                            </div>
                          )}
                        </sup>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-around mt-16">
                  <TelegramAccount
                    isMyProfile={isMyProfile}
                    userData={userData}
                    setUserData={setUserData}
                  />

                  <TwitterAccount
                    userData={userData}
                    setUserData={setUserData}
                    isMyProfile={isMyProfile}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center p-8 rounded-2xl bg-[#6536BB] bg-opacity-20 mt-16 lg:self-start">
            {lhcWallet && userData?.telegram?.id && (
              <p className="flex text-lg text-white font-bold mb-6">
                Activation Link{" "}
                <sup
                  className="relative cursor-pointer"
                  onClick={() =>
                    copyToClipboard(
                      `https://t.me/MMOSHBot?start=${userData?.telegram?.id}`,
                      0,
                    )
                  }
                >
                  {isTooltipShown && (
                    <div className="absolute z-10 mb-20 inline-block rounded-lg bg-gray-900 px-3 py-4ont-medium text-white shadow-sm dark:bg-gray-700">
                      Copied!
                    </div>
                  )}
                  <CopyIcon />
                </sup>
              </p>
            )}

            {lhcWallet && userData?.telegram?.id && (
              <p className="text-base text-white">
                {`https://t.me/MMOSHBot?start=${userData?.telegram?.id}`}
              </p>
            )}

            <p className="text-base text-white mt-6">
              <span className="font-bold">Your Role: </span>{" "}
              {userData?.profilenft ? "Member" : "Guest"}
            </p>
            <p className="text-base text-white my-4">
              <span className="font-bold">Your Points: </span>{" "}
              {rankData.points || 0}
            </p>
            <p className="text-base text-white">
              <span className="font-bold">Your Rank: </span>{" "}
              {rankData.rank || 0}
            </p>
          </div>
        </div>
      </div>
      <GuildList
        profilenft={userData?.profilenft}
        isMyProfile={isMyProfile}
        userName={userData?.profile?.name}
      />
    </div>
  );
};

export default Profile;
