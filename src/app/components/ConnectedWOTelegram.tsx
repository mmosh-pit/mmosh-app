import { useAtom } from "jotai";
import axios from "axios";
import TelegramIcon from "../../assets/icons/TelegramIcon";
import { UserStatus, data, status } from "../store";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

const ConnectedWOAccount = () => {
  const wallet = useAnchorWallet();
  const [_, setUserStatus] = useAtom(status);
  const [__, setUserData] = useAtom(data);

  const executeLogin = () => {
    window.Telegram.Login.auth(
      {
        bot_id: process.env.NEXT_PUBLIC_BOT_TOKEN,
        request_access: true,
      },
      async (data: any) => {
        if (!data.id) return;
        const telegramData = {
          id: data.id,
          firstName: data.firstName,
          username: data.username,
        };

        await axios.put("/api/update-wallet-data", {
          wallet: wallet!.publicKey,
          field: "telegram",
          value: telegramData,
        });

        setUserStatus(UserStatus.noTwitter);
        setUserData((prev: any) => ({
          ...prev,
          telegram: telegramData,
        }));
      },
    );
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center mt-12">
      <div className="md::max-w-[40%] max-w-[90%] my-12">
        <p className="text-center">
          Thanks for connecting your wallet! Now let’s link your Telegram
          account to your Solana address.
        </p>
      </div>

      <div className="mt-8">
        <button
          className="bg-[#FCAE0E] py-4 px-4 rounded-md flex items-center"
          onClick={executeLogin}
        >
          <TelegramIcon />
          <p className="text-black text-lg ml-2">Connect Telegram Account</p>
        </button>
      </div>
    </div>
  );
};

export default ConnectedWOAccount;
