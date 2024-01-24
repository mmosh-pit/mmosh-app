import { atom } from "jotai";
import { User } from "../models/user";

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
