"use client";

import React, { useState } from "react";
import axios from "axios";
import * as anchor from "@coral-xyz/anchor";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAtom } from "jotai";
import {
  data,
  isAuth,
  isAuthModalOpen,
  isAuthOverlayOpen,
  isDrawerOpen,
  signInModalInitialStep,
  signInModal,
  userWeb3Info,
  web3InfoLoading,
} from "../store";
import MobileDrawer from "./Profile/MobileDrawer";
import { Connectivity as UserConn } from "../../anchor/user";
import { web3Consts } from "@/anchor/web3Consts";
import { Connection } from "@solana/web3.js";
import Tabs from "./Header/Tabs";
import { incomingReferAddress } from "../store/signup";
import Notification from "./Notification/Notification";
import { currentGroupCommunity } from "../store/community";
import { init } from "../lib/firebase";
import useCheckDeviceScreenSize from "../lib/useCheckDeviceScreenSize";
import useWallet from "@/utils/wallet";
import {
  bagsBalance,
  BagsCoin,
  bagsCoins,
  BagsNFT,
  bagsNfts,
  genesisProfileUser,
} from "../store/bags";
import { getPriceForPTV } from "../lib/forge/jupiter";
import { AssetsHeliusResponse } from "../models/assetsHeliusResponse";
import client from "../lib/httpClient";
import KinshipBots from "@/assets/icons/KinshipBots";
import internalClient from "../lib/internalHttpClient";
import AlertModal from "./Modal";
import MessageBanner from "./common/MessageBanner";

const SOL_ADDR = "So11111111111111111111111111111111111111112";

const USDC_COIN = process.env.NEXT_PUBLIC_USDC_TOKEN;

const MMOSH_COIN = process.env.NEXT_PUBLIC_OPOS_TOKEN;

const PASS_COLLECTION = "PASSES";
const BADGE_COLLECTION = "BADGES";
const PROFILE_COLLECTION = "PROFILES";

