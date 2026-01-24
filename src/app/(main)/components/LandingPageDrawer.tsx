import * as React from "react";
import { useAtom } from "jotai";

import HamburgerIcon from "@/assets/icons/HamburgerIcon";
import { isDrawerOpen } from "@/app/store";

interface Props {
    scrollWithOffset: (ref: any) => void;
    originStoryRef: any;
    kinshipIntelligenceRef: any;
    collectiveEconomicsRef: any;
    foundingCreatorsRef: any;
}

const LandingPageDrawer = ({
    scrollWithOffset,
    originStoryRef,
    kinshipIntelligenceRef,
    collectiveEconomicsRef,
    foundingCreatorsRef,
}: Props) => {
    const [, setIsDrawerOpen] = useAtom(isDrawerOpen);

    const handleClick = (action?: () => void) => {
        action?.();
        setIsDrawerOpen(false);
    };


    return (
        <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content">
                <label
                    htmlFor="my-drawer"
                    className="btn drawer-button bg-transparent border-none"
                    onClick={() => setIsDrawerOpen(true)}
                >
                    <HamburgerIcon />
                </label>
            </div>

            <div className="drawer-side z-50">
                <label
                    htmlFor="my-drawer"
                    className="drawer-overlay"
                    aria-label="close sidebar"
                    onClick={() => setIsDrawerOpen(false)}
                />

                <div className="flex flex-col menu p-8 w-80 min-h-full bg-[#09073A] text-base-content">
                    <div className="flex flex-col gap-8">
                        <label
                            htmlFor="my-drawer"
                            className="text-base text-white cursor-pointer"
                            onClick={() =>
                                handleClick(() => scrollWithOffset(originStoryRef))
                            }
                        >
                            Origin Story
                        </label>

                        <label
                            htmlFor="my-drawer"
                            className="text-base text-white cursor-pointer"
                            onClick={() => handleClick(() => scrollWithOffset(kinshipIntelligenceRef))}
                        >
                            Kinship Intelligence
                        </label>

                        <label
                            htmlFor="my-drawer"
                            className="text-base text-white cursor-pointer"
                            onClick={() => handleClick(() => scrollWithOffset(collectiveEconomicsRef))}
                        >
                            Co-op Economics
                        </label>

                        <label
                            htmlFor="my-drawer"
                            className="text-base text-white cursor-pointer"
                            onClick={() => handleClick(() => scrollWithOffset(foundingCreatorsRef))}
                        >
                            Founding Creators
                        </label>

                        <a
                            // href="https://deeper.kinshipbots.com"
                            href="https://kinship.today"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base text-white cursor-pointer"
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            Go Deeper
                        </a>
                    </div>

                    <div className="h-[1px] w-[90%] bg-white mt-8" />
                </div>
            </div>
        </div>
    );
};

export default LandingPageDrawer;
