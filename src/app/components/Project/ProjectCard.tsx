"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BotIcon from "@/assets/icons/BotIcon";
import PersonIcon from "@/assets/icons/PersonIcon";
import CoinIcon from "@/assets/icons/CoinIcon";

const ProjectCard = (projectData: any) => {
  const router = useRouter();
  if (!projectData) return <></>;

  return (
    <div
      className="flex bg-[#030007] bg-opacity-40 px-4 py-2 rounded-2xl border-[1px] border-[#353485] cursor-pointer"
      onClick={() => {
        router.push(
          `${process.env.NEXT_PUBLIC_APP_MAIN_URL}/projects/${projectData.data.symbol.toLowerCase()}`,
        );
      }}
    >
      <div className="self-center max-w-[30%] 2xl:mr-8 mr-4">
        <div className="relative w-[7vmax] h-[7vmax]">
          <Image
            src={projectData.data.image}
            alt="Profile Image"
            className="rounded-md"
            layout="fill"
          />
        </div>
      </div>

      <div className="w-full flex flex-col justify-between">
        <div className="flex items-center">
          <BotIcon />
          <p className="text-white 2xl:text-lg text-base underline ml-2">
            {" "}
            <span className="font-bold text-white 2xl:text-lg text-base">
              {projectData.data.name}
            </span>{" "}
            • {projectData.data.symbol}
          </p>
        </div>

        <div className="flex items-center">
          <PersonIcon />
          <a
            className="2xl:text-base text-sm text-[#FF00C7] underline ml-2"
            href={`${process.env.NEXT_PUBLIC_APP_MAIN_URL}/${projectData.data.creatorUsername}`}
          >
            @{projectData.data.creatorUsername}
          </a>

          <p className="2xl:text-lg text-base text-white mx-2"> • </p>

          <CoinIcon />
          <p className="2xl:text-base text-sm underline uppercase ml-2">
            {projectData.data.creatorUsername}
          </p>
        </div>

        <div className="2xl:my-4 my-3">
          <p className="text-white 2xl:text-base text-sm text-with-ellipsis max-w-[70%]">
            {projectData.data.desc}
          </p>
        </div>

        <div className="flex flex-col 2xl:mt-4 mt-2">
          <div className="flex items-center rounded-lg px-2">
            <p className="2xl:text-sm text-xs text-white">
              <span className="font-bold text-sm text-white mr-4">
                Subscribers
              </span>
            </p>
            <div className="px-2 bg-[#19066B] rounded-lg">
              <p className="text-sm text-white">250</p>
            </div>
          </div>

          <div className="flex items-center rounded-lg px-2 mt-2">
            <p className="2xl:text-sm text-xs text-white">
              <span className="font-bold text-sm text-white mr-4">
                Market Cap
              </span>
            </p>
            <div className="px-2 bg-[#19066B] rounded-lg">
              <p className="2xl:text-sm text-xs text-white">123 USDC</p>
            </div>
          </div>
        </div>
      </div>

      <div className="self-start rounded-full w-[20%] h-8 bg-[#FF00AE] flex justify-center items-center">
        <p className="2xl:text-base text-sm text-white">Activate</p>
      </div>
    </div>
  );
};

export default ProjectCard;
