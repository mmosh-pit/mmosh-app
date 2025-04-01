"use client";

import * as React from "react";
import { isDrawerOpen } from "@/app/store";
import { useAtom } from "jotai";
import axios from "axios";

import Button from "@/app/components/common/Button";
import { userWeb3Info } from "@/app/store";
import * as anchor from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Connectivity as ProjectConn } from "@/anchor/community";
import { Connectivity as UserConn } from "@/anchor/user";
import { web3Consts } from "@/anchor/web3Consts";
import AgentPageInfo from "@/app/components/Project/AgentPageInfo";

const defaultRoleData: any = [
  {
    label: "Founder",
    value: "Founder",
    data: [],
    enabled: true,
  },
  {
    label: "Owner",
    value: "Owner",
    data: [],
    enabled: true,
  },
  {
    label: "Admin",
    value: "Admin",
    data: [],
    enabled: true,
  },
  {
    label: "Treasurer",
    value: "Treasurer",
    data: [],
    enabled: true,
  },
  {
    label: "Connector",
    value: "Connector",
    data: [],
    enabled: true,
  },
  {
    label: "Partner",
    value: "Partner",
    data: [],
    enabled: true,
  },
  {
    label: "Producer",
    value: "Producer",
    data: [],
    enabled: true,
  },
  {
    label: "Contributor",
    value: "Contributor",
    data: [],
    enabled: true,
  },
];

