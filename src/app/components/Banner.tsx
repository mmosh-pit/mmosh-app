import * as React from "react";
import { useAtom } from "jotai";
import Image from "next/image";
import * as anchor from "@coral-xyz/anchor";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";

import { Connectivity as UserConn } from "../lib/anchor/user";
import { web3Consts } from "../lib/anchor/web3Consts";
import { data } from "../store";
import axios from "axios";

const Banner = () => {
  const [currentUser, setCurrentUser] = useAtom(data);

  const [userData, setUserData] = React.useState({
    hasProfile: false,
    hasInvitation: false,
  });
  const wallet = useAnchorWallet();

  const getUserData = React.useCallback(async (username: string) => {
    const result = await axios.get(`/api/get-user-data?username=${username}`);

    setCurrentUser({
      ...result.data,
    });
  }, []);

  const getUserDataByWallet = React.useCallback(async () => {
    const result = await axios.get(
      `/api/get-wallet-data?username=${wallet?.publicKey}`,
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

      console.log("Profile info: ", profileInfo);
      if (profileInfo.profiles.length > 0) {
        getUserData(profileInfo.profiles[0].userinfo.username);
        setUserData({ ...userData, hasProfile: true });
        return;
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

  React.useEffect(() => {
    if (wallet?.publicKey) {
      getUserDataByWallet();
      getProfileInfo();
    }
  }, [wallet]);

  const renderComponent = React.useCallback(() => {
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
  }, [userData]);

  return (
    <div className="w-full flex justify-center py-12 bg-[#080536]">
      {renderComponent()}
    </div>
  );
};

export default Banner;