const Header = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const wallet = useWallet();
  const screenSize = useCheckDeviceScreenSize();

  const rendered = React.useRef(false);
  const renderedUserInfo = React.useRef(false);

  const [isLoadingLogout, setIsLoadingLogout] = useState(false);
  const [badge, setBadge] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const [_, setReferAddress] = useAtom(incomingReferAddress);
  const [__, setProfileInfo] = useAtom(userWeb3Info);
  const [___, setIsLoadingProfile] = useAtom(web3InfoLoading);
  const [isUserAuthenticated, setIsUserAuthenticated] = useAtom(isAuth);
  const [_____, setShowAuthOverlay] = useAtom(isAuthOverlayOpen);
  const [________, setIsAuthModalOpen] = useAtom(isAuthModalOpen);
  const [currentUser, setCurrentUser] = useAtom(data);
  const [isDrawerShown] = useAtom(isDrawerOpen);
  const [bags, setBags] = useAtom(bagsCoins);
  const [__________, setBagsNFTs] = useAtom(bagsNfts);
  const [___________, setTotalBalance] = useAtom(bagsBalance);
  const [____________, setHasGenesisProfile] = useAtom(genesisProfileUser);

  const [isModalOpen, setIsModalOpen] = useAtom(signInModal);
  const [initialModalStep, setInitialModalStep] = useAtom(
    signInModalInitialStep,
  );

  const [community] = useAtom(currentGroupCommunity);

  const param = searchParams.get("refer");
  const [membershipStatus, setMembershipStatus] = React.useState("na");

  React.useEffect(() => {
    if (param) {
      localStorage.setItem("refer", param);
      setReferAddress(param);
    } else {
      setReferAddress(process.env.NEXT_PUBLIC_DEFAULT_REFER_ADDRESS!);
    }
  }, [param]);

  const checkIfIsAuthenticated = React.useCallback(async () => {
    if (
      pathname === "/tos" ||
      pathname === "/privacy" ||
      pathname === "copyright" ||
      pathname === "license"
    )
      return;
    const url = `/is-auth`;

    try {
      const result = await client.get(url);

      const user = result.data?.data?.user;

      setShowAuthOverlay(!user);
      setIsAuthModalOpen(!user);
      setIsUserAuthenticated(!!user);
      setCurrentUser(user);

      if (user.onboarding_step < 4) {
        console.log("replacing because value; ", user.onboarding_step);
        router.replace("/account");
      }
    } catch (err) {
      // router.replace("/");
    }
  }, []);

  const getAllTokenAddreses = React.useCallback(async () => {
    const response = await internalClient.get("/api/get-all-coins-address");

    const data: any = response.data;

    const result: any = {};

    for (const value of data) {
      result[value.token] = true;
    }

    return result;
  }, [wallet]);

  const fetchAllBalances = React.useCallback(async () => {
    const allTokens = await getAllTokenAddreses();

    const response = await fetch(process.env.NEXT_PUBLIC_SOLANA_CLUSTER!, {
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        method: "getAssetsByOwner",
        params: {
          ownerAddress: wallet?.publicKey.toBase58(),
          displayOptions: {
            showFungible: true,
            showCollectionMetadata: true,
            showUnverifiedCollections: true,
            showNativeBalance: true,
          },
          page: 1,
          limit: 1000,
        },
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const mmoshUsdcPrice = await axios.get(
      `${process.env.NEXT_PUBLIC_JUPITER_PRICE_API}?ids=${process.env.NEXT_PUBLIC_OPOS_TOKEN},${process.env.NEXT_PUBLIC_USDC_TOKEN}`,
    );

    const USDCPrice = mmoshUsdcPrice.data?.data?.MMOSH?.price || 0;

    const res: AssetsHeliusResponse = await response.json();

    let networkCoin: BagsCoin = {
      symbol: "SOL",
      decimals: 9,
      balance: res.result.nativeBalance.lamports,
      name: "Solana",
      image:
        "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
      tokenAddress: SOL_ADDR,
      usdcPrice: Number(res.result.nativeBalance.price_per_sol.toFixed(2)),
      mmoshPrice: 0,
    };

    let stableCoin: BagsCoin | null = null;
    let nativeCoin: BagsCoin | null = null;

    const memecoins: BagsCoin[] = [];

    const exosystemCoins: BagsCoin[] = [];

    const badges: BagsNFT[] = [];

    const exosystemAssets: BagsNFT[] = [];

    const profiles: BagsNFT[] = [];
    const passes: BagsNFT[] = [];

    const nativeUsdcBalance = res.result.nativeBalance.total_price;

    let totalPriceInWallet = nativeUsdcBalance;

    for (const value of res.result.items) {
      if (value.interface === "FungibleToken") {
        if (value.token_info.decimals > 0) {
          const price = await getPriceForPTV(value.id);

          const coin = {
            name: value.content.metadata.name,
            image: value.content.links.image ?? "",
            symbol: value.content.metadata.symbol,
            balance: value.token_info.balance,
            tokenAddress: value.id,
            decimals: value.token_info.decimals,
            usdcPrice: price,
            mmoshPrice: 0,
          };

          if (value.id !== MMOSH_COIN) {
            const decimals = "1".padEnd(coin.decimals + 1, "0");

            const coinBalance = coin.balance / Number(decimals);

            totalPriceInWallet += coinBalance * price;
          }

          switch (value.id) {
            case SOL_ADDR:
              networkCoin = coin;
              break;
            case USDC_COIN:
              stableCoin = coin;
              break;
            case MMOSH_COIN:
              coin.usdcPrice = USDCPrice;
              const decimals = "1".padEnd(coin.decimals + 1, "0");
              const balance = value.token_info.balance / Number(decimals);
              coin.mmoshPrice = balance;

              totalPriceInWallet += coin.usdcPrice * balance;
              nativeCoin = coin;
              break;
            default:
              if (allTokens[value.id]) {
                memecoins.push(coin);
              } else {
                exosystemCoins.push(coin);
              }
          }
        } else {
          const badge = {
            name: value.content.metadata.name,
            image: value.content.links.image ?? "",
            symbol: value.content.metadata.symbol,
            balance: value.token_info.balance,
            tokenAddress: value.id,
            metadata: value.content.metadata,
          };
          if (value.group_definition && value.group_definition?.length > 0) {
            const collectionDefinition = value.grouping.find(
              (e) => e.group_key === "collection",
            );

            if (
              collectionDefinition?.collection_metadata?.symbol ===
              BADGE_COLLECTION
            ) {
              badges.push(badge);
            } else {
              exosystemAssets.push(badge);
            }
          }
        }
        continue;
      }

      const nft: BagsNFT = {
        name: value.content.metadata.name,
        image: value.content.links.image ?? "",
        symbol: value.content.metadata.symbol,
        balance: 1,
        tokenAddress: value.id,
        metadata: value.content.metadata,
      };

      if (nft.tokenAddress === web3Consts.genesisProfile.toBase58()) {
        setHasGenesisProfile(true);
      }

      const collectionDefinition = value.grouping.find(
        (e) => e.group_key === "collection",
      );

      if (
        collectionDefinition?.collection_metadata?.symbol === PROFILE_COLLECTION
      ) {
        profiles.push(nft);
        continue;
      }

      if (
        collectionDefinition?.collection_metadata?.symbol === PASS_COLLECTION
      ) {
        nft.parentKey = value.content.metadata.attributes?.find(
          (attr) =>
            attr.trait_type === "Community" || attr.trait_type === "Project",
        )?.value;

        passes.push(nft);
        continue;
      }
      exosystemAssets.push(nft);
    }

    setTotalBalance(totalPriceInWallet);

    setBags({
      native: nativeCoin,
      stable: stableCoin,
      network: networkCoin,
      exosystem: exosystemCoins.sort((a, b) => b.balance - a.balance),
      memecoins: memecoins.sort((a, b) => b.balance - a.balance),
    });

    setBagsNFTs({
      passes,
      profiles,
      badges,
      exosystem: exosystemAssets,
    });
  }, [wallet]);

  const getProfileInfo = async () => {
    try {
      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_CLUSTER!,
        {
          confirmTransactionInitialTimeout: 120000,
        },
      );
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

        const notificationResult = await axios.get(
          "/api/notifications?wallet=" + wallet?.publicKey.toBase58(),
        );
        setBadge(notificationResult.data.unread);
        setNotifications(notificationResult.data.data);
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
          parseInt(profileInfo.activationTokenBalance) +
          profileInfo.totalChild || 0,
        profile: {
          name: username,
          address: profileNft?.address,
          image: profileNft?.userinfo.image,
        },
      });
    } catch (err) {
      console.error("Header error: ", err);
    }

    setIsLoadingProfile(false);
  };

  React.useEffect(() => {
    if (!rendered.current) {
      init();
      rendered.current = true;
    }
  }, []);

  React.useEffect(() => {
    if (
      (!wallet || bags !== null) &&
      !["sign-up", "login", "password"].includes(pathname)
    )
      return;
    fetchAllBalances();
    checkMembershipStatus();
  }, [wallet]);

  React.useEffect(() => {
    if (
      wallet?.publicKey &&
      !renderedUserInfo.current &&
      !["sign-up", "login", "password"].includes(pathname)
    ) {
      renderedUserInfo.current = true;
      getProfileInfo();
    } else {
      setIsLoadingProfile(false);
    }
    checkIfIsAuthenticated();
  }, [wallet]);

  const resetNotification = async () => {
    await internalClient.put("/api/notifications/update", {
      wallet: wallet?.publicKey.toBase58(),
    });
    setBadge(0);
  };

  const logout = async () => {
    if (isLoadingLogout) return;

    setIsLoadingLogout(true);
    await client.delete("/logout", {});
    window.localStorage.removeItem("token");
    setIsLoadingLogout(false);

    setIsUserAuthenticated(false);
    setShowAuthOverlay(true);
  };

  const isMobileScreen = screenSize < 1200;

  if (
    pathname.includes("sign-up") ||
    pathname.includes("login") ||
    pathname.includes("password") ||
    pathname.includes("account")
  ) {
    return <></>;
  }

  if (
    pathname === "/tos" ||
    pathname === "/privacy" ||
    pathname === "/copyright" ||
    pathname === "/license" ||
    pathname === "/" ||
    (pathname === "/preview" && !isUserAuthenticated)
  ) {
    return <></>;
  }

  const checkMembershipStatus = async () => {
    let membershipInfo = await axios.get(
      "/api/membership/has-membership?wallet=" + wallet!.publicKey.toBase58(),
    );
    setMembershipStatus(membershipInfo.data);
  };

  return (
    <>
      <AlertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialStep={initialModalStep}
        isHome={pathname === "/"}
      />
      <header className="flex flex-col bg-transparent">
        <div className="w-full flex flex-col justify-center items-center py-6 md:px-20 px-8 relative">
          <div className="flex w-full justify-between items-center mx-8">
            {isMobileScreen ? (
              <div className="w-[100%] flex items-center">
                <MobileDrawer />

                <div className="mx-2" />

                <KinshipBots width={150} />
              </div>
            ) : (
              <div
                className="flex justify-start w-[100%] mr-12 cursor-pointer"
                onClick={() => {
                  if (pathname === "/" && isUserAuthenticated) {
                    setIsUserAuthenticated(false);
                    return;
                  }
                  router.push("/");
                }}
              >
                <KinshipBots />
              </div>
            )}

            {!isMobileScreen && isUserAuthenticated && <Tabs />}

            {!isUserAuthenticated &&
              pathname.includes("/bots/") &&
              !isMobileScreen && (
                <div className={`relative w-[100%] h-[80px]`}>
                  <Image
                    src="https://storage.googleapis.com/mmosh-assets/home/fd_logo.png"
                    alt="logo"
                    className="object-contain"
                    layout="fill"
                  />
                </div>
              )}

            <div className={`flex items-center justify-end w-[100%]`}>
              {/*currentUser?.profilenft && (
                <div className="dropdown pr-6 ml-4">
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
              )*/}

              {!!currentUser?.profile?.image && isUserAuthenticated && (
                <div
                  className={`relative w-[3.5vmax] md:w-[2.5vmax] h-[2.5vmax] md:mr-4 md:ml-4 ${isDrawerShown ? "z-[-1]" : ""
                    } cursor-pointer`}
                  onClick={() => {
                    router.push(`/${currentUser?.profile.username}`);
                  }}
                >
                  <Image
                    src={currentUser.profile.image}
                    alt="Profile Image"
                    className="rounded-md"
                    layout="fill"
                  />
                </div>
              )}

              {!!currentUser &&
                !currentUser?.profile?.image &&
                isUserAuthenticated && (
                  <div
                    className={`relative w-[3.5vmax] md:w-[2.5vmax] md:h-[2.5vmax] h-[3.5vmax] md:mr-4 md:ml-4 ${isDrawerShown ? "z-[-1]" : ""
                      } cursor-pointer`}
                    onClick={() => {
                      if (
                        !!currentUser?.guest_data.username &&
                        currentUser?.guest_data.username !== ""
                      ) {
                        router.push(`/${currentUser?.guest_data.username}`);
                      }
                    }}
                  >
                    <Image
                      src={
                        !!currentUser?.guest_data?.picture
                          ? currentUser!.guest_data.picture
                          : "https://storage.googleapis.com/mmosh-assets/default.png"
                      }
                      alt="Profile Image"
                      className="rounded-md"
                      layout="fill"
                    />
                  </div>
                )}

              {!isMobileScreen && isUserAuthenticated && (
                <button
                  className="relative border-[#FFFFFF47] border-[1px] bg-[#FFFFFF0F] px-4 py-2 rounded-full ml-4"
                  onClick={() => router.push("/settings")}
                >
                  <p className="lg:text-base text-xs text-white">Settings</p>
                </button>
              )}

              {!isUserAuthenticated && (
                <button
                  className="relative border-[#FFFFFF47] border-[1px] bg-[#FFFFFF0F] px-4 py-2 rounded-full ml-4"
                  onClick={() => {
                    if (pathname.includes("/bots/")) {
                      setIsModalOpen(true);
                      setInitialModalStep(0);
                      return;
                    }

                    router.push("/sign-up");
                  }}
                >
                  <p className="text-white lg:text-base text-xs text-center">
                    Sign Up
                  </p>
                </button>
              )}

              <button
                className="relative bg-[#CD068E] px-4 py-2 rounded-full ml-4"
                disabled={isLoadingLogout}
                onClick={() => {
                  if (isUserAuthenticated) {
                    logout();
                    return;
                  }

                  if (pathname.includes("/bots/")) {
                    setIsModalOpen(true);
                    setInitialModalStep(2);
                    return;
                  }

                  router.push("/login");
                }}
              >
                {isLoadingLogout ? (
                  <span className="loading loading-spinner loading-lg bg-[#CD068E]"></span>
                ) : (
                  <p className="lg:text-base text-xs text-white">
                    {isUserAuthenticated ? "Logout" : "Log In"}
                  </p>
                )}
              </button>
            </div>
          </div>
        </div>

        {pathname.includes("/bots/") && (
          <MessageBanner
            type="info"
            message="Welcome to Full Disclosure NOW! You are cordially invited to participate in the beta test of our AI Bot. This is a pre-release system for test purposes only, so please excuse any issues you may encounter."
          />
        )}

        {pathname.includes("/communities/") && community !== null && (
          <div
            className={`self-center lg:max-w-[50%] md:max-w-[60%] max-w-[75%] relative w-full flex justify-center items-end mt-12 pb-4 ${isDrawerShown ? "z-[-1]" : "z-0"
              }`}
          >
            <div
              className={`flex flex-col justify-center items-center ${isDrawerShown && "z-[-1]"
                } py-20`}
            >
              <h2 className="text-center">{community.name}</h2>

              <p className="text-base my-4">{community.description}</p>
            </div>
          </div>
        )}
        {membershipStatus === "expired" && (
          <div
            className="cursor-pointer"
            onClick={() => {
              router.push("/create/profile");
            }}
          >
            <MessageBanner
              type="error"
              message="Your membership is expired. pls upgrade"
            />
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
