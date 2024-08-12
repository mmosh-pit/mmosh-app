import * as React from "react";
import Image from "next/image";
import axios from "axios";
import { useAtom } from "jotai";

import TwitterDarkIcon from "@/assets/icons/TwitterDarkIcon";
import TelegramDarkIcon from "@/assets/icons/TelegramDarkIcon";
import { User } from "@/app/models/user";
import { selectedSearchFilter, typedSearchValue } from "@/app/store/home";
import MemberCard from "./MemberCard";

const MembersList = () => {
  const [selectedFilters] = useAtom(selectedSearchFilter);
  const [searchText] = useAtom(typedSearchValue);

  const [isLoading, setIsLoading] = React.useState(false);
  const fetching = React.useRef(false);
  const containerRef = React.useRef<any>(null);
  const [currentPage, setCurrentPage] = React.useState(0);
  const allUsers = React.useRef<User[]>([]);
  const lastPageTriggered = React.useRef(false);
  const [users, setUsers] = React.useState<User[]>([]);

  const getUsers = React.useCallback(async () => {
    if (
      selectedFilters.includes("members") ||
      selectedFilters.includes("all")
    ) {
      fetching.current = true;
      setIsLoading(true);
      const result = await axios.get(
        `/api/get-all-users?skip=${currentPage * 10}&searchText=${searchText}`,
      );

      if (result.data.users.length === 0) {
        lastPageTriggered.current = true;
      }

      setUsers(result.data.users);
      allUsers.current = result.data.users;
      setIsLoading(false);
      fetching.current = false;
    } else {
      setUsers([]);
    }
  }, [searchText, selectedFilters, currentPage]);

  // const paginateUsers = React.useCallback(async () => {
  //   fetching.current = true;
  //   const result = await axios.get(
  //     `/api/get-all-users?skip=${currentPage * 10}searchText=${searchText}`,
  //   );
  //
  //   fetching.current = false;
  //
  //   if (result.data.users.length === 0) {
  //     lastPageTriggered.current = true;
  //   }
  //
  //   setUsers((prev) => [...prev, ...result.data.users]);
  //   allUsers.current = [...allUsers.current, ...result.data.users];
  // }, [currentPage, searchText]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    if (
      containerRef.current.scrollHeight - containerRef.current.scrollTop <=
      containerRef.current.clientHeight + 50
    ) {
      setCurrentPage(currentPage + 1);
    }
  };

  // React.useEffect(() => {
  //   if (currentPage > 0 && !lastPageTriggered.current && !fetching.current) {
  //     paginateUsers();
  //   }
  // }, [currentPage]);

  React.useEffect(() => {
    if (fetching.current) return;
    getUsers();
  }, [searchText, currentPage]);

  if (isLoading) return <></>;

  if (users?.length === 0) return <></>;

  return (
    <div className="flex w-full flex-col" id="members">
      <div className="w-full flex justify-between px-4">
        <p className="text-white text-base">
          Members <span className="text-gray-500"></span>
        </p>

        <a className="underline text-white cursor-pointer text-base">
          Go to Membership Directory
        </a>
      </div>
      <div
        className="px-4 grid grid-cols-auto xs:grid-cols-1 xl:grid-cols-2 gap-4 mt-4 overflow-y-auto"
        ref={containerRef}
        onScroll={handleScroll}
      >
        {users.map((user) => (
          <MemberCard user={user} />
        ))}
      </div>
    </div>
  );
};

export default MembersList;
