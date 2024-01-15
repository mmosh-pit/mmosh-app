"use client";
import * as React from "react";

import DesktopNavbar from "../components/Profile/DesktopNavbar";
import Image from "next/image";
import useCheckMobileScreen from "../lib/useCheckMobileScreen";
import TelegramMagentaIcon from "@/assets/icons/TelegramMagentaIcon";
import TwitterMagentaIcon from "@/assets/icons/TwitterMagentaIcon";
import axios from "axios";
import { useAtom } from "jotai";
import { UserStatus, status } from "../store";
import { User } from "../models/user";

const Profile = ({ params }: { params: { username: string } }) => {
  const isMobile = useCheckMobileScreen();
  const [userData, setUserData] = React.useState<User>();
  const [rankData, setRankData] = React.useState({
    points: 0,
    rank: 0,
  })
  const [_, setUserStatus] = useAtom(status);

  const getUserData = React.useCallback(async () => {
    const result = await axios.get(
      `/api/get-user-data?username=${params.username}`,
    );

    setUserData({
      ...result.data,
    });
  }, [params]);

  const getRankData = React.useCallback(async() => {
    const result = await axios.get(`/api/get-rank-data?user=${userData?.telegram.id}`);

    setRankData(result.data);
  }, [userData]);

  React.useEffect(() => {
    setUserStatus(UserStatus.fullAccount);
    if (!params.username) return;
    getUserData();
  }, [params]);

  React.useEffect(() => {
    if (!userData) return;

    getRankData();
  }, [userData])

  return (
    <div className="w-full h-screen flex flex-col mt-16">
      <div className="w-full h-full flex xs:flex-col md:flex-row justify-between px-12">
        <DesktopNavbar />

        <div className="flex flex-col items-center xs:w-[80%] md:w-[50%] mt-16">
          <div className="w-full flex flex-col">
            <p className="text-lg text-white font-bold font-goudy">
              My MMOSH Account
            </p>

            <div className="w-full flex flex-col bg-[#6536BB] bg-opacity-20 rounded-tl-[100px] rounded-tr-md rounded-b-md p-8 mt-4">
              <div className="w-full flex">
                <Image
                  src={userData?.profile?.image || ""}
                  className="rounded-full"
                  width={isMobile ? 80 : 180}
                  height={isMobile ? 80 : 180}
                  alt="Profile image"
                />

                <div className="flex flex-col ml-4">
                  <p className="text-lg text-white font-bold">
                    {userData?.profile?.name}
                  </p>
                  <p className="text-sm">{`@${userData?.profile?.username}`}</p>
                  <p className="text-base text-white">
                    {userData?.profile?.bio}
                  </p>
                  <p className="text-base font-white underline">
                    {`mmosh.app/${userData?.profile?.username}`}
                  </p>
                </div>
              </div>

              <div className="w-full flex justify-around mt-16">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <TelegramMagentaIcon />
                    <p className="text-lg text-white ml-2">Telegram</p>
                  </div>
                  <p className="text-base text-white">
                    {userData?.telegram?.firstName}
                  </p>
                  <p className="text-base">@{userData?.telegram?.username}</p>
                  <button className="rounded-full p-4 bg-[#09073A] mt-2">
                    Switch Account
                  </button>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center">
                    <TwitterMagentaIcon />
                    <p className="text-lg text-white ml-2">Twitter</p>
                  </div>
                  <p className="text-base text-white">{userData?.twitter?.name}</p>
                  <p className="text-base">@{userData?.twitter?.username}</p>

                  <button className="rounded-full p-4 bg-[#09073A] mt-2">
                    Switch Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:h-[30%] xs:h-[60%] items-center p-8 rounded-2xl bg-[#6536BB] bg-opacity-20 mt-16">
          <p className="text-lg text-white font-bold">Activation Link</p>
          <p className="text-base text-white my-6">
            {`https://t.me/LiquidHeartsBot?start=${userData?.telegram?.id}`}
          </p>

          <p className="text-base text-white">
            <span className="font-bold">Your Role: </span> Guest
          </p>
          <p className="text-base text-white my-4">
            <span className="font-bold">Your Points: </span> {rankData.points}
          </p>
          <p className="text-base text-white">
            <span className="font-bold">Your Rank: </span> {rankData.rank}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
