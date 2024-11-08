import * as React from "react";
import { useAtom } from "jotai";
import axios from "axios";
import TelegramIcon from "../../assets/icons/TelegramIcon";
import { UserStatus, data, status } from "../store";
import ArrowIcon from "@/assets/icons/ArrowIcon";
import useWallet from "@/utils/wallet";

const ConnectedWOAccount = () => {
  const wallet = useWallet();
  const intervalRef = React.useRef<NodeJS.Timeout>();
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
    );
  };

  const checkForTelegramAccount = React.useCallback(async () => {
    const user = await axios.get(
      `/api/get-wallet-data?wallet=${wallet!.publicKey.toString()}`,
    );

    if (user.data) {
      if (user.data.telegram) {
        setUserStatus(UserStatus.noTwitter);
        clearInterval(intervalRef.current);
      }
    }
  }, []);

  const skipTelegram = React.useCallback(async () => {
    const telegramData = {};

    await axios.put("/api/update-wallet-data", {
      wallet: wallet!.publicKey,
      field: "telegram",
      value: telegramData,
    });

    setUserStatus(UserStatus.noTwitter);
    setUserData((prev: any) => ({
      ...prev,
      twitter: telegramData,
    }));
  }, []);

  const startChecking = React.useCallback(() => {
    const interval = setInterval(() => {
      checkForTelegramAccount();
    }, 2000);

    intervalRef.current = interval;
  }, []);

  return (
    <>
      <div className="relative w-full h-full flex flex-col justify-center items-center mt-8">
        <div className="md::max-w-[40%] max-w-[90%]">
          <h3 className="text-center text-white font-goudy font-normal mb-12">
            Connect to Telegram
          </h3>
          <p className="text-center">
            Thanks for connecting your wallet. Now let’s link your Telegram
            account, and you'll{" "}
            <span id="onboarding-points-gradient">earn 200 points</span>
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

        <p className="text-center mt-12 md:max-w-[60%] max-w-[85%]">
          If the automatic connection fails and you’re stuck on this page, go to
          the bot and connect manually with the Connect Apps command.
        </p>

        <div>
          <a
            onClick={startChecking}
            type="button"
            className="bg-[#1D1E62] py-4 px-8 rounded-md flex items-center mt-4"
            href="https://t.me/MMOSHBot"
            target="_blank"
          >
            <p className="text-white text-lg ml-2">Connect Manually</p>
          </a>
        </div>
      </div>
      <div
        className="flex items-center absolute bottom-[5vmax] right-[10vmax] cursor-pointer"
        onClick={skipTelegram}
      >
        <p className="pr-4 font-normal font-goudy">Skip</p>
        <ArrowIcon />
      </div>
    </>
  );
};

export default ConnectedWOAccount;
