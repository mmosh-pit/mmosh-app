import axios from "axios";
import * as React from "react";
import Image from "next/image";

import { DirectoryCoin } from "@/app/models/directoryCoin";
import { Line, LineChart, ResponsiveContainer } from "recharts";

type Props = {
  candidate: string;
  color: string;
};

const Coins = ({ candidate, color }: Props) => {
  const [candidateCoins, setCandidateCoins] = React.useState<DirectoryCoin[]>(
    [],
  );

  const [usdcMmoshPrice, setUsdcMmoshPrice] = React.useState(0);

  const getUsdcMmoshPrice = React.useCallback(async () => {
    const mmoshUsdcPrice = await axios.get(
      `https://price.jup.ag/v6/price?ids=MMOSH&vsToken=USDC`,
    );

    setUsdcMmoshPrice(mmoshUsdcPrice.data?.data?.MMOSH?.price || 0);
  }, []);

  React.useEffect(() => {
    getUsdcMmoshPrice();
  }, [candidateCoins]);

  const fetchCoins = async () => {
    const response = await axios.get(
      `/api/get-candidate-coins?candidate=${candidate}`,
    );

    setCandidateCoins(response.data);
  };

  React.useEffect(() => {
    fetchCoins();
  }, [candidate]);

  const getChartColor = React.useCallback((prices: string[]) => {
    if (Number(prices[prices.length - 1]) < Number(prices[prices.length - 2])) {
      return "#DC2626";
    }

    return "#22C55E";
  }, []);

  return (
    <div className="w-full px-4 py-2 grid grid-cols-auto md:grid-cols-3 xl:grid-cols-4 gap-8 mt-4">
      {candidateCoins.map((coin) => (
        <div
          className={`flex bg-[#030007] bg-opacity-40 px-2 py-2 rounded-2xl border-[1px] border-[${color}]`}
          key={coin.symbol}
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
  );
};

export default Coins;
