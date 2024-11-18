import { BagsCoin, bagsCoins } from "@/app/store/bags";
import { useAtom } from "jotai";
import CoinItem from "./CoinItem";

type Props = {
  onSelectCoin: (coin: BagsCoin) => void;
};

const Coins = ({ onSelectCoin }: Props) => {
  const [bags] = useAtom(bagsCoins);

  if (!bags) return <></>;

  return (
    <div className="px-24 flex flex-col overflow-y-auto overflow-x-hidden">
      {bags.network && (
        <div className="flex flex-col my-4">
          <h6 className="ml-4">Network</h6>

          <CoinItem coin={bags!.network!} onSelect={onSelectCoin} />
        </div>
      )}

      {bags.stable && (
        <div className="flex flex-col my-4">
          <h6 className="ml-4">Stable</h6>

          <CoinItem coin={bags!.stable!} onSelect={onSelectCoin} />
        </div>
      )}

      {bags.native && (
        <div className="flex flex-col my-4">
          <h6 className="ml-4">Native</h6>

          <CoinItem coin={bags!.native!} onSelect={onSelectCoin} />
        </div>
      )}

      {bags.community.length > 0 && (
        <div className="flex flex-col my-4">
          <h6 className="ml-4">Community</h6>

          {bags.community.map((coin) => (
            <CoinItem coin={coin} onSelect={onSelectCoin} />
          ))}
        </div>
      )}

      {bags.memecoins.length > 0 && (
        <div className="flex flex-col my-4">
          <h6 className="ml-4">Memecoins</h6>

          {bags.memecoins.map((coin) => (
            <CoinItem coin={coin} onSelect={onSelectCoin} />
          ))}
        </div>
      )}

      {bags.exosystem.length > 0 && (
        <div className="flex flex-col my-4">
          <h6 className="ml-4">Exosystem Coins</h6>

          {bags.exosystem.map((coin) => (
            <CoinItem coin={coin} onSelect={onSelectCoin} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Coins;
