import { atom } from "jotai";

export const onboardingStep = atom(0);

export const onboardingForm = atom({
  name: "",
  username: "",
  website: "",
  pronouns: "they/them",
  bio: "",
});

export const referredUser = atom("");
