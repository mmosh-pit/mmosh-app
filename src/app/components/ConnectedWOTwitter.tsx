import axios from "axios";
import * as React from "react";
import { useAtom } from "jotai";
import TwitterIcon from "@/assets/icons/TwitterIcon";
import {
  TwitterAuthProvider,
  getAdditionalUserInfo,
  getAuth,
  signInWithPopup,
} from "firebase/auth";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { UserStatus, data, status } from "../store";
import ArrowIcon from "@/assets/icons/ArrowIcon";

const ConnectedWOTwitter = () => {
  const wallet = useAnchorWallet();
  const [_, setUserStatus] = useAtom(status);
  const [__, setUserData] = useAtom(data);

  const connectTwitter = async () => {
    const provider = new TwitterAuthProvider();
    provider.addScope("tweet.read");
    provider.addScope("follows.read");
    provider.addScope("users.read");
    const auth = getAuth();

    signInWithPopup(auth, provider)
      .then(async (result) => {
        const info = getAdditionalUserInfo(result);

        const twitterData = {
          uid: result.user.uid,
          name: info?.profile!.name,
          username: info?.username,
          id: info?.profile!.id,
          provider: result.providerId,
        };

        await axios.put("/api/update-wallet-data", {
          wallet: wallet!.publicKey,
          field: "twitter",
          value: twitterData,
        });

        setUserStatus(UserStatus.noProfile);
        setUserData((prev: any) => ({
          ...prev,
          twitter: twitterData,
        }));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const skipTwitter = async () => {
    const twitterData = {};

    await axios.put("/api/update-wallet-data", {
      wallet: wallet!.publicKey,
      field: "twitter",
      value: twitterData,
    });

    setUserStatus(UserStatus.noProfile);
    setUserData((prev: any) => ({
      ...prev,
      twitter: twitterData,
    }));
  };

  return (
    <>
      <div className="relative w-full h-full flex flex-col justify-center items-center mt-6">
        <div className="md::max-w-[40%] max-w-[90%]">
          <h3 className="text-center text-white font-goudy font-normal mb-12">
            Connect to X / Twitter
          </h3>
          <p className="text-center">
            Connect your X/Twitter to{" "}
            <span id="onboarding-points-gradient">earn 100 points</span>, raid
            and win.
          </p>
        </div>

        <div className="mt-8">
          <button
            className="bg-[#CD068E] py-4 px-4 rounded-md flex justify-center items-center"
            onClick={connectTwitter}
          >
            <TwitterIcon />
            <p className="text-white text-lg ml-2">Connect Twitter/X Account</p>
          </button>
        </div>
      </div>
      <div
        className="flex items-center absolute bottom-[5vmax] right-[10vmax] cursor-pointer"
        onClick={skipTwitter}
      >
        <p className="pr-4 font-normal font-goudy">Skip</p>
        <ArrowIcon />
      </div>
    </>
  );
};

export default ConnectedWOTwitter;
