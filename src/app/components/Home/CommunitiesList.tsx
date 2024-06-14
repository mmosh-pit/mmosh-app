import * as React from "react";
import { useAtom } from "jotai";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Community, CommunityAPIResult } from "@/app/models/community";
import { data, searchBarText } from "@/app/store";
import CommunityCard from "./CommunityCard";

const CommunitiesList = () => {
  const navigate = useRouter();

  const [communities, setCommunities] = React.useState<CommunityAPIResult[]>(
    [],
  );

  const [currentUser] = useAtom(data);
  const [searchText] = useAtom(searchBarText);

  const fetching = React.useRef(false);
  const containerRef = React.useRef<any>(null);
  const [currentPage, setCurrentPage] = React.useState(0);
  const lastPageTriggered = React.useRef(false);

  const getUsers = React.useCallback(async () => {
    fetching.current = true;
    // TODO include pagination
    const result = await axios.get(
      `/api/list-communities?searchText=${searchText}`,
    );

    setCommunities(result.data);
    fetching.current = false;
  }, []);

  const handleScroll = () => {
    if (!containerRef.current) return;
    if (
      containerRef.current.scrollHeight - containerRef.current.scrollTop <=
      containerRef.current.clientHeight + 50
    ) {
      setCurrentPage(currentPage + 1);
    }
  };

  const onCommunitySelect = (community: Community) => {
    navigate.push(`/create/communities/${community.symbol}`);
  };

  React.useEffect(() => {
    if (!currentUser || fetching.current) return;
    getUsers();
  }, [currentUser]);

  return (
    <div
      className="w-full grid grid-cols-auto lg:grid-cols-8 md:grid-cols-4 sm:grid-cols-2 gap-8 px-4 flex mt-4 overflow-x-auto overflow-y-hidden"
      ref={containerRef}
      onScroll={handleScroll}
    >
      {communities.map((value) => (
        <div
          className="cursor-pointer"
          onClick={() => onCommunitySelect(value.data)}
          key={value._id?.toString()}
        >
          <CommunityCard
            name={value.data.name}
            image={value.data.image}
            username={value.data.symbol}
            description={value.data.description}
            key={value.data.tokenAddress}
          />
        </div>
      ))}
    </div>
  );
};

export default CommunitiesList;
