import { Coin } from "@/app/models/coin";
import axios from "axios";
import * as React from "react";

import { Area, AreaChart, ResponsiveContainer, XAxis } from "recharts";

type Props = {
  bonding?: string;
  height?: number;
  base?: Coin;
};

const Price = ({ height, base }: Props) => {
  // const [data, setData] = React.useState([]);
  const [price, setPrice] = React.useState(0)
  const [data, setData] = React.useState<{ value: number; name: string }[]>([])


  const getPricesFromAPI = async () => {
    try {
      let priceResult = await axios.get(`/api/project/token-detail?symbol=${base?.symbol.toUpperCase()}`);
      console.log("priceResult.data ", priceResult.data)
      if(priceResult.data.prices) {
        const newData = [];
        for (let index = 0; index < priceResult.data.prices.length; index++) {
          const d = new Date();
          let filterDate;
          filterDate = new Date(d.setDate(d.getDate() - index));
          const element = priceResult.data.labels[index];
          newData.push({ value: Math.abs(element.value), name:filterDate.toLocaleString("en-us", {
            month: "short",
            day: "numeric",
          })});
        }
        setData(newData.reverse())
        setPrice(priceResult.data.pricepercentage)
      }

    } catch (error) {
      resetGraph()
      console.error(error);
    }
  };

  const resetGraph = () => {
    const newData = [];
    for (let index = 0; index < 7; index++) {
      const d = new Date();
      let filterDate;
      filterDate = new Date(d.setDate(d.getDate() - index));
      newData.push({ value: 0, name: filterDate.toLocaleString("en-us", {
        month: "short",
        day: "numeric",
      })});
    }

    setData(newData.reverse())
    setPrice(0)
  }

  React.useEffect(()=>{
    resetGraph()
    getPricesFromAPI()
  },[])


  React.useEffect(()=>{
    console.log("price data", data)
  },[data])

  return (
    <div className="w-full flex flex-col bg-[#04024185] rounded-xl">
      <div className="flex flex-col ml-6 mt-4">
        <p className="text-sm">{base?.symbol.toUpperCase()} Price</p>
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
