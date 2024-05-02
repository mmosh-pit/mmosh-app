import * as React from "react";
import Image from "next/image";
import axios from "axios";
import { useAtom } from "jotai";
import { data, searchBarText } from "@/app/store";
import { User } from "@/app/models/user";

import { LineChart, Line, ResponsiveContainer } from "recharts";

const dummyData = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const CoinsList = () => {
  const [currentUser] = useAtom(data);
  const [searchText] = useAtom(searchBarText);

  const fetching = React.useRef(false);
  const containerRef = React.useRef<any>(null);
  const [currentPage, setCurrentPage] = React.useState(0);
  const allUsers = React.useRef<User[]>([]);
  const lastPageTriggered = React.useRef(false);
  const [users, setUsers] = React.useState<User[]>([]);

  const getUsers = React.useCallback(async () => {
    const result = await axios.get(`/api/get-all-users?sort=royalty&skip=0`);

    setUsers(result.data.users);
    allUsers.current = result.data.users;
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
      `/api/get-all-users?skip=${currentPage * 10}&searchText=${searchText}`,
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
    if (!currentUser) return;
    getUsers();
  }, [currentUser]);

  return (
    <div
      className="w-full px-4 grid xs:grid-cols-auto lg:grid-cols-2 gap-8 mt-4"
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
            <div className="relative w-[3vmax] h-[3vmax]">
              <Image
                src={user.profile.image}
                alt="Profile Image"
                className="rounded-full"
                layout="fill"
              />
            </div>
          </div>

          <div className="flex grow flex-col justify-start">
            <div>
              <p className="text-white text-lg">{user.profile.name}</p>
              <p className="text-base">{user.profile.username}</p>
            </div>
          </div>

          <div className="flex flex-col h-full">
            <p className="text-base font-white self-start">FDV</p>

            <div className="self-center">
              <p className="text-lg text-white font-bold">
                234 <span className="text-base font-normal">USDC</span>
              </p>
            </div>
          </div>

          <div className="bg-[#434069] w-[2px] h-[90%] mx-2 self-center" />

          <div className="flex flex-col">
            <p className="text-sm self-end">24h</p>

            <div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dummyData}>
                  <Line
                    type="monotone"
                    dataKey="pv"
                    stroke="#39F10A"
                    strokeWidth={4}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex self-end">
              <p className="text-sm text-[#39F10A]">0.0%</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoinsList;
