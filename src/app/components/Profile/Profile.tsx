"use client";
import * as React from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import axios from "axios";
import Image from "next/image";
import { useAtom } from "jotai";

import GuildList from "../GuildList";
import CopyIcon from "@/assets/icons/CopyIcon";
import TelegramAccount from "./TelegramAccount";
import { walletAddressShortener } from "@/app/lib/walletAddressShortener";
import DesktopNavbar from "./DesktopNavbar";
import { init } from "@/app/lib/firebase";
import { UserStatus, data, isDrawerOpen, settings, status } from "@/app/store";
import { User } from "@/app/models/user";
import useCheckMobileScreen from "@/app/lib/useCheckMobileScreen";
import { useRouter } from "next/navigation";
import HeartSvg from "./HeartSvg";
import LinkedHeartSvg from "./LinkedHeartSvg";
import EmptyHeartSvg from "./EmptyHeartSvg";

import { Connectivity as Community } from "@/anchor/community";
import * as anchor from "@coral-xyz/anchor";
import { web3Consts } from "@/anchor/web3Consts";
import { pinFileToShadowDriveUrl } from "@/app/lib/uploadFileToShdwDrive";
import { calcNonDecimalValue } from "@/anchor/curve/utils";
import InBoundHeart from "./InBoundHeart";
import EditIcon from "@/assets/icons/EditIcon";