const Project = ({ params }: { params: { symbol: string } }) => {
  const connection = useConnection();
  const wallet = useAnchorWallet();
  const [profileInfo] = useAtom(userWeb3Info);
  const [profile, setProfile] = React.useState("");
  const [projectLoading, setProjectLoading] = React.useState(true);
  const [projectDetail, setProjectDetail] = React.useState<any>(null);
  const [creatorInfo, setCreatorInfo] = React.useState<any>(null);
  const [isOwner, setOwner] = React.useState(false);
  const [roles, setRoles] = React.useState<any>([...defaultRoleData]);

  const [projectInfo, setProjectInfo] = React.useState<any>({
    profiles: [],
    activationTokens: [],
    activationTokenBalance: 0,
    totalChild: 0,
    profilelineage: {
      promoter: "",
      promoterprofile: "",
      scout: "",
      scoutprofile: "",
      recruiter: "",
      recruiterprofile: "",
      originator: "",
      originatorprofile: "",
    },
    generation: "",
    invitationPrice: 0,
    mintPrice: 0,
  });

  const [showMsg, setShowMsg] = React.useState(false);
  const [msgClass, setMsgClass] = React.useState("");
  const [msgText, setMsgText] = React.useState("");

  const [isDrawerShown] = useAtom(isDrawerOpen);

  React.useEffect(() => {
    getProjectDetailFromAPI();
  }, [params.symbol]);

  React.useEffect(() => {
    if (wallet && projectDetail) {
      getUserProfileInfo();
    }
  }, [wallet, projectDetail]);

  const getProjectDetailFromAPI = async () => {
    try {
      setProjectLoading(true);
      const listResult = await axios.get(
        `/api/project/detail?symbol=${params.symbol}`,
      );

      const user = await axios.get(
        `/api/get-wallet-data?wallet=${listResult.data.project.creator}`,
      );

      let newRole = [...defaultRoleData];

      newRole = updateRoleData("Founder", [user.data], newRole);

      for (let index = 0; index < listResult.data.profiles.length; index++) {
        const element = listResult.data.profiles[index];
        newRole = updateRoleData(element.role, element.profiles, newRole);
      }

      setRoles(newRole);

      setProjectDetail(listResult.data);
    } catch (error) {
      setProjectLoading(false);
      setProjectDetail(null);
    }
  };

  const updateRoleData = (type: any, values: any, newRoles: any) => {
    for (let index = 0; index < newRoles.length; index++) {
      const element = roles[index];
      if (element.value == type) {
        for (let i = 0; i < values.length; i++) {
          newRoles[index].data.push(values[i]);
        }
      }
    }
    return newRoles;
  };

  const getUserProfileInfo = async () => {
    if (!wallet) {
      return;
    }
    setProjectLoading(true);
    const env = new anchor.AnchorProvider(connection.connection, wallet, {
      preflightCommitment: "processed",
    });

    anchor.setProvider(env);
    let projectConn: ProjectConn = new ProjectConn(
      env,
      web3Consts.programID,
      new anchor.web3.PublicKey(projectDetail.project.key),
    );
    let projectInfo = await projectConn.getProjectUserInfo(
      projectDetail.project.key,
    );
    let tokenInfo = await projectConn.metaplex.nfts().findByMint({
      mintAddress: new anchor.web3.PublicKey(projectDetail.project.key),
    });
    let creator = tokenInfo.creators[0].address.toBase58();
    let userInfo = await getUserData(creator);
    setCreatorInfo(userInfo);

    if (projectInfo.profiles.length > 0) {
      if (projectInfo.profiles[0].address == projectDetail.project.key) {
        setOwner(true);
      } else {
        setOwner(false);
      }
    }

    setProjectInfo(projectInfo);
    await getProfileInfo();
  };

  const getProfileInfo = async () => {
    if (!wallet) {
      return;
    }
    const env = new anchor.AnchorProvider(connection.connection, wallet, {
      preflightCommitment: "processed",
    });
    let userConn: UserConn = new UserConn(env, web3Consts.programID);
    const profileInfo = await userConn.getUserInfo();
    setProfile(profileInfo.profiles[0].address);
    setProjectLoading(false);
  };

  // const createMessage = (message: any, type: any) => {
  //   window.scrollTo(0, 0);
  //   setMsgText(message);
  //   setMsgClass(type);
  //   setShowMsg(true);
  //   setTimeout(() => {
  //     setShowMsg(false);
  //   }, 4000);
  // };

  // const passAction = async () => {
  //   if (!profileInfo) {
  //     createMessage(
  //       "Hey! We checked your wallet is not connected",
  //       "warning-container",
  //     );
  //     return;
  //   }
  //
  //   if (!wallet) {
  //     createMessage(
  //       "Hey! We checked your wallet is not connected",
  //       "warning-container",
  //     );
  //     return;
  //   }
  //
  //   if (profileInfo?.solBalance < 0) {
  //     createMessage(
  //       <p>
  //         Hey! We checked your wallet and you don’t have enough SOL for the gas
  //         fees. Get some Solana and try again!
  //       </p>,
  //       "warning-container",
  //     );
  //     return;
  //   }
  //
  //   let tolBalance = profileInfo?.mmoshBalance;
  //
  //   if (tolBalance < projectInfo.mintPrice / 1000_000_000) {
  //     createMessage(
  //       "Hey! We checked your wallet and you don’t have enough to mint. Get some MMOSH here and try again!",
  //       "warning-container",
  //     );
  //     return;
  //   }
  //
  //   if (projectInfo.invitationPrice > 0) {
  //     if (projectInfo.activationTokens.length == 0) {
  //       createMessage(
  //         "Hey! We checked your wallet and you don’t have activation token to mint. Get Activation token and try again!",
  //         "warning-container",
  //       );
  //       return;
  //     }
  //   }
  //
  //   try {
  //     setPassSubmit(true);
  //     const genesisProfile = projectDetail.project.key;
  //     const env = new anchor.AnchorProvider(connection.connection, wallet, {
  //       preflightCommitment: "processed",
  //     });
  //     let projectConn: ProjectConn = new ProjectConn(
  //       env,
  //       web3Consts.programID,
  //       new anchor.web3.PublicKey(projectDetail.project.key),
  //     );
  //     setPassButtonStatus("Preparing Metadata...");
  //     const body = {
  //       name: projectDetail.project.name,
  //       symbol: projectDetail.project.symbol,
  //       description: projectDetail.project.desc,
  //       image: projectDetail.project.image,
  //       enternal_url: process.env.NEXT_PUBLIC_APP_MAIN_URL,
  //       family: "MMOSH",
  //       collection: "MMOSH Pass Collection",
  //       attributes: [
  //         {
  //           trait_type: "Project",
  //           value: projectDetail.project.key,
  //         },
  //         {
  //           trait_type: "Primitive",
  //           value: "Pass",
  //         },
  //         {
  //           trait_type: "MMOSH",
  //           value: "Genesis MMOSH",
  //         },
  //         {
  //           trait_type: "Seniority",
  //           value: "0",
  //         },
  //       ],
  //     };
  //
  //     // get originator name
  //     if (projectInfo.profilelineage.originator.length > 0) {
  //       let originator: any = await getUserName(
  //         projectInfo.profilelineage.originator,
  //       );
  //       if (originator != "") {
  //         body.attributes.push({
  //           trait_type: "Creator",
  //           value: originator,
  //         });
  //       } else {
  //         body.attributes.push({
  //           trait_type: "Creator",
  //           value: projectInfo.profilelineage.originator,
  //         });
  //       }
  //       body.attributes.push({
  //         trait_type: "Creator_Profile",
  //         value: projectInfo.profilelineage.originatorprofile,
  //       });
  //     }
  //
  //     const shadowHash: any = await pinFileToShadowDrive(body);
  //     if (shadowHash === "") {
  //       setPassSubmit(false);
  //       createMessage(
  //         "We’re sorry, there was an error while trying to prepare meta url. please try again later.",
  //         "danger-container",
  //       );
  //       return;
  //     }
  //     const passMetaURI = shadowHash;
  //
  //     setPassButtonStatus("Minting Pass...");
  //
  //     console.log("params", {
  //       name: projectDetail.project.name,
  //       symbol: projectDetail.project.symbol,
  //       uriHash: passMetaURI,
  //       genesisProfile: genesisProfile,
  //       commonLut: projectDetail.project.lut,
  //     });
  //
  //     console.log("profile ", profile);
  //     let res;
  //     if (projectInfo.invitationPrice > 0) {
  //       const activationToken = new anchor.web3.PublicKey(
  //         projectInfo.activationTokens[0].activation,
  //       );
  //       res = await projectConn.mintPass(
  //         {
  //           name: projectDetail.project.name,
  //           symbol: projectDetail.project.symbol,
  //           uriHash: passMetaURI,
  //           activationToken,
  //           genesisProfile,
  //           commonLut: projectDetail.project.lut,
  //         },
  //         profile,
  //       );
  //     } else {
  //       if (projectInfo.mintPrice > 0) {
  //         res = await projectConn.mintGuestPass(
  //           {
  //             name: projectDetail.project.name,
  //             symbol: projectDetail.project.symbol,
  //             uriHash: passMetaURI,
  //             genesisProfile,
  //             commonLut: projectDetail.project.lut,
  //           },
  //           profile,
  //         );
  //       } else {
  //         res = await projectConn.mintFreePass(
  //           {
  //             name: projectDetail.project.name,
  //             symbol: projectDetail.project.symbol,
  //             uriHash: passMetaURI,
  //             genesisProfile,
  //             commonLut: projectDetail.project.lut,
  //           },
  //           profile,
  //         );
  //       }
  //     }
  //
  //     if (res.Ok) {
  //       setPassButtonStatus("Waiting for confirmations...");
  //       await delay(15000);
  //       createMessage(
  //         "Congrats! You have minted your Pass successfully.",
  //         "success-container",
  //       );
  //       await getProjectDetailFromAPI();
  //     } else {
  //       createMessage(
  //         "We’re sorry, there was an error while trying to mint your Pass. Check your wallet and try again.",
  //         "danger-container",
  //       );
  //     }
  //
  //     setPassSubmit(false);
  //     setPassButtonStatus("Mint");
  //   } catch (error) {
  //     console.log("error ", error);
  //     createMessage(
  //       "We’re sorry, there was an error while trying to mint your Pass. Check your wallet and try again.",
  //       "danger-container",
  //     );
  //     setPassSubmit(false);
  //     setPassButtonStatus("Mint");
  //   }
  // };

  const getUserData = async (address: any) => {
    try {
      const result = await axios.get(`/api/get-wallet-data?wallet=${address}`);
      if (result) {
        if (result.data) {
          if (result.data.profile) {
            return result.data.profile;
          }
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  return (
    <>
      {showMsg && (
        <div
          className={
            "message-container text-white text-center text-header-small-font-size py-5 px-3.5 " +
            msgClass
          }
        >
          {msgText}
        </div>
      )}
      <div
        className={`background-content-full-bg flex flex-col ${isDrawerShown ? "z-[-1]" : ""}`}
      >
        {projectDetail && (
          <h4 className="text-white self-center text-xl py-7 capitalize">
            {projectDetail.project.name}
          </h4>
        )}
        <div className="flex flex-col bg-[#181747] backdrop-blur-[6px] rounded-md relative mx-16 rounded-xl mb-16 p-3">
          <div className="h-64 m-4 mb-0 overflow-hidden">
            {projectDetail && (
              <img
                src={projectDetail.project.image}
                alt="Project"
                className="w-full rounded-lg"
              />
            )}
          </div>

          <div className="relative mx-8 mb-0">
            <div className="absolute top-[-60px]">
              {projectDetail && (
                <img
                  src={projectDetail.project.image}
                  alt="Project"
                  className="w-[120px] h-[120px] object-cover rounded-lg"
                />
              )}
            </div>
            <div className="lg:pl-[140px] mt-20 lg:mt-0">
              <div className="lg:flex justify-between items-end mb-4">
                {projectDetail && (
                  <div className="flex flex-col mt-4 max-w-[60%]">
                    <div className="flex items-center">
                      <h5 className="font-bold text-white text-lg capitalize">
                        {projectDetail.project.name}
                      </h5>
                      <span className="font-bold text-lg text-white mx-2">
                        •
                      </span>
                      <p className="text-base">
                        {projectDetail.project.symbol.toUpperCase()}
                      </p>

                      {creatorInfo && (
                        <div className="ml-4 bg-[#21005EB2] border-lg px-3 py-1 rounded-lg">
                          {creatorInfo.username}
                        </div>
                      )}
                    </div>

                    <p className="text-sm">{projectDetail.project.desc}</p>
                  </div>
                )}
                <div className="flex items-center">
                  <Button
                    isLoading={false}
                    size="small"
                    title={"Mute"}
                    action={() => {
                      // passAction();
                    }}
                    isPrimary={false}
                  />

                  <div className="mx-4" />

                  <Button
                    isLoading={false}
                    size="small"
                    title={"Activate"}
                    action={() => {
                      // passAction();
                    }}
                    isPrimary
                  />
                </div>
              </div>
            </div>
          </div>

          {projectDetail?.project && (
            <AgentPageInfo agentKey={projectDetail.project.key} roles={roles} />
          )}
        </div>
      </div>
    </>
  );
};

export default Project;
