"use client";

import * as React from "react";
import FeaturedCard from "../components/Forge/MainPage/FeaturedCard";
import GuestPassCard from "../components/Forge/MainPage/GuestPassCard";
import DefaultCard from "../components/Forge/MainPage/DefaultCard";
import CoinCard from "../components/Forge/MainPage/CoinCard";
import CommunityCard from "../components/Forge/MainPage/CommunityCard";
import InvitationCard from "../components/Forge/MainPage/InvitationCard";
import ProfileCard from "../components/Forge/MainPage/ProfileCard";

const Forge = () => {
  return (
    <div className="relative w-full h-full flex flex-col background-content pt-20">
      <div className="self-center">
        <FeaturedCard>
          <GuestPassCard />
        </FeaturedCard>
      </div>

      <div className="grid grid-cols-3 p-8 gap-8">
        <DefaultCard>
          <CoinCard />
        </DefaultCard>

        <DefaultCard>
          <CommunityCard />
        </DefaultCard>

        <DefaultCard>
          <InvitationCard />
        </DefaultCard>

        <DefaultCard>
          <ProfileCard />
        </DefaultCard>
      </div>
    </div>
  );
};

export default Forge;
