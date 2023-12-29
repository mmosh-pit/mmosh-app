import axios from "axios";
import { useAtom } from "jotai";
import TwitterIcon from "@/assets/icons/TwitterIcon";
import { TwitterAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { UserStatus, data, status } from "../store";

const ConnectedWOTwitter = () => {
  const wallet = useAnchorWallet();
  const [_, setUserStatus] = useAtom(status);
  const [__, setUserData] = useAtom(data);

  const connectTwitter = async () => {
    const provider = new TwitterAuthProvider();
    const auth = getAuth();

    signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = TwitterAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const secret = credential?.secret;

        const user = result.user;

        const twitterData = {
          secret,
          token,
          user: user.uid,
        };

        await axios.post("/api/update-wallet-data", {
          wallet: wallet!.publicKey,
          field: "twitter",
          value: twitterData,
        });

        setUserStatus(UserStatus.fullAccount);
        setUserData((prev: any) => ({
          ...prev,
          twitter: twitterData,
        }));
      })
      .catch((error) => {});
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center mt-12">
      <div className="md::max-w-[40%] max-w-[90%] my-12">
        <p className="text-center">
          Last step! To complete your registration please connect your Twitter
          (X) account to the Airdrop Bot.
        </p>
      </div>

      <div className="mt-8">
        <button
          className="bg-[#FCAE0E] py-4 px-4 rounded-md flex justify-center items-center"
          onClick={connectTwitter}
        >
          <TwitterIcon />
          <p className="text-black text-lg ml-2">Connect Twitter/X Account</p>
        </button>
      </div>
    </div>
  );
};

export default ConnectedWOTwitter;
