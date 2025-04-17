import * as React from "react";
import { Candidate } from "./candidate";
import { FrostWallet } from "@/utils/frostWallet";

export type CreateCoinParams = {
  username: string;
  name: string;
  symbol: string;
  description: string;
  imageFile: File | null;
  preview: string;
  wallet: FrostWallet;
  multiplier: number;
  supply: number;
  initialPrice: number;
  type: string;
  baseToken: any;
  setMintingStatus: React.Dispatch<React.SetStateAction<string>>;
};

export type CreateProjectCoinParams = {
  username: string;
  name: string;
  symbol: string;
  description: string;
  imageFile: File | null;
  preview: string;
  wallet: FrostWallet;
  multiplier: number;
  supply: number;
  initialPrice: number;
  type: string;
  baseToken: any;
  candidate: Candidate;
  position: string;
  setMintingStatus: React.Dispatch<React.SetStateAction<string>>;
};
