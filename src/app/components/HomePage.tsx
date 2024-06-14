import * as React from "react";
import { useAtom } from "jotai";

import { data, isDrawerOpen } from "../store";
import Banner from "./Banner";
import MembersList from "./Home/MembersList";
import CoinsList from "./Home/CoinsList";
import CommunitiesList from "./Home/CommunitiesList";

const HomePage = () => {
  const [currentUser] = useAtom(data);
  const [isDrawerShown] = useAtom(isDrawerOpen);

  return (
    <div
      className={`w-full min-h-screen flex flex-col items-center background-content ${
        isDrawerShown ? "z-[-1]" : ""
      }`}
    >
      <Banner />
      <div className="self-center md:max-w-[50%] max-w-[80%]">
        <h5 className="text-center text-white font-goudy font-normal mb-[3vmax] mt-[1vmax]">
          Welcome Home, {currentUser?.profile?.name}
        </h5>

        <p className="text-center text-white text-lg">
          A MMOSH is a decentralized, permissionless and composable virtual
          world available through various access devices and software platforms
        </p>
      </div>

      <div className="flex flex-col w-full mt-8 px-12">
        <div id="communities" className="w-full flex flex-col mb-4">
          <div className="w-full flex justify-between px-4">
            <p className="text-white text-base">
              Community<span className="text-gray-500"></span>
            </p>

            <a className="underline text-white cursor-pointer text-base">
              Go to Community Directory
            </a>
          </div>
          <CommunitiesList />
        </div>

        <div className="w-full flex justify-between mt-8">
          <div className="flex w-full flex-col" id="members">
            <div className="w-full flex justify-between px-4">
              <p className="text-white text-base">
                Members <span className="text-gray-500"></span>
              </p>

              <a className="underline text-white cursor-pointer text-base">
                Go to Membership Directory
              </a>
            </div>
            <MembersList />
          </div>

          <div className="flex w-full flex-col" id="coins">
            <div className="w-full flex justify-between px-4">
              <p className="text-white text-base">
                Coins <span className="text-gray-500"></span>
              </p>

              <a className="underline text-white cursor-pointer text-base">
                Go to Coin Directory
              </a>
            </div>
            <CoinsList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