const Profile = ({ username }: { username: any }) => {
  const isMobile = useCheckMobileScreen();
  const router = useRouter();
  const rendered = React.useRef(false);
  const wallet = useAnchorWallet();
  const [isOnSettings] = useAtom(settings);
  const [isDrawerShown] = useAtom(isDrawerOpen);
  const [isTooltipShown, setIsTooltipShown] = React.useState(false);
  const [isFirstTooltipShown, setIsFirstTooltipShown] = React.useState(false);
  const [isSecTooltipShown, setIsSecTooltipShown] = React.useState(false);
  const [userData, setUserData] = React.useState<User>();
  const [rankData, setRankData] = React.useState({
    points: 0,
    rank: 0,
  });
  const [lhcWallet, setLhcWallet] = React.useState("");
  const [_, setUserStatus] = useAtom(status);

  const connection = useConnection();

  const [loader, setLoader] = React.useState(false);
  const [statusMsg, setStatusMsg] = React.useState("");
  const [connectionStatus, setConnectionStatus] = React.useState(0);
  const [hasRequest, setHasRequest] = React.useState(false);
  const [currentUser, setCurrentUser] = useAtom(data);
  const [requestloader, setReqestLoader] = React.useState(false);

  const getUserData = React.useCallback(async () => {
    let url = `/api/get-user-data?username=${username}`;
    console.log("wallet", currentUser);
    if (currentUser) {
      url = url + "&requester=" + currentUser.wallet;
    }
    const result = await axios.get(url);

    setUserData({
      ...result.data,
    });
    setConnectionStatus(
      result.data.profile.connection ? result.data.profile.connection : 0,
    );
    setHasRequest(
      result.data.profile.request ? result.data.profile.request : false,
    );
  }, [username, currentUser]);

  const getRankData = React.useCallback(async () => {
    const result = await axios.get(
      `/api/get-rank-data?user=${userData?.telegram.id}`,
    );

    setRankData(result.data);
  }, [userData]);

  const getLhcWallet = React.useCallback(async () => {
    const result = await axios.get(
      `/api/get-lhc-address?id=${userData?.telegram.id}`,
    );

    setLhcWallet(result.data?.addressPublicKey);
  }, [userData]);

  const isMyProfile = currentUser?.profilenft === userData?.profilenft;

  const copyToClipboard = React.useCallback(
    async (text: string, textNumber: number) => {
      if (textNumber === 1) {
        setIsFirstTooltipShown(true);
      } else if (textNumber === 2) {
        setIsSecTooltipShown(true);
      } else {
        setIsTooltipShown(true);
      }
      await navigator.clipboard.writeText(text);

      setTimeout(() => {
        if (textNumber === 1) {
          setIsFirstTooltipShown(false);
        } else if (textNumber === 2) {
          setIsSecTooltipShown(false);
        } else {
          setIsTooltipShown(false);
        }
      }, 2000);
    },
    [],
  );

  React.useEffect(() => {
    console.log("username ", username);
    setUserStatus(UserStatus.fullAccount);
    if (!username) return;
    getUserData();
  }, [username, currentUser]);

  React.useEffect(() => {
    if (!userData) return;

    getRankData();
    getLhcWallet();
  }, [userData]);

  React.useEffect(() => {
    if (!rendered.current) {
      init();
      rendered.current = true;
    }
  }, []);

  const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));

  const sendConnectionRequest = async () => {
    // 0 - no connection
    // 1 - requested
    // 2 - following
    // 3 - follower
    // 4 - linked
    // 5 - has invite no connection

    if (!wallet || !currentUser || !userData) {
      return;
    }

    let connectionnft;
    let connectionbadge;
    let communityConnection: Community;
    const env = new anchor.AnchorProvider(connection.connection, wallet, {
      preflightCommitment: "processed",
    });
    anchor.setProvider(env);

    try {
      setLoader(true);
      let nextStatus;
      let nextConnectionStatus;
      if (
        connectionStatus == 0 ||
        connectionStatus == 3 ||
        connectionStatus == 5
      ) {
        if (connectionStatus != 5) {
          if (!currentUser.profile.connectionnft) {
            setStatusMsg("Initiating...");
            const projectKeyPair = anchor.web3.Keypair.generate();
            communityConnection = new Community(
              env,
              web3Consts.programID,
              projectKeyPair.publicKey,
            );

            let connectionBody = {
              name: currentUser.profile.username + " Connection",
              symbol: "CONNECTIONS",
              description: currentUser.profile.bio,
              image:
                "https://shdw-drive.genesysgo.net/FuBjTTmQuqM7pGR2gFsaiBxDmdj8ExP5fzNwnZyE2PgC/heart_on_fire.jpg",
              enternal_url:
                process.env.NEXT_PUBLIC_APP_MAIN_URL +
                "/" +
                currentUser.profile.username,
              collection: "MMOSH Pass Collection",
              attributes: [
                {
                  trait_type: "Project",
                  value: projectKeyPair.publicKey.toBase58(),
                },
              ],
            };
            const projectMetaURI: any =
              await pinFileToShadowDriveUrl(connectionBody);
            const profileMintingCost = new anchor.BN(calcNonDecimalValue(0, 9));
            const invitationMintingCost = new anchor.BN(
              calcNonDecimalValue(0, 9),
            );

            const res1: any = await communityConnection.mintGenesisPass({
              name: currentUser.profile.username,
              symbol: "CONNECT",
              uri: projectMetaURI,
              mintKp: projectKeyPair,
              input: {
                oposToken: web3Consts.usdcToken,
                profileMintingCost,
                invitationMintingCost,
                mintingCostDistribution: {
                  parent: 100 * 2,
                  grandParent: 100 * 70,
                  greatGrandParent: 100 * 20,
                  ggreatGrandParent: 100 * 5,
                  genesis: 100 * 3,
                },
                tradingPriceDistribution: {
                  seller: 100 * 2,
                  parent: 100 * 70,
                  grandParent: 100 * 20,
                  greatGrandParent: 100 * 5,
                  genesis: 100 * 3,
                },
              },
            });

            connectionnft = res1.Ok.info.profile;

            await delay(15000);
            setStatusMsg("Connecting...");
            const invitebody = {
              name: "Connection from " + currentUser.profile.username,
              symbol: "CONNECTIONS",
              description:
                currentUser.profile.username +
                " cordially invites you to link hearts on the MMOSH. Please feel free to link back.",
              image:
                "https://shdw-drive.genesysgo.net/FuBjTTmQuqM7pGR2gFsaiBxDmdj8ExP5fzNwnZyE2PgC/heart_on_fire.jpg",
              external_url: "https://liquidhearts.app",
              minter: currentUser.profile.name,
              attributes: [
                {
                  trait_type: "Project",
                  value: projectKeyPair.publicKey.toBase58(),
                },
              ],
            };
            const inviteMetaURI: any =
              await pinFileToShadowDriveUrl(invitebody);

            const res2: any = await communityConnection.initBadge({
              name: "Invitation",
              symbol: "CONNECT",
              uri: inviteMetaURI,
              profile: connectionnft,
            });
            console.log("invite result ", res2);
            connectionbadge = res2.Ok.info.subscriptionToken;
            await delay(15000);

            const params = {
              connectionnft,
              connectionbadge,
            };
            await axios.put("/api/connections/update-wallet-data", {
              value: params,
              wallet: currentUser.wallet,
            });
            currentUser.profile.connectionnft = connectionnft;
            currentUser.profile.connectionnft = connectionbadge;
            setCurrentUser(currentUser);
          } else {
            connectionnft = currentUser.profile.connectionnft;
            connectionbadge = currentUser.profile.connectionbadge;
            communityConnection = new Community(
              env,
              web3Consts.programID,
              new anchor.web3.PublicKey(currentUser.profile.connectionnft),
            );
          }
          const balance = await communityConnection.getUserBalance({
            token: connectionbadge,
            address: wallet.publicKey,
          });
          if (balance == 0) {
            setStatusMsg("Inviting...");
            let res = await communityConnection.createBadge({
              amount: 10000,
              subscriptionToken: connectionbadge,
            });
            if (res.Err) {
              setLoader(false);
              return;
            }
            await delay(15000);
          }

          const userbalance = await communityConnection.getUserBalance({
            token: connectionbadge,
            address: new anchor.web3.PublicKey(userData.wallet),
          });
          if (userbalance == 0) {
            setStatusMsg("Sending...");
            let res1;
            res1 = await communityConnection.transferBadge({
              amount: 1,
              subscriptionToken: connectionbadge,
              receiver: userData.wallet,
            });
            if (res1.Err) {
              setLoader(false);
              return;
            }
            console.log("transferBadge ", res1);
          }
        } else {
          setStatusMsg("connecting...");
        }
        nextStatus = userData.profile?.isprivate ? 0 : 1;
        if (userData.profile?.isprivate) {
          nextConnectionStatus = 1;
        } else {
          if (connectionStatus != 3) {
            nextConnectionStatus = 2;
          } else {
            nextConnectionStatus = 4;
          }
        }
      } else if (connectionStatus == 1) {
        setStatusMsg("Cancelling...");
        nextStatus = 3;
        nextConnectionStatus = 5;
      } else {
        setStatusMsg("unlinking...");
        if (connectionStatus == 4) {
          nextConnectionStatus = 3;
        } else {
          nextConnectionStatus = 0;
        }
        nextStatus = 2;
      }
      await axios.post("/api/connections/send", {
        sender: currentUser.wallet,
        receiver: userData.wallet,
        badge: connectionbadge,
        status: nextStatus,
      });
      setConnectionStatus(nextConnectionStatus);
      await delay(15000);
      setLoader(false);
    } catch (error) {
      setLoader(false);
    }
  };

  const connectionAction = async (type: any) => {
    if (!wallet || !currentUser || !userData) {
      return;
    }
    try {
      setReqestLoader(true);
      if (type === "accept") {
        await axios.post("/api/connections/send", {
          sender: userData.wallet,
          receiver: currentUser.wallet,
          badge: "",
          status: 4,
        });
        if (connectionStatus == 2) {
          setConnectionStatus(4);
        } else {
          setConnectionStatus(3);
        }
      } else {
        await axios.post("/api/connections/send", {
          sender: userData.wallet,
          receiver: currentUser.wallet,
          badge: "",
          status: 5,
        });
        setConnectionStatus(0);
      }
      setHasRequest(false);
      setReqestLoader(false);
    } catch (error) {
      setReqestLoader(false);
    }
  };

  if (!userData) return <></>;

  return (
    <div className="w-full h-screen flex flex-col">
      <div
        className={`w-full flex flex-col md:flex-row ${isMyProfile ? "lg:justify-between" : "lg:justify-around"} px-6 md:px-12 mt-16 gap-6`}
      >
        {!isMobile && isMyProfile && <DesktopNavbar user={userData} />}

        <div className={`flex-1`}>
          <p className="text-lg text-white font-bold font-goudy">
            {isMyProfile
              ? "My LHC Account"
              : `${userData?.profile?.name}'s Hideout`}
          </p>
          <div
            className="flex flex-col bg-[#6536BB] bg-opacity-20 rounded-tl-[3vmax] rounded-tr-md rounded-b-md p-4 mt-4"
            id={userData?.profilenft && "member-container"}
          >
            <div className="w-full grid" id="profile-info-image">
              <div
                className={`relative w-[8vmax] h-[8vmax] ${isDrawerShown ? "z-[-1]" : ""}`}
              >
                {userData?.profile?.image && (
                  <Image
                    src={userData?.profile?.image || ""}
                    alt="Profile Image"
                    className="rounded-full"
                    layout="fill"
                    objectFit="contain"
                  />
                )}
              </div>

              <div className="flex flex-col ml-4">
                <p className="flex text-lg text-white font-bold">
                  {userData?.profile?.name}
                  {currentUser && (
                    <>
                      {wallet &&
                        wallet.publicKey.toBase58() != userData.wallet &&
                        currentUser.profilenft &&
                        !loader && (
                          <>
                            {(connectionStatus == 0 ||
                              connectionStatus == 5) && (
                              <span
                                className="cursor-pointer ml-2.5 mt-1"
                                onClick={sendConnectionRequest}
                              >
                                <EmptyHeartSvg />
                              </span>
                            )}

                            {(connectionStatus == 1 ||
                              connectionStatus == 2) && (
                              <span
                                className="cursor-pointer ml-2.5"
                                onClick={sendConnectionRequest}
                              >
                                <HeartSvg />
                              </span>
                            )}

                            {connectionStatus == 4 && (
                              <span
                                className="cursor-pointer relative top-[-6px]"
                                onClick={sendConnectionRequest}
                              >
                                <LinkedHeartSvg />
                              </span>
                            )}

                            {connectionStatus == 3 && (
                              <span
                                className="cursor-pointer relative top-[-4px]"
                                onClick={sendConnectionRequest}
                              >
                                <InBoundHeart />
                              </span>
                            )}
                          </>
                        )}
                      {wallet &&
                        wallet.publicKey.toBase58() == userData.wallet &&
                        currentUser.profilenft &&
                        !loader && (
                          <>
                            <span
                              className="cursor-pointer ml-1 mt-1"
                              onClick={() => {
                                router.push("/create/edit-profile");
                              }}
                            >
                              <EditIcon />
                            </span>
                          </>
                        )}
                    </>
                  )}
                </p>
                <p className="text-sm">{`@${userData?.profile?.username}`}</p>
                {userData.profile?.request && (
                  <div className="flex justify-start mt-2.5">
                    {requestloader && (
                      <button className="btn btn-xs bg-[#372E4F] rounded-md text-white mx-2.5">
                        processing...
                      </button>
                    )}

                    {!requestloader && hasRequest && (
                      <>
                        <p className="text-white text-sm">Request</p>
                        <button
                          className="btn btn-xs bg-[#372E4F] rounded-md text-white mx-2.5"
                          onClick={() => {
                            connectionAction("accept");
                          }}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-xs bg-[#372E4F] rounded-md text-white"
                          onClick={() => {
                            connectionAction("reject");
                          }}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                )}
                <p className="text-base text-white mt-4 max-w-[60%] md:max-w-[80%]">
                  {userData?.profile?.bio}
                </p>

                <div className="flex items-center mt-4">
                  <a
                    className="text-base font-white underline"
                    href={`${process.env.NEXT_PUBLIC_APP_MAIN_URL}/${userData?.profile?.username}`}
                  >
                    {`liquidhearts.app/${userData?.profile?.username}`}
                  </a>

                  {!isMobile && (
                    <>
                      {lhcWallet && (
                        <div
                          className={`relative ml-4 px-4 rounded-[18px] bg-[#09073A] ${isDrawerShown ? "z-[-1]" : ""}`}
                        >
                          <div className="flex flex-col justify-center items-center">
                            <a
                              className="text-base text-white underline"
                              href={`https://xray.helius.xyz/account/${lhcWallet}?network=mainnet`}
                              target="_blank"
                            >
                              Social Wallet
                            </a>
                            <a
                              className="text-base text-white underline"
                              href={`https://xray.helius.xyz/account/${lhcWallet}?network=mainnet`}
                              target="_blank"
                            >
                              {walletAddressShortener(lhcWallet)}
                            </a>
                          </div>

                          <sup
                            className="absolute top-[-8px] right-[-8px] cursor-pointer"
                            onClick={() => copyToClipboard(lhcWallet, 1)}
                          >
                            <CopyIcon />
                            {isFirstTooltipShown && (
                              <div className="absolute z-10 mb-20 inline-block rounded-lg bg-gray-900 px-3 py-4 text-sm font-medium text-white shadow-sm dark:bg-gray-700">
                                Copied!
                              </div>
                            )}
                          </sup>
                        </div>
                      )}

                      <div
                        className={`relative ml-4 px-4 rounded-[18px] bg-[#09073A] ${isDrawerShown ? "z-[-1]" : ""}`}
                      >
                        <div className="flex flex-col items-center justify-center">
                          <a
                            className="text-base text-white underline"
                            href={`https://xray.helius.xyz/account/${userData.wallet}?network=mainnet`}
                            target="_blank"
                          >
                            Linked Wallet
                          </a>

                          <a
                            className="text-base text-white underline"
                            href={`https://xray.helius.xyz/account/${userData.wallet}?network=mainnet`}
                            target="_blank"
                          >
                            {walletAddressShortener(userData.wallet)}
                          </a>
                        </div>
                        <sup
                          className="absolute top-[-8px] right-[-8px] cursor-pointer"
                          onClick={() => copyToClipboard(userData.wallet, 2)}
                        >
                          <CopyIcon />
                          {isSecTooltipShown && (
                            <div className="absolute z-10 mb-20 inline-block rounded-lg bg-gray-900 px-3 py-4 text-sm font-medium text-white shadow-sm dark:bg-gray-700">
                              Copied!
                            </div>
                          )}
                        </sup>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {isMobile && (
              <div className="flex justify-around mt-6">
                {lhcWallet && (
                  <div
                    className={`relative ml-4 px-4 rounded-[18px] bg-[#09073A] ${isDrawerShown ? "z-[-1]" : ""}`}
                  >
                    <div className="flex flex-col justify-center items-center">
                      <a
                        className="text-base text-white underline"
                        href={`https://xray.helius.xyz/account/${lhcWallet}?network=mainnet`}
                        target="_blank"
                      >
                        Social Wallet
                      </a>
                      <a
                        className="text-base text-white underline"
                        href={`https://xray.helius.xyz/account/${lhcWallet}?network=mainnet`}
                        target="_blank"
                      >
                        {walletAddressShortener(lhcWallet)}
                      </a>
                    </div>

                    <sup
                      className="absolute top-[-0.5vmax] right-[-0.5vmax] cursor-pointer"
                      onClick={() => copyToClipboard(lhcWallet, 1)}
                    >
                      <CopyIcon />
                      {isFirstTooltipShown && (
                        <div className="absolute z-10 mb-20 inline-block rounded-lg bg-gray-900 px-3 py-4 text-sm font-medium text-white shadow-sm dark:bg-gray-700">
                          Copied!
                        </div>
                      )}
                    </sup>
                  </div>
                )}

                <div
                  className={`relative ml-4 px-4 rounded-[18px] bg-[#09073A] ${isDrawerShown ? "z-[-1]" : ""}`}
                >
                  <div className="flex flex-col items-center justify-center">
                    <a
                      className="text-base text-white underline"
                      href={`https://xray.helius.xyz/account/${userData.wallet}?network=mainnet`}
                      target="_blank"
                    >
                      Linked Wallet
                    </a>

                    <a
                      className="text-base text-white underline"
                      href={`https://xray.helius.xyz/account/${userData.wallet}?network=mainnet`}
                      target="_blank"
                    >
                      {walletAddressShortener(userData.wallet)}
                    </a>
                  </div>
                  <sup
                    className="absolute top-[-0.5vmax] right-[-0.5vmax] cursor-pointer"
                    onClick={() => copyToClipboard(userData.wallet, 2)}
                  >
                    <CopyIcon />
                    {isSecTooltipShown && (
                      <div className="absolute z-10 mb-20 inline-block rounded-lg bg-gray-900 px-3 py-4 text-sm font-medium text-white shadow-sm dark:bg-gray-700">
                        Copied!
                      </div>
                    )}
                  </sup>
                </div>
              </div>
            )}

            <div className="w-full flex justify-around mt-16">
              <TelegramAccount
                isMyProfile={isMyProfile}
                userData={userData}
                setUserData={setUserData}
              />
            </div>
          </div>
        </div>
      </div>
      <GuildList
        profilenft={userData?.profilenft}
        isMyProfile={isMyProfile}
        userName={userData?.profile?.name}
      />
    </div>
  );
};

export default Profile;
