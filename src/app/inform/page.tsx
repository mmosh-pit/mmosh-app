"use client";
import { useAtom } from "jotai";
import * as React from "react";

import { isDrawerOpen } from "../store";
import SearchBar from "../components/Project/Candidates/SearchBar";
import {
  BagsCoin,
  BagsNFT,
  bagsBalance,
  bagsCoins,
  bagsNfts,
} from "../store/bags";
import axios from "axios";
import useWallet from "@/utils/wallet";
import { AssetsHeliusResponse } from "../models/assetsHeliusResponse";
import AssetCard from "../components/Inform/AssetCard";

const COMMUNITY_PTVB_COIN = process.env.NEXT_PUBLIC_PTVB_TOKEN;
const COMMUNITY_PTVR_COIN = process.env.NEXT_PUBLIC_PTVR_TOKEN;

const USDC_COIN = process.env.NEXT_PUBLIC_USDC_TOKEN;

const MMOSH_COIN = process.env.NEXT_PUBLIC_OPOS_TOKEN;

const PASS_COLLECTION = "PASSES";
const BADGE_COLLECTION = "BADGES";
const PROFILE_COLLECTION = "PROFILES";

const Inform = () => {
  const wallet = useWallet();

  const [isDrawerShown] = useAtom(isDrawerOpen);
  const [searchText, setSearchText] = React.useState("");

  const [_, setTotalBalance] = useAtom(bagsBalance);
  const [bags, setBags] = useAtom(bagsCoins);
  const [nfts, setBagsNFTs] = useAtom(bagsNfts);

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
    const allTokens = await getAllTokenAddreses();

    const response = await fetch(process.env.NEXT_PUBLIC_SOLANA_CLUSTER!, {
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        method: "getAssetsByOwner",
        params: {
          ownerAddress: wallet?.publicKey.toBase58(),
          displayOptions: {
            showFungible: true,
            showCollectionMetadata: true,
            showNativeBalance: true,
            showUnverifiedCollections: true,
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
          const coin = {
            name: value.content.metadata.name,
            image: value.content.links.image ?? "",
            symbol: value.content.metadata.symbol,
            balance: value.token_info.balance,
            tokenAddress: value.id,
            decimals: value.token_info.decimals,
            usdcPrice: 0,
            mmoshPrice: 0,
          };

          switch (value.id) {
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
        balance: 1,
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

    setTotalBalance(totalPriceInWallet);

    setBags({
      native: nativeCoin,
      stable: stableCoin,
      network: null,
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

  React.useEffect(() => {
    if (!wallet) return;
    fetchAllBalances();
  }, [wallet]);

  const coins = [...(bags?.memecoins ?? []), ...(bags?.community ?? [])];

  return (
    <div
      className={`background-content-full-bg flex flex-col items-center ${isDrawerShown ? "z-[-1]" : ""}`}
    >
      <div className="bg-[#131245E0] flex flex-col items-center py-4 px-2 md:w-[85%] w-[95%] rounded-lg mt-8">
        <h3>Inform OPOS</h3>

        <div className="mt-6 mb-3">
          <SearchBar setSearchText={setSearchText} />
        </div>

        <div className="w-full bg-[#09073A] px-4 py-2 rounded-md">
          <h5>Ecosystem</h5>
        </div>

        <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 min-h-[10vh] py-4">
          {!nfts?.profiles.length ? (
            <p className="text-white text-center text-sm">Nothing yet</p>
          ) : (
            nfts.profiles.map((asset) => <AssetCard asset={asset} />)
          )}
        </div>

        <div className="w-full bg-[#09073A] px-4 py-2 rounded-md">
          <h5>Projects</h5>
        </div>

        <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 min-h-[10vh] py-4">
          {!nfts?.passes.length ? (
            <p className="text-white text-center text-sm">Nothing yet</p>
          ) : (
            nfts.profiles.map((asset) => <AssetCard asset={asset} />)
          )}
        </div>

        <div className="w-full bg-[#09073A] px-4 py-2 rounded-md">
          <h5>Communities</h5>
        </div>

        <div className="w-full flex justify-center items-center flex-wrap min-h-[10vh] py-4">
          <p className="text-white text-center text-sm">Nothing yet</p>
        </div>

        <div className="w-full bg-[#09073A] px-4 py-2 rounded-md">
          <h5>Coins</h5>
        </div>

        <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 min-h-[10vh] py-4">
          {!coins.length ? (
            <p className="text-white text-center text-sm">Nothing yet</p>
          ) : (
            coins.map((asset) => <AssetCard asset={asset} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Inform;
