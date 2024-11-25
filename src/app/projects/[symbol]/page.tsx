"use client";

import * as React from "react";
import Button from "@/app/components/common/Button";
import { isDrawerOpen } from "@/app/store";
import { useAtom } from "jotai";
import Image from "next/image";
import { DirectoryCoin } from "@/app/models/directoryCoin";
import CoinCardItem from "@/app/components/common/CoinCardItem";
import { mockCoins } from "@/utils/mockCoins";
import { User } from "@/app/models/user";
import SimpleMemberCard from "@/app/components/common/SimpleMemberCard";

const Project = () => {
  const [isDrawerShown] = useAtom(isDrawerOpen);

  const [coins, setCoins] = React.useState<DirectoryCoin[]>(
    mockCoins.map((coin) => ({
      ...coin,
      priceLastSevenDays: coin.priceLastSevenDays.map((e) => e.toString()),
    })),
  );

  const [members, setMembers] = React.useState<User[]>([]);

  return (
    <div
      className={`background-content-full-bg flex flex-col ${isDrawerShown ? "z-[-1]" : ""}`}
    >
      <h4 className="text-white self-center text-xl py-12">Project Page</h4>

      <div className="flex flex-col bg-[#181747] backdrop-blur-[6px] rounded-md relative mx-16 rounded-xl">
        <div className="project-image-header h-[25vh] m-4">
          <div className="dots-menu" />

          <div className="p-2 bg-[#100E3A] rounded-lg">
            <p className="text-white text-base">Inform OPOS</p>
          </div>
        </div>

        <div className="absolute left-[5%] top-[12%] md:top-[15%] lg:top-[18%]">
          <div className="relative w-[8vmax] h-[8vmax]">
            <Image
              src="https://storage.googleapis.com/mmosh-assets/mmosh_box.png"
              alt="Project"
              layout="fill"
            />
          </div>
        </div>

        <div className="flex justify-between items-end mb-4">
          <div className="w-[8vmax]" />

          <div className="flex flex-col mt-4 max-w-[60%]">
            <div className="flex">
              <h5 className="font-bold text-white text-lg">Frankie</h5>
              <span className="font-bold text-lg text-white mx-2">•</span>
              <p className="text-base">Frankie</p>

              <div className="ml-4 bg-[#21005EB2] border-lg px-3 py-1 rounded-lg">
                Owner
              </div>
            </div>

            <p className="text-sm">
              Lorem ipsum dolor sit amet consectetur. Eu vitae sit vestibulum
              enim ultricies amet massa nulla. Accumsan arcu aliquam proin amet
              malesuada erat ac tristique.
            </p>
          </div>
          <div className="mr-8">
            <Button
              isLoading={false}
              size="small"
              title="Mint Project Pass"
              action={() => {}}
              isPrimary
            />
          </div>
        </div>

        <div className="flex flex-col mt-6">
          <h6 className="text-white font-bold text-lg ml-6">Community Coins</h6>
          <div className="w-full grid lg:grid-cols-4 md:grid-cols-3 grid-cols-auto gap-4 px-8 mt-4">
            {coins.map((coin) => (
              <CoinCardItem
                key={coin.symbol + coin.name}
                coin={coin}
                displayGraph
              />
            ))}
          </div>

          <div className="flex mt-8">
            <div className="flex grow flex-col items-start">
              <h6 className="text-white font-bold text-lg mb-4 ml-4">
                Communities
              </h6>

              <div className="w-full grid grid-cols-auto md:grid-cols-2 gap-4 px-8 py-6 bg-[#202061]">
                {coins.map((coin) => (
                  <CoinCardItem coin={coin} displayGraph={false} />
                ))}
              </div>
            </div>
            <div className="flex grow flex-col items-start">
              <div className="flex justify-between">
                <h6 className="text-white font-bold text-lg mb-4 ml-4">
                  Memecoins
                </h6>

                <div id="all-trading-pairs"></div>
              </div>

              <div className="w-full grid grid-cols-auto md:grid-cols-2 gap-4 py-6 bg-[#202061]">
                {coins.map((coin) => (
                  <CoinCardItem coin={coin} displayGraph={false} />
                ))}
              </div>
            </div>
            <div className="flex grow flex-col items-start">
              <h6 className="text-white font-bold text-lg mb-4 ml-4">
                Members
              </h6>

              <div className="w-full grid grid-cols-auto md:grid-cols-2 gap-4 px-8 py-6 bg-[#202061]">
                {coins.map((coin) => (
                  <CoinCardItem coin={coin} displayGraph={false} />
                ))}
                {members.map((member) => (
                  <SimpleMemberCard user={member} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;
