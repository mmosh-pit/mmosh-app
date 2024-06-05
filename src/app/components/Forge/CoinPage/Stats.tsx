import * as React from "react";
import { useAtom } from "jotai";
import axios from "axios";

import { coinStats } from "@/app/store/coins";
import { Coin } from "@/app/models/coin";
import { User } from "@/app/models/user";

type Props = {
  coin: Coin;
};

const Stats = ({ coin }: Props) => {
  const [stats] = useAtom(coinStats);

  const [coinOwner, setCoinOwner] = React.useState<User | null>(null);

  const fetchCoinOwner = React.useCallback(async () => {
    const result = await axios.get(
      `/api/get-user-data?username=${coin.username}`,
    );

    setCoinOwner(result.data);
  }, [coin]);

  React.useEffect(() => {
    fetchCoinOwner();
  }, [coin]);

  return (
    <div className="w-full flex flex-col bg-[#04024185] backdrop-blur-[10px] rounded-xl p-12">
      <h5>Stats</h5>

      <div className="flex flex-col my-4">
        <div className="w-full flex justify-between">
          <div className="flex flex-col">
            <p>TVL</p>
            <p className="text-white">
              {stats.total} <span className="ml-1 text-xs">MMOSH</span>
            </p>
          </div>

          <div className="flex flex-col">
            <p>1 Day Volume</p>
            <p className="text-white">
              {stats.dayVolume} <span className="ml-1 text-xs">MMOSH</span>
            </p>
          </div>
        </div>

        <div className="h-[1px] w-full bg-[#100E5242] rounded-full" />

        <div className="flex flex-col mt-8">
          <h5>Info</h5>
          <p className="my-2">{coin.desc}</p>
          {coinOwner && (
            <div className="bg-[#7420E8] rounded-2xl p-4">
              <p className="text-white text-sm">{coinOwner.profile.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;
