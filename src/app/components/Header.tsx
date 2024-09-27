"use client";

import React, { useState } from "react";
import axios from "axios";
import * as anchor from "@coral-xyz/anchor";
import { usePathname, useSearchParams } from "next/navigation";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import { walletAddressShortener } from "../lib/walletAddressShortener";
import { useAtom } from "jotai";
import {
  UserStatus,
  data,
  incomingWallet,
  isDrawerOpen,
  settings,
  status,
  userWeb3Info,
  web3InfoLoading,
} from "../store";
import useCheckMobileScreen from "../lib/useCheckMobileScreen";
import MobileDrawer from "./Profile/MobileDrawer";
import { Connectivity as UserConn } from "../../anchor/user";
import { web3Consts } from "@/anchor/web3Consts";
import { Connection } from "@solana/web3.js";
import { pageCommunity } from "../store/community";
import Tabs from "./Header/Tabs";
import ProjectTabs from "./Header/ProjectTabs";
import { incomingReferAddress } from "../store/signup";
import Notification from "./Notification/Notification";

const Header = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const wallet = useAnchorWallet();

  const renderedUserInfo = React.useRef(false);
  const [_, setReferAddress] = useAtom(incomingReferAddress);
  const [__, setProfileInfo] = useAtom(userWeb3Info);
  const [___, setIsLoadingProfile] = useAtom(web3InfoLoading);
  const [userStatus] = useAtom(status);
  const [community] = useAtom(pageCommunity);
  const [currentUser, setCurrentUser] = useAtom(data);
  const [isOnSettings, setIsOnSettings] = useAtom(settings);
  const [incomingWalletToken, setIncomingWalletToken] = useAtom(incomingWallet);
  const [isDrawerShown] = useAtom(isDrawerOpen);
  const isMobileScreen = useCheckMobileScreen();
  const [badge, setBadge] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const param = searchParams.get("refer");

  React.useEffect(() => {
    if (param) {
      setReferAddress(param);
    } else {
      setReferAddress(process.env.NEXT_PUBLIC_DEFAULT_REFER_ADDRESS!);
    }
  }, [param]);

  const getHeaderBackground = React.useCallback(() => {
    let defaultClass =
      "w-full flex flex-col justify-center items-center py-6 px-8 relative z-10 ";

    if (pathname.includes("create")) {
      defaultClass += "bg-black bg-opacity-[0.56] backdrop-blur-[10px]";
    } else if (pathname !== "/" || isOnSettings) {
      defaultClass += "bg-white bg-opacity-[0.07] backdrop-blur-[2px]";
    } else if (pathname === "/" && !isOnSettings) {
      defaultClass += "bg-black bg-opacity-[0.56] backdrop-blur-[2px]";
    }

    return defaultClass;
  }, [userStatus, pathname]);

  const getProfileInfo = async () => {
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_CLUSTER!);
    const env = new anchor.AnchorProvider(connection, wallet!, {
      preflightCommitment: "processed",
    });

    setIsLoadingProfile(true);

    let userConn: UserConn = new UserConn(env, web3Consts.programID);

    const profileInfo = await userConn.getUserInfo();

    const genesis = profileInfo.activationTokens[0]?.genesis;
    const activation = profileInfo.activationTokens[0]?.activation;

    const totalMints = profileInfo.totalChild;

    let firstTime = true;

    if (profileInfo.activationTokens.length > 0) {
      if (profileInfo.activationTokens[0].activation != "") {
        firstTime = false;
      }
    }
    const totalChilds = totalMints;

    let quota = 0;

    if (totalChilds < 3) {
      quota = 10;
    } else if (totalChilds >= 3 && totalChilds < 7) {
      quota = 25;
    } else if (totalChilds >= 7 && totalChilds < 15) {
      quota = 50;
    } else if (totalChilds >= 15 && totalChilds < 35) {
      quota = 250;
    } else if (totalChilds >= 35 && totalChilds < 75) {
      quota = 500;
    } else {
      quota = 1000;
    }

    const profileNft = profileInfo.profiles[0];
    let username = "";
    if (profileNft?.address) {
      username = profileNft.userinfo.username;

      const res = await axios.get(`/api/get-user-data?username=${username}`);
      setCurrentUser(res.data);

      const notificationResult = await axios.get(
        "api/notifications?wallet=" + wallet?.publicKey.toBase58(),
      );
      setBadge(notificationResult.data.unread);
      setNotifications(notificationResult.data.data);
    } else {
      const res = await axios.get(
        `/api/get-wallet-data?wallet=${wallet?.publicKey.toBase58()}`,
      );

      setCurrentUser(res.data);
    }

    setProfileInfo({
      generation: profileInfo.generation,
      genesisToken: genesis,
      profileLineage: profileInfo.profilelineage,
      activationToken: activation,
      solBalance: profileInfo.solBalance,
      mmoshBalance: profileInfo.oposTokenBalance,
      usdcBalance: profileInfo.usdcTokenBalance,
      firstTimeInvitation: firstTime,
      quota,
      activationTokenBalance:
        parseInt(profileInfo.activationTokenBalance) + profileInfo.totalChild ||
        0,
      profile: {
        name: username,
        address: profileNft?.address,
        image: profileNft?.userinfo.image,
      },
    });
    setIsLoadingProfile(false);
  };

  React.useEffect(() => {
    if (wallet?.publicKey && !renderedUserInfo.current) {
      renderedUserInfo.current = true;
      getProfileInfo();
    } else {
      setIsLoadingProfile(false);
    }
  }, [wallet]);

  React.useEffect(() => {
    if (wallet?.publicKey && incomingWalletToken !== "") {
      (async () => {
        const result = await axios.post("/api/link-social-wallet", {
          token: incomingWalletToken,
          wallet: wallet.publicKey.toString(),
        });

        setCurrentUser(result.data);
        setIncomingWalletToken("");
      })();
    }
  }, [wallet, incomingWalletToken]);

  if (pathname.includes("sign-up") || pathname.includes("login")) {
    return <></>;
  }

  const resetNotification = async () => {
    await axios.put("api/notifications/update", {
      wallet: wallet?.publicKey.toBase58(),
    });
    setBadge(0);
  };

  return (
    <header className="flex flex-col">
      <div className={getHeaderBackground()}>
        <div className="flex w-full justify-between items-center mx-8">
          <div className="flex w-[33%] justify-start items-center">
            {isMobileScreen ? (
              <MobileDrawer />
            ) : (
              <div className="w-[33%]">
                <Image
                  src="https://storage.googleapis.com/hellbenders-public-c095b-assets/hellbendersWebAssets/logo.png"
                  alt="logo"
                  className="ml-8"
                  width={isMobileScreen ? 40 : 80}
                  height={isMobileScreen ? 40 : 80}
                />
              </div>
            )}
          </div>

          {!isMobileScreen && <Tabs />}

          <div className="flex justify-end items-center w-[33%]">
            {currentUser?.profilenft && (
              <div className="dropdown pr-6">
                <a
                  className="text-base text-white cursor-pointer relative"
                  tabIndex={0}
                  href="javascript:void(0)"
                  onClick={resetNotification}
                >
                  <img
                    src="/images/alert.png"
                    alt="notification"
                    className="max-w-4 w-4"
                  />
                  {badge > 0 && (
                    <span className="bg-[#FF0000] text-white w-6 h-6 rounded-full absolute text-center leading-6  right-[-11px] top-[-13px]">
                      {badge}
                    </span>
                  )}
                </a>
                {notifications && (
                  <div
                    className="dropdown-content z-[999999999] top-[72px]"
                    tabIndex={0}
                  >
                    <div className="w-64 bg-black bg-opacity-[0.56] backdrop-blur-[2px] p-5 max-h-96 overflow-y-auto">
                      {notifications.length > 0 && (
                        <div>
                          {notifications.map((value: any) => (
                            <Notification data={value} key={value._id} />
                          ))}
                        </div>
                      )}
                      {notifications.length == 0 && (
                        <p className="text-base">
                          You don't have any notification
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            {currentUser?.profile?.image && (
              <div
                className={`relative w-[2.5vmax] h-[2.5vmax] mr-6 ${isDrawerShown ? "z-[-1]" : ""}`}
              >
                <Image
                  src={currentUser.profile.image}
                  alt="Profile Image"
                  className="rounded-full"
                  layout="fill"
                />
              </div>
            )}

            <WalletMultiButton
              startIcon={undefined}
              style={{
                background:
                  "linear-gradient(91deg, #D858BC -3.59%, #3C00FF 102.16%)",
                padding: "0 2em",
                borderRadius: 15,
              }}
            >
              <p className="text-lg text-white">
                {wallet?.publicKey
                  ? walletAddressShortener(wallet.publicKey.toString())
                  : "Connect Wallet"}
              </p>
            </WalletMultiButton>

            {userStatus === UserStatus.fullAccount &&
              !isMobileScreen &&
              currentUser?.telegram?.id && (
                <button
                  className="relative bg-[#03002B] px-6 py-3 rounded-xl ml-6"
                  onClick={() => setIsOnSettings(true)}
                >
                  <p className="text-base text-white font-bold settings-btn">
                    Settings
                  </p>
                </button>
              )}
          </div>
        </div>
      </div>

      {!isMobileScreen && <ProjectTabs />}

      {pathname.includes("/create/communities/") && (
        <div
          className={`relative w-full flex justify-center items-end mt-12 pb-4 ${isDrawerShown ? "z-[-1]" : "z-0"}`}
        >
          <div
            className={`flex justify-center items-center ${isDrawerShown && "z-[-1]"} py-40`}
          >
            <h2 className="text-center">
              Mint this pass to join {community?.name}
            </h2>
          </div>
        </div>
      )}

      {pathname === "/" && !isOnSettings && (
        <div className="w-full flex flex-col justify-center items-center pb-4 my-16">
          <h6>Welcome Home {currentUser?.profile.name}</h6>
          <p className="text-base mt-4">
            The MMOSH is a Massively Multiplayer On-chain Shared Hallucination.
          </p>
          <p className="text-base">Make Money Fun!</p>
        </div>
      )}
    </header>
  );
};

export default Header;
