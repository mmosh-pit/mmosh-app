import * as React from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import Image from "next/image";
import axios from "axios";
import { useAtom } from "jotai";

import { DirectoryCoin } from "@/app/models/directoryCoin";
import { selectedSearchFilter, typedSearchValue } from "@/app/store/home";
import { useRouter } from "next/navigation";

const CoinsList = () => {
  const navigate = useRouter();

  const [selectedFilters] = useAtom(selectedSearchFilter);
  const [searchText] = useAtom(typedSearchValue);

  const [isLoading, setIsLoading] = React.useState(false);
  const fetching = React.useRef(false);
  const containerRef = React.useRef<any>(null);
  const [currentPage, setCurrentPage] = React.useState(0);
  const lastPageTriggered = React.useRef(false);
  const [coins, setCoins] = React.useState<DirectoryCoin[]>([]);
  const [usdcMmoshPrice, setUsdcMmoshPrice] = React.useState(0);

  const getCoins = React.useCallback(async () => {
    if (selectedFilters.includes("coins") || selectedFilters.includes("all")) {
      setIsLoading(true);
      fetching.current = true;
      const url = `/api/list-coins?page=${currentPage}&volume=hour&keyword=${searchText}`;

      const result = await axios.get(url);

      fetching.current = false;

      const newCoins = [];
      for (let index = 0; index < result.data.length; index++) {
        const element = result.data[index];
        const datas = [];

        for (
          let index = 0;
          index < element.priceLastSevenDays.length;
          index++
        ) {
          const elementchart = element.priceLastSevenDays[index];
          datas.push(elementchart.value);
        }
        element.priceLastSevenDays = datas;

        newCoins.push(element);
      }

      setCoins(newCoins);
      setIsLoading(false);
    } else {
      setCoins([]);
    }
  }, [searchText, currentPage, selectedFilters]);

  const getUsdcMmoshPrice = React.useCallback(async () => {
    const mmoshUsdcPrice = await axios.get(
      `${process.env.NEXT_PUBLIC_JUPITER_PRICE_API}?ids=${process.env.NEXT_PUBLIC_OPOS_TOKEN},${process.env.NEXT_PUBLIC_USDC_TOKEN}`,
    );

    setUsdcMmoshPrice(mmoshUsdcPrice.data?.data?.MMOSH?.price || 0);
  }, []);

  const getChartColor = React.useCallback((prices: string[]) => {
    if (Number(prices[prices.length - 1]) < Number(prices[prices.length - 2])) {
      return "#DC2626";
    }

    return "#22C55E";
  }, []);

  const handleScroll = () => {
    if (!containerRef.current) return;
    if (
      containerRef.current.scrollHeight - containerRef.current.scrollTop <=
      containerRef.current.clientHeight + 50
    ) {
      setCurrentPage(currentPage + 1);
    }
  };

  React.useEffect(() => {
    getUsdcMmoshPrice();
  }, [coins]);

  React.useEffect(() => {
    getCoins();
  }, [searchText]);

  React.useEffect(() => {
    if (currentPage > 0 && !lastPageTriggered.current && !fetching.current) {
      getCoins();
    }
  }, [currentPage]);

  const navigateToCoinPage = React.useCallback((symbol: string) => {
    navigate.push(`/coins/${symbol}`);
  }, []);

  if (isLoading) return <></>;

  if (coins?.length === 0) return <></>;

  return (
    <div className="flex w-full flex-col" id="coins">
      <div className="w-full flex justify-between px-4">
        <p className="text-white text-base">
          Coins <span className="text-gray-500"></span>
        </p>

        <a
          className="underline text-white cursor-pointer text-base"
          href={`${process.env.NEXT_PUBLIC_APP_MAIN_URL}/create/coins`}
        >
          Go to Coin Directory
        </a>
      </div>
      <div
        className="w-full px-4 py-2 grid grid-cols-auto xs:grid-cols-1 xl:grid-cols-2 gap-8 mt-4"
        ref={containerRef}
        onScroll={handleScroll}
      >
        {coins.map((coin) => (
          <div
            className="flex bg-[#030007] bg-opacity-40 px-2 py-2 rounded-2xl cursor-pointer"
            id="border-gradient-container"
            key={coin.symbol}
            onClick={() => navigateToCoinPage(coin.symbol)}
          >
            <div className="self-center max-w-[30%] mr-8">
              <div className="relative w-[3vmax] h-[3vmax]">
                <Image
                  src={coin.image}
                  alt="Profile Image"
                  className="rounded-full"
                  layout="fill"
                />
              </div>
            </div>

            <div className="flex grow flex-col justify-start">
              <div>
                <p className="text-white text-sm">{coin.name}</p>
                <p className="text-sm">{coin.symbol}</p>
              </div>
            </div>

            <div className="flex flex-col h-full">
              <p className="text-sm font-white self-start">FDV</p>

              <div className="self-center">
                <p className="text-sm text-white font-bold">
                  {coin.price * coin.volume * usdcMmoshPrice}{" "}
                  <span className="text-sm font-normal">USDC</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoinsList;
