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
        <div className="relative w-[6vmax] h-[6vmax]">
          <Image
            src={projectData.data.image}
            alt="Profile Image"
            className="rounded-md"
            layout="fill"
          />
        </div>
      </div>

      <div className="w-full flex flex-col">
        <div>
          <p className="text-white text-lg">{projectData.data.name} • </p>
          <p className="text-base">{projectData.data.symbol}</p>
        </div>

        <div className="my-4">
          <p className="text-white text-base text-with-ellipsis max-w-[70%]">
            {projectData.data.desc}
          </p>
        </div>

        <div className="flex flex-col mt-4">
          <div className="flex max-w-[5vmax] items-center rounded-lg bg-[#353485B2] px-2">
            <p className="text-sm text-white">
              <span className="font-bold text-sm text-white mr-4">TVL</span>
              123 USDC
            </p>
          </div>

          <a
            className="text-sm text-[#FF00C7] underline"
            href={`${process.env.NEXT_PUBLIC_APP_MAIN_URL}/projects/${projectData.data.symbol.toLowerCase()}`}
          >
            {projectData.data.symbol.toLowerCase()}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
