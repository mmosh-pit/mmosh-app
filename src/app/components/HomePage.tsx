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
        <CommunitiesList />

        <div className="w-full flex justify-between mt-8">
          <MembersList />

          <CoinsList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
