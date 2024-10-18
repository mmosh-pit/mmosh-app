import * as React from "react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

import { data, settings } from "@/app/store";
import SimpleArrowDown from "@/assets/icons/SimpleArrowDown";
import SimpleArrowUp from "@/assets/icons/SimpleArrowUp";

const Tabs = () => {
  const router = useRouter();

  const [currentUser] = useAtom(data);
  const [isOnSettings, setIsOnSettings] = useAtom(settings);

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  return (
    <div className="flex justify-center items-center">
      <a
        className="text-base text-white cursor-pointer"
        onClick={() => {
          router.push("/coins");
        }}
      >
        Coins
      </a>

      <div className="lg:mx-6 md:mx-3" />

      <a
        className="text-base text-white cursor-pointer"
        onClick={() => {
          router.push("/members");
        }}
      >
        Members
      </a>

      <div className="lg:mx-6 md:mx-3" />
      <a
        className="text-base text-white cursor-pointer"
        onClick={() => router.push("/projects")}
      >
        Projects
      </a>

      <div className="lg:mx-6 md:mx-3" />
      <a
        className="text-base text-white cursor-pointer"
        onClick={() => router.push("/communities")}
      >
        Communities
      </a>

      <div className="lg:mx-6 md:mx-3" />
      <a
        className="text-base text-white cursor-pointer"
        onClick={() => {
          router.push("/rewards");
        }}
      >
        Rewards
      </a>

      <div className="lg:mx-6 md:mx-3" />
      <a
        className="text-base text-white cursor-pointer"
        onClick={() => {
          router.push("/swap");
        }}
      >
        Swap
      </a>

      <div className="lg:mx-6 md:mx-3" />
      <a
        className="text-base text-white cursor-pointer"
        onClick={() => {
          router.push("/atm");
        }}
      >
        ATM
      </a>

      <div className="lg:mx-6 md:mx-3" />

      <div
        className="flex items-center cursor-pointer relative "
        onClick={() => setIsCreateOpen(!isCreateOpen)}
      >
        <p className="text-base text-white font-semibold">Create</p>

        <div className="ml-1">
          {isCreateOpen ? <SimpleArrowUp /> : <SimpleArrowDown />}
        </div>

        {isCreateOpen && (
          <div className="flex flex-col py-2 px-4 absolute top-[20px] right-[-25px] bg-[#17155C] rounded-lg">
            <p
              className="text-sm text-white mb-2"
              onClick={() => router.push("/create/profile")}
            >
              Profile
            </p>
            <p
              className="text-sm text-white mb-2"
              onClick={() => router.push("/create/coins")}
            >
              Coins
            </p>
            <p
              className="text-sm text-white mb-2"
              onClick={() => router.push("/communities/create")}
            >
              Communities
            </p>
            <p
              className="text-sm text-white"
              onClick={() => router.push("/create/create_projects")}
            >
              Projects
            </p>
          </div>
        )}
      </div>

      {currentUser?.profilenft && (
        <>
          <div className="lg:mx-6 md:mx-3" />
          <a
            className="text-base text-white cursor-pointer"
            onClick={() => {
              if (isOnSettings) return setIsOnSettings(false);
              router.push(`/${currentUser?.profile.username}`);
            }}
          >
            My Profile
          </a>
        </>
      )}

      <div className="lg:mx-6 md:mx-3" />
      <a
        className="text-base text-white cursor-pointer"
        href="https://www.liquidhearts.club"
        target="_blank"
      >
        Training
      </a>
    </div>
  );
};

export default Tabs;
