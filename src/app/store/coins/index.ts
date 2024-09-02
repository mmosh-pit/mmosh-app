import { atom } from "jotai";

export const selectedUSDCCoin = atom(false);
export const coinTextSearch = atom("");

export const selectedVolume = atom({ label: "1H Volume", value: "1h" });

export const coinStats = atom({
  dayVolume: "",
  monthVolume: "",
  yearVolume: "",
  total: "",
});

export const selectedDateType = atom("day");
