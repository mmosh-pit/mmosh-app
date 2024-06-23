"use client";

import * as React from "react";
import { useAtom } from "jotai";
import FeaturedCard from "../components/Forge/MainPage/FeaturedCard";
import GuestPassCard from "../components/Forge/MainPage/GuestPassCard";
import DefaultCard from "../components/Forge/MainPage/DefaultCard";
import CoinCard from "../components/Forge/MainPage/CoinCard";
import CommunityCard from "../components/Forge/MainPage/CommunityCard";
import InvitationCard from "../components/Forge/MainPage/InvitationCard";
import ProfileCard from "../components/Forge/MainPage/ProfileCard";
import { userWeb3Info, web3InfoLoading } from "../store";

const Forge = () => {
  const [profileData] = useAtom(userWeb3Info);
  const [isLoadingProfile] = useAtom(web3InfoLoading);

  const hasProfile = !!profileData?.profile.address;
  const hasInvitation = !!profileData?.activationToken;

  const getFeaturedCard = React.useCallback(() => {
    if (hasProfile) {
      return <InvitationCard />;
    }

    if (hasInvitation) {
      return <ProfileCard />;
    }

    return <GuestPassCard />;
  }, [hasProfile, hasInvitation]);

  if (isLoadingProfile) {
    return (
      <div className="relative background-content flex w-full justify-center items-center">
        <span className="loading loading-spinner w-[8vmax] h-[8vmax] loading-lg bg-[#BEEF00]"></span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col background-content pt-20">
      <div className="self-center">
        <FeaturedCard>{getFeaturedCard()}</FeaturedCard>
      </div>

      <div className="grid grid-cols-auto md:grid-cols-2 lg:grid-cols-3 p-8 gap-8">
        <DefaultCard>
          <CoinCard />
        </DefaultCard>

        <DefaultCard>
          <CommunityCard />
        </DefaultCard>

        {!hasProfile && (
          <DefaultCard>
            <InvitationCard />
          </DefaultCard>
        )}

        {!hasInvitation && !hasProfile && (
          <DefaultCard>
            <ProfileCard />
          </DefaultCard>
        )}
      </div>
    </div>
  );
};

export default Forge;
