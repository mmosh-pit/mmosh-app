import currencyFormatter from "@/app/lib/currencyFormatter";
import { walletAddressShortener } from "@/app/lib/walletAddressShortener";
import CopyIcon from "@/assets/icons/CopyIcon";
import useWallet from "@/utils/wallet";
import * as React from "react";
import NFTs from "./NFTs";
import Coins from "./Coins";
import SearchBar from "../Project/Candidates/SearchBar";
import { BagsCoin, BagsNFT } from "@/app/store/bags";
import SwapIcon from "@/assets/icons/SwapIcon";
import { useRouter } from "next/navigation";
import BuyIcon from "@/assets/icons/BuyIcon";
import ReceiveIcon from "@/assets/icons/ReceiveIcon";
import RewardsIcon from "@/assets/icons/RewardsIcon";
import SendWalletIcon from "@/assets/icons/SendWalletIcon";

type Props = {
  onSelectAsset: (asset: BagsNFT) => void;
  onSelectCoin: (asset: BagsCoin) => void;
  totalBalance: number;
};

const Bags = ({ onSelectCoin, onSelectAsset, totalBalance }: Props) => {
  const [search, setSearch] = React.useState("");
  const [selectedTab, setSelectedTab] = React.useState(0);
  const router = useRouter();
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
    <div className="w-full h-screen min-w-[3vmax] flex flex-col justify-center items-center items-center justify-start mt-8">
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
                <div className="absolute z-10 mb-20 inline-block rounded-xl bg-gray-900 px-3 py-4ont-medium text-white shadow-sm dark:bg-gray-700">
                  Copied!
                </div>
              )}
              <CopyIcon />
            </button>
          </div>
        </div>

        <div className="w-full flex justify-evenly mt-6">
          <div
            className="min-w-[3vmax] flex flex-col justify-center items-center py-2 bg-[#2E3C4E] cursor-pointer rounded-xl"
            onClick={() => {
              router.push("/swap");
            }}
          >
            <SwapIcon />

            <p className="text-sm text-white mt-1">Swap</p>
          </div>

          <div
            className="min-w-[3vmax] flex flex-col justify-center items-center py-2 bg-[#2E3C4E] cursor-pointer rounded-xl"
            onClick={() => {
              router.push("/atm");
            }}
          >
            <BuyIcon />

            <p className="text-sm text-white mt-1">Buy</p>
          </div>

          <div
            className="min-w-[3vmax] flex flex-col justify-center items-center py-2 bg-[#2E3C4E] cursor-pointer rounded-xl"
            onClick={() => {
              // router.push("/atm");
            }}
          >
            <SendWalletIcon />

            <p className="text-sm text-white mt-1">Send</p>
          </div>

          <div
            className="min-w-[3vmax] flex flex-col justify-center items-center py-2 bg-[#2E3C4E] cursor-pointer rounded-xl"
            onClick={() => {
              // router.push("/atm");
            }}
          >
            <ReceiveIcon />

            <p className="text-sm text-white mt-1">Receive</p>
          </div>

          <div
            className="min-w-[3vmax] flex flex-col justify-center items-center py-2 bg-[#2E3C4E] cursor-pointer rounded-xl"
            onClick={() => {
              router.push("/rewards");
            }}
          >
            <RewardsIcon />

            <p className="text-sm text-white mt-1">Rewards</p>
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
