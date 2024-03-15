import axios from "axios";
import * as React from "react";
import { useAtom } from "jotai";
import { User } from "../models/user";
import UserCard from "./UserCard";
import UserSortTabs from "./UserSortTabs";
import { lineage, sortDirection, sortOption } from "../store";
import LineageFilterOptions from "./Profile/LineageFilterOptions";

const GuildList = ({
  profilenft,
  isMyProfile,
  userName,
}: {
  profilenft: string;
  isMyProfile: boolean;
  userName: string;
}) => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const [users, setUsers] = React.useState<User[]>([]);

  const [selectedSortOption] = useAtom(sortOption);
  const [selectedSortDirection] = useAtom(sortDirection);
  const [lineageOptions] = useAtom(lineage);

  const lastPageTriggered = React.useRef(false);

  const fetching = React.useRef(false);
  const containerRef = React.useRef<any>(null);

  const filterGuild = React.useCallback(async () => {
    if (!profilenft) return;
    const gensArr: string[] = [];

    lineageOptions.forEach((val) => {
      if (val.selected) {
        gensArr.push(val.value);
      }
    });

    fetching.current = true;
    const result = await axios.get(
      `/api/get-user-guild?address=${profilenft}&skip=${0}&sort=${selectedSortOption}&sortDir=${selectedSortDirection}&gens=${gensArr.join(",")}`,
    );
    fetching.current = false;
    lastPageTriggered.current = false;

    setCurrentPage(0);

    setUsers(result.data);
  }, [selectedSortOption, selectedSortDirection, lineageOptions, currentPage]);

  const paginateGuild = React.useCallback(async () => {
    if (!profilenft) return;
    const gensArr: string[] = [];

    lineageOptions.forEach((val) => {
      if (val.selected) {
        gensArr.push(val.value);
      }
    });

    fetching.current = true;
    const result = await axios.get(
      `/api/get-user-guild?address=${profilenft}&skip=${
        currentPage * 10
      }&sort=${selectedSortOption}&sortDir=${selectedSortDirection}&gens=${gensArr.join(",")}`,
    );
    fetching.current = false;

    if (result.data.length === 0) {
      lastPageTriggered.current = true;
    }

    setUsers((prev) => [...prev, ...result.data]);
  }, [selectedSortOption, selectedSortDirection, lineageOptions, currentPage]);

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
    if (currentPage > 0 && !lastPageTriggered.current && !fetching.current) {
      paginateGuild();
    }
  }, [currentPage]);

  React.useEffect(() => {
    filterGuild();
  }, [selectedSortOption, selectedSortDirection, lineageOptions]);

  if (!profilenft) return <></>;

  return (
    <>
      <div
        className="flex flex-col items-start ml-20 mt-8"
        ref={containerRef}
        onScroll={handleScroll}
      >
        <p className="text-lg text-white font-bold font-goudy">
          {isMyProfile ? "Your Guild" : `${userName}'s Guild`}
        </p>

        <LineageFilterOptions />

        <UserSortTabs />
      </div>

      {users.length === 0 ? (
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-base">
            {isMyProfile &&
              "Hmm, looks like you need to start expanding your Guild"}
          </p>
        </div>
      ) : (
        <div className="relative px-16 pb-8 grid xs:grid-cols-auto lg:grid-cols-3 gap-4 mt-[3vmax]">
          {users.map((value) => (
            <UserCard
              user={value}
              key={value.profile.username}
              isHome={false}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default GuildList;
