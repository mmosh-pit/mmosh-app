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

  const listInnerRef = React.useRef(null);
  const lastPageTriggered = React.useRef(false);

  const filterGuild = React.useCallback(async () => {
    if (!profilenft) return;
    const gensArr: string[] = [];

    lineageOptions.forEach((val) => {
      if (val.selected) {
        gensArr.push(val.value);
      }
    });

    const result = await axios.get(
      `/api/get-user-guild?address=${profilenft}&skip=${
        currentPage * 10
      }&sort=${selectedSortOption}&sortDir=${selectedSortDirection}&gens=${gensArr.join(",")}`,
    );

    if (result.data.length === 0) {
      lastPageTriggered.current = true;
    }

    setUsers(result.data);
  }, [selectedSortOption, selectedSortDirection, currentPage]);

  const onScroll = React.useCallback(() => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (
        scrollTop + clientHeight === scrollHeight &&
        !lastPageTriggered.current
      ) {
        setCurrentPage(currentPage + 1);
      }
    }
  }, [currentPage]);

  React.useEffect(() => {
    filterGuild();
  }, [selectedSortOption, selectedSortDirection, currentPage]);

  if (!profilenft || users.length === 0) return <></>;

  return (
    <>
      <div className="flex flex-col items-start ml-20 mt-8">
        <p className="text-lg text-white font-bold font-goudy">
          {isMyProfile ? "Your Guild" : `${userName}'s Guild`}
        </p>

        <LineageFilterOptions />

        <UserSortTabs />
      </div>

      <div
        className="relative px-16 pb-8 grid xs:grid-cols-auto lg:grid-cols-3 gap-4 mt-[3vmax]"
        onScroll={onScroll}
        ref={listInnerRef}
      >
        {users.map((value) => (
          <UserCard user={value} key={value.profile.username} />
        ))}
      </div>
    </>
  );
};

export default GuildList;
