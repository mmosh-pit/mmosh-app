import { useAtom } from "jotai";

import CampaignFilter from "@/app/components/Project/PTV/CampaignFilter";
import SearchBar from "@/app/components/Project/Candidates/SearchBar";
import { filterText } from "@/app/store/candidates";

const LeaderboardFilters = () => {
  const [_, setSearchText] = useAtom(filterText);

  return (
    <div className="w-full flex justify-between items-center">
      <CampaignFilter />

      <div className="lg:w-[30%] md:w-[35%] sm:w-[45%] w-[60%]">
        <SearchBar setSearchText={setSearchText} />
      </div>
    </div>
  );
};

export default LeaderboardFilters;
