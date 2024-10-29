import * as React from "react";
import axios from "axios";
import { useAtom } from "jotai";

import { User } from "@/app/models/user";
import { selectedSearchFilter } from "@/app/store/home";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { textSearch } from "@/app/store/membership";
import UserCard from "../UserCard";
import { data } from "@/app/store";

const MembersList = () => {
  const [selectedFilters] = useAtom(selectedSearchFilter);
  const [searchText] = useAtom(textSearch);

  const [isLoading, setIsLoading] = React.useState(false);
  const fetching = React.useRef(false);
  const containerRef = React.useRef<any>(null);
  const [currentPage, setCurrentPage] = React.useState(0);
  const allUsers = React.useRef<User[]>([]);
  const lastPageTriggered = React.useRef(false);
  const [users, setUsers] = React.useState<User[]>([]);
  const wallet = useAnchorWallet();
  const connection = useConnection();
  const [currentUser] = useAtom(data);

  const getUsers = React.useCallback(async () => {
    if (
      selectedFilters.includes("members") ||
      selectedFilters.includes("all")
    ) {
      fetching.current = true;
      setIsLoading(true);
      let url = `/api/get-all-users?skip=${currentPage * 15}&searchText=${searchText}`;
      if (wallet) {
        url = url + "&requester=" + wallet.publicKey.toBase58();
      }

      const result = await axios.get(url);

      if (result.data.users.length === 0) {
        lastPageTriggered.current = true;
        setIsLoading(false);
        fetching.current = false;
        return;
      }

      if (currentPage === 0) {
        setUsers(result.data.users);
      } else {
        setUsers((prev) => [...prev, ...result.data.users]);
      }

      allUsers.current = result.data.users;
      setIsLoading(false);
      fetching.current = false;
    } else {
      setUsers([]);
    }
  }, [searchText, selectedFilters, currentPage, wallet]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    if (
      containerRef.current.scrollHeight - containerRef.current.scrollTop <=
        containerRef.current.clientHeight + 50 &&
      !lastPageTriggered.current
    ) {
      setCurrentPage(currentPage + 1);
    }
  };

  React.useEffect(() => {
    if (fetching.current) return;
    getUsers();
  }, [searchText, currentPage]);

  if (isLoading) return <></>;

  if (users?.length === 0) return <></>;

  return (
    <div className="flex w-full flex-col" id="members">
      <div
        className="px-4 py-2 grid grid-cols-auto xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 overflow-y-auto mt-8"
        ref={containerRef}
        onScroll={handleScroll}
      >
        {users.map((user) => (
          // <MemberCard
          //   user={user}
          //   wallet={wallet}
          //   currentuser={currentUser || undefined}
          //   connection={connection.connection}
          // />
          <UserCard
            user={user}
            wallet={wallet}
            currentuser={currentUser || undefined}
            isHome={false}
            connection={connection.connection}
          />
        ))}
      </div>
    </div>
  );
};

export default MembersList;
