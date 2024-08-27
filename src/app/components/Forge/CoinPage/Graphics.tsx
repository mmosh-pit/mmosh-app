import * as React from "react";
import { useAtom } from "jotai";

import DateTypeSelector from "../../common/DateTypeSelector";
import { Coin } from "@/app/models/coin";
import { coinStats, selectedDateType } from "@/app/store/coins";
import TVL from "../../CoinDirectory/TVL";
import Volume from "../../CoinDirectory/Volume";
import Price from "../../CoinDirectory/Price";

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
  const [stats] = useAtom(coinStats);

  const [type, setType] = useAtom(selectedDateType);

  const [selectedGraphicType, setSelectedGraphicType] = React.useState({
    label: "TVL",
    value: "tvl",
  });

  const renderGraphicType = React.useCallback(() => {
    if (selectedGraphicType.value === "tvl")
      return <TVL bonding={coin.bonding} height={400} />;

    if (selectedGraphicType.value === "volume")
      return <Volume bonding={coin.bonding} height={400} />;

    return <Price height={400} />;
  }, [coin, selectedGraphicType]);

  return (
    <div className="w-full flex flex-col bg-[#040241] rounded-xl py-1 px-6 md:mr-4">
      <div className="w-full flex justify-end mt-4 px-12">
        <div className="flex items-center self-end">
          <div className="dropdown rounded-lg py-1 ml-4 mr-6">
            <div tabIndex={0} role="button" className="btn m-1">
              <p className="text-base">{selectedGraphicType.label}</p>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              {typeOptions.map((value) => (
                <li onClick={() => setSelectedGraphicType(value)}>
                  <p className="text-base">{value.label}</p>
                </li>
              ))}
            </ul>
          </div>

          <DateTypeSelector type={type} setType={setType} />
        </div>
      </div>
      {renderGraphicType()}
    </div>
  );
};

export default Graphics;
