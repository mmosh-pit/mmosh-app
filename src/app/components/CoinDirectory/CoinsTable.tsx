import { useAtom } from "jotai";
import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios, { CancelTokenSource } from "axios";
import { Line, LineChart, ResponsiveContainer } from "recharts";

import {
  coinTextSearch,
  selectedUSDCCoin,
  selectedVolume,
} from "@/app/store/coins";
import SortIcon from "@/assets/icons/SortIcon";
import { DirectoryCoin } from "@/app/models/directoryCoin";
import ArrowUp from "@/assets/icons/ArrowUp";
import ArrowDown from "@/assets/icons/ArrowDown";

const CoinsTable = () => {
  const navigate = useRouter();
  const source = React.useRef<CancelTokenSource | null>(null);

  const [searchText] = useAtom(coinTextSearch);
  const [isUSDCSelected] = useAtom(selectedUSDCCoin);
  const [volume] = useAtom(selectedVolume);

  const [selectedSort, setSelectedSort] = React.useState("");
  const [isLastPage, setIsLastPage] = React.useState(false);

  const [coins, setCoins] = React.useState<DirectoryCoin[]>([]);
  const [usdcMmoshPrice, setUsdcMmoshPrice] = React.useState(0);

  const getCoins = async (volume: string, keyword: string, page: number) => {
    try {
      if (source.current) {
        source.current.cancel();
        source.current = null;
      }
      source.current = axios.CancelToken.source();

      const url = `/api/list-coins?page=${page}&volume=${volume}&keyword=${keyword}`;

      const apiResult = await axios.get(url, {
        cancelToken: source.current.token,
      });

      const newCoins = [];
      for (let index = 0; index < apiResult.data.length; index++) {
        const element = apiResult.data[index];
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
      if (apiResult.data.length < 10) {
        setIsLastPage(true);
      }
    } catch (error) {
      setCoins([]);
    }
  };

  const getCoinPriceStatus = React.useCallback(
    (start: number, end: number) => {
      const isIncremental = start <= end;

      const iconToRender = isIncremental ? (
        <ArrowUp fill={isIncremental ? "#22C55E" : "#DC2626"} />
      ) : (
        <ArrowDown fill={isIncremental ? "#22C55E" : "#DC2626"} />
      );

      const substraction = end - start;

      const percentage =
        substraction === 0 || start === 0
          ? "0%"
          : `${(substraction / start) * 100}%`;

      return (
        <div className="flex items-center justify-evenly">
          <p
            className={`text-sm ${isIncremental ? "text-green-500" : "text-red-500"}`}
          >
            {percentage}
          </p>
          {iconToRender}
        </div>
      );
    },
    [usdcMmoshPrice, isUSDCSelected],
  );

  const getUsdcMmoshPrice = React.useCallback(async () => {
    const mmoshUsdcPrice = await axios.get(
      `https://price.jup.ag/v6/price?ids=MMOSH&vsToken=USDC`,
    );

    setUsdcMmoshPrice(mmoshUsdcPrice.data?.data?.MMOSH?.price || 0);
  }, []);

  const navigateToCoinPage = React.useCallback((symbol: string) => {
    navigate.push(`/create/coins/${symbol}`);
  }, []);

  const getCoinPrice = React.useCallback(
    (price: number) => {
      if (isUSDCSelected) {
        return `${price * usdcMmoshPrice} USDC`;
      }

      return `${price} MMOSH`;
    },
    [usdcMmoshPrice, isUSDCSelected],
  );

  const getCoinFDV = React.useCallback(
    (value: number) => {
      if (isUSDCSelected) {
        return `${value * usdcMmoshPrice} USDC`;
      }

      return `${value} MMOSH`;
    },
    [usdcMmoshPrice, isUSDCSelected],
  );

  const getCoinVolume = React.useCallback(
    (value: number) => {
      if (isUSDCSelected) {
        return `${value * usdcMmoshPrice} USDC`;
      }

      return `${value} MMOSH`;
    },
    [usdcMmoshPrice, isUSDCSelected],
  );

  const getChartColor = React.useCallback((prices: string[]) => {
    if (Number(prices[prices.length - 1]) < Number(prices[prices.length - 2])) {
      return "#DC2626";
    }

    return "#22C55E";
  }, []);

  React.useEffect(() => {
    getCoins(volume.value, searchText, 0);
    getUsdcMmoshPrice();
  }, [searchText, volume]);

  return (
    <table className="w-full bg-[#100E5242] rounded-md">
      <thead>
        <tr>
          <th>
            <p className="text-white text-sm">Rank</p>
          </th>
          <th align="center">
            <div className="flex items-center">
              <SortIcon />
              <p className="text-white text-sm ml-2">Coin</p>
            </div>
          </th>
          <th align="center">
            <p className="text-white text-sm">Price</p>
          </th>
          <th align="center">
            <p className="text-white text-sm">1H%</p>
          </th>
          <th align="center">
            <p className="text-white text-sm">24H%</p>
          </th>

          <th align="center">
            <p className="text-white text-sm">FDV%</p>
          </th>

          <th align="center">
            <p className="text-white text-sm">Volume%</p>
          </th>

          <th align="center">
            <p className="text-white text-sm">Last 7 days</p>
          </th>
        </tr>
      </thead>

      <tbody>
        {coins.map((coin, index) => (
          <tr
            className={`${index % 2 === 0 ? "bg-[#100E5242] hover:bg-[#100E5230]" : "bg-[#07076E70] hover:bg-[#07076E60]"}`}
            key={coin.symbol}
            onClick={() => navigateToCoinPage(coin.symbol)}
          >
            <td align="center">
              <p className="text-white text-sm">{index + 1}</p>
            </td>

            <td align="center">
              <a
                href={`${process.env.NEXT_PUBLIC_APP_MAIN_URL}/create/coins/${coin.symbol}`}
                className="cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="relative w-[1vmax] h-[1vmax] rounded-full">
                    <Image
                      src={coin.image}
                      layout="fill"
                      alt={`${coin.name} image`}
                    />
                  </div>
                  <p className="text-white text-sm ml-1">{coin.name}</p>
                  <p className="text-white text-sm ml-2">
                    {coin.symbol.toUpperCase()}
                  </p>
                </div>
              </a>
            </td>

            <td align="center">{getCoinPrice(coin.price)}</td>

            <td align="center">
              {getCoinPriceStatus(coin.oneHourPriceStart, coin.oneHourPriceEnd)}
            </td>

            <td align="center">
              {getCoinPriceStatus(coin.oneDayPriceStart, coin.oneDayPriceEnd)}
            </td>

            <td align="center">{getCoinFDV(coin.price * coin.volume)}</td>

            <td align="center">{getCoinVolume(coin.volume)}</td>

            <td align="center">
              <ResponsiveContainer width={150} height={50}>
                <LineChart
                  width={150}
                  height={50}
                  data={coin.priceLastSevenDays.map((val) => ({ value: val }))}
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CoinsTable;
