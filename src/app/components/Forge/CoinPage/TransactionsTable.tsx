import * as React from "react";
import { useAtom } from "jotai";
import axios from "axios";
import Image from "next/image";

import { Coin } from "@/app/models/coin";
import { coinStats } from "@/app/store/coins";
import { abbreviateNumber } from "@/app/lib/abbreviateNumber";
import SortIcon from "@/assets/icons/SortIcon";
import { walletAddressShortener } from "@/app/lib/walletAddressShortener";
import { calculateTimeForTransactionTable } from "@/app/lib/dateUtils";
import currencyFormatter from "@/app/lib/currencyFormatter";

type Props = {
  coin: Coin;
};

const TransactionsTable = ({ coin }: Props) => {
  const [_, setStats] = useAtom(coinStats);

  const [isLastPage, setIsLastPage] = React.useState(false);
  const [history, setHistory] = React.useState<any>([]);

  const fetchDirectory = async (page: any) => {
    try {
      const url = `/api/list-coin-transactions?page=${page}&bonding=${coin.bonding}`;

      const apiResult = await axios.get(url);

      if (apiResult.data.history.length > 0) {
        const newHistory = [];
        for (let index = 0; index < apiResult.data.history.length; index++) {
          const element = apiResult.data.history[index];
          newHistory.push(element);
        }
        setHistory(newHistory);
      }

      const dayVolume = abbreviateNumber(apiResult.data.day);
      const monthVolume = abbreviateNumber(apiResult.data.month);
      const yearVolume = abbreviateNumber(apiResult.data.year);

      setStats((prev) => ({ ...prev, dayVolume, monthVolume, yearVolume }));

      if (apiResult.data.history.length < 10) {
        setIsLastPage(true);
      }
    } catch (error) {
      setHistory([]);
    }
  };

  React.useEffect(() => {
    fetchDirectory(0);
  }, []);

  return (
    <div className="w-full flex flex-col">
      <div className="my-4 ml-4">
        <h5>Transactions</h5>
      </div>

      <table className="w-full bg-[#100E5242] rounded-md">
        <thead>
          <tr>
            <th align="center">
              <div className="flex items-center justify-center">
                <SortIcon />
                <p className="text-white text-sm ml-2">Time</p>
              </div>
            </th>
            <th align="center">
              <p className="text-white text-sm">Type</p>
            </th>
            <th align="center">
              <p className="text-white text-sm">MMOSH</p>
            </th>

            <th align="center">
              <p className="text-white text-sm">For</p>
            </th>

            <th align="center">
              <p className="text-white text-sm">USD</p>
            </th>

            <th align="center">
              <p className="text-white text-sm">Wallet</p>
            </th>
          </tr>
        </thead>

        <tbody>
          {history.map((item: any, index: number) => (
            <tr
              className={`${index % 2 === 0 ? "bg-[#100E5242] hover:bg-[#100E5230]" : "bg-[#07076E70] hover:bg-[#07076E60]"} cursor`}
              key={coin.symbol}
            >
              <td align="center">
                <p className="text-white text-sm">
                  {calculateTimeForTransactionTable(
                    new Date(),
                    new Date(item.created_date),
                  )}
                </p>
              </td>

              <td align="center">
                <p
                  className={`text-white text-sm ${item.type === "sell" ? "text-red" : "text-green"}`}
                >
                  {item.type}
                </p>
              </td>

              <td align="center">
                <p className="text-white text-sm">
                  {currencyFormatter(item.value).replace("$", "")}
                </p>
              </td>

              <td align="center">
                <div className="w-full flex items-center justify-around">
                  <div className="flex">
                    <p className="text-white font-normal text-sm">
                      {item.price}
                    </p>
                    <div className="relative w-[1vmax] h-[1vmax] mx-2">
                      <Image src={item.targetimg} alt="mmosh" layout="fill" />
                    </div>
                    <p className="text-white font-normal text-sm">
                      {item.targetsymbol}
                    </p>
                  </div>
                </div>
              </td>

              <td align="center">
                <p className="text-white text-sm">
                  {currencyFormatter(item.usdcPrice || 0)}
                </p>
              </td>

              <td align="center">
                <p className="text-white text-sm">
                  {walletAddressShortener(item.wallet)}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
