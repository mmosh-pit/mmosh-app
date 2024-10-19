import * as React from "react";
import axios from "axios";
import Image from "next/image";
import { useAtom } from "jotai";

import { Coin } from "@/app/models/coin";
import Search from "../common/Search";
import CoinListItem from "../common/CoinListItem";
import { SwapCoin } from "@/app/models/swapCoin";
import SimpleArrowDown from "@/assets/icons/SimpleArrowDown";
import CloseIcon from "@/assets/icons/CloseIcon";
import { networkCoins, communityCoins } from "@/app/lib/forge/jupiter";
import { data } from "@/app/store";
import RecentCoin from "../common/RecentCoin";

type Props = {
  selectedCoin: SwapCoin | null;
  otherToken: SwapCoin | null;
  onTokenSelect: (coin: SwapCoin, isBase: boolean) => {};
  isBase: boolean;
  readonly: boolean;
};

const CoinSelect = ({
  selectedCoin,
  otherToken,
  onTokenSelect,
  isBase,
  readonly,
}: Props) => {
  const [coinsList, setCoinsList] = React.useState<Coin[]>([]);

  const [politicalCoins, setPoliticalCoins] = React.useState<Coin[]>([]);

  const [recentCoins, setRecentCoins] = React.useState<Coin[]>([]);

  const [searchText, setSearchText] = React.useState("");

  const [currentUser] = useAtom(data);

  const getCoinsList = async () => {
    let newCoinList = [];
    const listResult = await axios.get(`/api/list-tokens?search=${searchText}`);

    const politicalResult = await axios.get(
      `/api/list-political-tokens?search=${searchText}`,
    );

    const recentCoins = await axios.get(
      `/api/get-recent-coins?profile=${currentUser?.profilenft}`,
    );

    if (otherToken?.token === "") {
      for (let index = 0; index < listResult.data.length; index++) {
        const element = listResult.data[index];
        element.decimals = 9;
        element.iscoin = false;
        newCoinList.push(element);
      }
    } else {
      if (
        otherToken?.symbol.toLowerCase() == "mmosh" ||
        otherToken?.symbol.toLowerCase() == "ptvr" ||
        otherToken?.symbol.toLowerCase() == "ptvb"
      ) {
        for (let index = 0; index < listResult.data.length; index++) {
          const element = listResult.data[index];
          element.decimals = 9;
          element.iscoin = false;
          newCoinList.push(element);
        }
      }
    }

    if (searchText) {
      let finalList = newCoinList.filter((item: any) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()),
      );
      setCoinsList(finalList);
    } else {
      setCoinsList(newCoinList);
    }

    setPoliticalCoins(politicalResult.data);
    setRecentCoins(recentCoins.data);
  };

  const handleTokenSelect = (token: Coin) => {
    onTokenSelect(token as SwapCoin, isBase);
    (
      document.getElementById(
        isBase ? "coin_modal_base" : "coin_modal_target",
      ) as any
    )?.close();
  };

  React.useEffect(() => {
    getCoinsList();
  }, [searchText, isBase]);

  const onOpenModel = async () => {
    await getCoinsList();
    (
      document.getElementById(
        isBase ? "coin_modal_base" : "coin_modal_target",
      ) as any
    )?.showModal();
  };

  return (
    <>
      <div
        className={`flex items-center min-w-[2.5vmax] min-h-[2vmax] ${!readonly && "cursor-pointer"} border-[1px] border-[#FFFFFF05] bg-[#DEDDFC12] rounded-md px-2 mx-1`}
        onClick={onOpenModel}
      >
        {selectedCoin && (
          <>
            {selectedCoin!.image && (
              <div className="w-[1.5vmax] h-[1.5vmax] relative flex items-center">
                <Image
                  src={selectedCoin!.image}
                  alt={selectedCoin!.symbol}
                  layout="fill"
                />
              </div>
            )}
            <p className="text-white text-sm ml-1 mr-2">
              {selectedCoin!.symbol.toUpperCase()}
            </p>

            <SimpleArrowDown />
          </>
        )}
      </div>
      <dialog
        id={isBase ? "coin_modal_base" : "coin_modal_target"}
        className="modal"
      >
        <div className="flex flex-col modal-box w-[40%] bg-[#02001A] p-8">
          <div className="custom-select-open grow">
            <div className="flex w-full justify-between mb-2">
              <p className="text-xs text-white font-bold ml-4">Trading Pairs</p>

              <button
                className="cursor-pointer"
                onClick={() =>
                  (
                    document.getElementById(
                      isBase ? "coin_modal_base" : "coin_modal_target",
                    ) as any
                  )?.close()
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

            <div>
              {recentCoins.map((coin) => (
                <RecentCoin
                  onTokenSelect={handleTokenSelect}
                  symbol={coin.symbol}
                  desc={coin.desc}
                  name={coin.name}
                  image={coin.image}
                  token={coin.token}
                  bonding={coin.bonding}
                  creatorUsername={coin.creatorUsername}
                  iscoin={coin.iscoin}
                  decimals={coin.decimals}
                />
              ))}
            </div>

            <div className="w-full h-[1px] bg-[#36357C] px-2 mb-8 mt-2" />

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
