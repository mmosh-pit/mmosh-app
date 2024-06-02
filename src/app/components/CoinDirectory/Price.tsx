import * as React from "react";

import { Area, AreaChart, ResponsiveContainer, XAxis } from "recharts";

const Price = () => {
  // const [data, setData] = React.useState([]);

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

  const customizedGroupTick = (props: any) => {
    const { index, x, y, payload } = props;

    return (
      <g>
        <g>
          <text x={x} y={y}>
            2021
          </text>
          <text x={x} y={y}>
            2022
          </text>
          <text x={x} y={y}>
            2023
          </text>
          <text x={x} y={y}>
            2024
          </text>
        </g>
      </g>
    );
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          width={500}
          height={200}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="2">
              <stop offset="0%" stopColor="#C900B3" stopOpacity={0.8} />
              <stop offset="75%" stopColor="#C900B3" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            tickLine={false}
            scale="band"
            interval={0}
            axisLine={false}
            tick={customizedGroupTick}
          />
          <Area
            type="monotone"
            dataKey="pv"
            stroke="#007AFF"
            fill="url(#gradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Price;
