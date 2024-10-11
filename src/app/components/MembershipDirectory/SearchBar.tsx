import * as React from "react";
import { useAtom } from "jotai";

import SearchIcon from "@/assets/icons/SearchIcon";
import useCheckMobileScreen from "@/app/lib/useCheckMobileScreen";
import { textSearch } from "@/app/store/membership";
import Button from "../common/Button";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const router = useRouter();
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

        <div className="md:w-[20%] w-[40%]">
          <Button
            title="Join the Club"
            isLoading={false}
            size="large"
            isPrimary
            action={() => {
              router.push("/create/profile");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
