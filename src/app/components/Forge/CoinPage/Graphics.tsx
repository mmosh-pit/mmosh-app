import axios from "axios";
import * as React from "react";
import { useAtom } from "jotai";
import { Area, AreaChart, ResponsiveContainer, XAxis } from "recharts";

import DateTypeSelector from "../../common/DateTypeSelector";
import { Coin } from "@/app/models/coin";
import { abbreviateNumber } from "@/app/lib/abbreviateNumber";
import { coinStats } from "@/app/store/coins";

const typeOptions = [
  {
    label: "Price",
    value: "price",
  },
  {
    label: "Volume",
    value: "volume",
  },
  {
    label: "TVL",
    value: "tvl",
  },
];

type Props = {
  coin: Coin;
};

const Graphics = ({ coin }: Props) => {
  const [stats, setStats] = useAtom(coinStats);

  const [type, setType] = React.useState("day");

  const [selectedGraphicType, setSelectedGraphicType] = React.useState({
    label: "Price",
    value: "price",
  });

  const [graphicData, setGraphicData] = React.useState<
    { value: number; name: string }[]
  >([]);

  const getGraphicData = React.useCallback(async () => {
    const result = await axios.get(`/api/tvl?bonding=${coin.bonding}`);
    const data = [];
    for (let index = 0; index < result.data.labels.length; index++) {
      const element = result.data.labels[index];
      data.push({ value: Math.abs(element.value), name: element.label });
    }
    const total = abbreviateNumber(Math.abs(result.data.total));
    setStats((prev) => ({ ...prev, total }));
    setGraphicData(data.reverse());
  }, []);

  React.useEffect(() => {
    getGraphicData();
  }, [selectedGraphicType]);

  return (
    <div className="w-full flex flex-col bg-[#04024185] rounded-xl py-8">
      <div className="w-full flex justify-between mt-4 px-12">
        <h6 className="self-end">
          ${stats.total}
          <p className="text-white">MMOSH</p>
        </h6>

        <div className="flex items-center self-start">
          <DateTypeSelector type={type} setType={setType} />

          <div className="dropdown rounded-lg py-1 ml-4">
            <div tabIndex={0} role="button" className="btn m-1">
              {selectedGraphicType.label}
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              {typeOptions.map((value) => (
                <li onClick={() => setSelectedGraphicType(value)}>
                  <p>{value.label}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          width={450}
          height={300}
          data={graphicData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="2">
              <stop offset="0%" stopColor="#007AFF" stopOpacity={0.8} />
              <stop offset="75%" stopColor="#09093C" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#007AFF"
            fill="url(#gradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graphics;
