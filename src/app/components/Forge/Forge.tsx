import * as React from "react";
import DefaultCard from "./MainPage/DefaultCard";
import CoinCard from "./MainPage/CoinCard";
import CommunityCard from "./MainPage/CommunityCard";
import InvitationCard from "./MainPage/InvitationCard";
import ProfileCard from "./MainPage/ProfileCard";
import FeaturedCard from "./MainPage/FeaturedCard";
import GuestPassCard from "./MainPage/GuestPassCard";

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
