import { atom } from "jotai";

export enum UserStatus {
  noTelegram,
  noAccount,
  noTwitter,
  fullAccount,
}

export const status = atom<UserStatus>(UserStatus.noTelegram);

export const data = atom<any>({});
