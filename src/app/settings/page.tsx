"use client";
import { useAtom } from "jotai";
import * as React from "react";

import { appPrivateKey, appPublicKey, isAuth } from "../store";
import CopyIcon from "@/assets/icons/CopyIcon";
import { useRouter } from "next/navigation";

const Settings = () => {
  const router = useRouter();
  const [isUserAuthenticated] = useAtom(isAuth);

  const [isPrivateKeyVisible, setIsPrivateKeyVisible] = React.useState(false);
  const [privateKey] = useAtom(appPrivateKey);
  const [publicKey] = useAtom(appPublicKey);
  const [isTooltipShown, setIsTooltipShown] = React.useState(false);

  const [isTooltip2Shown, setIsTooltip2Shown] = React.useState(false);

  const copyToClipboard = React.useCallback(
    async (text: string, publicKey = false) => {
      if (publicKey) {
        setIsTooltip2Shown(true);
      } else {
        setIsTooltipShown(true);
      }
      await navigator.clipboard.writeText(text);

      setTimeout(() => {
        if (publicKey) {
          setIsTooltip2Shown(false);
        } else {
          setIsTooltipShown(false);
        }
      }, 2000);
    },
    [],
  );

  React.useEffect(() => {
    if (!isUserAuthenticated) {
      router.replace("/login");
    }
  }, [isUserAuthenticated]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full flex justify-center mt-16 mb-8">
        <p className="text-lg text-white font-bold font-goudy">Settings</p>
      </div>

      <div className="flex flex-col ml-20">
        <div className="my-2">
          <p className="text-base text-white font-goudy font-bold">
            App Wallet
          </p>
        </div>

        <div className="flex md:flex-row flex-col">
          <div className="lg:w-[30%] md:w-[45%] sm:w-[80%] w-[90%] flex flex-col">
            <div className="my-2">
              <p className="text-base text-white">Public Key</p>
            </div>

            <div className="w-full min-h-[8vmax] bg-[#030007] bg-opacity-[0.33] rounded-md p-8">
              <div className="flex flex-col bg-[#02001A] rounded-md p-8">
                <div className="ml-4 mb-4">
                  <p className="text-base text-white font-goudy">
                    Show Public Key
                  </p>
                </div>

                <div className="flex min-h-[4vmax] relative border-[1px] border-[#1B1B1B] rounded-md p-4">
                  <p className="text-sm word-break-text">{publicKey}</p>
                  <div
                    className="cursor-pointer ml-4 mt-8"
                    onClick={() => copyToClipboard(publicKey, true)}
                  >
                    {isTooltip2Shown && (
                      <div className="absolute z-10 mb-20 inline-block rounded-lg bg-gray-900 px-3 py-4ont-medium text-white shadow-sm dark:bg-gray-700">
                        Copied!
                      </div>
                    )}
                    <CopyIcon />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:ml-12 md:mt-0 mt-12 lg:w-[30%] md:w-[45%] sm:w-[80%] w-[90%] flex flex-col">
            <div className="my-2">
              <p className="text-base text-white">Private Key</p>
            </div>

            <div className="w-full min-h-[8vmax] bg-[#030007] bg-opacity-[0.33] rounded-md p-8">
              <div className="flex flex-col bg-[#02001A] rounded-md p-8">
                <div className="ml-4 mb-4">
                  <p className="text-base text-white font-goudy">
                    Show Private Key
                  </p>
                </div>

                <div className="flex min-h-[4vmax] relative border-[1px] border-[#1B1B1B] rounded-md p-4">
                  <div
                    className={`${!isPrivateKeyVisible && "filter blur-lg"}`}
                  >
                    <p className="text-sm word-break-text">{privateKey}</p>
                  </div>
                  {isPrivateKeyVisible && (
                    <div
                      className="cursor-pointer ml-4 mt-8"
                      onClick={() => copyToClipboard(privateKey)}
                    >
                      {isTooltipShown && (
                        <div className="absolute z-10 mb-20 inline-block rounded-lg bg-gray-900 px-3 py-4ont-medium text-white shadow-sm dark:bg-gray-700">
                          Copied!
                        </div>
                      )}
                      <CopyIcon />
                    </div>
                  )}
                </div>

                <label>*Never share your Private Key</label>

                <button
                  className="relative bg-[#CD068E] py-4 px-4 rounded-md mt-4"
                  onClick={() => setIsPrivateKeyVisible(!isPrivateKeyVisible)}
                >
                  <p className="text-base text-white">
                    {!isPrivateKeyVisible ? "Show" : "Hide"}
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
