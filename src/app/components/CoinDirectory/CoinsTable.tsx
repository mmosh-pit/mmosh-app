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

      console.log("Result: ", apiResult);

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

  const getCoinPriceStatus = React.useCallback((start: number, end: number) => {
    const isIncremental = start <= end;

    const iconToRender = isIncremental ? <ArrowUp /> : <ArrowDown />;

    const percentage = `${((end - start) / start) * 100}%`;

    return (
      <div className="flex items-center justify-evenly">
        {percentage}
        {iconToRender}
      </div>
    );
  }, []);

  const navigateToCoinPage = React.useCallback((symbol: string) => {
    navigate.push(`/create/coins/${symbol}`);
  }, []);

  React.useEffect(() => {
    getCoins(volume.value, searchText, 0);
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
            className={`${index % 2 === 0 ? "bg-[#100E5242] hover:bg-[#100E5230]" : "bg-[#07076E70] hover:bg-[#07076E60]"} cursor-pointer`}
            key={coin.symbol}
            onClick={() => navigateToCoinPage(coin.symbol)}
          >
            <td align="center">
              <p className="text-white text-sm">{index}</p>
            </td>

            <td align="center">
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
            </td>

            <td align="center">{coin.price} MMOSH</td>

            <td align="center">
              {getCoinPriceStatus(coin.oneHourPriceStart, coin.oneHourPriceEnd)}
            </td>

            <td align="center">
              {getCoinPriceStatus(coin.oneDayPriceStart, coin.oneDayPriceEnd)}
            </td>

            <td align="center">{coin.price * coin.volume} MMOSH</td>

            <td align="center">{coin.volume} MMOSH</td>

            <td align="center">
              <ResponsiveContainer width={150} height={50}>
                <LineChart
                  width={150}
                  height={50}
                  data={coin.priceLastSevenDays}
                >
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
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
