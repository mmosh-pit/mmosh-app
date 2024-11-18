import currencyFormatter from "@/app/lib/currencyFormatter";
import { walletAddressShortener } from "@/app/lib/walletAddressShortener";
import CopyIcon from "@/assets/icons/CopyIcon";
import useWallet from "@/utils/wallet";
import * as React from "react";
import NFTs from "./NFTs";
import Coins from "./Coins";
import SearchBar from "../Project/Candidates/SearchBar";
import { BagsCoin, BagsNFT } from "@/app/store/bags";

type Props = {
  onSelectAsset: (asset: BagsNFT) => void;
  onSelectCoin: (asset: BagsCoin) => void;
  totalBalance: number;
};

const Bags = ({ onSelectCoin, onSelectAsset, totalBalance }: Props) => {
  const [search, setSearch] = React.useState("");
  const [selectedTab, setSelectedTab] = React.useState(0);
  const wallet = useWallet();

  const [isTooltipShown, setIsTooltipShown] = React.useState(false);

  const copyToClipboard = React.useCallback(async (text: string) => {
    setIsTooltipShown(true);
    await navigator.clipboard.writeText(text);

    setTimeout(() => {
      setIsTooltipShown(false);
    }, 2000);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-start mt-8">
      <div className="flex items-center justify-center my-8">
        <h6>My Bags</h6>
      </div>

      <div className="flex items-center justify-center my-8">
        <SearchBar setSearchText={setSearch} />
      </div>

      <div className="bags-background-card lg:w-[40%] md:w-[60%] w-[85%]">
        <div className="bags-background-card-balance-card" id="balance-card">
          <h6>{currencyFormatter(totalBalance)}</h6>
          <div className="flex">
            <p className="text-base text-white">
              {walletAddressShortener(wallet?.publicKey?.toString() ?? "")}
            </p>
            <button
              className="cursor-pointer ml-2"
              onClick={() =>
                copyToClipboard(wallet?.publicKey.toString() ?? "")
              }
            >
              {isTooltipShown && (
                <div className="absolute z-10 mb-20 inline-block rounded-lg bg-gray-900 px-3 py-4ont-medium text-white shadow-sm dark:bg-gray-700">
                  Copied!
                </div>
              )}
              <CopyIcon />
            </button>
          </div>
        </div>

        <div className="bags-background-card-tabs" id="tabs">
          <button className="cursor-pointer" onClick={() => setSelectedTab(0)}>
            <p
              className={`text-base text-white ${selectedTab === 0 && "font-bold"}`}
            >
              Coins
            </p>
          </button>

          <button className="cursor-pointer" onClick={() => setSelectedTab(1)}>
            <p
              className={`text-base text-white ${selectedTab === 1 && "font-bold"}`}
            >
              Codes
            </p>
          </button>
        </div>

        {selectedTab === 0 ? (
          <Coins onSelectCoin={onSelectCoin} />
        ) : (
          <NFTs onSelect={onSelectAsset} />
        )}
      </div>
    </div>
  );
};

export default Bags;
