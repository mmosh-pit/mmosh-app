import * as React from "react";
import RemoveIcon from "@/assets/icons/RemoveIcon";
import Button from "../common/Button";
import { data } from "@/app/store";
import { useAtom } from "jotai";
import client from "@/app/lib/httpClient";

const TelegramApp = () => {
  const [currentUser, setCurrentUser] = useAtom(data);

  const [isLoading, setIsLoading] = React.useState(false);

  const executeLogin = () => {
    console.log(window.Telegram);
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

        await client.post("/telegram", telegramData);

        setCurrentUser((prev) => ({ ...prev!, telegram: telegramData }));
      },
    );
  };

  const removeGroup = React.useCallback(async () => {
    setIsLoading(true);

    await client.delete("/telegram");

    setCurrentUser((prev) => ({ ...prev!, telegram: null }));

    setIsLoading(false);
  }, []);

  return (
    <div
      className={`flex flex-col justify-center items-center md:min-w-[60%] min-w-[80%] my-2 bg-[#03000754] backdrop-filter backdrop-blur-[8px] rounded-lg p-6 min-h-[200px] mt-12`}
    >
      {!currentUser?.telegram?.id && (
        <Button
          size="large"
          title="Connect a Telegram Account"
          isLoading={isLoading}
          action={executeLogin}
          isPrimary
        />
      )}

      {currentUser?.telegram && (
        <div className="w-full flex justify-between items-center my-2 bg-[#03000733] rounded-lg py-8 px-12 backdrop-filter backdrop-blur-[8.6px]">
          <div className="flex flex-col w-full">
            <div className="flex items-center self-end mb-2">
              <div
                className="flex items-center cursor-pointer ml-2"
                onClick={() => {
                  removeGroup();
                }}
              >
                <RemoveIcon />
                <p className="text-sm text-white font-bold ml-1">Delete</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TelegramApp;
