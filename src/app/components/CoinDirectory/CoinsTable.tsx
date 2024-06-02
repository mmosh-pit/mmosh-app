import { useAtom } from "jotai";
import * as React from "react";
import Image from "next/image";

import { coinTextSearch, selectedUSDCCoin } from "@/app/store/coins";
import SortIcon from "@/assets/icons/SortIcon";
import { DirectoryCoin } from "@/app/models/directoryCoin";
import ArrowUp from "@/assets/icons/ArrowUp";
import ArrowDown from "@/assets/icons/ArrowDown";
import { Line, LineChart, ResponsiveContainer } from "recharts";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const CoinsTable = () => {
  const [searchText] = useAtom(coinTextSearch);
  const [isUSDCSelected] = useAtom(selectedUSDCCoin);

  const [selectedSort, setSelectedSort] = React.useState("");

  const [coins, setCoins] = React.useState<DirectoryCoin[]>([]);

  const getCoinPriceStatus = React.useCallback((start: number, end: number) => {
    const isIncremental = start <= end;

    const iconToRender = isIncremental ? <ArrowUp /> : <ArrowDown />;

    const percentage = `${((end - start) / start) * 100}%`;

    return (
      <div className="flex items-center">
        {percentage}
        {iconToRender}
      </div>
    );
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>
            <p className="text-white text-sm">Rank</p>
          </th>
          <th>
            <div className="flex">
              <SortIcon />
              <p className="text-white text-sm">Coin</p>
            </div>
          </th>
          <th>
            <p className="text-white text-sm">Price</p>
          </th>
          <th>
            <p className="text-white text-sm">1H%</p>
          </th>
          <th>
            <p className="text-white text-sm">24H%</p>
          </th>

          <th>
            <p className="text-white text-sm">FDV%</p>
          </th>

          <th>
            <p className="text-white text-sm">Volume%</p>
          </th>

          <th>
            <p className="text-white text-sm">Last 7 days</p>
          </th>
        </tr>
      </thead>

      <tbody>
        {coins.map((coin, index) => (
          <tr className={`${index % 2 === 0 ? "#100E52" : "#07076E"}`}>
            <td>
              <p className="text-white text-sm">{index}</p>
            </td>

            <td>
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

            <td>{coin.price} MMOSH</td>

            <td>
              {getCoinPriceStatus(coin.oneHourPriceStart, coin.oneHourPriceEnd)}
            </td>

            <td>
              {getCoinPriceStatus(coin.oneDayPriceStart, coin.oneDayPriceEnd)}
            </td>

            <td>{coin.price * coin.volume} MMOSH</td>

            <td>{coin.volume} MMOSH</td>

            <td>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart width={300} height={50} data={data}>
                  <Line
                    type="monotone"
                    dataKey="pv"
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
