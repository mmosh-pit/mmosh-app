import axios from "axios";
import { useAtom } from "jotai";
import React from "react";
import { UserStatus, data, status } from "../store";

const WithTelegramNoAccount = () => {
  const [_, setUserStatus] = useAtom(status);
  const [userData] = useAtom(data);

  const checkForTelegramAccount = React.useCallback(async () => {
    const user = await axios.get(
      `/api/get-bot-user?id=${userData?.telegram.id}`,
    );

    if (user.data) {
      setUserStatus(UserStatus.noTwitter);
    }
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      checkForTelegramAccount();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center mt-12">
      <div className="md::max-w-[40%] max-w-[90%] my-12">
        <h3 className="text-center text-white font-goudy font-normal mb-12">
          Activate the Bot
        </h3>
        <p className="text-center">
          Activate our Telegram bot to receive messages and guidance along your
          journey.
        </p>
      </div>

      <div className="mt-8">
        <a
          className="bg-[#CD068E] py-4 px-4 rounded-md flex items-center"
          href="https://t.me/LiquidHeartsBot"
          target="_blank"
        >
          <p className="text-white text-lg">Activate Bot</p>
        </a>
      </div>
    </div>
  );
};

export default WithTelegramNoAccount;
