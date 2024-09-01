import * as React from "react";

import SearchIcon from "@/assets/icons/SearchIcon";

type Props = {
  setSearchText: (value: string) => void;
};

const SearchBar = ({ setSearchText }: Props) => {
  const [localText, setLocalText] = React.useState("");

  const executeSearch = () => {
    setSearchText(localText);
  };

  return (
    <div className="w-full flex justify-between px-8">
      <div className="w-full flex items-center bg-[#010623] bg-opacity-[0.15] border-[1px] border-[#C2C2C229] rounded-full p-1 backdrop-filter backdrop-blur-[10px]">
        <button
          className="flex bg-[#5A00FF] rounded-full p-4 items-center"
          onClick={executeSearch}
        >
          <SearchIcon />
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
    </div>
  );
};

export default SearchBar;
