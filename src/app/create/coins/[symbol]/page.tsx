"use client";
import * as React from "react";
import axios from "axios";
import { useAtom } from "jotai";
import Image from "next/image";

import ArrowBack from "@/assets/icons/ArrowBack";
import { useRouter } from "next/navigation";
import { Coin } from "@/app/models/coin";
import Graphics from "@/app/components/Forge/CoinPage/Graphics";
import Stats from "@/app/components/Forge/CoinPage/Stats";
import TransactionsTable from "@/app/components/Forge/CoinPage/TransactionsTable";
import { selectedUSDCCoin } from "@/app/store/coins";

const Page = ({ params }: { params: { symbol: string } }) => {
  const navigate = useRouter();

  const [isUSDCSelected, setIsUSDCSelected] = useAtom(selectedUSDCCoin);

  const rendered = React.useRef(false);

  const [coin, setCoin] = React.useState<Coin | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const goBack = React.useCallback(() => {
    navigate.back();
  }, []);

  const fetchCoinData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      console.log("Queryiiing");
      const result = await axios.get<Coin>(
        `/api/get-token-by-symbol?symbol=${params.symbol}`,
      );

      setIsLoading(false);
      setCoin(result.data);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [params]);

  React.useEffect(() => {
    if (!rendered.current) {
      fetchCoinData();
      rendered.current = true;
    }
  }, [params]);

  if (isLoading) {
    return (
      <div className="background-content flex w-full justify-center items-center">
        <span className="loading loading-spinner w-[8vmax] h-[8vmax] loading-lg bg-[#BEEF00]"></span>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="background-content flex flex-col max-h-full pt-20 px-12" />
    );
  }

  return (
    <div className="background-content flex flex-col max-h-full pt-20 px-12">
      <div className="w-full flex justify-between">
        <div className="flex items-center mb-8 ml-4">
          <div
            className="flex items-center mr-4 cursor-pointer"
            onClick={goBack}
          >
            <ArrowBack />
            <p className="text-white text-sm">Back</p>
          </div>

          <div className="flex items-center">
            <div className="relative w-[1.5vmax] h-[1.5vmax]">
              <Image
                alt={coin.symbol}
                src={coin.image}
                layout="fill"
                className="rounded-full"
              />
            </div>

            <h6 className="mx-2">{coin.name}</h6>
            <p className="text-tiny self-end">{coin.symbol}</p>
          </div>
        </div>

        <div className="flex items-center mr-8">
          <p className="text-sm">MMOSH</p>
          <input
            type="checkbox"
            className="toggle [--tglbg:#1A1750] hover:bg-[#EF01A4] bg-[#EF01A4] mx-4"
            checked={isUSDCSelected}
            onChange={(e) => setIsUSDCSelected(e.target.checked)}
          />
          <p className="text-sm">USDC</p>
        </div>
      </div>
      <div className="w-full flex flex-col md:flex-row justify-between">
        <Graphics coin={coin} />
        <Stats coin={coin} />
      </div>

      <div className="w-full px-12 mt-20">
        <TransactionsTable coin={coin} />
      </div>
    </div>
  );
};

export default Page;
