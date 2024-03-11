import { useAtom } from "jotai";
import * as React from "react";

import { data } from "../store";
import axios from "axios";
import CloseIcon from "@/assets/icons/CloseIcon";

const BotBanner = () => {
  const [hasBotAccount, setHasBotAccount] = React.useState(true);
  const [currentUser] = useAtom(data);

  const checkForBotAccount = React.useCallback(async () => {
    const result = await axios.get(
      `/api/check-bot-account?telegramId=${currentUser?.telegram?.id}`,
    );

    if (result.data) {
      setHasBotAccount(true);
      return;
    }

    setHasBotAccount(false);
  }, [currentUser]);

  React.useEffect(() => {
    if (currentUser) {
      checkForBotAccount();
    }
  }, [currentUser]);

  if (hasBotAccount || !currentUser) return <></>;

  return (
    <a className="w-full relative" target="_blank" href="https://t.me/MMOSHBot">
      <div
        className="w-full flex justify-between items-center py-2"
        id="bot-banner-container"
      >
        <div className="w-[3vmax]"></div>
        <p className="text-base">
          Activate our{" "}
          <span className="text-base underline cursor-pointer">
            Telegram Bot
          </span>{" "}
          and connect your account to join the MMOSH!
        </p>
        <div
          className="w-[3vmax] cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            setHasBotAccount(true);
          }}
        >
          <CloseIcon />
        </div>
      </div>
    </a>
  );
};

export default BotBanner;
