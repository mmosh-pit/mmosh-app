import * as React from "react";
import { useAtom } from "jotai";

import TelegramDarkIcon from "@/assets/icons/TelegramDarkIcon";
import TwitterDarkIcon from "@/assets/icons/TwitterDarkIcon";
import Image from "next/image";
import { User } from "../models/user";
import axios from "axios";
import { data, accounts, points, searchBarText } from "../store";

const HomePage = () => {
  const [currentUser] = useAtom(data);
  const [_, setTotalAccounts] = useAtom(accounts);
  const [__, setTotalPoints] = useAtom(points);
  const [searchText] = useAtom(searchBarText);
  const allUsers = React.useRef<User[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);

  const getUsers = React.useCallback(async () => {
    const result = await axios.get(`/api/get-all-users`);

    setUsers(result.data.users);
    allUsers.current = result.data.users;
    setTotalPoints(result.data.totalPoints);
    setTotalAccounts(result.data.totalAccounts);
  }, []);

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
    <div className="w-full h-screen flex flex-col items-center mt-6 home-content">
      <div className="self-center md:max-w-[50%] max-w-[80%]">
        <p className="text-center text-white font-goudy font-normal mb-[3vmax] mt-[1vmax]">
          Welcome Home, {currentUser?.profile?.name}
        </p>

        <p className="text-center text-white">
          A MMOSH is a decentralized, permissionless and composable virtual
          world available through various access devices and software platforms
        </p>
      </div>

      <div className="w-[90%] grid xs:grid-cols-auto lg:grid-cols-3 gap-4 mt-[3vmax]">
        {users.map((value, index) => (
          <div className="grid">
            <div className="flex bg-[#030007] bg-opacity-40 px-4 py-4 rounded-2xl">
              <div className="self-center max-w-[30%] mr-8">
                <div className="relative w-[8vmax] h-[8vmax]">
                  <Image
                    src={value.profile.image}
                    alt="Profile Image"
                    className="rounded-full"
                    layout="fill"
                  />
                </div>
              </div>

              <div className="w-full flex flex-col justify-start">
                <div>
                  <p className="text-white text-lg">
                    {value.profile.name} • <span>Guest</span>
                  </p>
                  <p className="text-base">@{value.profile.username}</p>
                </div>

                <div className="my-4">
                  <p className="text-white text-base">{value.profile.bio}</p>
                  <a
                    className="text-[#FF00C7] text-base"
                    href={`https://mmosh.app/${value.profile.username}`}
                  >
                    mmosh.app/{value.profile.username}
                  </a>
                </div>

                <div>
                  <div className="flex items-center">
                    <TelegramDarkIcon />

                    <a
                      target="_blank"
                      href={`https://t.me/${value.telegram.username}`}
                      className="ml-4 underline text-[#9493B2]"
                    >
                      https://t.me/{value.telegram.username}
                    </a>
                  </div>

                  <div className="flex items-center mt-2">
                    <TwitterDarkIcon />

                    <a
                      target="_blank"
                      href={`https://twitter.com/${value.twitter.username}`}
                      className="ml-4 underline text-[#9493B2]"
                    >
                      https://twitter.com/{value.twitter.username}
                    </a>
                  </div>
                </div>

                <div className="w-[80%] flex justify-between bg-[#434E59] bg-opacity-50 px-[2vmax] py-2 rounded-3xl mt-4">
                  <div>
                    <p className="text-white text-base">
                      Points: {value.telegram.points || 0}
                    </p>
                  </div>

                  <div className="bg-[#596570] w-[1px] h-full" />

                  <div>
                    <p className="text-white text-base">Rank: {index + 1}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
