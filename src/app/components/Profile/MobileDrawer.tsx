import * as React from "react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

import HamburgerIcon from "@/assets/icons/HamburgerIcon";
import { data, isDrawerOpen, settings } from "@/app/store";

const MobileDrawer = () => {
  const router = useRouter();
  const [_, setIsDrawerOpen] = useAtom(isDrawerOpen);
  const [currentUser] = useAtom(data);
  const [isOnSettings, setIsOnSettings] = useAtom(settings);

  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label
          htmlFor="my-drawer"
          className="btn drawer-button"
          onClick={() => setIsDrawerOpen(true)}
        >
          <HamburgerIcon />
        </label>
      </div>

      <div className="drawer-side z-10">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
          onClick={() => setIsDrawerOpen(false)}
        ></label>
        <div className="flex flex-col menu p-4 w-80 min-h-full bg-[#09073A] text-base-content">
          <div className="flex flex-col">
            <a
              className="text-base text-white cursor-pointer"
              onClick={() => {
                router.push("/");
              }}
            >
              Coins
            </a>

            <a
              className="text-base text-white cursor-pointer"
              onClick={() => {
                router.push("/create/create_profile");
              }}
            >
              Members
            </a>

            <a
              className="text-base text-white cursor-pointer"
              onClick={() => router.push("/create/projects")}
            >
              Projects
            </a>

            <a
              className="text-base text-white cursor-pointer"
              onClick={() => router.push("/communities")}
            >
              Communities
            </a>

            <a
              className="text-base text-white cursor-pointer"
              onClick={() => {
                router.push("/");
              }}
            >
              Rewards
            </a>

            <a
              className="text-base text-white cursor-pointer"
              onClick={() => {
                router.push("/atm");
              }}
            >
              ATM
            </a>

            {currentUser?.profilenft && (
              <a
                className="text-base text-white cursor-pointer"
                onClick={() => {
                  if (isOnSettings) return setIsOnSettings(false);
                  router.push(`/${currentUser?.profile.username}`);
                }}
              >
                My Profile
              </a>
            )}

            <a
              className="text-base text-white cursor-pointer"
              onClick={() => {
                router.push("/");
              }}
            >
              Training
            </a>
          </div>
          <div className="h-[1px] w-[90%] bg-white mt-4" />
          <div className="flex flex-col mt-4">
            <p className="text-lg font-bold mb-8">My MMOSH Account</p>

            <div className="flex my-4">
              <p className="text-base text-white">Send</p>
              <p className="text-base text-white mx-2">•</p>

              <div id="coming-soon-mobile-wrapper">
                <p id="coming-soon-mobile" className="text-base">
                  Coming Soon
                </p>
              </div>
            </div>

            {currentUser?.telegram?.id && (
              <div className="mt-8" onClick={() => setIsOnSettings(true)}>
                <p className="text-base text-white font-bold">Settings</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
