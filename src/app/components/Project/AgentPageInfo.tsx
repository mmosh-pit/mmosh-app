import axios from "axios";
import * as React from "react";
import SimpleMemberCard from "../common/SimpleMemberCard";

import { AgentStats } from "@/app/models/AgentStats";
import { User } from "@/app/models/user";

const AgentPageInfo = ({ agentKey }: { agentKey: string }) => {
  const [members, setMembers] = React.useState<User[]>([]);
  const [offers, setOffers] = React.useState<any[]>([]);

  const [stats, setStats] = React.useState<AgentStats>({
    offers: 0,
    subscribers: 0,
    teams: 0,
  });

  const [selectedTab, setSelectedTab] = React.useState(0);

  const getTabStyles = React.useCallback(
    (tab: number) => {
      if (tab === selectedTab) {
        return "text-base text-white font-bold underline";
      }

      return "text-base text-white font-bold";
    },
    [selectedTab],
  );

  const getAgentStats = React.useCallback(async () => {
    const result = await axios.get(
      `/api/get-agent-total-values?key=${agentKey}`,
    );

    setStats(result.data);
  }, [agentKey]);

  const getAgentMembers = React.useCallback(async () => {
    const result = await axios.get(
      `/api/get-agent-subscribers?key=${agentKey}`,
    );

    setMembers(result.data);
  }, [agentKey]);

  const getAgentOffers = React.useCallback(async () => {
    const result = await axios.get(
      `/api/offer/list-project?project=${agentKey}`,
    );

    setOffers(result.data);
  }, [agentKey]);

  const getAgentTeams = React.useCallback(async () => { }, [agentKey]);

  React.useEffect(() => {
    getAgentStats();
    getAgentMembers();
    getAgentOffers();
    getAgentTeams();
  }, [agentKey]);

  return (
    <div className="flex flex-col">
      <div className="flex bg-[#03002563] rounded-lg p-4">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => setSelectedTab(0)}
        >
          <p className={getTabStyles(0)}>Subscribers</p>
          <div className="mx-1" />
          <p className="text-base text-white">({stats.subscribers})</p>
        </div>

        <div className="mx-4" />

        <div
          className="flex items-center cursor-pointer"
          onClick={() => setSelectedTab(1)}
        >
          <p className={getTabStyles(1)}>Offers</p>
          <div className="mx-1" />
          <p className="text-base text-white">({stats.offers})</p>
        </div>

        <div className="mx-4" />

        <div
          className="flex items-center cursor-pointer"
          onClick={() => setSelectedTab(2)}
        >
          <p className={getTabStyles(2)}>Team Members</p>
          <div className="mx-1" />
          <p className="text-base text-white">({stats.teams})</p>
        </div>
      </div>

      {selectedTab === 0 && (
        <div className="w-full h-full grid grid-cols-auto gap-4 2xl:px-8 md:px-4 px-6 py-6 overflow-y-auto">
          {members.map((member) => (
            <SimpleMemberCard user={member} />
          ))}
        </div>
      )}

      {selectedTab === 1 && (
        <div className="w-full h-full grid grid-cols-auto gap-4 2xl:px-8 md:px-4 px-6 py-6 overflow-y-auto">
          {offers.map((offer) => (
            <></>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentPageInfo;
