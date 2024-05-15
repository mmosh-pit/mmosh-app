"use client";

import * as React from "react";
import { useAtom } from "jotai";
// import FeaturedCard from "../components/Forge/MainPage/FeaturedCard";
// import GuestPassCard from "../components/Forge/MainPage/GuestPassCard";
// import DefaultCard from "../components/Forge/MainPage/DefaultCard";
// import CoinCard from "../components/Forge/MainPage/CoinCard";
// import CommunityCard from "../components/Forge/MainPage/CommunityCard";
// import InvitationCard from "../components/Forge/MainPage/InvitationCard";
// import ProfileCard from "../components/Forge/MainPage/ProfileCard";
import { userWeb3Info, web3InfoLoading } from "../store";
import MintInvitation from "../components/Forge/MintInvitation";
import CreateProfile from "../components/Forge/CreateProfile";

const Forge = () => {
  const [profileData] = useAtom(userWeb3Info);
  const [isLoadingProfile] = useAtom(web3InfoLoading);

  const hasProfile = !!profileData?.profile.address;

  if (isLoadingProfile) {
    return (
      <div className="relative background-content flex w-full justify-center items-center">
        <span className="loading loading-spinner w-[8vmax] h-[8vmax] loading-lg bg-[#BEEF00]"></span>
      </div>
    );
  }

  if (hasProfile) {
    return (
      <div className="relative background-content">
        <MintInvitation />
      </div>
    );
  }

  return (
    <div className="relative background-content">
      <CreateProfile />
    </div>
  );

  // return (
  //   <div className="relative w-full h-full flex flex-col background-content pt-20">
  //     <div className="self-center">
  //       <FeaturedCard>
  //         <GuestPassCard />
  //       </FeaturedCard>
  //     </div>
  //
  //     <div className="grid grid-cols-3 p-8 gap-8">
  //       <DefaultCard>
  //         <CoinCard />
  //       </DefaultCard>
  //
  //       <DefaultCard>
  //         <CommunityCard />
  //       </DefaultCard>
  //
  //       <DefaultCard>
  //         <InvitationCard />
  //       </DefaultCard>
  //
  //       <DefaultCard>
  //         <ProfileCard />
  //       </DefaultCard>
  //     </div>
  //   </div>
  // );
};

export default Forge;
