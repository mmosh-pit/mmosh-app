import { Coin } from "@/app/models/coin";
import { atom } from "jotai";

export const defaultFirstFormState = {
  name: "",
  symbol: "",
  description: "",
  image: null,
  preview: "",
};

export const defaultThirdFormState = {
  coin: null,
  passPrice: "0",
  invitation: "",
  invitationPrice: "0",
  creatorRoyalties: "70%",
  promoterRoyalties: "20%",
  scoutRoyalties: "5%",
  invitationDiscount: "",
};

export const step1Form = atom<{
  name: string;
  symbol: string;
  description: string;
  image: File | null;
  preview: string;
}>(defaultFirstFormState);

export const step2Form = atom<string[]>([]);

export const step3Form = atom<{
  coin: Coin | null;
  passPrice: string;
  invitation: string;
  invitationPrice: string;
  creatorRoyalties: string;
  promoterRoyalties: string;
  scoutRoyalties: string;
  invitationDiscount: string;
}>(defaultThirdFormState);

export const step = atom(0);
