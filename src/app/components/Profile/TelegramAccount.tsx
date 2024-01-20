import * as React from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import axios from "axios";

import { User } from "@/app/models/user";
import TelegramMagentaIcon from "@/assets/icons/TelegramMagentaIcon";

type Props = {
  userData: User | undefined;
  setUserData: React.Dispatch<React.SetStateAction<User | undefined>>;
};

const TelegramAccount = ({ userData, setUserData }: Props) => {
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

    if (isDisconnecting && !isConnecting) {
      setIsConnecting(true);
      return;
    }

    if (isDisconnecting && isConnecting) {
      window.Telegram.Login.auth(
        {
          bot_id: process.env.NEXT_PUBLIC_BOT_TOKEN,
          request_access: true,
        },
        async (data: any) => {
          if (!data.id) return;
          const telegramData = {
            id: data.id,
            firstName: data.first_name,
            username: data.username,
          };

          await axios.put("/api/update-wallet-data", {
            wallet: wallet!.publicKey,
            field: "telegram",
            value: telegramData,
          });

          setUserData((prev: any) => ({
            ...prev,
            telegram: telegramData,
          }));
        },
      );

      setIsDisconnecting(false);
      setIsConnecting(false);
      return;
    }
  }, [isDisconnecting, isConnecting]);

  const getButtonHelperText = React.useCallback(() => {
    if (isDisconnecting && !isConnecting) {
      return "*First, disconnect from Telegram";
    }

    if (isConnecting) {
      return "*Now, connect the Telegram account you would like to use.";
    }

    return "";
  }, [isDisconnecting, isConnecting]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <TelegramMagentaIcon />
        <p className="text-lg text-white ml-2">Telegram</p>
      </div>
      <p className="text-base text-white">{userData?.telegram?.firstName}</p>
      <p className="text-base">@{userData?.telegram?.username}</p>
      <button
        className="rounded-full p-4 bg-[#09073A] mt-2"
        onClick={toggleButtonState}
      >
        {getButtonLabel()}
      </button>
      <span className="text-xs">{getButtonHelperText()}</span>
    </div>
  );
};

export default TelegramAccount;
