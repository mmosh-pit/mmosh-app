import * as React from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import Image from "next/image";
import axios from "axios";
import { useAtom } from "jotai";

import { DirectoryCoin } from "@/app/models/directoryCoin";
import { selectedSearchFilter, typedSearchValue } from "@/app/store/home";
import { getPriceForPTV } from "@/app/lib/forge/jupiter";
import { pair } from "@/app/store/coins";

const CoinsList = () => {
  const [selectedFilters] = useAtom(selectedSearchFilter);
  const [searchText] = useAtom(typedSearchValue);

  const [isLoading, setIsLoading] = React.useState(false);
  const fetching = React.useRef(false);
  const containerRef = React.useRef<any>(null);
  const [currentPage, setCurrentPage] = React.useState(0);
  const lastPageTriggered = React.useRef(false);
  const [coins, setCoins] = React.useState<DirectoryCoin[]>([]);
  const [usdcMmoshPrice, setUsdcMmoshPrice] = React.useState(0);

  const [tradingPair] = useAtom(pair);

  const getBaseTokenPrices = async () => {

    let prices = {
      mmosh: 0,
      ptvb: 0,
      ptvr: 0
    }

    let mmoshResponse = await axios.get(
      "https://api.jup.ag/price/v2?ids=FwfrwnNVLGyS8ucVjWvyoRdFDpTY8w6ACMAxJ4rqGUSS,CUQ7Tj9nWHFV39QvyeFCecSRXLGYQNEPTbhu287TdPMX,H8hgJsUKwChQ96fRgAtoP3X7dZqCo7XRnUT8CJvLyrgd"
    );
    prices.mmosh = mmoshResponse.data.data["FwfrwnNVLGyS8ucVjWvyoRdFDpTY8w6ACMAxJ4rqGUSS"].price || 0;
    prices.ptvb = mmoshResponse.data.data["CUQ7Tj9nWHFV39QvyeFCecSRXLGYQNEPTbhu287TdPMX"].price || 0;
    prices.ptvr = mmoshResponse.data.data["H8hgJsUKwChQ96fRgAtoP3X7dZqCo7XRnUT8CJvLyrgd"].price || 0;

  return prices
}

  const getCoins = React.useCallback(async () => {
    if (selectedFilters.includes("coins") || selectedFilters.includes("all")) {
      setIsLoading(true);
      fetching.current = true;
      const url = `/api/list-coins?page=${currentPage}&volume=hour&keyword=${searchText}&symbol=${tradingPair}`;

      const prices = await getBaseTokenPrices()
      const result = await axios.get(url);

      fetching.current = false;

      let nf = new Intl.NumberFormat('en-US')
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
        let marketcap = 0
        if(element.basesymbol === "PTVB") {
          marketcap = element.supply * (prices.ptvb * element.lastprice)
        } else if(element.basesymbol === "PTVR") {
          marketcap = element.supply * (prices.ptvr * element.lastprice)
        } else {
          marketcap = element.supply * (prices.mmosh * element.lastprice)
        }
        element.marketcap = nf.format(marketcap) +" USDC" 

        newCoins.push(element);
      }

      setCoins(newCoins);
      setIsLoading(false);
    } else {
      setCoins([]);
    }
  }, [searchText, currentPage, selectedFilters]);

  const getUsdcMmoshPrice = React.useCallback(async () => {
    if (tradingPair === "PTVB") {
      const mmoshUsdcPrice = await getPriceForPTV(
        process.env.NEXT_PUBLIC_PTVB_TOKEN,
      );
      setUsdcMmoshPrice(mmoshUsdcPrice);
    } else if (tradingPair === "PTVR") {
      const mmoshUsdcPrice = await getPriceForPTV(
        process.env.NEXT_PUBLIC_PTVR_TOKEN,
      );
      setUsdcMmoshPrice(mmoshUsdcPrice);
    } else {
      const mmoshUsdcPrice = await axios.get(
        `https://price.jup.ag/v6/price?ids=MMOSH`,
      );
      setUsdcMmoshPrice(mmoshUsdcPrice.data?.data?.MMOSH?.price || 0.003);
    }
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

  if (isLoading) return <></>;

  if (coins?.length === 0) return <></>;



  return (
    <div className="flex w-full flex-col" id="coins">
      <div
        className="w-full px-4 py-2 grid grid-cols-auto xs:grid-cols-1 lg:grid-cols-3 md:grid-cols-2 xl:grid-cols-4 gap-8 mt-4"
        ref={containerRef}
        onScroll={handleScroll}
      >
        {coins.map((coin) => (
          <div
            className="flex bg-[#030007] bg-opacity-40 px-2 py-2 rounded-2xl"
            id="border-gradient-container"
            key={coin.symbol.toUpperCase()}
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
                <p className="text-sm">{coin.symbol.toUpperCase()}</p>
              </div>
            </div>

            <div className="flex flex-col h-full">
              <p className="text-sm font-white self-start">Market Cap</p>

              <div className="self-center">
                <p className="text-sm text-white font-bold">
                  {coin.marketcap}{" "}
                  <span className="text-sm font-normal">USDC</span>
                </p>
              </div>
            </div>

            <div className="bg-[#434069] w-[2px] h-[90%] mx-2 self-center" />

            <div className="flex flex-col">
              <p className="text-xs self-end">24h</p>

              <div className="w-[5vmax]">
                <ResponsiveContainer width="100%" height={50}>
                  <LineChart
                    width={150}
                    height={50}
                    data={coin.priceLastSevenDays.map((val) => ({
                      value: val,
                    }))}
                  >
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={getChartColor(coin.priceLastSevenDays)}
                      dot={false}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex self-end">
                <p className="text-sm text-[#39F10A]">0.0%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoinsList;
