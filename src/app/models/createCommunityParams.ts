import { AnchorWallet } from "@solana/wallet-adapter-react";
import React from "react";
import { Coin } from "./coin";

export type CreateCommunityParams = {
  wallet: AnchorWallet;
  discount: string;
  invitationPrice: number;
  profileCost: number;
  name: string;
  symbol: string;
  description: string;
  topics: string[];
  telegram: string;
  invitationImage: Blob | null;
  genesisImage: Blob;
  passImage: string;
  pronouns: string;
  minterUsername: string;
  minterName: string;
  priceDistribution: PriceDistribution;
  setMintingStatus: React.Dispatch<React.SetStateAction<string>>;
  userProfile: string;
  coin: Coin;
};

type PriceDistribution = {
  curator: number;
  creator: number;
  promoter: number;
  scout: number;
  ecosystem: number;
};
