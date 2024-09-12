"use client";
import * as React from "react";
import axios from "axios";

import CandidateCard from "@/app/components/Project/Candidates/CandidateCard";
import AIChat from "@/app/components/Project/Candidates/CandidatePage/AIChat";
import { CandidateInfo } from "@/app/models/candidateInfo";
import Coins from "@/app/components/Project/Candidates/CandidatePage/Coins";

const Candidate = ({ params }: { params: { candidate: string } }) => {
  const [selectedTab, setSelectedTab] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);

  const [candidateInfo, setCandidateInfo] = React.useState<CandidateInfo>({
    candidate: null,
    firstOponent: null,
    secondOponent: null,
  });

  const getCandidateInfo = React.useCallback(async () => {
    const response = await axios.get<CandidateInfo>(
      `/api/get-candidate-info?candidate=${params.candidate}`,
    );

    setCandidateInfo(response.data);

    setIsLoading(false);
  }, [params.candidate]);

  React.useEffect(() => {
    getCandidateInfo();
  }, [params.candidate]);

  const getCandidateColor = () => {
    if (candidateInfo.candidate?.PARTY === "DEM") {
      return "#0061ff";
    }

    if (candidateInfo.candidate?.PARTY === "REP") {
      return "#ff002e";
    }

    return "#0c0054";
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center background-content">
        <span className="loading loading-spinner w-[8vmax] h-[8vmax] loading-lg bg-[#7B30DB]"></span>
      </div>
    );
  }

  return (
    <div className="w-full h-full background-content mix-blend-hard-light">
      <div className="w-full h-full flex flex-col md:px-16 px-4 mt-16 relative">
        <div className="w-full flex justify-evenly">
          {candidateInfo.candidate && (
            <div className="w-[35%]">
              <CandidateCard candidate={candidateInfo.candidate} />
            </div>
          )}
          {candidateInfo.firstOponent && (
            <div className="w-[35%]">
              <CandidateCard
                candidate={candidateInfo.firstOponent}
                borderRight
              />
            </div>
          )}
        </div>

        {candidateInfo.secondOponent && (
          <div className="w-full flex justify-center mt-8">
            <div className="w-[35%]">
              <CandidateCard candidate={candidateInfo.secondOponent} noBorder />
            </div>
          </div>
        )}

        <div className="w-full flex items-start flex-col mt-16">
          <div className="flex">
            <p
              className={`text-base ${selectedTab === 0 ? "text-white font-bold" : ""} mr-4`}
              onClick={() => setSelectedTab(0)}
            >
              Candidate Memecoins
            </p>

            <p
              className={`text-base ${selectedTab === 1 ? "text-white font-bold" : ""} `}
              onClick={() => setSelectedTab(1)}
            >
              Ask the AI
            </p>
          </div>
          {selectedTab === 1 && <AIChat candidateInfo={candidateInfo} />}
          {selectedTab === 0 && (
            <Coins
              candidate={candidateInfo.candidate?.CANDIDATE_ID ?? ""}
              color={getCandidateColor()}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Candidate;
