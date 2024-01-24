import * as React from "react";
import axios from "axios";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import {
  TwitterAuthProvider,
  getAdditionalUserInfo,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { User } from "@/app/models/user";
import TwitterMagentaIcon from "@/assets/icons/TwitterMagentaIcon";

type Props = {
  userData: User | undefined;
  setUserData: React.Dispatch<React.SetStateAction<User | undefined>>;
  isMyProfile: boolean;
};

const TwitterAccount = ({ userData, setUserData, isMyProfile }: Props) => {
  const wallet = useAnchorWallet();
  const [isDisconnecting, setIsDisconnecting] = React.useState(false);
  const [isConnecting, setIsConnecting] = React.useState(false);

  const getButtonLabel = React.useCallback(() => {
    if (isDisconnecting) {
      return "Disconnect";
    }

    if (isConnecting) {
      return "Connect";
    }

    return "Switch Account";
  }, [isDisconnecting, isConnecting]);

  const toggleButtonState = React.useCallback(() => {
    if (!isDisconnecting && !isConnecting) {
      setIsDisconnecting(true);
      return;
    }

    const auth = getAuth();
    if (isDisconnecting && !isConnecting) {
      signOut(auth);
      setIsConnecting(true);
      return;
    }

    if (isDisconnecting && isConnecting) {
      const provider = new TwitterAuthProvider();

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

          setUserData((prev: any) => ({
            ...prev,
            twitter: twitterData,
          }));
        })
        .catch((error) => {
          console.error(error);
        });

      setIsDisconnecting(false);
      setIsConnecting(false);
      return;
    }
  }, [isDisconnecting, isConnecting]);

  const getButtonHelperText = React.useCallback(() => {
    if (isDisconnecting && !isConnecting) {
      return "*First, disconnect from Twitter";
    }

    if (isConnecting) {
      return "*Now, connect the Twitter account you would like to use.";
    }

    return "";
  }, [isDisconnecting, isConnecting]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <TwitterMagentaIcon />
        <p className="text-lg text-white ml-2">Twitter</p>
      </div>
      <p className="text-base text-white">{userData?.twitter?.name}</p>
      <p className="text-base">@{userData?.twitter?.username}</p>

      {isMyProfile && (
        <>
          <button
            className="rounded-full p-4 bg-[#09073A] mt-2"
            onClick={toggleButtonState}
          >
            {getButtonLabel()}
          </button>
          <span className="text-xs">{getButtonHelperText()}</span>
        </>
      )}
    </div>
  );
};

export default TwitterAccount;
