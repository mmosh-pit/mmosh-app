"use client";
import * as React from "react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

import { isDrawerOpen } from "../store";
import Button from "../components/common/Button";
import SearchIcon from "@/assets/icons/SearchIcon";

const Page = () => {
  const router = useRouter();

  const [communities, setCommunities] = React.useState<GroupCommunity[]>([]);

  const [isDrawerShown] = useAtom(isDrawerOpen);

  const [searchText, setSearchText] = React.useState("");

  return (
    <div
      className={`background-content flex flex-col ${isDrawerShown ? "z-[-1]" : ""}`}
    >
      <div className="w-full flex justify-between items-end">
        <div className="w-[33%]" />

        <div className="flex flex-col w-[33%]">
          <h6>Community Directory</h6>

          <div className="w-full flex justify-between mt-4">
            <div className="w-full flex items-center bg-[#010623] bg-opacity-[0.15] border-[1px] border-[#C2C2C229] rounded-full p-1 backdrop-filter backdrop-blur-[10px]">
              <button className="flex bg-[#5A00FF] rounded-full p-2 items-center">
                <SearchIcon />
              </button>

              <input
                placeholder="Type your search terms"
                className="ml-4 w-full bg-transparent outline-none"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="w-[33%]">
          <Button
            isLoading={false}
            size="large"
            title="Create New Community"
            action={() => {
              router.push("/communities/create");
            }}
            isPrimary
          />
        </div>
      </div>

      <div id="communities-list"></div>
    </div>
  );
};

export default Page;
