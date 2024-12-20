import { atom } from "jotai";

export type BagsCoin = {
  image: string;
  tokenAddress: string;
  name: string;
  symbol: string;
  balance: number;
  decimals: number;
  usdcPrice: number;
  mmoshPrice: number;
  parentKey?: string;
};

export type BagsCoins = {
  network: BagsCoin | null;
  stable: BagsCoin | null;
  native: BagsCoin | null;
  community: BagsCoin[];
  memecoins: BagsCoin[];
  exosystem: BagsCoin[];
};

export type BagsNFT = {
  image: string;
  tokenAddress: string;
  name: string;
  symbol: string;
  balance: number;
  metadata: any;
  parentKey?: string;
};

export type BagsNFTAssets = {
  profiles: BagsNFT[];
  passes: BagsNFT[];
  badges: BagsNFT[];
  exosystem: BagsNFT[];
};

export const bagsCoins = atom<BagsCoins | null>(null);

export const bagsNfts = atom<BagsNFTAssets | null>(null);

export const bagsBalance = atom(0);

export const genesisProfileUser = atom(false);
