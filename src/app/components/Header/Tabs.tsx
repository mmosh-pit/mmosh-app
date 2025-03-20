import * as React from "react";
import { useRouter } from "next/navigation";

const Tabs = () => {
  const router = useRouter();
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
          router.push("/projects");
        }}
      >
        Agents
      </a>

      <div className="lg:mx-6 md:mx-3" />

      <a
        className="text-base text-white cursor-pointer"
        onClick={() => router.push("/coins")}
      >
        Agent Coins
      </a>

      <div className="lg:mx-6 md:mx-3" />

      <a
        className="flex items-center cursor-pointer relative "
        onClick={() => router.push("/create/create_projects")}
      >
        <p className="text-base text-white font-semibold">Agent Studio</p>
      </a>

      <div className="lg:mx-6 md:mx-3" />
      <a
        className="text-base text-white cursor-pointer"
        onClick={() => router.push("/projects")}
      >
        Subscriptions
      </a>

      <div className="lg:mx-6 md:mx-3" />
      <a
        className="text-base text-white cursor-pointer"
        onClick={() => {
          router.push("/bags");
        }}
      >
        Wallet
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
    </div>
  );
};

export default Tabs;
