import * as React from "react";
import { useAtom } from "jotai";
import axios from "axios";
import Image from "next/image";

import { Community } from "@/app/models/community";
import { data, searchBarText } from "@/app/store";

const CommunitiesList = () => {
  const [communities, setCommunities] = React.useState<Community[]>([]);

  const [currentUser] = useAtom(data);
  const [searchText] = useAtom(searchBarText);

  const fetching = React.useRef(false);
  const containerRef = React.useRef<any>(null);
  const [currentPage, setCurrentPage] = React.useState(0);
  const allCommunities = React.useRef<Community[]>([]);
  const lastPageTriggered = React.useRef(false);

  const getUsers = React.useCallback(async () => {
    fetching.current = true;
    const result = await axios.get(
      `/api/get-home-communities?search=${searchText}&skip=${currentPage * 15}`,
    );

    setCommunities(result.data);
    allCommunities.current = result.data.users;
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

  React.useEffect(() => {
    if (!currentUser || fetching.current) return;
    getUsers();
  }, [currentUser]);

  return (
    <div
      className="w-full px-4 flex mt-[3vmax] overflow-x-auto"
      ref={containerRef}
      onScroll={handleScroll}
    >
      {communities.map((community) => (
        <div className="flex flex-col">
          <div
            className="relative flex bg-[#030007] bg-opacity-40 px-2 py-2 rounded-t-xl w-[6vmax] h-[6vmax]"
            id="border-gradient-container"
          >
            <Image
              src={community.image}
              alt="Profile Image"
              className="rounded-full"
              layout="fill"
            />
          </div>
          <p>{community.name}</p>
        </div>
      ))}
    </div>
  );
};

export default CommunitiesList;
