"use client";

import * as React from "react";
import axios from "axios";
import Image from "next/image";
import { useAtom } from "jotai";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

import { Community } from "@/app/models/community";
import { User } from "@/app/models/user";
import Swap from "@/app/components/Forge/Community/Swap";
import InvitationBadgeMint from "@/app/components/Forge/Community/InvitationBadgeMint";
import CommunityPassMint from "@/app/components/Forge/Community/CommunityPassMint";
import { pageCommunity } from "@/app/store/community";
import TelegramBox from "@/app/components/Forge/Community/TelegramBox";
import { getCommunityProjectInfo } from "@/app/lib/forge/getCommunityProjectInfo";
import { userWeb3Info } from "@/app/store";

const Page = ({ params }: { params: { symbol: string } }) => {
  const wallet = useAnchorWallet();

  const [userInfo] = useAtom(userWeb3Info);

  const [isLoading, setIsLoading] = React.useState(false);

  const [communityCreator, setCommunityCreator] = React.useState<User | null>(
    null,
  );
  const [communityWeb3Info, setCommunityWeb3Info] = React.useState<any>();
  const [isOwner, setIsOwner] = React.useState(false);

  const [community, setCommunity] = useAtom(pageCommunity);

  const getCommunityDetails = React.useCallback(async () => {
    try {
      setIsLoading(true);

      const communityRes = await axios.get<Community>(
        `/api/get-community?symbol=${params.symbol}`,
      );

      if (!communityRes.data) {
        setIsLoading(false);
        return;
      }

      const coinResult = await axios.get(
        `/api/get-token-by-address?token=${communityRes.data.coin.token}`,
      );

      const creatorResult = await axios.get(
        `/api/get-user-data?username=${communityRes.data.username}`,
      );

      const communityProjectInfo = await getCommunityProjectInfo(
        wallet!,
        communityRes.data.project,
      );

      if (communityProjectInfo.profiles.length > 0) {
        if (
          communityProjectInfo.profiles[0].address ==
          communityRes.data.tokenAddress
        ) {
          setIsOwner(true);
        }
      }

      setCommunityWeb3Info(communityProjectInfo);

      setCommunityCreator(creatorResult.data);
      communityRes.data.coin = coinResult.data;
      setCommunity(communityRes.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }, [params, wallet]);

  React.useEffect(() => {
    if (!params.symbol || !wallet) return;

    getCommunityDetails();
  }, [params, wallet]);

  if (isLoading) {
    return (
      <div className="relative background-content flex w-full justify-center items-center">
        <span className="loading loading-spinner w-[8vmax] h-[8vmax] loading-lg bg-[#BEEF00]"></span>
      </div>
    );
  }

  if (!community)
    return (
      <div className="background-content relative flex flex-col max-h-full" />
    );

  return (
    <div className="background-content relative flex flex-col items-center max-h-full">
      <div className="w-full relative flex flex-col lg:flex-row justify-around px-16 md:px-0 w-[80%] md:w-[70%] lg:w-full">
        <div className="flex flex-col">
          <div className="w-[8vmax] h-[8vmax] relative">
            <Image src={community.image} layout="fill" alt="" />
          </div>

          <div className="flex flex-col mt-12">
            <div className="flex items-center mt-2 mb-4">
              <p className="text-base text-white font-medium">
                {community.name}
              </p>

              <p className="text-base">{` • ${community.symbol}`}</p>
            </div>

            <p className="text-base">{community.description}</p>
          </div>

          {communityCreator && (
            <div className="relative p-4 mt-12 flex flex-col border-[1px] border-[#fff] border-opacity-20 rounded-3xl min-h-[250px]">
              <div className="w-full flex">
                <div className="relative w-[3vmax]">
                  <div className="w-[4vmax] h-[4vmax] absolute top-[-20px] left-[-20px] rounded-full">
                    <Image
                      src={communityCreator.profile.image}
                      alt={communityCreator.profile.username}
                      layout="fill"
                      className="rounded-full"
                    />
                  </div>
                </div>
                <div className="flex flex-col ml-4">
                  <p className="text-white text-base">
                    {communityCreator.profile.name}
                  </p>
                  <p className="text-sm mt-2">
                    @{communityCreator.profile.username}
                  </p>
                </div>
              </div>

              <div className="mt-8 mb-2">
                <p className="text-white text-sm">
                  {communityCreator.profile.bio}
                </p>
              </div>

              <a
                href={`https://www.mmosh.app/${communityCreator.profile.username}`}
              >{`${communityCreator.profile.name} the ${communityCreator.profile.descriptor}`}</a>
            </div>
          )}
        </div>

        <div className="mt-16">
          <Swap coin={community.coin} communitySymbol={community.symbol} />
        </div>

        {community.invitation !== "none" && (
          <div className="mt-16">
            <InvitationBadgeMint
              image={community.inviteImg}
              price={Number(community.invitationPrice)}
              coin={community.coin}
              projectInfo={communityWeb3Info}
              solBalance={userInfo?.solBalance || 0}
            />
          </div>
        )}

        <div className="mt-16">
          <CommunityPassMint
            image={community.image}
            price={Number(community.passPrice)}
            coin={community.coin}
            projectInfo={communityWeb3Info}
            solBalance={userInfo?.solBalance || 0}
          />
        </div>
      </div>

      <div className="flex justify-center self-center mt-12">
        <TelegramBox
          telegram={community.telegram}
          communityName={community.name}
          isOwner={isOwner}
        />
      </div>
    </div>
  );
};

export default Page;
