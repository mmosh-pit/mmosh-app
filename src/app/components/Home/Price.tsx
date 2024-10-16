import { abbreviateNumber } from "@/app/lib/abbreviateNumber";
import { selectedDirectory } from "@/app/store/home";
import axios from "axios";
import { useAtom } from "jotai";
import * as React from "react";

import { Area, AreaChart, ResponsiveContainer, XAxis } from "recharts";

type Props = {
  symbol: string;
  bonding?: string;
  height?: number;
};

const Price = ({ height, symbol }: Props) => {
  // const [data, setData] = React.useState([]);
  const [selectedCoinDirectory] = useAtom(selectedDirectory);
  const [price, setPrice] = React.useState(0)
  const [data, setData] = React.useState<{ uv: number; pv: number; amt: number; name: string }[]>([])

  const getPricesFromAPI = async () => {
    try {
      let priceResult = await axios.get(
        `/api/project/token-detail?symbol=${symbol}`,
      );
      console.log("priceResult.data ", priceResult.data);
      if (priceResult?.data?.prices) {
        const newData = [];
        for (let index = 0; index < priceResult.data.prices.length; index++) {
          const d = new Date();
          let filterDate;
          filterDate = new Date(d.setDate(d.getDate() - index));
          const element = priceResult.data.prices[index];
          newData.push({ uv: Math.abs(element), pv: Math.abs(element), amt: Math.abs(element), name:filterDate.toLocaleString("en-us", {
            month: "short",
            day: "numeric",
          })});
        }
        setData(newData.reverse());
        setPrice(priceResult.data.pricepercentage);
      }
    } catch (error) {
      resetGraph();
      console.error(error);
    }
  };

  const resetGraph = () => {
    const newData = [];
    for (let index = 0; index < 7; index++) {
      const d = new Date();
      let filterDate;
      filterDate = new Date(d.setDate(d.getDate() - index));
      newData.push({ amt:0, pv:0, uv:0, name: filterDate.toLocaleString("en-us", {
        month: "short",
        day: "numeric",
      })});
    }

    setData(newData.reverse());
    setPrice(0);
  };

  React.useEffect(() => {
    resetGraph();
    getPricesFromAPI();
  }, [selectedCoinDirectory]);

  React.useEffect(() => {
    console.log("price data", data);
    // getPricesFromAPI()
  }, [data]);

  return (
    <div className="w-full flex flex-col bg-[#04024185] rounded-xl">
      <div className="flex flex-col ml-6 mt-4">
        <p className="text-sm">{symbol} Price</p>
        <h6>USDC {price}</h6>
      </div>
      <ResponsiveContainer width="100%" height={height || 200}>
        <AreaChart
          width={500}
          height={height || 200}
          data={data}
          margin={{
            top: 10,
          }}
        >
          <defs>
            <linearGradient id="gradient-price" x1="0" y1="0" x2="0" y2="2">
              <stop offset="0%" stopColor="#C900B3" stopOpacity={0.8} />
              <stop offset="75%" stopColor="#C900B3" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <Area
            type="monotone"
            dataKey="pv"
            stroke="#C900B3"
            fill="url(#gradient-price)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Price;
