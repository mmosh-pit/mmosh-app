import * as React from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";

import { Coin } from "@/app/models/coin";
import { userWeb3Info } from "@/app/store";
import Search from "../../common/Search";
import RecentCoin from "../../common/RecentCoin";
import CoinListItem from "../../common/CoinListItem";
import { SwapCoin } from "@/app/models/swapCoin";
import CloseIcon from "@/assets/icons/CloseIcon";
import { networkCoins, communityCoins } from "@/app/lib/forge/jupiter";

type Props = {
  selectedCoin: SwapCoin | null;
  onTokenSelect: React.Dispatch<React.SetStateAction<SwapCoin | null>>;
};

const CoinSelect = ({ selectedCoin, onTokenSelect }: Props) => {
  const wallet = useAnchorWallet();
  const [profileInfo] = useAtom(userWeb3Info);

  const fetching = React.useRef(false);

  const [coinsList, setCoinsList] = React.useState<Coin[]>([]);
  const [politicalCoins, setPoliticalCoins] = React.useState<Coin[]>([]);
  const [recentCoins, setRecentCoins] = React.useState<Coin[]>([]);
  const [searchText, setSearchText] = React.useState("");

  const getRecentCoins = React.useCallback(async () => {
    if (!profileInfo) return;
    const result = await axios.get(
      `/api/get-recent-coins?profile=${profileInfo?.profile.address}`,
    );

    setRecentCoins(result.data);
  }, []);

  const getCoinsList = React.useCallback(async () => {
    fetching.current = true;
    const listResult = await axios.get<Coin[]>(
      `/api/list-tokens?search=${searchText}`,
    );

    const coinList = listResult.data;

    const regularCoins = coinList.filter(
      (coin) => !["PTVB", "PTVR"].includes(coin.basesymbol.toUpperCase()),
    );
    const politicalMemecoins = coinList.filter((coin) =>
      ["PTVB", "PTVR"].includes(coin.basesymbol.toUpperCase()),
    );

    setCoinsList(regularCoins);
    setPoliticalCoins(politicalMemecoins);
    fetching.current = false;
  }, [searchText]);

  const handleTokenSelect = React.useCallback(
    (token: Coin) => {
      onTokenSelect(token as SwapCoin);
      (document.getElementById("coin_modal") as any)?.close();
    },
    [wallet],
  );

  React.useEffect(() => {
    getCoinsList();
  }, [searchText]);

  React.useEffect(() => {
    getRecentCoins();
  }, [profileInfo]);

  return (
    <>
      <div
        className="w-full flex items-center min-w-[2.5vmax] min-h-[2vmax] bg-black bg-opacity-[0.07] cursor-pointer border-[1px] border-[#FFFFFF30] rounded-lg px-2 mx-1"
        onClick={() => {
          return (document.getElementById("coin_modal") as any)?.showModal();
        }}
      >
        {selectedCoin ? (
          <div className="w-full flex justify-center items-center">
            <div className="w-[1.2vmax] h-[1.2vmax] relative flex items-center">
              <Image
                src={selectedCoin!.image}
                alt={selectedCoin!.symbol}
                layout="fill"
              />
            </div>
            <p className="text-white text-sm ml-1 mr-2">
              {selectedCoin!.symbol.toUpperCase()}
            </p>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center">
            <p className="text-base text-gray-500">Set the Coin</p>
          </div>
        )}
      </div>
      <dialog id="coin_modal" className="modal">
        <div className="flex flex-col modal-box w-[40%] bg-[#02001A] p-8">
          <div className="custom-select-open grow">
            <div className="flex w-full justify-between mb-2">
              <p className="text-xs text-white font-bold ml-4">Trading Pairs</p>

              <button
                className="cursor-pointer"
                onClick={() =>
                  (document.getElementById("coin_modal") as any)?.close()
                }
              >
                <CloseIcon />
              </button>
            </div>

            <div className="my-2 w-[80%] ml-8">
              <Search
                value={searchText}
                onChange={(e) => setSearchText(e)}
                darker
              />
            </div>

            <div className="grid gap-4 grid-cols-auto">
              {recentCoins.map((coin) => (
                <RecentCoin
                  token={coin.token}
                  bonding={coin.bonding}
                  desc={coin.desc}
                  creatorUsername={coin.creatorUsername}
                  basesymbol={coin.basesymbol}
                  name={coin.name}
                  symbol={coin.symbol}
                  image={coin.image}
                  onTokenSelect={handleTokenSelect}
                  key={coin.token}
                />
              ))}
            </div>

            <div className="w-full h-[0.5px] bg-[#36357C] px-2 mb-8 mt-2" />

            <div className="w-full mb-4 mt-6">
              <p className="text-lg text-white font-bold">Network Tokens</p>
            </div>

            {networkCoins.map((coin) => {
              return (
                <div className="my-2">
                  <CoinListItem
                    token={coin.token}
                    bonding={coin.bonding}
                    name={coin.name}
                    desc={coin.desc}
                    creatorUsername={coin.creatorUsername}
                    symbol={coin.symbol}
                    basesymbol=""
                    image={coin.image}
                    iscoin={coin.iscoin}
                    decimals={coin.decimals}
                    onTokenSelect={handleTokenSelect}
                    key={coin.token}
                  />
                </div>
              );
            })}

            <div className="w-full mb-4 mt-6">
              <p className="text-lg text-white font-bold">Community Coins</p>
            </div>

            {communityCoins.map((coin) => {
              return (
                <div className="my-2">
                  <CoinListItem
                    token={coin.token}
                    bonding={coin.bonding}
                    name={coin.name}
                    desc={coin.desc}
                    creatorUsername={coin.creatorUsername}
                    basesymbol=""
                    symbol={coin.symbol}
                    image={coin.image}
                    iscoin={coin.iscoin}
                    decimals={coin.decimals}
                    onTokenSelect={handleTokenSelect}
                    key={coin.token}
                  />
                </div>
              );
            })}

            <div className="w-full mb-4 mt-6">
              <p className="text-lg text-white font-bold">Memecoins</p>
            </div>

            {coinsList.map((coin) => {
              return (
                <div className="my-2">
                  <CoinListItem
                    token={coin.token}
                    bonding={coin.bonding}
                    basesymbol={coin.basesymbol}
                    name={coin.name}
                    desc={coin.desc}
                    creatorUsername={coin.creatorUsername}
                    symbol={coin.symbol}
                    image={coin.image}
                    iscoin={coin.iscoin}
                    decimals={coin.decimals}
                    onTokenSelect={handleTokenSelect}
                    key={coin.token}
                  />
                </div>
              );
            })}

            <div className="w-full mb-4 mt-6">
              <p className="text-lg text-white font-bold">
                Political Memecoins
              </p>
            </div>

            {politicalCoins.map((coin) => {
              return (
                <div className="my-2">
                  <CoinListItem
                    token={coin.token}
                    bonding={coin.bonding}
                    name={coin.name}
                    desc={coin.desc}
                    creatorUsername={coin.creatorUsername}
                    basesymbol={coin.basesymbol}
                    symbol={coin.symbol}
                    image={coin.image}
                    iscoin={coin.iscoin}
                    decimals={coin.decimals}
                    onTokenSelect={handleTokenSelect}
                    key={coin.token}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </dialog>
    </>
  );
};

export default CoinSelect;
