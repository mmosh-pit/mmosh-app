"use client";

import * as React from "react";
import {
  isAuth,
  isDrawerOpen,
  signInCurrentBot,
  signInModal,
  signInModalInitialStep,
} from "@/app/store";
import { useAtom } from "jotai";
import axios from "axios";
import Image from "next/image";
import Extension from "@/app/models/Extension";
import internalClient from "@/app/lib/internalHttpClient";

import { userWeb3Info } from "@/app/store";
import * as anchor from "@coral-xyz/anchor";
import useConnection from "@/utils/connection";
import useWallet from "@/utils/wallet";
import { Connectivity as ProjectConn } from "@/anchor/community";
import { Connectivity as UserConn } from "@/anchor/user";
import { web3Consts } from "@/anchor/web3Consts";
import AgentPageInfo from "@/app/components/Project/AgentPageInfo";
import useCheckDeviceScreenSize from "@/app/lib/useCheckDeviceScreenSize";

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
  const screenSize = useCheckDeviceScreenSize();
  const wallet = useWallet();
  const [profileInfo] = useAtom(userWeb3Info);
  const [_, setCurrentBot] = useAtom(signInCurrentBot);
  const [isAuthenticated] = useAtom(isAuth);
  const [profile, setProfile] = React.useState("");
  const [projectLoading, setProjectLoading] = React.useState(true);
  const [projectDetail, setProjectDetail] = React.useState<any>(null);
  const [creatorInfo, setCreatorInfo] = React.useState<any>(null);
  const [isOwner, setOwner] = React.useState(false);
  const [roles, setRoles] = React.useState<any>([...defaultRoleData]);

  const [__, setIsModalOpen] = useAtom(signInModal);
  const [___, setInitialModalStep] = useAtom(signInModalInitialStep);

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

  // Extension form state
  const [selectedPlatform, setSelectedPlatform] = React.useState<'linkedin' | 'bluesky' | 'x'>('linkedin');
  const [extensionForm, setExtensionForm] = React.useState({
    email: '',
    password: '',
    instructions: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitMessage, setSubmitMessage] = React.useState('');
  const [connectedAccounts, setConnectedAccounts] = React.useState<any[]>([]);
  const [selectedAccountType, setSelectedAccountType] = React.useState<'all' | 'linkedin' | 'bluesky' | 'x'>('all');

  React.useEffect(() => {
    getProjectDetailFromAPI();
    setCurrentBot(params.symbol);
    fetchConnectedAccounts();
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

  const fetchConnectedAccounts = async () => {
    try {
      const response = await internalClient.get(`/api/extension?botId=${params.symbol}&userId=${profile}`);
      if (response.status === 200) {
        setConnectedAccounts(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching connected accounts:', error);
      setConnectedAccounts([]);
    }
  };

  const isMobileScreen = screenSize < 1200;

  // Handle extension form submission
  const handleExtensionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!extensionForm.email || !extensionForm.password || !extensionForm.instructions) {
      setSubmitMessage('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const extensionData: Extension = {
        type: selectedPlatform,
        email: extensionForm.email,
        password: extensionForm.password,
        instructions: extensionForm.instructions,
        userId: profile || undefined,
        botId: params.symbol
      };

      const response = await internalClient.post('/api/extension', extensionData);
      
      if (response.status === 200) {
        setSubmitMessage('Extension connected successfully!');
        setExtensionForm({ email: '', password: '', instructions: '' });
        await fetchConnectedAccounts(); // Refresh the connected accounts list
      }
    } catch (error) {
      console.error('Error saving extension:', error);
      setSubmitMessage('Error connecting extension. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setExtensionForm(prev => ({
      ...prev,
      [field]: value
    }));
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
        <div className="flex flex-col backdrop-blur-[6px] rounded-xl relative md:mx-16 mx-4 mb-16 p-3">
          {projectDetail && (
            <div className="h-80 overflow-hidden relative">
              <Image
                src="https://storage.googleapis.com/mmosh-assets/home/fd_banner.png"
                alt="Project"
                className="w-full rounded-lg"
                layout="fill"
              />

              {isAuthenticated ||
                (isMobileScreen && (
                  <div className="absolute left-0 top-0 h-[50px] bg-[#00000080] rounded-tl-lg rounded-br-[50px] p-4 lg:w-[280px] md:w-[200px] w-[150px] lg:h-[80px]">
                    <Image
                      src="https://storage.googleapis.com/mmosh-assets/home/fd_logo.png"
                      alt="FDN"
                      layout="fill"
                      className="object-contain p-4"
                    />
                  </div>
                ))}
            </div>
          )}

          <div className="relative m-auto">
            <div className="bot-image">
              {projectDetail && (
                <Image
                  src={projectDetail.project.image}
                  alt="Project"
                  className="object-cover rounded-full"
                  layout="fill"
                />
              )}
            </div>
          </div>

          {!isMobileScreen && (
            <div className="w-full flex justify-between items-center mb-4 mt-16">
              <div className="flex flex-col mt-4 w-[33%]">
                <div className="flex items-center">
                  <div className="relative w-[80px] h-[80px]">
                    <Image
                      src="https://storage.googleapis.com/mmosh-assets/home/fd_creator.png"
                      alt="Creator"
                      layout="fill"
                    />
                  </div>

                  <div className="flex flex-col ml-8">
                    <h5 className="font-bold text-white text-lg capitalize">
                      Brian Tseng, the Solar Bee
                    </h5>

                    <div className="my-2" />

                    <p className="text-base">Creator, Full Disclosure Bot</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center w-[33%]">
                <h3 className="text-white text-2xl">FULL Disclosure NOW</h3>

                {isAuthenticated && (
                  <p className="text-white text-base mt-4">
                    FDN
                    <span className="text-white text-base mx-2">•</span>
                    BRIAN
                  </p>
                )}
              </div>

              <div className="w-[33%] flex justify-end">
                <button
                  className="rounded-full px-6 py-2 bg-[#FF00AE]"
                  onClick={() => {
                    setIsModalOpen(true);
                    setInitialModalStep(0);
                  }}
                >
                  <p className="text-base text-white">Join the movement</p>
                </button>
              </div>
            </div>
          )}

          {isMobileScreen && (
            <div className="w-full flex flex-col items-center mb-4 mt-16">
              <div className="flex flex-col items-center w-full">
                <h3 className="text-white text-2xl">FULL Disclosure NOW</h3>

                {isAuthenticated && (
                  <p className="text-white text-base mt-4">
                    FDN
                    <span className="text-white text-base mx-2">•</span>
                    BRIAN
                  </p>
                )}
              </div>

              <div className="flex justify-center mb-4 mt-6">
                <button
                  className="w-full rounded-full px-6 py-2 bg-[#FF00AE]"
                  onClick={() => {
                    setIsModalOpen(true);
                    setInitialModalStep(0);
                  }}
                >
                  <p className="text-base text-white">Join the movement</p>
                </button>
              </div>

              <div className="flex flex-col mt-2 w-full bg-[#FFFFFF08] border-[1px] border-[#FFFFFF28] rounded-lg py-4 px-4">
                <div className="flex items-center">
                  <div className="relative w-[80px] h-[80px]">
                    <Image
                      src="https://storage.googleapis.com/mmosh-assets/home/fd_creator.png"
                      alt="Creator"
                      layout="fill"
                    />
                  </div>

                  <div className="flex flex-col ml-4">
                    <h5 className="font-bold text-white text-lg capitalize">
                      Brian Tseng, the Solar Bee
                    </h5>

                    <div className="my-1" />

                    <p className="text-base">Creator, Full Disclosure Bot</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div
            className={`bg-[#FFFFFF08] border-[1px] border-[#FFFFFF28] rounded-lg py-4 w-full flex flex-col items-center ${isMobileScreen ? "mt-6" : "mt-12"} mb-8`}
          >
            <h4 className="text-lg text-white font-bold text-center">
              What if the future you always dreamed of was already here?
            </h4>

            <div className="my-2" />

            <p className="text-base leading-[40px] text-white text-center lg:max-w-[65%] max-w-[90%]">
              Join the movement to reveal suppressed tech, hidden programs, and
              the roadmap to humanity’s next evolution. Access cutting-edge
              information, tools, intel, and transformative content from a
              global network of Starseeds, visionaries, and truth-seekers. Stay
              connected to the latest breakthroughs in healing, consciousness,
              and disclosure as we awaken a new era of truth and liberation
              across the universe.
            </p>
          </div>

          {projectDetail?.project && isAuthenticated && (
            <AgentPageInfo agentKey={projectDetail.project.key} roles={roles} />
          )}

          {/* Social Media Connection Section */}
          <div className="flex space-x-3 justify-around">
            <div className="flex space-x-2">
                  <button 
                    type="button"
                    onClick={() => setSelectedPlatform('x')}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      selectedPlatform === 'x' 
                        ? 'border-white text-white bg-white/10' 
                        : 'border-gray-600 text-gray-400 hover:text-white hover:border-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      <span>X</span>
                    </div>
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => setSelectedPlatform('bluesky')}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      selectedPlatform === 'bluesky' 
                        ? 'border-white text-white bg-white/10' 
                        : 'border-gray-600 text-gray-400 hover:text-white hover:border-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      <span>Bluesky</span>
                    </div>
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => setSelectedPlatform('linkedin')}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      selectedPlatform === 'linkedin' 
                        ? 'border-white text-white bg-white/10' 
                        : 'border-gray-600 text-gray-400 hover:text-white hover:border-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                        <span className="text-[#2d1b69] font-bold text-xs">in</span>
                      </div>
                      <span>LinkedIn</span>
                    </div>
                  </button>
                  </div>
                </div>
              </div>
              
              
            <div className="rounded-xl p-8">
              {/* Platform Selection Tabs */}
              <div className="items-center mb-8 ">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    {selectedPlatform === 'linkedin' && (
                      <span className="text-[#2d1b69] font-bold text-sm">in</span>
                    )}
                    {selectedPlatform === 'bluesky' && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    )}
                    {selectedPlatform === 'x' && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-white font-semibold">
                    {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}
                  </span>
                </div>
                
 

              {/* Connection Form */}
              <div className="bg-[#070529] rounded-xl p-8 mt-2">
                <h3 className="text-white text-xl font-semibold text-center mb-8">
                  What {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} accounts do you want to share with your agent?
                </h3>
                
                <form onSubmit={handleExtensionSubmit}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Credentials */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Email or phone
                        </label>
                        <input
                          type="text"
                          placeholder="Email or phone"
                          value={extensionForm.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-4 py-3 bg-[#1a0b2e] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#FF00AE] transition-colors"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Password
                        </label>
                        <input
                          type="password"
                          placeholder="Password"
                          value={extensionForm.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="w-full px-4 py-3 bg-[#1a0b2e] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#FF00AE] transition-colors"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Right Column - Instructions */}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Instructions
                      </label>
                      <textarea
                        placeholder="Enter instructions for the Agent to follow when interacting through this account."
                        rows={6}
                        value={extensionForm.instructions}
                        onChange={(e) => handleInputChange('instructions', e.target.value)}
                        className="w-full px-4 py-3 bg-[#1a0b2e] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#FF00AE] transition-colors resize-none"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Submit Message */}
                  {submitMessage && (
                    <div className={`text-center mt-4 ${
                      submitMessage.includes('successfully') ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {submitMessage}
                    </div>
                  )}
                  
                  {/* Connect Button */}
                  <div className="flex justify-center mt-8">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#FF00AE] hover:bg-[#e6009a] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                    >
                      {isSubmitting ? 'Connecting...' : 'Connect'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Connected Accounts Display Section */}
            {connectedAccounts.length > 0 && (
              <div className="mt-8">
                <div className="bg-[#070529] rounded-xl p-8">
                  <h3 className="text-white text-xl font-semibold text-center mb-6">
                    Connected Accounts
                  </h3>
                  
                  {/* Account Type Filter */}
                  <div className="flex justify-center mb-6">
                    <div className="flex space-x-2 bg-[#1a0b2e] rounded-lg p-1">
                      <button
                        onClick={() => setSelectedAccountType('all')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          selectedAccountType === 'all'
                            ? 'bg-[#FF00AE] text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        All ({connectedAccounts.length})
                      </button>
                      <button
                        onClick={() => setSelectedAccountType('linkedin')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          selectedAccountType === 'linkedin'
                            ? 'bg-[#FF00AE] text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        LinkedIn ({connectedAccounts.filter(acc => acc.type === 'linkedin').length})
                      </button>
                      <button
                        onClick={() => setSelectedAccountType('x')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          selectedAccountType === 'x'
                            ? 'bg-[#FF00AE] text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        X ({connectedAccounts.filter(acc => acc.type === 'x').length})
                      </button>
                      <button
                        onClick={() => setSelectedAccountType('bluesky')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          selectedAccountType === 'bluesky'
                            ? 'bg-[#FF00AE] text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Bluesky ({connectedAccounts.filter(acc => acc.type === 'bluesky').length})
                      </button>
                    </div>
                  </div>

                  {/* Accounts List */}
                  <div className="space-y-4">
                    {connectedAccounts
                      .filter(account => selectedAccountType === 'all' || account.type === selectedAccountType)
                      .map((account, index) => (
                        <div key={index} className="bg-[#1a0b2e] border border-gray-600 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                {account.type === 'linkedin' && (
                                  <span className="text-[#2d1b69] font-bold text-sm">in</span>
                                )}
                                {account.type === 'x' && (
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                  </svg>
                                )}
                                {account.type === 'bluesky' && (
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                  </svg>
                                )}
                              </div>
                              <div>
                                <h4 className="text-white font-medium capitalize">
                                  {account.type} Account
                                </h4>
                                <p className="text-gray-400 text-sm">
                                  {account.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-green-400 text-sm font-medium">
                                Connected
                              </span>
                              <button
                                onClick={() => {
                                  // Add delete functionality here
                                  console.log('Delete account:', account.id);
                                }}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          {account.instructions && (
                            <div className="mt-3 pt-3 border-t border-gray-600">
                              <p className="text-gray-300 text-sm">
                                <span className="font-medium">Instructions:</span> {account.instructions}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>

                  {connectedAccounts.filter(account => selectedAccountType === 'all' || account.type === selectedAccountType).length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-400">
                        No {selectedAccountType === 'all' ? '' : selectedAccountType} accounts connected yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>        
      </div>
      
    </>
  );
};

export default Project;
