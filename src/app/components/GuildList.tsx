import axios from "axios";
import * as React from "react";
import { useAtom } from "jotai";
import { User } from "../models/user";
import UserCard from "./UserCard";
import UserSortTabs from "./UserSortTabs";
import {
  connectionTypes,
  data,
  lineage,
  sortDirection,
  sortOption,
} from "../store";
import LineageFilterOptions from "./Profile/LineageFilterOptions";
import ConnectionFilterOptions from "./Profile/ConnectionFilterOptions";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import useCheckMobileScreen from "../lib/useCheckMobileScreen";

const GuildList = ({
  profilenft,
  isMyProfile,
  userName,
}: {
  profilenft: string;
  isMyProfile: boolean;
  userName: string;
}) => {
  const wallet = useAnchorWallet();
  const connection = useConnection();
  const [currentUser] = useAtom(data);
  const isMobile = useCheckMobileScreen();

  const [currentPage, setCurrentPage] = React.useState(0);
  const [users, setUsers] = React.useState<User[]>([]);

  const [selectedSortOption] = useAtom(sortOption);
  const [selectedSortDirection] = useAtom(sortDirection);
  const [lineageOptions] = useAtom(lineage);

  const lastPageTriggered = React.useRef(false);

  const fetching = React.useRef(false);
  const containerRef = React.useRef<any>(null);
  const [connectionOptions] = useAtom(connectionTypes);

  const filterGuild = React.useCallback(async () => {
    if (!profilenft) return;
    const gensArr: string[] = [];

    lineageOptions.forEach((val) => {
      if (val.selected) {
        gensArr.push(val.value);
      }
    });

    const connectionArr: string[] = [];
    connectionOptions.forEach((val) => {
      if (val.selected) {
        connectionArr.push(val.value);
      }
    });

    fetching.current = true;
    let url = `/api/get-user-guild?address=${profilenft}&skip=${0}&sort=${selectedSortOption}&sortDir=${selectedSortDirection}&gens=${gensArr.join(",")}&connection=${connectionArr.join(",")}`;
    if (currentUser) {
      url = url + "&requester=" + currentUser.wallet;
    }
    const result = await axios.get(
      `/api/get-user-guild?address=${profilenft}&skip=${0}&sort=${selectedSortOption}&sortDir=${selectedSortDirection}&gens=${gensArr.join(",")}&connection=${connectionArr.join(",")}`,
    );
    fetching.current = false;
    lastPageTriggered.current = false;

    setCurrentPage(0);

    setUsers(result.data);
  }, [
    selectedSortOption,
    selectedSortDirection,
    lineageOptions,
    currentPage,
    currentUser,
  ]);

  const paginateGuild = React.useCallback(async () => {
    if (!profilenft) return;
    const gensArr: string[] = [];

    lineageOptions.forEach((val) => {
      if (val.selected) {
        gensArr.push(val.value);
      }
    });

    const connectionArr: string[] = [];
    connectionOptions.forEach((val) => {
      if (val.selected) {
        connectionArr.push(val.value);
      }
    });

    fetching.current = true;
    let url = `/api/get-user-guild?address=${profilenft}&skip=${
      currentPage * 10
    }&sort=${selectedSortOption}&sortDir=${selectedSortDirection}&connection=${connectionArr.join(",")}&gens=${gensArr.join(",")}`;
    if (currentUser) {
      url = url + "&requester=" + currentUser.wallet;
    }

    const result = await axios.get(url);
    fetching.current = false;

    if (result.data.length === 0) {
      lastPageTriggered.current = true;
    }

    setUsers((prev) => [...prev, ...result.data]);
  }, [
    selectedSortOption,
    selectedSortDirection,
    lineageOptions,
    currentPage,
    currentUser,
  ]);

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
        className="flex flex-col items-start md:ml-20 mt-8"
        ref={containerRef}
        onScroll={handleScroll}
      >
        <p className="text-lg text-white font-bold font-goudy">
          {isMyProfile ? "Your Lineage" : `${userName}'s Lineage`}
        </p>
        <div className="md:flex">
          <LineageFilterOptions />
          <ConnectionFilterOptions />
        </div>

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
        <div className="relative px-16 pb-8 grid xs:grid-cols-auto md:grid-cols-2 xl:grid-cols-3 gap-4 mt-[3vmax]">
          {users.map((value) => (
            <UserCard
              user={value}
              key={value.profile.username}
              isHome={false}
              currentuser={currentUser ? currentUser : undefined}
              connection={connection.connection}
              wallet={wallet}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default GuildList;
