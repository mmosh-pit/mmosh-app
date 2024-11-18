import * as React from "react";
import Image from "next/image";

import { BagsCoin } from "@/app/store/bags";
import { abbreviateNumber } from "@/app/lib/abbreviateNumber";

type Props = {
  coin: BagsCoin;
  onSelect: (coin: BagsCoin) => void;
};

const CoinItem = ({ coin, onSelect }: Props) => {
  const getCoinBalance = React.useCallback(() => {
    const decimals = "1".padEnd(coin.decimals + 1, "0");

    return abbreviateNumber(coin.balance / Number(decimals));
  }, [coin]);

  return (
    <div
      className="flex justify-between bg-[#2E3C4E80] rounded-md my-2 cursor-pointer py-4 px-6"
      onClick={() => onSelect(coin)}
    >
      <div className="flex">
        <div className="w-[3vmax] h-[3vmax] relative">
          <Image
            src={coin.image}
            alt="coin"
            layout="fill"
            className="rounded-full"
          />
        </div>

        <div className="flex flex-col justify-center ml-4">
          <p className="underline text-white text-sm">{coin.name}</p>
          <p className="text-sm">{getCoinBalance()}</p>
        </div>
      </div>

      <div className="flex flex-col justify-center self-center">
        <p className="font-bold text-white text-sm">
          ${abbreviateNumber(coin.usdcPrice)}
        </p>
      </div>
    </div>
  );
};

export default CoinItem;
