"use client";
import { useAtom } from "jotai";
import * as React from "react";

import { isDrawerOpen } from "../store";
import SearchBar from "../components/Project/Candidates/SearchBar";

const Inform = () => {
  const [isDrawerShown] = useAtom(isDrawerOpen);
  const [searchText, setSearchText] = React.useState("");

  return (
    <div
      className={`background-content-full-bg flex flex-col items-center ${isDrawerShown ? "z-[-1]" : ""}`}
    >
      <div className="bg-[#131245E0] flex flex-col items-center py-4 px-2 md:w-[85%] w-[95%] rounded-lg mt-8">
        <h3>Inform OPOS</h3>

        <div className="mt-6 mb-3">
          <SearchBar setSearchText={setSearchText} />
        </div>

        <div className="w-full bg-[#09073A] px-4 py-2 rounded-md">
          <h5>Ecosystem</h5>
        </div>

        <div className="w-full flex justify-center items-center flex-wrap h-[10vh]">
          <p className="text-white text-center text-sm">Nothing yet</p>
        </div>

        <div className="w-full bg-[#09073A] px-4 py-2 rounded-md">
          <h5>Projects</h5>
        </div>

        <div className="w-full flex justify-center items-center flex-wrap h-[10vh]">
          <p className="text-white text-center text-sm">Nothing yet</p>
        </div>

        <div className="w-full bg-[#09073A] px-4 py-2 rounded-md">
          <h5>Communities</h5>
        </div>

        <div className="w-full flex justify-center items-center flex-wrap h-[10vh]">
          <p className="text-white text-center text-sm">Nothing yet</p>
        </div>

        <div className="w-full bg-[#09073A] px-4 py-2 rounded-md">
          <h5>Coins</h5>
        </div>

        <div className="w-full flex justify-center items-center flex-wrap h-[10vh]">
          <p className="text-white text-center text-sm">Nothing yet</p>
        </div>
      </div>
    </div>
  );
};

export default Inform;
