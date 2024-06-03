"use client";

import CoinsTable from "@/app/components/CoinDirectory/CoinsTable";
import Price from "@/app/components/CoinDirectory/Price";
import SearchBar from "@/app/components/CoinDirectory/SearchBar";
import TVL from "@/app/components/CoinDirectory/TVL";
import Volume from "@/app/components/CoinDirectory/Volume";
import useCheckMobileScreen from "@/app/lib/useCheckMobileScreen";

const Coins = () => {
  const isMobile = useCheckMobileScreen();

  return (
    <div className="background-content relative flex flex-col max-h-full pt-20 px-12">
      {!isMobile && (
        <div className="w-full grid md:grid-cols-3 gap-8 grid-cols-auto items-center">
          <TVL />

          <Volume />

          <Price />
        </div>
      )}

      <div className="mt-8">
        <SearchBar />
      </div>

      <div className="w-full mt-8">
        <CoinsTable />
      </div>
    </div>
  );
};

export default Coins;
