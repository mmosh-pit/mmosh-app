"use client";
import * as React from "react";
import axios from "axios";
import Image from "next/image";

import ArrowBack from "@/assets/icons/ArrowBack";
import { useRouter } from "next/navigation";
import { Coin } from "@/app/models/coin";
import Graphics from "@/app/components/Forge/CoinPage/Graphics";
import Stats from "@/app/components/Forge/CoinPage/Stats";
import TransactionsTable from "@/app/components/Forge/CoinPage/TransactionsTable";

const Page = ({ params }: { params: { symbol: string } }) => {
  const navigate = useRouter();

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
      <div className="relative background-content flex w-full justify-center items-center">
        <span className="loading loading-spinner w-[8vmax] h-[8vmax] loading-lg bg-[#BEEF00]"></span>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="background-content relative flex flex-col max-h-full pt-20 px-12" />
    );
  }

  return (
    <div className="background-content relative flex flex-col max-h-full pt-20 px-12">
      <div className="w-full flex justify-between">
        <div className="flex items-center mb-8 ml-4">
          <div className="flex items-center mr-4" onClick={goBack}>
            <ArrowBack />
            <p className="text-white text-sm">Back</p>
          </div>

          <div className="flex items-center">
            <div className="relative w-[1.5vmax] h-[1.5vmax]">
              <Image alt={coin.symbol} src={coin.image} layout="fill" />
            </div>

            <h6 className="mx-2">{coin.name}</h6>
            <p className="text-sm">{coin.symbol}</p>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col md:flex-row justify-between">
        <div className="md:w-[50%] w-[90%]">
          <Graphics coin={coin} />
        </div>

        <div className="md:w-[35%] w-[90%]">
          <Stats coin={coin} />
        </div>
      </div>

      <div className="w-full px-12 mt-20">
        <TransactionsTable coin={coin} />
      </div>
    </div>
  );
};

export default Page;
