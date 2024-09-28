import * as React from "react";
import { useAtom } from "jotai";

import CoinsTable from "./CoinDirectory/CoinsTable";
import SearchBar from "./CoinDirectory/SearchBar";
import Graphics from "./Home/Graphics";
import { selectedCoinsMode } from "../store/home";
import CoinsList from "./Home/CoinsList";

const HomePage = () => {
  // const [currentUser] = useAtom(data);
  // const [isDrawerShown] = useAtom(isDrawerOpen);

  const [coinsMode] = useAtom(selectedCoinsMode);

  return (
    <div className="background-content flex flex-col max-h-full pt-20 px-12 w-full">
      <Graphics />

      <div className="mt-8">
        <SearchBar />
      </div>

      <div className="w-full mt-8">
        {coinsMode === "list" ? <CoinsTable /> : <CoinsList />}
      </div>
    </div>
  );

  // return (
  //   <div
  //     className={`w-full min-h-screen flex flex-col items-center background-content ${
  //       isDrawerShown ? "z-[-1]" : ""
  //     } mix-blend-hard-light`}
  //   >
  //     <Banner />
  //     <div className="self-center md:max-w-[50%] max-w-[80%]">
  //       <h5 className="text-center text-white font-goudy font-normal mb-[3vmax] mt-[1vmax]">
  //         {currentUser?.profile?.name
  //           ? `Welcome Home, ${currentUser?.profile?.name}`
  //           : "Howdy Stranger!"}
  //       </h5>
  //
  //       <p className="text-center text-base">
  //         {currentUser?.profile?.name
  //           ? "A MMOSH is a decentralized, permissionless and composable virtual world available through various access devices and software platforms"
  //           : "Welcome to MMOSH, the social protocol for connected communities. Make Money Fun!"}
  //       </p>
  //     </div>
  //
  //     <div className="lg:w-[20%] md:w-[30%] sm:w-[40%] w-[50%] self-center flex justify-center my-8">
  //       <HomeSearch placeholder="Type your search terms" />
  //     </div>
  //
  //     <div className="flex flex-col w-full px-12">
  //       <div className="w-full flex md:flex-row flex-col justify-between mt-8 overflow-y-auto md:max-h-[1000px]">
  //         <ProjectsList />
  //         <CommunitiesList />
  //       </div>
  //
  //       <div className="w-full flex md:flex-row flex-col justify-between mt-8 overflow-y-auto md:max-h-[600px] pb-12 py-8">
  //         <MembersList />
  //
  //         <CoinsList />
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default HomePage;
