import * as React from "react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

import HamburgerIcon from "@/assets/icons/HamburgerIcon";
import { isDrawerOpen } from "@/app/store";

const MobileDrawer = () => {
  const router = useRouter();
  const [_, setIsDrawerOpen] = useAtom(isDrawerOpen);

  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label htmlFor="my-drawer" className="btn drawer-button" onClick={() => setIsDrawerOpen(true)}>
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
            <p
              className="text-base text-white mb-2 cursor-pointer"
              onClick={() => router.replace("/")}
            >
              Home
            </p>

            <a href="https://www.mmosh.ai" className="text-base text-white mt-2 cursor-pointer">Website</a>
          </div>
          <div className="h-[1px] w-[90%] bg-white mt-4" />
          <div className="flex flex-col mt-4">
            <p className="text-lg font-bold mb-8">My MMOSH Account</p>

            <div className="flex my-4" id="">
              <p className="text-base text-white">Bags</p>
              <p className="text-base text-white mx-2">•</p>

              <div id="coming-soon-mobile-wrapper">
                <p id="coming-soon-mobile" className="text-base">
                  Coming Soon
                </p>
              </div>
            </div>

            <div className="flex my-4">
              <p className="text-base text-white">Send</p>
              <p className="text-base text-white mx-2">•</p>

              <div id="coming-soon-mobile-wrapper">
                <p id="coming-soon-mobile" className="text-base">
                  Coming Soon
                </p>
              </div>
            </div>

            <div className="flex my-4">
              <p className="text-base text-white">Swap</p>
              <p className="text-base text-white mx-2">•</p>

              <div id="coming-soon-mobile-wrapper">
                <p id="coming-soon-mobile" className="text-base">
                  Coming Soon
                </p>
              </div>
            </div>

            <div className="flex my-4">
              <p className="text-base text-white">Create</p>
              <p className="text-base text-white mx-2">•</p>

              <div id="coming-soon-mobile-wrapper">
                <p id="coming-soon-mobile" className="text-base">
                  Coming Soon
                </p>
              </div>
            </div>

            <div className="flex my-4">
              <p className="text-base text-white">Airdrop</p>
              <p className="text-base text-white mx-2">•</p>

              <div id="coming-soon-mobile-wrapper">
                <p id="coming-soon-mobile" className="text-base">
                  Coming Soon
                </p>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-base text-white font-bold">Settings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
