import { Coin } from "@/app/models/coin";
import axios from "axios";
import * as React from "react";
import DateTypeSelector from "../common/DateTypeSelector";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false, // Ensure ApexCharts is not imported during SSR
});

type Props = {
  bonding?: string;
  height?: number;
  base?: Coin;
};

const Price = ({ height, base }: Props) => {
  const [price, setPrice] = React.useState(0);
  const [data, setData] = React.useState<any>([
    {
      data: [],
    },
  ]);

  const [type, setType] = React.useState("day");

  const [options, setOptions] = React.useState<any>({
    chart: {
      type: "candlestick",
      height: height || 300,
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
    tooltip: {
      enabled: false,
    },
  });

  const getPricesFromAPI = async () => {
    try {
      let priceResult = await axios.get(
        `/api/token/price?key=${base?.bonding}&type=${type}`,
      );
      console.log("priceResult.data ", priceResult.data);
      if (priceResult.data?.prices) {
        const newData = [];
        for (let index = 0; index < priceResult.data.prices.length; index++) {
          const element = priceResult.data.prices[index];
          newData.push({
            x: new Date(element.x),
            y: element.y,
          });
        }

        setPrice(priceResult.data.price);
        setData([
          {
            data: newData,
          },
        ]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    getPricesFromAPI();
  }, [type]);

  return (
    <div className="w-full flex flex-col bg-[#04024185] rounded-xl">
      <div className="w-full flex justify-between px-4 pt-4">
        <div className="flex flex-col">
          <h6>
            {base?.symbol.toUpperCase()} {price}
          </h6>
        </div>
        <DateTypeSelector type={type} setType={setType} />
      </div>
      <Chart
        options={options}
        series={data}
        type="candlestick"
        height={height || 300}
      />
    </div>
  );
};

export default Price;
