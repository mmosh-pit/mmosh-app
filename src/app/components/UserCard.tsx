import Image from "next/image";
import * as React from "react";
import axios from "axios";

import { User } from "../models/user";
import TwitterDarkIcon from "@/assets/icons/TwitterDarkIcon";
import TelegramDarkIcon from "@/assets/icons/TelegramDarkIcon";
import { Connection } from "@solana/web3.js";
import { useAtom } from "jotai";
import { data } from "../store";

import * as anchor from "@coral-xyz/anchor";
import { pinFileToShadowDriveUrl } from "@/app/lib/uploadFileToShdwDrive";
import { calcNonDecimalValue } from "@/anchor/curve/utils";
import { web3Consts } from "@/anchor/web3Consts";
import { Connectivity as Community } from "@/anchor/community";
import EmptyHeartSvg from "./Profile/EmptyHeartSvg";
import HeartSvg from "./Profile/HeartSvg";
import LinkedHeartSvg from "./Profile/LinkedHeartSvg";
import InBoundHeart from "./Profile/InBoundHeart";
import { FrostWallet } from "@/utils/frostWallet";

type Props = {
  user: User;
  isHome: boolean;
  wallet?: FrostWallet;
  currentuser?: User;
  connection: Connection;
};

const UserCard = ({ user, wallet, currentuser, connection }: Props) => {
  const rendered = React.useRef(false);
  const [rank, setRank] = React.useState(0);

  const [loader, setLoader] = React.useState(false);
  const [statusMsg, setStatusMsg] = React.useState("");
  const [connectionStatus, setConnectionStatus] = React.useState(0);
  const [hasRequest, setHasRequest] = React.useState(false);
  const [___, setCurrentUser] = useAtom(data);
  const [requestloader, setReqestLoader] = React.useState(false);

  const getRankData = React.useCallback(async () => {
    if (user.profilenft) {
      const result = await axios.get(
        `/api/get-member-rank?nft=${user.profilenft}`,
      );

      setRank(result.data.rank);
    } else {
      const result = await axios.get(
        `/api/get-rank-data?user=${user.telegram?.id}`,
      );

      setRank(result.data.rank);
    }
  }, [user]);

  React.useEffect(() => {
    if (!rendered.current) {
      getRankData();
      rendered.current = true;
    }
  }, []);

  React.useEffect(() => {
    console.log(" user.profile.connection", user.profile.connection);
    setConnectionStatus(user.profile.connection ? user.profile.connection : 0);
    setHasRequest(user.profile.request ? user.profile.request : false);
  }, [user.profilenft]);

  const sendConnectionRequest = async () => {
    // 0 - no connection
    // 1 - requested
    // 2 - following
    // 3 - follower
    // 4 - linked
    // 5 - has invite no connection

    if (!wallet || !currentuser) {
      return;
    }

    let connectionnft;
    let connectionbadge;
    let communityConnection: Community;
    const env = new anchor.AnchorProvider(connection, wallet, {
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
          if (!currentuser.profile.connectionnft) {
            setStatusMsg("Initiating...");
            const projectKeyPair = anchor.web3.Keypair.generate();
            communityConnection = new Community(
              env,
              web3Consts.programID,
              projectKeyPair.publicKey,
            );

            let connectionBody = {
              name: currentuser.profile.username + " Connection",
              symbol: "CONNECTIONS",
              description: currentuser.profile.bio,
              image:
                "https://shdw-drive.genesysgo.net/FuBjTTmQuqM7pGR2gFsaiBxDmdj8ExP5fzNwnZyE2PgC/heart_on_fire.jpg",
              enternal_url:
                process.env.NEXT_PUBLIC_APP_MAIN_URL +
                "/" +
                currentuser.profile.username,
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
              name: currentuser.profile.username,
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
              name: "Connection from " + currentuser.profile.username,
              symbol: "CONNECTIONS",
              description:
                currentuser.profile.username +
                " cordially invites you to link hearts on the MMOSH. Please feel free to link back.",
              image:
                "https://shdw-drive.genesysgo.net/FuBjTTmQuqM7pGR2gFsaiBxDmdj8ExP5fzNwnZyE2PgC/heart_on_fire.jpg",
              external_url: "https://kinshipbots.com",
              minter: currentuser.profile.name,
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
              wallet: currentuser.wallet,
            });
            currentuser.profile.connectionnft = connectionnft;
            currentuser.profile.connectionnft = connectionbadge;
            setCurrentUser(currentuser);
          } else {
            connectionnft = currentuser.profile.connectionnft;
            connectionbadge = currentuser.profile.connectionbadge;
            communityConnection = new Community(
              env,
              web3Consts.programID,
              new anchor.web3.PublicKey(currentuser.profile.connectionnft),
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
            address: new anchor.web3.PublicKey(user.wallet),
          });
          if (userbalance == 0) {
            setStatusMsg("Sending...");
            let res1;
            res1 = await communityConnection.transferBadge({
              amount: 1,
              subscriptionToken: connectionbadge,
              receiver: user.wallet,
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
        nextStatus = user.profile.isprivate ? 0 : 1;
        if (user.profile.isprivate) {
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
        sender: currentuser.wallet,
        receiver: user.wallet,
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
    if (!currentuser) {
      return;
    }
    try {
      setReqestLoader(true);
      if (type === "accept") {
        await axios.post("/api/connections/send", {
          sender: user.wallet,
          receiver: currentuser.wallet,
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
          sender: user.wallet,
          receiver: currentuser.wallet,
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

  const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));

  React.useEffect(() => {
    console.log("current user ", connectionStatus);
  }, [connectionStatus]);

  return (
    <div
      className="flex bg-[#030007] bg-opacity-40 px-4 py-4 rounded-2xl"
      id={user.profilenft && "member-container-home"}
    >
      <div className="self-center max-w-[30%] mr-8">
        <div className="relative w-[6vmax] h-[6vmax]">
          <Image
            src={user.profile.image}
            alt="Profile Image"
            className="rounded-full"
            layout="fill"
          />
        </div>
      </div>

      <div className="w-full flex flex-col">
        <div>
          <p className="text-white text-lg">
            {user.profile.name} •{" "}
            <span className="text-gray-500">
              {user.profilenft ? "Member" : "Guest"}
            </span>
            {currentuser && (
              <>
                {wallet &&
                  wallet.publicKey.toBase58() != user.wallet &&
                  currentuser.profilenft &&
                  !loader && (
                    <>
                      {(connectionStatus == 0 || connectionStatus == 5) && (
                        <span
                          className="cursor-pointer ml-2.5 mt-1"
                          onClick={sendConnectionRequest}
                        >
                          <EmptyHeartSvg />
                        </span>
                      )}

                      {(connectionStatus == 1 || connectionStatus == 2) && (
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
              </>
            )}
          </p>
          <p className="text-base">@{user.profile.username}</p>
        </div>

        <div className="my-4">
          <p className="text-white text-base text-with-ellipsis">
            {user.profile.bio}
          </p>
          <a
            className="text-[#FF00C7] text-base"
            href={`${process.env.NEXT_PUBLIC_APP_MAIN_URL}/${user.profile.username}`}
          >
            kinship.codes/{user.profile.username}
          </a>
        </div>

        <div>
          {user.telegram?.username && (
            <div className="flex items-center">
              <TelegramDarkIcon />

              <a
                target="_blank"
                href={`https://t.me/${user.telegram.username}`}
                className="text-base ml-4 underline text-[#9493B2]"
              >
                https://t.me/{user.telegram.username}
              </a>
            </div>
          )}

          {user.twitter?.username && (
            <div className="flex items-center mt-2">
              <TwitterDarkIcon />

              <a
                target="_blank"
                href={`https://twitter.com/${user.twitter.username}`}
                className="text-base ml-4 underline text-[#9493B2]"
              >
                https://twitter.com/{user.twitter.username}
              </a>
            </div>
          )}
        </div>

        {user.profile.request && (
          <div className="flex justify-end">
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

        <div className="flex justify-start">
          <div className="flex bg-[#434E59] bg-opacity-50 px-2 md:px-4 py-2 rounded-3xl mt-4">
            <p className="text-white text-xs">Royalties: {user.royalty || 0}</p>
          </div>

          <div className="lg:mx-4 md:mx-2 mx-1" />

          <div className="flex bg-[#434E59] bg-opacity-50 px-2 md:px-4 py-2 rounded-3xl mt-4">
            <p className="text-white text-xs">
              Seniority: {user.profile.seniority || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
