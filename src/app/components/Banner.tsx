import * as React from "react";
import { useAtom } from "jotai";
import Image from "next/image";
import * as anchor from "@coral-xyz/anchor";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";

import { Connectivity as UserConn } from "../lib/anchor/user";
import { web3Consts } from "../lib/anchor/web3Consts";
import { UserStatus, data, status } from "../store";
import axios from "axios";
import TelegramBigIcon from "@/assets/icons/TelegramBigIcon";

const Banner = ({
  fromProfile,
  userTelegramId,
}: {
  fromProfile: boolean;
  userTelegramId?: number;
}) => {
  const [userStatus] = useAtom(status);
  const [currentUser, setCurrentUser] = useAtom(data);

  const [hasInitialized, setHasInitialized] = React.useState(false);
  const [userData, setUserData] = React.useState({
    hasProfile: false,
    hasInvitation: false,
  });
  const wallet = useAnchorWallet();

  const getUserData = React.useCallback(async (username: string) => {
    if (!fromProfile) return;
    const result = await axios.get(`/api/get-user-data?username=${username}`);

    setCurrentUser({
      ...result.data,
    });
  }, []);

  const getUserDataByWallet = React.useCallback(async () => {
    if (!fromProfile) return;
    const result = await axios.get(
      `/api/get-wallet-data?wallet=${wallet?.publicKey}`,
    );

    setCurrentUser({
      ...result.data,
    });
  }, [wallet?.publicKey]);

  const getProfileInfo = React.useCallback(async () => {
    try {
      if (!wallet) return;

      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_CLUSTER!,
      );
      const env = new anchor.AnchorProvider(connection, wallet, {
        preflightCommitment: "processed",
      });

      let userConn = new UserConn(env, web3Consts.programID);
      const profileInfo = await userConn.getUserInfo();

      if (profileInfo.profiles.length > 0) {
        await getUserData(profileInfo.profiles[0].userinfo.username);
        setUserData({ ...userData, hasProfile: true });
        return;
      } else {
        await getUserDataByWallet();
      }

      if (profileInfo.activationTokens.length > 0) {
        setUserData({ ...userData, hasInvitation: true, hasProfile: false });
        return;
      }

      setUserData({ hasProfile: false, hasInvitation: false });
    } catch (error) {
      console.log("Got error", error);
    }
  }, []);

  const fetchUserInfo = React.useCallback(async () => {
    await getProfileInfo();

    setHasInitialized(true);
  }, [wallet?.publicKey]);

  React.useEffect(() => {
    if (wallet?.publicKey) {
      fetchUserInfo();
    }
  }, [wallet]);

  console.log("User status: ", userStatus);

  const renderComponent = React.useCallback(() => {
    //TODO Banner when wallet not connected
    //
    if (userStatus === UserStatus.noAccount) {
      return (
        <div className="max-w-[95%] md:max-w-[60%] grid grid-cols-2 justify-items-center">
          <div className="flex flex-col justify-around items-center max-w-[75%]">
            <p className="text-base text-white text-center">
              Create and Join Crypto Communities on Telegram! Start by
              activating MMOSHBot
            </p>

            <a
              href={`https://t.me/MMOSHBot?start=${userTelegramId || 1294956737}`}
            >
              <button className="bg-[#CD068E] relative rounded-md px-4 py-2">
                <p className="text-base text-white">Activate Bot</p>
              </button>
            </a>
          </div>

          <div
            className="w-full flex justify-center items-center py-8"
            id="banner-image-container"
          >
            <div className="relative flex justify-center items-center rounded-full w-[8vmax] h-[8vmax] bg-blue-500">
              <TelegramBigIcon className="mr-2" />
            </div>
          </div>
        </div>
      );
    }

    if (userData.hasProfile) {
      return (
        <div className="max-w-[95%] md:max-w-[60%] grid grid-cols-2 justify-items-center">
          <div className="flex flex-col justify-around items-center max-w-[75%]">
            <p className="text-base text-white text-center">
              Hey {currentUser?.profile?.name}, mint and send out more
              invitations to grow you Guild and earn more royalties.
            </p>

            <a href="https://forge.mmosh.app">
              <button className="bg-[#CD068E] relative rounded-md px-4 py-2">
                <p className="text-base text-white">Enter the Forge</p>
              </button>
            </a>
          </div>

          <div
            className="w-full flex justify-center items-center py-4"
            id="banner-image-container"
          >
            <div className="relative w-[8vmax] h-[8vmax]">
              <Image
                src="https://storage.googleapis.com/mmosh-assets/invitation.png"
                alt="invitation"
                layout="fill"
              />
            </div>
          </div>
        </div>
      );
    }

    if (userData.hasInvitation) {
      return (
        <div className="max-w-[95%] md:max-w-[60%] grid grid-cols-2 justify-items-center">
          <div className="flex flex-col justify-around items-center max-w-[75%]">
            <p className="text-base text-white text-center">
              Hey {currentUser?.profile?.name}, now it’s time to mint your
              Profile to join MMOSH DAO as a lifetime member.
            </p>
            <a href="https://forge.mmosh.app">
              <button className="bg-[#CD068E] relative rounded-md px-4 py-2">
                <p className="text-base text-white">Enter the Forge</p>
              </button>
            </a>
          </div>

          <div
            className="w-full flex justify-center items-center py-4"
            id="banner-image-container"
          >
            <div className="relative w-[8vmax] h-[8vmax]">
              <Image
                src={currentUser?.profile?.image || ""}
                alt="Profile Image"
                layout="fill"
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-[95%] md:max-w-[60%] grid grid-cols-2 justify-items-center">
        <div className="flex flex-col justify-around items-center">
          <div className="max-w-[75%]">
            <p className="text-base text-white text-center">
              Hey {currentUser?.profile?.name}, you’ll need an invitation to
              mint your Profile and become a MMOSH DAO member.
            </p>
            <p className="text-base text-white text-center">
              You can get an invitation from a current member. Find one in the
              Membership Directory, or ask around in our main Telegram group.
            </p>
          </div>

          <a href="https://t.me/mmoshpit" target="_blank">
            <button className="relative bg-[#CD068E] rounded-md px-4 py-2">
              <p className="text-base text-white">Go to Telegram Group</p>
            </button>
          </a>
        </div>

        <div
          className="w-full flex justify-center items-center py-4"
          id="banner-image-container"
        >
          <div className="relative w-[8vmax] h-[8vmax]">
            <Image
              src="https://storage.googleapis.com/mmosh-assets/invitation.png"
              alt="invitation"
              layout="fill"
            />
          </div>
        </div>
      </div>
    );
  }, [currentUser, userData, userStatus]);

  if (!hasInitialized) return <></>;

  return (
    <div className="w-full flex justify-center py-12 bg-[#080536]">
      {renderComponent()}
    </div>
  );
};

export default Banner;
