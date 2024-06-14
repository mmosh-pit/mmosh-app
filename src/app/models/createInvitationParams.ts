import { AnchorWallet } from "@solana/wallet-adapter-react";
import { ProfileInfo } from "./profileInfo";

export type CreateInvitationParams = {
  profileInfo: ProfileInfo;
  amount: number;
  wallet: AnchorWallet;
  name: string;
  pronouns: string;
  seniority: number;
};
