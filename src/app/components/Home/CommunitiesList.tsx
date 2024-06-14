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

  const [isLoading, setIsLoading] = React.useState(false);

  const [currentUser] = useAtom(data);
  const [searchText] = useAtom(searchBarText);

  const fetching = React.useRef(false);
  const containerRef = React.useRef<any>(null);
  const [currentPage, setCurrentPage] = React.useState(0);
  const lastPageTriggered = React.useRef(false);

  const getCommunities = React.useCallback(async () => {
    setIsLoading(true);
    fetching.current = true;
    // TODO include pagination
    const result = await axios.get(
      `/api/list-communities?searchText=${searchText}`,
    );

    setCommunities(result.data);
    fetching.current = false;
    setIsLoading(false);
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
    if (fetching.current) return;
    getCommunities();
  }, [currentUser]);

  if (isLoading) return <></>;

  return (
    <div id="communities" className="w-full flex flex-col mb-4">
      <div className="w-full flex justify-between px-4">
        <p className="text-white text-base">
          Community<span className="text-gray-500"></span>
        </p>

        <a
          className="underline text-white cursor-pointer text-base"
          href={`${process.env.NEXT_PUBLIC_APP_MAIN_URL}/create/communities`}
        >
          Go to Community Directory
        </a>
      </div>
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
    </div>
  );
};

export default CommunitiesList;
