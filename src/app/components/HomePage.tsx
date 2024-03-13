import * as React from "react";
import { useAtom } from "jotai";

import { User } from "../models/user";
import axios from "axios";
import {
  accounts,
  data,
  isDrawerOpen,
  points,
  searchBarText,
  sortDirection,
  sortOption,
  userType,
} from "../store";
import Banner from "./Banner";
import { useWallet } from "@solana/wallet-adapter-react";
import BotBanner from "./BotBanner";
import UserCard from "./UserCard";
import UserSortTabs from "./UserSortTabs";
import UserTypeOptionsTabs from "./Home/UserTypeOptionsTabs";

const HomePage = () => {
  const [currentUser] = useAtom(data);
  const [_, setTotalAccounts] = useAtom(accounts);
  const [__, setTotalPoints] = useAtom(points);
  const [searchText] = useAtom(searchBarText);
  const [isDrawerShown] = useAtom(isDrawerOpen);
  const [selectedSortOption] = useAtom(sortOption);
  const [selectedSortDirection] = useAtom(sortDirection);
  const [selectedFilter] = useAtom(userType);

  const allUsers = React.useRef<User[]>([]);
  const listInnerRef = React.useRef(null);
  const lastPageTriggered = React.useRef(false);
  const [users, setUsers] = React.useState<User[]>([]);
  const [currentPage, setCurrentPage] = React.useState(0);

  const wallet = useWallet();

  const getUsers = React.useCallback(async () => {
    const result = await axios.get(
      `/api/get-all-users?sort=royalty&skip=0&userType=all`,
    );

    setUsers(result.data.users);
    allUsers.current = result.data.users;
    setTotalPoints(result.data.totalPoints);
    setTotalAccounts(result.data.totalAccounts);
  }, []);

  const filterUsers = React.useCallback(async () => {
    const result = await axios.get(
      `/api/get-all-users?sort=${selectedSortOption}&skip=${
        currentPage * 10
      }&userType=${selectedFilter}&sortDir=${selectedSortDirection}`,
    );

    if (result.data.users.length === 0) {
      lastPageTriggered.current = true;
    }

    setUsers(result.data.users);
    allUsers.current = result.data.users;
  }, [selectedFilter, selectedSortOption, selectedSortDirection, currentPage]);

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
    filterUsers();
  }, [selectedFilter, selectedSortOption, selectedSortDirection, currentPage]);

  React.useEffect(() => {
    if (!currentUser) return;
    getUsers();
  }, [currentUser]);

  React.useEffect(() => {
    if (searchText === "") {
      setUsers(allUsers.current);
      return;
    }

    const filteredUsers = allUsers.current.filter((value) => {
      if (
        value.profile.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        value.profile.username?.toLowerCase().includes(searchText.toLowerCase())
      ) {
        return true;
      }

      return false;
    });

    setUsers(filteredUsers);
  }, [searchText]);

  return (
    <div
      className={`w-full h-screen flex flex-col items-center mt-6 home-content ${
        isDrawerShown ? "z-[-1]" : ""
      }`}
    >
      {wallet?.publicKey && <BotBanner />}
      {wallet.publicKey && <Banner fromProfile={false} />}
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

        <div
          className="w-[90%] grid xs:grid-cols-auto lg:grid-cols-3 gap-4 mt-[3vmax]"
          ref={listInnerRef}
          onScroll={onScroll}
        >
          {users.map((value) => (
            <UserCard user={value} key={value.profile.username} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
