"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
      <div className="self-center max-w-[30%] mr-8">
        <div className="relative w-[7vmax] h-[7vmax]">
          <Image
            src={projectData.data.image}
            alt="Profile Image"
            className="rounded-md"
            layout="fill"
          />
        </div>
      </div>

      <div className="w-full flex flex-col">
        <div className="flex items-center">
          <p className="text-white text-lg underline">
            {" "}
            <span className="font-bold text-white text-lg">
              {projectData.data.name}
            </span>{" "}
            • {projectData.data.symbol}
          </p>
        </div>

        <div className="flex items-center">
          <p className="text-white text-lg text-[#FF00C7] underline">
            @{projectData.data.creatorUsername}
          </p>
          <p className="text-base"> • {projectData.data.creatorUsername}</p>
        </div>

        <div className="my-4">
          <p className="text-white text-base text-with-ellipsis max-w-[70%]">
            {projectData.data.desc}
          </p>
        </div>

        <div className="flex flex-col mt-4">
          <div className="flex items-center rounded-lg px-2">
            <p className="text-sm text-white">
              <span className="font-bold text-sm text-white mr-4">
                Subscribers
              </span>
            </p>
            <div className="px-2 bg-[#19066B] rounded-lg">
              <p className="text-sm text-white">250</p>
            </div>
          </div>

          <div className="flex items-center rounded-lg px-2 mt-2">
            <p className="text-sm text-white">
              <span className="font-bold text-sm text-white mr-4">
                Market Cap
              </span>
            </p>
            <div className="px-2 bg-[#19066B] rounded-lg">
              <p className="text-sm text-white">123 USDC</p>
            </div>
          </div>
        </div>
      </div>

      <div className="self-start rounded-full w-[20%] h-8 bg-[#FF00AE] flex justify-center items-center">
        <p className="text-base text-white">Activate</p>
      </div>
    </div>
  );
};

export default ProjectCard;
