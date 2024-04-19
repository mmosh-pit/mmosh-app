import * as React from "react";
import { useAtom } from "jotai";

import { User } from "../models/user";
import axios from "axios";
import {
  data,
  isDrawerOpen,
  searchBarText,
  sortDirection,
  sortOption,
  userType,
} from "../store";
import Banner from "./Banner";
import { useWallet } from "@solana/wallet-adapter-react";
import UserCard from "./UserCard";
import UserSortTabs from "./UserSortTabs";
import UserTypeOptionsTabs from "./Home/UserTypeOptionsTabs";

const HomePage = () => {
  const [currentUser] = useAtom(data);
  const [searchText] = useAtom(searchBarText);
  const [isDrawerShown] = useAtom(isDrawerOpen);
  const [selectedSortOption] = useAtom(sortOption);
  const [selectedSortDirection] = useAtom(sortDirection);
  const [selectedFilter] = useAtom(userType);

  const fetching = React.useRef(false);
  const containerRef = React.useRef<any>(null);
  const [currentPage, setCurrentPage] = React.useState(0);
  const allUsers = React.useRef<User[]>([]);
  const lastPageTriggered = React.useRef(false);
  const [users, setUsers] = React.useState<User[]>([]);

  const wallet = useWallet();

  const getUsers = React.useCallback(async () => {
    const result = await axios.get(
      `/api/get-all-users?sort=royalty&skip=0&userType=all`,
    );

    setUsers(result.data.users);
    allUsers.current = result.data.users;
  }, []);

  const filterUsers = React.useCallback(async () => {
    fetching.current = true;
    const result = await axios.get(
      `/api/get-all-users?sort=${selectedSortOption}&skip=${0}&userType=${selectedFilter}&sortDir=${selectedSortDirection}&searchText=${searchText}`,
    );

    setCurrentPage(0);
    fetching.current = false;
    lastPageTriggered.current = false;

    setUsers(result.data.users);
    allUsers.current = result.data.users;
  }, [
    selectedFilter,
    selectedSortOption,
    selectedSortDirection,
    currentPage,
    searchText,
  ]);

  const paginateUsers = React.useCallback(async () => {
    fetching.current = true;
    const result = await axios.get(
      `/api/get-all-users?sort=${selectedSortOption}&skip=${
        currentPage * 10
      }&userType=${selectedFilter}&sortDir=${selectedSortDirection}&searchText=${searchText}`,
    );

    fetching.current = false;

    if (result.data.users.length === 0) {
      lastPageTriggered.current = true;
    }

    setUsers((prev) => [...prev, ...result.data.users]);
    allUsers.current = [...allUsers.current, ...result.data.users];
  }, [
    selectedFilter,
    selectedSortOption,
    selectedSortDirection,
    currentPage,
    searchText,
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
    filterUsers();
  }, [selectedFilter, selectedSortOption, selectedSortDirection, searchText]);

  React.useEffect(() => {
    if (currentPage > 0 && !lastPageTriggered.current && !fetching.current) {
      paginateUsers();
    }
  }, [currentPage]);

  React.useEffect(() => {
    if (!currentUser) return;
    getUsers();
  }, [currentUser]);

  return (
    <div
      className={`w-full h-screen flex flex-col items-center mt-6 home-content ${
        isDrawerShown ? "z-[-1]" : ""
      }`}
      ref={containerRef}
      onScroll={handleScroll}
    >
      <Banner fromProfile={false} />
      <div className="self-center md:max-w-[50%] max-w-[80%]">
        <p className="text-center text-white font-goudy font-normal mb-[3vmax] mt-[1vmax]">
          Welcome Home, {currentUser?.profile?.name}
        </p>

        <p className="text-center text-white">
          A MMOSH is a decentralized, permissionless and composable virtual
          world available through various access devices and software platforms
        </p>
      </div>

      <div className="w-full mt-8">
        <div className="flex flex-col items-start ml-20">
          <UserTypeOptionsTabs />

          <UserSortTabs />
        </div>

        <div className="w-full px-12 grid xs:grid-cols-auto lg:grid-cols-3 gap-4 mt-[3vmax]">
          {users.map((value) => (
            <UserCard user={value} key={value.profile.username} isHome />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
