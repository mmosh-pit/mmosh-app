import * as React from "react";

import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";

const Volume = () => {
  // const [data, setData] = React.useState([]);

  const data = [
    { name: "1", uv: 300, pv: 456 },
    { name: "5", uv: 100, pv: 321 },
    { name: "6", uv: 9, pv: 235 },
    { name: "7", uv: 53, pv: 267 },
    { name: "12", uv: 43, pv: 45 },
    { name: "19", uv: 222, pv: 366 },
    { name: "20", uv: 372, pv: 486 },
    { name: "21", uv: 182, pv: 512 },
    { name: "22", uv: 164, pv: 302 },
    { name: "23", uv: 316, pv: 425 },
    { name: "24", uv: 131, pv: 467 },
    { name: "32", uv: 154, pv: 33 },
    { name: "33", uv: 205, pv: 354 },
    { name: "34", uv: 70, pv: 258 },
  ];

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" />
          <Bar dataKey="pv" fill="#7000FF" radius={[20, 20, 10, 10]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Volume;
