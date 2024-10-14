import * as React from "react";
import { useAtom } from "jotai";

import CoinsTable from "./CoinDirectory/CoinsTable";
import SearchBar from "./CoinDirectory/SearchBar";
import Graphics from "./Home/Graphics";
import { selectedCoinsMode } from "../store/home";
import CoinsList from "./Home/CoinsList";
import useCheckMobileScreen from "../lib/useCheckMobileScreen";

const HomePage = () => {
  // const [currentUser] = useAtom(data);
  // const [isDrawerShown] = useAtom(isDrawerOpen);

  const [coinsMode] = useAtom(selectedCoinsMode);

  const isMobile = useCheckMobileScreen();

  return (
    <div className="background-content flex flex-col max-h-full pt-20 px-12 w-full">
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
