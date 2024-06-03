import { abbreviateNumber } from "@/app/lib/abbreviateNumber";
import axios from "axios";
import * as React from "react";

import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";

const Volume = () => {
  const [data, setData] = React.useState([]);
  const [total, setTotal] = React.useState("0");

  const [type, setType] = React.useState("");

  const getVolume = async () => {
    try {
      const tvlResult = await axios.get(`/api/volume?type=${type}`);

      setData(tvlResult.data.labels?.reverse() || []);

      setTotal(abbreviateNumber(Math.abs(tvlResult.data.total)));
    } catch (error) {
      setTotal("0");
    }
  };

  React.useEffect(() => {
    getVolume();
  }, [type]);

  return (
    <div className="w-full flex flex-col bg-[#04024185] rounded-xl py-4">
      <div className="w-full flex justify-between">
        <div className="flex flex-col ml-6 mt-4">
          <p className="text-sm">Volume</p>
          <h6 className="my-2">${total}M</h6>
          <p className="text-tiny">Past Month</p>
        </div>

        <div className="flex">
          <div
            className={`${type === "day" ? "bg-[#8511F98F]" : "bg-transparent border-[1px] border-[#FFFFFF22]"} flex justify-center items-center w-[1vmax] h-[1vmax] mx-1`}
            onClick={() => setType("day")}
          >
            D
          </div>

          <div
            className={`${type === "week" ? "bg-[#8511F98F]" : "bg-transparent border-[1px] border-[#FFFFFF22]"} flex justify-center items-center w-[1vmax] h-[1vmax] mx-1`}
            onClick={() => setType("week")}
          >
            W
          </div>

          <div
            className={`${type === "month" ? "bg-[#8511F98F]" : "bg-transparent border-[1px] border-[#FFFFFF22]"} flex justify-center items-center w-[1vmax] h-[1vmax] mx-1`}
            onClick={() => setType("month")}
          >
            M
          </div>

          <div
            className={`${type === "year" ? "bg-[#8511F98F]" : "bg-transparent border-[1px] border-[#FFFFFF22]"} flex justify-center items-center w-[1vmax] h-[1vmax] mx-1`}
            onClick={() => setType("year")}
          >
            Y
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
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
          <Bar dataKey="value" fill="#7000FF" radius={[20, 20, 10, 10]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Volume;
