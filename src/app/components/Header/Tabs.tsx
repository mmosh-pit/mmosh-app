import * as React from "react";
import { useRouter } from "next/navigation";

import SimpleArrowDown from "@/assets/icons/SimpleArrowDown";
import SimpleArrowUp from "@/assets/icons/SimpleArrowUp";

const Tabs = () => {
  const router = useRouter();

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  return (
    <div className="flex justify-center items-center rounded-full border-[#FFFFFF47] border-[1px] bg-[#FFFFFF0F] px-4 py-2">
      <a
        className="text-base text-white cursor-pointer"
        onClick={() => {
          router.push("/chat");
        }}
      >
        Chat
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
        onClick={() => {
          router.push("/coins");
        }}
      >
        Coins
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
        onClick={() => router.push("/projects")}
      >
        Projects
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
          <div className="flex flex-col w-[150px] py-2 px-4 absolute top-[20px] right-[-25px] bg-[#17155C] rounded-lg border-[1px] border-[#FFFFFF30]">
            <p
              className="text-sm text-white mb-2"
              onClick={() => router.push("/create/profile")}
            >
              Profile
            </p>
            <p
              className="text-sm text-white mb-2"
              onClick={() => router.push("/create/create_invitation")}
            >
              Invitations
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

      <div className="lg:mx-6 md:mx-3" />
      <a
        className="text-base text-white cursor-pointer"
        onClick={() => {
          router.push("/bags");
        }}
      >
        Wallet
      </a>
    </div>
  );
};

export default Tabs;
