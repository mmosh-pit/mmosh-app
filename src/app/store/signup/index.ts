import { atom } from "jotai";

export const storeFormAtom = atom({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

export const incomingReferAddress = atom("");
