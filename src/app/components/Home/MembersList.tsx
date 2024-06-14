import * as React from "react";
import Image from "next/image";
import axios from "axios";
import { useAtom } from "jotai";

import TwitterDarkIcon from "@/assets/icons/TwitterDarkIcon";
import TelegramDarkIcon from "@/assets/icons/TelegramDarkIcon";
import { data, searchBarText } from "@/app/store";
import { User } from "@/app/models/user";

const MembersList = () => {
  const [currentUser] = useAtom(data);
  const [searchText] = useAtom(searchBarText);

  const [isLoading, setIsLoading] = React.useState(false);
  const fetching = React.useRef(false);
  const containerRef = React.useRef<any>(null);
  const [currentPage, setCurrentPage] = React.useState(0);
  const allUsers = React.useRef<User[]>([]);
  const lastPageTriggered = React.useRef(false);
  const [users, setUsers] = React.useState<User[]>([]);

  const getUsers = React.useCallback(async () => {
    setIsLoading(true);
    const result = await axios.get(`/api/get-all-users?sort=royalty&skip=0`);

    setUsers(result.data.users);
    allUsers.current = result.data.users;
    setIsLoading(false);
  }, []);

  const filterUsers = React.useCallback(async () => {
    fetching.current = true;
    const result = await axios.get(
      `/api/get-all-users?skip=${0}&searchText=${searchText}`,
    );

    setCurrentPage(0);
    fetching.current = false;
    lastPageTriggered.current = false;

    setUsers(result.data.users);
    allUsers.current = result.data.users;
  }, [currentPage, searchText]);

  const paginateUsers = React.useCallback(async () => {
    fetching.current = true;
    const result = await axios.get(
      `/api/get-all-users?skip=${currentPage * 10}searchText=${searchText}`,
    );

    fetching.current = false;

    if (result.data.users.length === 0) {
      lastPageTriggered.current = true;
    }

    setUsers((prev) => [...prev, ...result.data.users]);
    allUsers.current = [...allUsers.current, ...result.data.users];
  }, [currentPage, searchText]);

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
  }, [searchText]);

  React.useEffect(() => {
    if (currentPage > 0 && !lastPageTriggered.current && !fetching.current) {
      paginateUsers();
    }
  }, [currentPage]);

  React.useEffect(() => {
    if (fetching.current) return;
    getUsers();
  }, [currentUser]);

  if (isLoading) return <></>;

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
        className="px-4 grid xs:grid-cols-auto lg:grid-cols-2 gap-4 mt-4 overflow-y-auto"
        ref={containerRef}
        onScroll={handleScroll}
      >
        {users.map((user) => (
          <div
            className="flex bg-[#030007] bg-opacity-40 px-2 py-2 rounded-2xl"
            id="border-gradient-container"
            key={user.profile.username}
          >
            <div className="self-center max-w-[30%] mr-8">
              <div className="relative w-[6vmax] h-[6vmax]">
                <Image
                  src={user.profile.image}
                  alt="Profile Image"
                  className="rounded-full"
                  layout="fill"
                />
              </div>
            </div>

            <div className="w-full flex flex-col justify-start">
              <div>
                <p className="text-white text-sm">
                  {user.profile.name} •{" "}
                  <span className="text-gray-500">Member</span>
                </p>
                <p className="text-sm">@{user.profile.username}</p>
              </div>

              <div className="my-2 flex flex-col">
                <p className="text-white text-sm text-dots md:w-[12vmax] w-[8vmax]">
                  {user.profile.bio}
                </p>
                <a
                  className="text-[#FF00C7] text-sm"
                  href={`https://mmosh.app/${user.profile.username}`}
                >
                  mmosh.app/{user.profile.username}
                </a>
              </div>

              <div className="w-[100%] flex justify-between items-center py-2 rounded-3xl mt-2">
                <div className="flex items-center">
                  <p className="text-white text-xs">Guild Size</p>

                  <div className="w-[3vmax] py-1 flex justify-center items-center text-center bg-[#584C6E] bg-opacity-40 rounded-full ml-4">
                    <p className="text-white text-sm">12</p>
                  </div>
                </div>

                <div className="flex mr-8 justify-between">
                  {user.twitter?.username && (
                    <a
                      className="cursor-pointer"
                      href={`https://twitter.com/${user.twitter.username}`}
                    >
                      <TwitterDarkIcon />
                    </a>
                  )}

                  {user.telegram?.username && (
                    <a
                      className="cursor-pointer ml-2"
                      href={`https://t.me/${user.telegram.username}`}
                    >
                      <TelegramDarkIcon />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersList;
