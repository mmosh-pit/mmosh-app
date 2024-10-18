import * as React from "react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

import HamburgerIcon from "@/assets/icons/HamburgerIcon";
import { data, isDrawerOpen, settings } from "@/app/store";
import SimpleArrowDown from "@/assets/icons/SimpleArrowDown";
import SimpleArrowUp from "@/assets/icons/SimpleArrowUp";

const MobileDrawer = () => {
  const router = useRouter();
  const [_, setIsDrawerOpen] = useAtom(isDrawerOpen);
  const [currentUser] = useAtom(data);
  const [isOnSettings, setIsOnSettings] = useAtom(settings);

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

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
                router.push("/coins");
              }}
            >
              Coins
            </a>

            <div className="my-2" />

            <a
              className="text-base text-white cursor-pointer"
              onClick={() => {
                router.push("/members");
              }}
            >
              Members
            </a>

            <div className="my-2" />

            <a
              className="text-base text-white cursor-pointer"
              onClick={() => router.push("/projects")}
            >
              Projects
            </a>

            <div className="my-2" />

            <a
              className="text-base text-white cursor-pointer"
              onClick={() => router.push("/communities")}
            >
              Communities
            </a>

            <div className="my-2" />

            <a
              className="text-base text-white cursor-pointer"
              onClick={() => {
                router.push("/rewards");
              }}
            >
              Rewards
            </a>

            <div className="my-2" />

            <a
              className="text-base text-white cursor-pointer"
              onClick={() => {
                router.push("/atm");
              }}
            >
              ATM
            </a>

            <div className="my-2" />

            <div
              className="flex flex-col cursor-pointer"
              onClick={() => setIsCreateOpen(!isCreateOpen)}
            >
              <div className="flex items-center">
                <p className="text-base text-white font-semibold">Create</p>

                <div className="ml-1">
                  {isCreateOpen ? <SimpleArrowUp /> : <SimpleArrowDown />}
                </div>
              </div>

              {isCreateOpen && (
                <div className="flex flex-col p-2 my-4">
                  <p
                    className="text-sm text-white mb-2"
                    onClick={() => router.push("/create/profile")}
                  >
                    Profile
                  </p>
                  <p
                    className="text-sm text-white mb-2"
                    onClick={() => router.push("/create/create_invitation")}
                  >
                    Invitations
                  </p>
                  <p
                    className="text-sm text-white mb-2"
                    onClick={() => router.push("/create/coins")}
                  >
                    Coins
                  </p>
                  <p
                    className="text-sm text-white mb-2"
                    onClick={() => router.push("/communities/create")}
                  >
                    Communities
                  </p>
                  <p
                    className="text-sm text-white"
                    onClick={() => router.push("/create/create_projects")}
                  >
                    Projects
                  </p>
                </div>
              )}
            </div>

            <div className="my-2" />

            <a
              className="text-base text-white cursor-pointer"
              onClick={() => {
                router.push("/swap");
              }}
            >
              Swap
            </a>

            {currentUser?.profilenft && (
              <>
                <div className="my-2" />
                <a
                  className="text-base text-white cursor-pointer"
                  onClick={() => {
                    if (isOnSettings) return setIsOnSettings(false);
                    router.push(`/${currentUser?.profile.username}`);
                  }}
                >
                  My Profile
                </a>
              </>
            )}

            <div className="my-2" />

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
              className="text-base text-white cursor-pointer"
              onClick={() => router.replace("/create/projects/ptv")}
            >
              Pump the Vote
            </a>

            <div className="my-2" />

            <a
              onClick={() => router.replace("/create/projects/ptv/candidates")}
              className="text-base text-white cursor-pointer "
            >
              Candidates
            </a>

            <div className="my-2" />

            <a
              className="text-base text-white cursor-pointer "
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
