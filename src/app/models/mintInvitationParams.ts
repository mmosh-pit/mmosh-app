import * as React from "react";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Community } from "./community";

export type MintInvitationParams = {
  amount: number;
  wallet: AnchorWallet;
  setInvitationStatus: React.Dispatch<React.SetStateAction<string>>;
  pronouns?: string;
  userName?: string;
  community: Community;
  projectInfo: any;
};
