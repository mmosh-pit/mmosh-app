"use client";
import * as React from "react";

import CandidatesList from "@/app/components/Project/PTV/CandidatesList";
import CoinsList from "@/app/components/Project/PTV/CoinsList";
import PartiesGraphics from "@/app/components/Project/PTV/PartiesGraphics";
import LeaderboardFilters from "@/app/components/Project/PTV/LeaderboardFilters";

const Page = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center background-content px-12">
      <PartiesGraphics />

      <div className="w-full flex justify-center items-center my-8">
        <h6>Leaderboard</h6>
      </div>

      <LeaderboardFilters />

      <div className="w-full flex md:flex-row flex-col justify-between mt-8 overflow-y-auto md:max-h-[500px] pb-12 py-8">
        <CandidatesList />

        <CoinsList />
      </div>
    </div>
  );
};

export default Page;
