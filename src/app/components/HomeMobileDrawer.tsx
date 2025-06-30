import * as React from "react";
import { useAtom } from "jotai";

import HamburgerIcon from "@/assets/icons/HamburgerIcon";
import { isDrawerOpen } from "@/app/store";

type Props = {
  belowHeroRef: React.RefObject<HTMLDivElement>;
  howItWorksSection: React.RefObject<HTMLDivElement>;
  whySection: React.RefObject<HTMLDivElement>;
  founderSection: React.RefObject<HTMLDivElement>;
  testimonialsSection: React.RefObject<HTMLDivElement>;
  safeSection: React.RefObject<HTMLDivElement>;
};

const HomeMobileDrawer = ({
  belowHeroRef,
  howItWorksSection,
  whySection,
  founderSection,
  testimonialsSection,
  safeSection,
}: Props) => {
  const [_, setIsDrawerOpen] = useAtom(isDrawerOpen);

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
              onClick={() =>
                belowHeroRef.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Overview
            </a>

            <div className=" my-6" />

            <a
              className="text-base text-white cursor-pointer"
              onClick={() =>
                howItWorksSection.current?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              How it Works
            </a>

            <div className=" my-6" />

            <a
              className="text-base text-white cursor-pointer"
              onClick={() =>
                whySection.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Why Join?
            </a>

            <div className=" my-6" />

            <a
              className="text-base text-white cursor-pointer"
              onClick={() =>
                founderSection.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              From our Founder
            </a>

            <div className=" my-6" />
            <a
              className="text-base text-white cursor-pointer"
              onClick={() =>
                testimonialsSection.current?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Testimonials
            </a>

            <div className=" my-6" />
            <a
              className="text-base text-white cursor-pointer"
              onClick={() =>
                safeSection.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Safety
            </a>

            <div className="my-6" />
            <a
              className="text-base text-white cursor-pointer"
              href="https://docs.kinshipbots.com"
              target="_blank"
            >
              Docs
            </a>
          </div>

          <div className="h-[1px] w-[90%] bg-white mt-4" />
        </div>
      </div>
    </div>
  );
};

export default HomeMobileDrawer;
