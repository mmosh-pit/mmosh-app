"use client";
import * as React from "react";

import { useAtom } from "jotai";
import { BagsCoin, BagsNFT, bagsBalance } from "../store/bags";
import useWallet from "@/utils/wallet";
import Bags from "../components/Bags/Bags";
import SelectedCoin from "../components/Bags/SelectedCoin";
import SendAsset from "../components/Bags/SendAsset";

const Page = () => {
  const [selectedAsset, setSelectedAsset] = React.useState<
    BagsCoin | BagsNFT | null
  >(null);

  const [isOnSend, setIsOnSend] = React.useState(false);

  const [totalBalance] = useAtom(bagsBalance);

  const onSelectCoin = React.useCallback((coin: BagsCoin) => {
    setSelectedAsset(coin);
  }, []);

  if (isOnSend) {
    return (
      <SendAsset
        selectedCoin={selectedAsset!}
        goBack={() => {
          if ("decimals" in selectedAsset!) {
            setIsOnSend(false);
          } else {
            setIsOnSend(false);
            setSelectedAsset(null);
          }
        }}
      />
    );
  }

  if (selectedAsset) {
    return (
      <SelectedCoin
        selectedCoin={selectedAsset}
        totalBalance={totalBalance}
        setSelectedAsset={setSelectedAsset}
        onSend={() => setIsOnSend(true)}
      />
    );
  }

  return (
    <Bags
      totalBalance={totalBalance}
      onSelectAsset={(asset) => {
        setIsOnSend(true);
        setSelectedAsset(asset);
      }}
      onSelectCoin={onSelectCoin}
    />
  );
};

export default Page;
