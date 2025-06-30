import * as React from "react";
import { useAtom } from "jotai";

import SearchIcon from "@/assets/icons/SearchIcon";
import useCheckMobileScreen from "@/app/lib/useCheckMobileScreen";
import { textSearch } from "@/app/store/membership";
import ArrowUp from "@/assets/icons/ArrowUp";
import ArrowDown from "@/assets/icons/ArrowDown";

const SearchBar = () => {
  const isMobile = useCheckMobileScreen();
  const [localText, setLocalText] = React.useState("");

  const [_, setSearchText] = useAtom(textSearch);

  const executeSearch = () => {
    setSearchText(localText);
  };

  return (
    <div className="w-full flex flex-col items-center px-8">
      {isMobile && (
        <div className="w-[75%] flex md:items-center bg-[#010623] bg-opacity-[0.15] border-[1px] border-[#C2C2C229] rounded-full p-1 backdrop-filter backdrop-blur-[10px]">
          <button
            className="flex bg-[#5A00FF] rounded-full px-6 py-4 items-center"
            onClick={executeSearch}
          >
            <SearchIcon width={24} height={24} />

            <p className="text-white font-bold text-base ml-2.5 md:block hidden">
              Search
            </p>
          </button>

          <input
            placeholder="Type your search terms"
            className="ml-4 w-full bg-transparent outline-none"
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                executeSearch();
              }
            }}
          />
        </div>
      )}
      <div className="w-full flex justify-between">
        {!isMobile && <div className="w-[33%]" />}

        {!isMobile && (
          <div className="w-[50%] md:w-[20%] flex md:items-center bg-[#010623] bg-opacity-[0.15] border-[1px] border-[#C2C2C229] rounded-full p-1 backdrop-filter backdrop-blur-[10px]">
            <button
              className="flex bg-[#5A00FF] rounded-full px-6 py-4 items-center"
              onClick={executeSearch}
            >
              <SearchIcon width={24} height={24} />

              <p className="text-white font-bold text-base ml-2.5 md:block hidden">
                Search
              </p>
            </button>

            <input
              placeholder="Type your search terms"
              className="ml-4 w-full bg-transparent outline-none"
              value={localText}
              onChange={(e) => setLocalText(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  executeSearch();
                }
              }}
            />
          </div>
        )}

        <div className="w-[33%] flex justify-end items-center">
          <div className="rounded-full px-6 py-2 flex items-center bg-[#2F2D58] border-[1px] border-[#FFFFFF22]">
            <p className="text-white text-base">Sort By</p>
            <div className="flex flex-col items-center justify-center ml-1">
              <ArrowUp width="0.3vmax" height="0.3vmax" />
              <div className="my-[2px]" />
              <ArrowDown width="0.3vmax" height="0.3vmax" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
