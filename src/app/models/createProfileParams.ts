import { PublicKey } from "@solana/web3.js";
import { ProfileForm } from "./profileForm";
import { ProfileInfo } from "./profileInfo";
import { FrostWallet } from "@/utils/frostWallet";

export type CreateProfileParams = {
  profileInfo: ProfileInfo;
  form: ProfileForm;
  image: File | null;
  preview: string;
  wallet: FrostWallet;
  parentProfile: PublicKey,
  membership: string,
  membershipType: string,
  price: number
};
