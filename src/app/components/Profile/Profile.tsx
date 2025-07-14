"use client";
import * as React from "react";
import useConnection from "@/utils/connection";
import axios from "axios";
import { useAtom } from "jotai";
import Image from "next/image";

import { init } from "@/app/lib/firebase";
import { UserStatus, data, profileFilter, status } from "@/app/store";
import { User } from "@/app/models/user";

import { Connectivity as Community } from "@/anchor/community";
import * as anchor from "@coral-xyz/anchor";
import { web3Consts } from "@/anchor/web3Consts";
import { pinFileToShadowDriveUrl } from "@/app/lib/uploadFileToShdwDrive";
import { calcNonDecimalValue } from "@/anchor/curve/utils";
import useWallet from "@/utils/wallet";
import ProfileFilters from "./ProfileFilters";
import GuildList from "../GuildList";
import internalClient from "@/app/lib/internalHttpClient";

const Profile = ({ username }: { username: any }) => {
  const rendered = React.useRef(false);
  const wallet = useWallet();
  const [_, setUserStatus] = useAtom(status);
  const [selectedFilter] = useAtom(profileFilter);

  const connection = useConnection();

  const [userData, setUserData] = React.useState<User>();
  const [loader, setLoader] = React.useState(false);
  const [statusMsg, setStatusMsg] = React.useState("");
  const [connectionStatus, setConnectionStatus] = React.useState(0);
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
      result.data?.profile.connection ? result.data.profile.connection : 0,
    );
  }, [username, currentUser]);

  const isMyProfile = currentUser?.profilenft === userData?.profilenft;

  React.useEffect(() => {
    setUserStatus(UserStatus.fullAccount);
    if (!username) return;
    getUserData();
  }, [username, currentUser]);

  React.useEffect(() => {
    if (!userData) return;
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
              external_url: "https://kinshipbots.com",
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
            await internalClient.put("/api/connections/update-wallet-data", {
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
      await internalClient.post("/api/connections/send", {
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
        await internalClient.post("/api/connections/send", {
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
        await internalClient.post("/api/connections/send", {
          sender: userData.wallet,
          receiver: currentUser.wallet,
          badge: "",
          status: 5,
        });
        setConnectionStatus(0);
      }
      setReqestLoader(false);
    } catch (error) {
      setReqestLoader(false);
    }
  };

  if (!userData) return <></>;

  const bannerImage =
    userData.profile.banner !== ""
      ? userData.profile.banner
      : userData.guest_data.banner !== ""
        ? userData.guest_data.banner
        : "https://storage.googleapis.com/mmosh-assets/default_banner.png";

  const profileImage =
    userData.profile.image !== ""
      ? userData.profile.image
      : userData.guest_data.picture;

  return (
    <div className="background-content-full-bg flex flex-col">
      <div className="flex flex-col bg-[#181747] backdrop-blur-[6px] rounded-md relative mx-16 rounded-xl px-3 pt-3 pb-12">
        <div className="h-[500px] m-4 mb-0 overflow-hidden relative">
          <Image
            src={bannerImage}
            alt="banner"
            className="w-full rounded-lg"
            layout="fill"
          />
        </div>

        <div className="relative mx-8 mb-4">
          <div className="w-[220px] h-[220px] absolute top-[-80px]">
            <Image
              src={profileImage}
              alt="Project"
              className="rounded-lg"
              layout="fill"
            />
          </div>
          <div className="lg:pl-[250px] mt-20 lg:mt-0">
            <div className="lg:flex justify-between items-end mb-4">
              <div className="flex flex-col mt-4 max-w-[60%]">
                <div className="flex items-center mb-4">
                  <h5 className="font-bold text-white text-lg capitalize">
                    {userData.profile.displayName !== ""
                      ? userData.profile.displayName
                      : userData.guest_data.displayName !== ""
                        ? userData.guest_data.displayName
                        : userData.name}
                  </h5>
                  <span className="font-bold text-lg text-white mx-2">•</span>
                  <p className="text-base">
                    {userData.profile.name !== ""
                      ? `${userData.profile.name} ${userData.profile.lastName ?? ""}`
                      : `${userData.guest_data.name} ${userData.guest_data.lastName ?? ""}`}
                  </p>

                  <p className="ml-4 text-base text-[#FF00AE]">
                    @
                    {userData.profile.username !== ""
                      ? userData.profile.username
                      : userData.guest_data.username}
                  </p>

                  <div
                    className={`px-4 py-1 ${!!userData.profilenft ? "creator-btn" : "guest-btn"} rounded-md ml-6`}
                  >
                    <p
                      className={`${!!userData.profilenft ? "text-black" : "text-white"} text-base`}
                    >
                      {!!userData.profilenft ? "Creator" : "Guest"}
                    </p>
                  </div>
                </div>

                <p className="text-sm">
                  {userData.profile.bio !== ""
                    ? userData.profile.bio
                    : userData.guest_data.bio}
                </p>
              </div>
            </div>

            <div className="flex flex-col">
              <p className="text-base text-white font-bold">Earnings</p>
              <div className="flex justify-start items-start mt-2">
                <div className="flex flex-col justify-center items-center bg-[#3C39BE33] bg-opacity-50 p-2 rounded-lg">
                  <p className="text-white text-xs font-bold">Creator</p>
                  <p className="text-white text-xs">00.00USDC</p>
                </div>

                <div className="mx-1" />

                <div className="flex flex-col justify-center items-center bg-[#3C39BE33] bg-opacity-50 p-2 rounded-lg">
                  <p className="text-white text-xs font-bold">Promoter</p>
                  <p className="text-white text-xs">00.00USDC</p>
                </div>

                <div className="mx-1" />

                <div className="flex flex-col justify-center items-center bg-[#3C39BE33] bg-opacity-50 p-2 rounded-lg">
                  <p className="text-white text-xs font-bold">Total</p>
                  <p className="text-white text-xs">00.00USDC</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ProfileFilters isGuest={!userData.profilenft} />

        {!!userData.profilenft && (
          <>
            {selectedFilter === 1 && (
              <GuildList
                profilenft={userData.profilenft}
                userName={
                  userData.profile.username !== ""
                    ? userData.profile.username
                    : userData.guest_data.username
                }
                isMyProfile={isMyProfile}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
