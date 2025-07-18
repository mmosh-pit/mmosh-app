import { atom } from "jotai";
import { User } from "../models/user";
import { ProfileInfo } from "../models/profileInfo";

export enum UserStatus {
  noTelegram,
  noAccount,
  noTwitter,
  noProfile,
  fullAccount,
}

export const status = atom<UserStatus>(UserStatus.noTelegram);

export const data = atom<User | null>(null);

export const accounts = atom(0);
export const points = atom(0);
export const searchBarText = atom("");

export const isDrawerOpen = atom(false);

export const sortOption = atom("royalty");
export const sortDirection = atom("desc");

export const profileFilter = atom(0);

export const lineage = atom([
  { label: "Promoted", value: "gen1", selected: true, subLabel: "Gen 1" },
  { label: "Scouted", value: "gen2", selected: true, subLabel: "Gen 2" },
  { label: "Recruited", value: "gen3", selected: true, subLabel: "Gen 3" },
  { label: "Originated", value: "gen4", selected: true, subLabel: "Gen 4" },
]);

export const connectionTypes = atom([
  { label: "unlinked", value: "unlinked", selected: true, subLabel: "" },
  { label: "follower", value: "follower", selected: true, subLabel: "" },
  { label: "following", value: "following", selected: true, subLabel: "" },
  { label: "linked", value: "linked", selected: true, subLabel: "" },
]);

export const userType = atom("all");

export const settings = atom(false);

export const incomingWallet = atom("");

// Web3 info
export const userWeb3Info = atom<ProfileInfo | null>(null);
export const web3InfoLoading = atom(true);

export const isAuth = atom(false);
export const isAuthOverlayOpen = atom(true);
export const isAuthModalOpen = atom(false);

export const appPrivateKey = atom("");
export const appPublicKey = atom("");

export const signInModal = atom(false);
export const signInModalInitialStep = atom(0);
export const signInCurrentBot = atom("");
