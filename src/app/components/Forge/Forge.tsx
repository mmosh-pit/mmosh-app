import * as React from "react";
import { useAtom } from "jotai";

import { userWeb3Info } from "@/app/store";
import DefaultCard from "./MainPage/DefaultCard";
import CoinCard from "./MainPage/CoinCard";
import CommunityCard from "./MainPage/CommunityCard";
import InvitationCard from "./MainPage/InvitationCard";
import ProfileCard from "./MainPage/ProfileCard";
import FeaturedCard from "./MainPage/FeaturedCard";
import GuestPassCard from "./MainPage/GuestPassCard";

const Forge = () => {
  const [profileInfo] = useAtom(userWeb3Info);

  const hasProfile = !!profileInfo?.profile?.address;
  const hasInvitation = (profileInfo?.activationTokenBalance || 0) > 0;

  const getFeaturedComponent = () => {
    if (hasProfile) {
      return <InvitationCard />;
    }

    if (hasInvitation) {
      return <InvitationCard />;
    }

    return <GuestPassCard />;
  };

  return (
    <div className="relative w-full h-full flex flex-col background-content pt-20">
      <div className="self-center">
        <FeaturedCard>{getFeaturedComponent()}</FeaturedCard>
      </div>

      <div className="grid grid-cols-3 p-8 gap-8">
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
