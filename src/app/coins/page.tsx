"use client";
import * as React from "react";
import { useAtom } from "jotai";

import { selectedCoinsMode } from "../store/home";
import useCheckMobileScreen from "../lib/useCheckMobileScreen";
import Graphics from "../components/Home/Graphics";
import SearchBar from "../components/CoinDirectory/SearchBar";
import CoinsTable from "../components/CoinDirectory/CoinsTable";
import CoinsList from "../components/Home/CoinsList";

const HomePage = () => {
  const [coinsMode] = useAtom(selectedCoinsMode);

  const isMobile = useCheckMobileScreen();

  return (
    <div className="background-content flex flex-col max-h-full pt-20 px-12 w-full relative">
      <Graphics />

      <div className="mt-8">
        <SearchBar />
      </div>

      <div className="w-full mt-8">
        {coinsMode === "list" && !isMobile ? <CoinsTable /> : <CoinsList />}
      </div>
    </div>
  );
};

export default HomePage;
