import * as React from "react";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Community } from "./community";

export type MintCommunityPassParams = {
  wallet: AnchorWallet;
  setMintStatus: React.Dispatch<React.SetStateAction<string>>;
  community: Community;
  projectInfo: any;
  profile: string;
};
