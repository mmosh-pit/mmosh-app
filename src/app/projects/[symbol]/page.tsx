"use client";

import * as React from "react";
import { isDrawerOpen } from "@/app/store";
import { useAtom } from "jotai";
import Image from "next/image";
import axios from "axios";

import Button from "@/app/components/common/Button";
import { DirectoryCoin } from "@/app/models/directoryCoin";
import CoinCardItem from "@/app/components/common/CoinCardItem";
import { mockCoins } from "@/utils/mockCoins";
import { User } from "@/app/models/user";
import SimpleMemberCard from "@/app/components/common/SimpleMemberCard";
import Dots from "@/assets/icons/Dots";
import { Community } from "@/app/models/community";
import { mockCommunities } from "@/utils/mockCommunities";
import CommunityCard from "@/app/components/common/CommunityCard";

const Project = () => {
  const [isDrawerShown] = useAtom(isDrawerOpen);

  const [coins, setCoins] = React.useState<DirectoryCoin[]>(
    mockCoins.map((coin) => ({
      ...coin,
      priceLastSevenDays: coin.priceLastSevenDays.map((e) => e.toString()),
    })),
  );

  const [communities, setCommunities] =
    React.useState<Omit<Community, "coin">[]>(mockCommunities);

  const [members, setMembers] = React.useState<User[]>([]);

  const getUsers = React.useCallback(async () => {
    let url = `/api/get-all-users?skip=0`;

    const result = await axios.get(url);

    setMembers(result.data.users);
  }, []);

  React.useEffect(() => {
    getUsers();
  });

  return (
    <div
      className={`background-content-full-bg flex flex-col ${isDrawerShown ? "z-[-1]" : ""}`}
    >
      <h4 className="text-white self-center text-xl py-12">Project Page</h4>

      <div className="flex flex-col bg-[#181747] backdrop-blur-[6px] rounded-md relative mx-16 rounded-xl mb-16">
        <div className="project-image-header h-[25vh] m-4">
          <div className="dots-menu">
            <Dots />
          </div>

          <button className="p-2 bg-[#100E3A] rounded-lg cursor-pointer">
            <p className="text-white text-base">Inform OPOS</p>
          </button>
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
            <div className="flex items-center">
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
          <div className="w-full grid lg:grid-cols-4 md:grid-cols-3 grid-cols-auto gap-4 2xl:px-8 md:px-4 px-6 mt-4">
            {coins.map((coin) => (
              <CoinCardItem
                key={coin.symbol + coin.name}
                coin={coin}
                displayGraph
              />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 mt-8">
            <div className="flex grow flex-col items-start">
              <h6 className="text-white font-bold text-lg mb-4 ml-4">
                Communities
              </h6>

              <div className="w-full h-full grid grid-cols-auto 2xl:grid-cols-2 grid-rows-min gap-4 2xl:px-8 md:px-4 px-6 py-6 bg-[#202061] max-h-[500px] overflow-y-auto">
                {communities.map((community) => (
                  <CommunityCard community={community} />
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

              <div className="w-full h-full grid grid-cols-auto lg:grid-cols-2 md:gap-2 gap-4 2xl:gap-4 py-6 bg-[#202061] max-h-[500px] overflow-y-auto">
                {coins.map((coin) => (
                  <div
                    key={coin.name + coin.symbol}
                    className="max-h-[80px] mb-2"
                  >
                    <CoinCardItem coin={coin} displayGraph={false} />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex grow flex-col items-start">
              <h6 className="text-white font-bold text-lg mb-4 ml-4">
                Members
              </h6>

              <div className="w-full h-full grid grid-cols-auto gap-4 2xl:px-8 md:px-4 px-6 py-6 bg-[#202061] max-h-[500px] overflow-y-auto">
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
