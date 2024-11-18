"use client";
import * as React from "react";

import { useAtom } from "jotai";
import { AssetsHeliusResponse } from "../models/assetsHeliusResponse";
import axios from "axios";
import { BagsCoin, BagsNFT, bagsCoins, bagsNfts } from "../store/bags";
import useWallet from "@/utils/wallet";
import { getPriceForPTV } from "../lib/forge/jupiter";
import Bags from "../components/Bags/Bags";
import SelectedCoin from "../components/Bags/SelectedCoin";
import SendAsset from "../components/Bags/SendAsset";

const SOL_ADDR = "So11111111111111111111111111111111111111112";

const COMMUNITY_PTVB_COIN = process.env.NEXT_PUBLIC_PTVB_TOKEN;
const COMMUNITY_PTVR_COIN = process.env.NEXT_PUBLIC_PTVR_TOKEN;

const USDC_COIN = process.env.NEXT_PUBLIC_USDC_TOKEN;

const MMOSH_COIN = process.env.NEXT_PUBLIC_OPOS_TOKEN;

const PASS_COLLECTION = "PASSES";
const BADGE_COLLECTION = "BADGES";
const PROFILE_COLLECTION = "PROFILES";

const Page = () => {
  const wallet = useWallet();

  const rendered = React.useRef(false);
  const [_, setMmoshUsdcPrice] = React.useState(0);
  const [selectedAsset, setSelectedAsset] = React.useState<
    BagsCoin | BagsNFT | null
  >(null);

  const [totalBalance, setTotalBalance] = React.useState(0);
  const [isOnSend, setIsOnSend] = React.useState(false);

  const [bags, setBags] = useAtom(bagsCoins);
  const [__, setBagsNFTs] = useAtom(bagsNfts);

  const getAllTokenAddreses = React.useCallback(async () => {
    const response = await axios.get("/api/get-all-coins-address");

    const data: any = response.data;

    const result: any = {};

    for (const value of data) {
      result[value.token] = true;
    }

    return result;
  }, [wallet]);

  const fetchAllBalances = React.useCallback(async () => {
    rendered.current = true;

    const allTokens = await getAllTokenAddreses();

    const response = await fetch(process.env.NEXT_PUBLIC_SOLANA_CLUSTER!, {
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        method: "getAssetsByOwner",
        params: {
          ownerAddress: "F9FxKsm6ZS4EYYSu1rdBPQDh5JUHgjjmtwxwUZBjNjaB",
          displayOptions: {
            showFungible: true,
            showCollectionMetadata: true,
            showUnverifiedCollections: true,
            showNativeBalance: true,
          },
          page: 1,
          limit: 1000,
        },
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const mmoshUsdcPrice = await axios.get(
      `https://price.jup.ag/v6/price?ids=MMOSH`,
    );

    const USDCPrice = mmoshUsdcPrice.data?.data?.MMOSH?.price || 0;

    const res: AssetsHeliusResponse = await response.json();

    let networkCoin: BagsCoin = {
      symbol: "SOL",
      decimals: 9,
      balance: res.result.nativeBalance.lamports,
      name: "Solana",
      image:
        "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
      tokenAddress: SOL_ADDR,
      usdcPrice: Number(res.result.nativeBalance.price_per_sol.toFixed(2)),
      mmoshPrice: 0,
    };

    let stableCoin: BagsCoin | null = null;
    let nativeCoin: BagsCoin | null = null;

    const communityCoins: BagsCoin[] = [];

    const memecoins: BagsCoin[] = [];

    const exosystemCoins: BagsCoin[] = [];

    const badges: BagsNFT[] = [];

    const exosystemAssets: BagsNFT[] = [];

    const profiles: BagsNFT[] = [];
    const passes: BagsNFT[] = [];

    const nativeUsdcBalance = res.result.nativeBalance.total_price;

    let totalPriceInWallet = nativeUsdcBalance;

    for (const value of res.result.items) {
      if (value.interface === "FungibleToken") {
        if (value.token_info.decimals > 0) {
          const price = await getPriceForPTV(value.id);

          const coin = {
            name: value.content.metadata.name,
            image: value.content.links.image ?? "",
            symbol: value.content.metadata.symbol,
            balance: value.token_info.balance,
            tokenAddress: value.id,
            decimals: value.token_info.decimals,
            usdcPrice: price,
            mmoshPrice: 0,
          };

          if (value.id !== MMOSH_COIN) {
            const decimals = "1".padEnd(coin.decimals + 1, "0");

            const coinBalance = coin.balance / Number(decimals);

            totalPriceInWallet += coinBalance * price;
          }

          switch (value.id) {
            case SOL_ADDR:
              networkCoin = coin;
              break;
            case COMMUNITY_PTVB_COIN:
              communityCoins.push(coin);
              break;
            case COMMUNITY_PTVR_COIN:
              communityCoins.push(coin);
              break;
            case USDC_COIN:
              stableCoin = coin;
              break;
            case MMOSH_COIN:
              coin.usdcPrice = USDCPrice;
              const decimals = "1".padEnd(coin.decimals + 1, "0");
              const balance = value.token_info.balance / Number(decimals);
              coin.mmoshPrice = balance;

              totalPriceInWallet += coin.usdcPrice * balance;
              nativeCoin = coin;
              break;
            default:
              if (allTokens[value.id]) {
                memecoins.push(coin);
              } else {
                exosystemCoins.push(coin);
              }
          }
        } else {
          const badge = {
            name: value.content.metadata.name,
            image: value.content.links.image ?? "",
            symbol: value.content.metadata.symbol,
            balance: value.token_info.balance,
            tokenAddress: value.id,
            metadata: value.content.metadata,
          };
          if (value.group_definition && value.group_definition?.length > 0) {
            const collectionDefinition = value.grouping.find(
              (e) => e.group_key === "collection",
            );

            if (
              collectionDefinition?.collection_metadata?.symbol ===
              BADGE_COLLECTION
            ) {
              badges.push(badge);
            } else {
              exosystemAssets.push(badge);
            }
          }
        }
        continue;
      }

      const nft = {
        name: value.content.metadata.name,
        image: value.content.links.image ?? "",
        symbol: value.content.metadata.symbol,
        balance: 0,
        tokenAddress: value.id,
        metadata: value.content.metadata,
      };

      const collectionDefinition = value.grouping.find(
        (e) => e.group_key === "collection",
      );

      if (
        collectionDefinition?.collection_metadata?.symbol === PROFILE_COLLECTION
      ) {
        profiles.push(nft);
        continue;
      }

      if (
        collectionDefinition?.collection_metadata?.symbol === PASS_COLLECTION
      ) {
        passes.push(nft);
        continue;
      }
      exosystemAssets.push(nft);
    }

    setMmoshUsdcPrice(USDCPrice);
    setTotalBalance(totalPriceInWallet);

    setBags({
      native: nativeCoin,
      stable: stableCoin,
      network: networkCoin,
      community: communityCoins,
      exosystem: exosystemCoins,
      memecoins: memecoins,
    });

    setBagsNFTs({
      passes,
      profiles,
      badges,
      exosystem: exosystemAssets,
    });
  }, [wallet]);

  const onSelectCoin = React.useCallback((coin: BagsCoin) => {
    setSelectedAsset(coin);
  }, []);

  React.useEffect(() => {
    if (!wallet || rendered.current || bags !== null) return;
    fetchAllBalances();
  }, [wallet]);

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
