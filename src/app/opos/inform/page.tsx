"use client";
import { useAtom } from "jotai";
import * as React from "react";

import { isDrawerOpen } from "../../store";
import SearchBar from "../../components/Project/Candidates/SearchBar";
import {
  BagsNFT,
  bagsCoins,
  bagsNfts,
  genesisProfileUser,
} from "../../store/bags";
import AssetCard from "../../components/Inform/AssetCard";
import axios from "axios";

const Inform = () => {
  const [hasGenesisProfile] = useAtom(genesisProfileUser);
  const [isDrawerShown] = useAtom(isDrawerOpen);
  const [bags] = useAtom(bagsCoins);
  const [nfts] = useAtom(bagsNfts);

  const [allCoins, setAllCoins] = React.useState<BagsNFT[]>([]);
  const [allProfiles, setAllProfiles] = React.useState<BagsNFT[]>([]);

  const [_, setSearchText] = React.useState("");
  const [selectedTab, setSelectedTab] = React.useState(0);

  const coins = [...(bags?.memecoins ?? []), ...(bags?.community ?? [])];

  const fetchAssetsAsGenesisUser = React.useCallback(async () => {
    const [profilesRes, coinsRes] = await Promise.all([
      axios.get("/api/get-all-profiles"),
      axios.get("/api/get-all-coins"),
    ]);

    const parsedProfiles: BagsNFT[] = [];
    const parsedCoins: BagsNFT[] = [];

    for (const data of profilesRes.data) {
      parsedProfiles.push({
        tokenAddress: data.profilenft,
        name: data.profile.name,
        image: data.profile.image,
        symbol: data.profile.username,
        balance: 1,
        metadata: {},
      });
    }

    for (const data of coinsRes.data) {
      parsedCoins.push({
        tokenAddress: data.token,
        name: data.name,
        image: data.image,
        symbol: data.symbol,
        balance: 1,
        metadata: {},
      });
    }

    setAllCoins(parsedCoins);
    setAllProfiles(parsedProfiles);
  }, []);

  React.useEffect(() => {
    if (hasGenesisProfile) {
      fetchAssetsAsGenesisUser();
    }
  }, [hasGenesisProfile]);

  return (
    <div
      className={`background-content-full-bg flex flex-col items-center ${
        isDrawerShown ? "z-[-1]" : ""
      }`}
    >
      <div className="bg-[#131245E0] flex flex-col items-center py-4 px-2 md:w-[85%] w-[95%] rounded-lg mt-8">
        <h3>Inform OPOS</h3>

        <div className="mt-6 mb-3">
          <SearchBar setSearchText={setSearchText} />
        </div>

        <div className="w-full justify-center items-center flex bg-[#09073A] px-4 py-2 rounded-md">
          <button className="mx-3" onClick={() => setSelectedTab(0)}>
            <h5
              className={`${selectedTab === 0 ? "font-bold" : "font-normal"}`}
            >
              Ecosystem
            </h5>
          </button>

          <button className="mx-3" onClick={() => setSelectedTab(1)}>
            <h5
              className={`${selectedTab === 1 ? "font-bold" : "font-normal"}`}
            >
              Projects
            </h5>
          </button>

          <button className="mx-3" onClick={() => setSelectedTab(2)}>
            <h5
              className={`${selectedTab === 2 ? "font-bold" : "font-normal"}`}
            >
              Communities
            </h5>
          </button>

          <button className="mx-3" onClick={() => setSelectedTab(3)}>
            <h5
              className={`${selectedTab === 3 ? "font-bold" : "font-normal"}`}
            >
              Coins
            </h5>
          </button>
        </div>

        <div className="w-full h-[50vh]">
          {selectedTab === 0 && (
            <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6  py-4">
              {!nfts?.profiles.length ? (
                <p className="text-white self-center text-center text-sm">
                  Nothing yet
                </p>
              ) : allProfiles.length > 0 ? (
                allProfiles.map((asset) => <AssetCard asset={asset} />)
              ) : (
                nfts.profiles.map((asset) => <AssetCard asset={asset} />)
              )}
            </div>
          )}

          {selectedTab === 1 && (
            <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 py-4">
              {!nfts?.passes.length ? (
                <p className="text-white text-center self-center text-sm">
                  Nothing yet
                </p>
              ) : (
                nfts.passes.map((asset) => <AssetCard asset={asset} />)
              )}
            </div>
          )}

          {selectedTab === 2 && (
            <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6  py-4">
              {!nfts?.passes.length ? (
                <p className="text-white text-center self-center text-sm">
                  Nothing yet
                </p>
              ) : (
                nfts.passes.map((asset) => <AssetCard asset={asset} />)
              )}
            </div>
          )}

          {selectedTab === 3 && (
            <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6  py-4">
              {!coins.length ? (
                <p className="text-white text-center self-center text-sm">
                  Nothing yet
                </p>
              ) : allCoins.length > 0 ? (
                allCoins.map((asset) => <AssetCard asset={asset} />)
              ) : (
                coins.map((asset) => <AssetCard asset={asset} />)
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inform;