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
        await axios.post("/api/log-data", {
          data,
        });
        if (!data.id) return;

        const user = await axios.get(`/api/get-bot-user?id=${data.id}`);

        const telegramData = {
          id: data.id,
          firstName: data.first_name,
          username: data.username,
          points: user.data?.points || 0,
        };

        await axios.put("/api/update-wallet-data", {
          wallet: wallet!.publicKey,
          field: "telegram",
          value: telegramData,
        });

        if (!user.data) {
          setUserStatus(UserStatus.noAccount);
          setUserData((prev: any) => ({
            ...prev,
            telegram: telegramData,
          }));
          return;
        }

        setUserStatus(UserStatus.noTwitter);
        setUserData((prev: any) => ({
          ...prev,
          telegram: telegramData,
        }));
      },
      async (val: any) => {
        await axios.post("/api/log-data", {
          data: val,
        });
      },
    );
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center mt-8">
      <div className="md::max-w-[40%] max-w-[90%]">
        <h3 className="text-center text-white font-goudy font-normal mb-12">
          Connect to Telegram
        </h3>
        <p className="text-center">
          Thanks for connecting your wallet. Now let’s link your Telegram
          account to this Solana wallet.
        </p>
      </div>

      <div className="mt-8">
        <button
          className="bg-[#CD068E] py-4 px-4 rounded-md flex items-center"
          onClick={executeLogin}
        >
          <TelegramIcon />
          <p className="text-white text-lg ml-2">Connect Telegram Account</p>
        </button>
      </div>
    </div>
  );
};

export default ConnectedWOAccount;
