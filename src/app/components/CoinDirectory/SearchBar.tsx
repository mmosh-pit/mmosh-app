import * as React from "react";
import { useAtom } from "jotai";

import SearchIcon from "@/assets/icons/SearchIcon";
import useCheckMobileScreen from "@/app/lib/useCheckMobileScreen";
import {
  coinTextSearch,
  selectedUSDCCoin,
  selectedVolume,
} from "@/app/store/coins";

const volumeOptions = [
  {
    label: "1H Volume",
    value: "1h",
  },
  {
    label: "1D Volume",
    value: "1d",
  },
  {
    label: "1W Volume",
    value: "1w",
  },
  {
    label: "1M Volume",
    value: "1m",
  },
  {
    label: "1Y Volume",
    value: "1y",
  },
];

const SearchBar = () => {
  const isMobile = useCheckMobileScreen();
  const [localText, setLocalText] = React.useState("");

  const [_, setSearchText] = useAtom(coinTextSearch);
  const [isUSDCSelected, setIsUSDCSelected] = useAtom(selectedUSDCCoin);
  const [volume, setVolume] = useAtom(selectedVolume);

  const executeSearch = () => {
    setSearchText(localText);
  };

  return (
    <div className="w-full flex justify-between px-8">
      {!isMobile && <div className="w-[33%]" />}

      <div className="w-[33%] flex items-center bg-[#F4F4F4] bg-opacity-[0.15] border-[1px] border-[#C2C2C2] rounded-full p-1 backdrop-filter backdrop-blur-[5px]">
        <button
          className="flex bg-[#5A00FF] rounded-full px-12 py-4 items-center"
          onClick={executeSearch}
        >
          <SearchIcon />

          <p className="text-white font-bold text-base ml-4">Search</p>
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

      <div className="w-[33%] flex items-center justify-between">
        <div className="flex items-center">
          <p className="text-sm">MMOSH</p>
          <input
            type="checkbox"
            className="toggle [--tglbg:#1A1750] bg-[#EF01A4]"
            checked={isUSDCSelected}
            onChange={(e) => setIsUSDCSelected(e.target.checked)}
          />
          <p className="text-sm">USDC</p>
        </div>

        <div className="dropdown bg-[#221E5F] rounded-lg py-1">
          <div tabIndex={0} role="button" className="btn m-1">
            {volume.label}
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 bg-[#221E5F]"
          >
            {volumeOptions.map((value) => (
              <li onClick={() => setVolume(value)}>
                <p>{value.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
