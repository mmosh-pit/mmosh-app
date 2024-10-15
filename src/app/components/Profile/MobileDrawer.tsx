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
        >
        </label>
        <div className="flex flex-col menu p-4 w-80 min-h-full bg-[#09073A] text-base-content">
          <div className="flex flex-col">
            <a
              className="text-base text-white cursor-pointer"
              onClick={() => {
                router.push("/coins");
              }}
            >
              Coins
            </a>

            <a
              className="text-base text-white cursor-pointer"
              onClick={() => {
                router.push("/members");
              }}
            >
              Members
            </a>

            <a
              className="text-base text-white cursor-pointer"
              onClick={() => router.push("/projects")}
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
                router.push("/rewards");
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

            <a
              className="text-base text-white cursor-pointer"
              onClick={() => {
                router.push("/swap");
              }}
            >
              Swap
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
              href="https://www.liquidhearts.club"
              target="_blank"
            >
              Training
            </a>
          </div>

          <div className="h-[1px] w-[90%] bg-white mt-4" />

          <div className="flex flex-col mt-4">
            <a
              className="text-base text-white cursor-pointer self-center"
              onClick={() => router.replace("/create/projects/ptv")}
            >
              Pump the Vote
            </a>

            <div className="mx-6" />

            <a
              onClick={() => router.replace("/create/projects/ptv/candidates")}
              className="text-base text-white cursor-pointer self-center"
            >
              Candidates
            </a>

            <div className="mx-6" />

            <a
              className="text-base text-white cursor-pointer self-center"
              onClick={() => {
                router.push("/projects/ptv/bounties");
              }}
            >
              Bounties
            </a>
          </div>

          <div className="h-[1px] w-[90%] bg-white mt-4" />
          <div className="flex flex-col mt-4">
            {currentUser?.telegram?.id && (
              <div
                className="mt-8"
                onClick={() => setIsOnSettings(true)}
              >
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
