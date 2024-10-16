import * as React from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";

import { Coin } from "@/app/models/coin";
import { userWeb3Info } from "@/app/store";
import Search from "../common/Search";
import RecentCoin from "../common/RecentCoin";
import CoinListItem from "../common/CoinListItem";
import { SwapCoin } from "@/app/models/swapCoin";
import SimpleArrowDown from "@/assets/icons/SimpleArrowDown";
import CloseIcon from "@/assets/icons/CloseIcon";
import { jupCoins } from "@/app/lib/forge/jupiter";

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

  // const [recentCoins, setRecentCoins] = React.useState<Coin[]>([]);
  const [searchText, setSearchText] = React.useState("");

  const getCoinsList = async () => {
    let newCoinList = [];
    const listResult = await axios.get(`/api/list-tokens?search=${searchText}`);

    const politicalResult = await axios.get(
      `/api/list-political-tokens?search=${searchText}`,
    );

    if (otherToken?.token === "") {
      newCoinList = jupCoins;
      for (let index = 0; index < listResult.data.length; index++) {
        const element = listResult.data[index];
        element.decimals = 9;
        element.iscoin = false;
        newCoinList.push(element);
      }
    } else {
      let memeCoin = listResult.data.filter(
        (item: any) => item.token == otherToken?.token,
      );
      if (memeCoin.length > 0) {
        newCoinList.push(jupCoins[0]); // mmosh
        newCoinList.push(jupCoins[1]); // ptvr
        newCoinList.push(jupCoins[2]); // ptvb
      }

      if (otherToken?.symbol.toLowerCase() == "mmosh") {
        let jupList = jupCoins;
        for (let index = 0; index < jupList.length; index++) {
          const element = jupList[index];
          if (element.symbol != otherToken?.symbol) {
            newCoinList.push(element);
          }
        }
      }

      if (
        otherToken?.symbol.toLowerCase() == "ptvb" ||
        otherToken?.symbol.toLowerCase() == "ptvr"
      ) {
        newCoinList.push(jupCoins[0]); // mmosh
      }

      if (otherToken?.symbol.toLowerCase() == "usdc") {
        newCoinList.push(jupCoins[0]); // mmosh
        newCoinList.push(jupCoins[4]); // sol
      }

      if (otherToken?.symbol.toLowerCase() == "wsol") {
        newCoinList.push(jupCoins[0]); // mmosh
        newCoinList.push(jupCoins[3]); // usdc
      }

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
            <div className="w-[1.5vmax] h-[1.5vmax] relative flex items-center">
              <Image
                src={selectedCoin!.image}
                alt={selectedCoin!.symbol}
                layout="fill"
              />
            </div>
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
              <p className="text-xs text-white font-bold ml-4">Creator Coins</p>

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

            <div className="w-full h-[0.5px] bg-[#36357C] px-2 mb-8 mt-2" />

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

            <div className="w-full h-[0.5px] bg-[#36357C] px-2 mb-8 mt-2" />

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
