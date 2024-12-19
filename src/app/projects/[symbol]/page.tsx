"use client";

import * as React from "react";
import { isDrawerOpen } from "@/app/store";
import { useAtom } from "jotai";
import Image from "next/image";
import axios from "axios";

import Button from "@/app/components/common/Button";
import { DirectoryCoin } from "@/app/models/directoryCoin";
import CoinCardItem from "@/app/components/common/CoinCardItem";
import { mockCoins } from "@/utils/mockCoins";
import { User } from "@/app/models/user";
import SimpleMemberCard from "@/app/components/common/SimpleMemberCard";
import Dots from "@/assets/icons/Dots";
import { Community } from "@/app/models/community";
import { mockCommunities } from "@/utils/mockCommunities";
import CommunityCard from "@/app/components/common/CommunityCard";
import { useRouter } from "next/navigation";
import { userWeb3Info } from "@/app/store";
import * as anchor from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Connectivity as ProjectConn } from "@/anchor/community";
import { Connectivity as UserConn } from "@/anchor/user";
import { web3Consts } from "@/anchor/web3Consts";
import { pinFileToShadowDrive } from "@/app/lib/uploadFileToShdwDrive";

const Project = ({ params }: { params: { symbol: string } }) => {
  const navigate = useRouter();
  const connection = useConnection();
  const wallet = useAnchorWallet();
  const [profileInfo] = useAtom(userWeb3Info);
  const [profile, setProfile] = React.useState("")
  const [projectLoading, setProjectLoading] = React.useState(true);
  const [projectDetail, setProjectDetail] =  React.useState<any>(null)
  const [creatorInfo, setCreatorInfo] = React.useState<any>(null)
  const [isOwner, setOwner] = React.useState(false)
  const [projectInfo, setProjectInfo] = React.useState<any>({
      profiles: [],
      activationTokens: [],
      activationTokenBalance: 0,
      totalChild: 0,
      profilelineage: {
          promoter: "",
          promoterprofile:"",
          scout: "",
          scoutprofile:"",
          recruiter: "",
          recruiterprofile: "",
          originator: "",
          originatorprofile: "",
      },
      generation: "",
      invitationPrice: 0,
      mintPrice: 0
  })

  const [showMsg, setShowMsg] = React.useState(false);
  const [msgClass, setMsgClass] = React.useState("");
  const [msgText, setMsgText] = React.useState("");

  const [passSubmit, setPassSubmit] = React.useState(false)
  const [passButtonStatus, setPassButtonStatus] = React.useState("Mint Project Pass")
  const delay = (ms:any) => new Promise(res => setTimeout(res, ms));

  const [isDrawerShown] = useAtom(isDrawerOpen);

  const [coins, setCoins] = React.useState<DirectoryCoin[]>(
    mockCoins.map((coin) => ({
      ...coin,
      priceLastSevenDays: coin.priceLastSevenDays.map((e) => e.toString()),
    })),
  );

  const [communities, setCommunities] =
    React.useState<Omit<Community, "coin">[]>(mockCommunities);

  const [members, setMembers] = React.useState<User[]>([]);

  const getUsers = React.useCallback(async () => {
    let url = `/api/get-all-users?skip=0`;

    const result = await axios.get(url);

    setMembers(result.data.users);
  }, []);


  React.useEffect(()=>{
    getUsers();
    getProjectDetailFromAPI()
  },[])

  React.useEffect(()=>{
    if(wallet && projectDetail) {
       getUserProfileInfo()
    }
  },[wallet, projectDetail])

  const getProjectDetailFromAPI = async() => {
    try {
        setProjectLoading(true)
        let listResult = await axios.get(`/api/project/detail?symbol=${params.symbol}`);
        setProjectDetail(listResult.data)
        
        setProjectLoading(false)
    } catch (error) {
        setProjectLoading(false)
        setProjectDetail(null)
    }
  }

  const getUserProfileInfo = async () => {
    if(!wallet) {
        return
    }
    setProjectLoading(true)
    const env = new anchor.AnchorProvider(connection.connection, wallet, {
        preflightCommitment: "processed",
    });

    anchor.setProvider(env);
    let projectConn: ProjectConn = new ProjectConn(env, web3Consts.programID, new anchor.web3.PublicKey(projectDetail.project.key));
    let projectInfo = await projectConn.getProjectUserInfo(projectDetail.project.key);
    let tokenInfo = await projectConn.metaplex.nfts().findByMint({
      mintAddress: new anchor.web3.PublicKey(projectDetail.project.key) 
    })
    let creator = tokenInfo.creators[0].address.toBase58()
    let userInfo = await getUserData(creator);
    setCreatorInfo(userInfo);

    if(projectInfo.profiles.length > 0) {
        if(projectInfo.profiles[0].address == projectDetail.project.key) {
            setOwner(true)
        } else {
            setOwner(false)
        }
    }

    setProjectInfo(projectInfo)
    getProfileInfo()
  }

  const getProfileInfo = async () => {
    if(!wallet) {
        return
    }
    const env = new anchor.AnchorProvider(connection.connection, wallet, {
      preflightCommitment: "processed",
    });
    let userConn: UserConn = new UserConn(env, web3Consts.programID);
    const profileInfo = await userConn.getUserInfo();
    setProfile(profileInfo.profiles[0].address);
    setProjectLoading(false)
  };

  const createMessage = (message: any, type: any) => {
    window.scrollTo(0, 0);
    setMsgText(message);
    setMsgClass(type);
    setShowMsg(true);
    setTimeout(() => {
    setShowMsg(false);
    }, 4000);
  };

  const passAction = async () => {
    if(!profileInfo) {
        createMessage(
            "Hey! We checked your wallet is not connected",
            "warning-container",
        );
        return
    }

    if(!wallet) {
        createMessage(
            "Hey! We checked your wallet is not connected",
            "warning-container",
        );
        return
    }

    if (profileInfo?.solBalance < 0) {
        createMessage(
          <p>
            Hey! We checked your wallet and you don’t have enough SOL for the gas
            fees. Get some Solana and try again!
          </p>,
          "warning-container",
        );
        return;
    }
  
    let tolBalance = profileInfo?.mmoshBalance;

    if(tolBalance < (projectInfo.mintPrice / 1000_000_000)) {
        createMessage(
            "Hey! We checked your wallet and you don’t have enough to mint. Get some MMOSH here and try again!",
            "warning-container",
        );
        return
    }

    if(projectInfo.invitationPrice > 0) {
      if(projectInfo.activationTokens.length == 0) {
        createMessage(
          "Hey! We checked your wallet and you don’t have activation token to mint. Get Activation token and try again!",
          "warning-container",
        );
        return
      }
    }
   
    try {
        setPassSubmit(true);
        const genesisProfile = projectDetail.project.key;
        const env = new anchor.AnchorProvider(connection.connection, wallet, {
          preflightCommitment: "processed",
        });
        let projectConn: ProjectConn = new ProjectConn(env, web3Consts.programID, new anchor.web3.PublicKey(projectDetail.project.key));
        setPassButtonStatus("Preparing Metadata...")
        const body = {
            name:  projectDetail.project.name,
            symbol: projectDetail.project.symbol,
            description: projectDetail.project.desc,
            image: projectDetail.project.image,
            enternal_url: process.env.NEXT_PUBLIC_APP_MAIN_URL,
            family: "MMOSH",
            collection: "MMOSH Pass Collection",
            attributes: [
              {
                trait_type: "Project",
                value:projectDetail.project.key,
              },
              {
                trait_type: "Primitive",
                value:"Pass",
              },
              {
                trait_type: "MMOSH",
                value:"Genesis MMOSH",
              },
              {
                trait_type: "Seniority",
                value:"0",
              },
            ],
        };

        // get originator name
        if (projectInfo.profilelineage.originator.length > 0) {
            let originator: any = await getUserName(projectInfo.profilelineage.originator);
            if (originator != "") {
                body.attributes.push({
                trait_type: "Creator",
                value: originator,
                });
            } else {
                body.attributes.push({
                trait_type: "Creator",
                value: projectInfo.profilelineage.originator,
                });
            }
            body.attributes.push({
                trait_type: "Creator_Profile",
                value: projectInfo.profilelineage.originatorprofile,
            });
        }

        const shadowHash: any = await pinFileToShadowDrive(body);
        if (shadowHash === "") {
            setPassSubmit(false);
            createMessage(
                "We’re sorry, there was an error while trying to prepare meta url. please try again later.",
                "danger-container",
            );
            return;
        }
        const passMetaURI = shadowHash;

        setPassButtonStatus("Minting Pass...")

        console.log("params", {
            name: projectDetail.project.name,
            symbol: projectDetail.project.symbol,
            uriHash: passMetaURI,
            genesisProfile: genesisProfile,
            commonLut: projectDetail.project.lut
        })

        console.log("profile ", profile)
        let res;
        if(projectInfo.invitationPrice > 0) {

          const activationToken = new anchor.web3.PublicKey(projectInfo.activationTokens[0].activation);
          res = await projectConn.mintPass({
            name: projectDetail.project.name,
            symbol: projectDetail.project.symbol,
            uriHash: passMetaURI,
            activationToken,
            genesisProfile,
            commonLut: projectDetail.project.lut
          },profile);
        } else {
          if(projectInfo.mintPrice > 0) {
            res = await projectConn.mintGuestPass({
              name: projectDetail.project.name,
              symbol: projectDetail.project.symbol,
              uriHash: passMetaURI,
              genesisProfile,
              commonLut: projectDetail.project.lut
            },profile);
          } else {
            res = await projectConn.mintFreePass({
              name: projectDetail.project.name,
              symbol: projectDetail.project.symbol,
              uriHash: passMetaURI,
              genesisProfile,
              commonLut: projectDetail.project.lut
            },profile);
          }

        }

        if(res.Ok) {
            setPassButtonStatus("Waiting for confirmations...")
            await delay(15000)
            createMessage(
                "Congrats! You have minted your Pass successfully.",
                "success-container",
            );
            await getProjectDetailFromAPI()
        } else {
            createMessage(
                "We’re sorry, there was an error while trying to mint your Pass. Check your wallet and try again.",
                "danger-container",
            );
        }
             
        setPassSubmit(false)
        setPassButtonStatus("Mint")
    } catch (error) {
        console.log("error ", error)
        createMessage(
            "We’re sorry, there was an error while trying to mint your Pass. Check your wallet and try again.",
            "danger-container",
        );
        setPassSubmit(false)
        setPassButtonStatus("Mint")
    }
  } 


  const getUserData = async (address: any) => {
    try {
        const result = await axios.get(
            `/api/get-wallet-data?wallet=${address}`,
          );
          if (result) {
            if (result.data) {
              if (result.data.profile) {
                return result.data.profile;
              }
            }
        }
        return null
    } catch (error) {
        return null
    }
};


  const getUserName = async (pubKey: any) => {
    try {
      const result = await axios.get(`/api/get-wallet-data?wallet=${pubKey}`);
      if (result) {
        if (result.data) {
          if (result.data.profile) {
            return result.data.profile.username;
          }
        }
      }
      return "";
    } catch (error) {
      return "";
    }
  };

  return (
    <>
        {showMsg && (
            <div className={"message-container text-white text-center text-header-small-font-size py-5 px-3.5 " + msgClass}>{msgText}</div>
        )}
        <div
          className={`background-content-full-bg flex flex-col ${isDrawerShown ? "z-[-1]" : ""}`}
        >
          {projectDetail &&
              <h4 className="text-white self-center text-xl py-7 capitalize">{projectDetail.project.name}</h4>
          }
          <div className="flex flex-col bg-[#181747] backdrop-blur-[6px] rounded-md relative mx-16 rounded-xl mb-16">
    
            <div className="h-[25vh] m-4 mb-0 overflow-hidden">
                {projectDetail &&
                    <img
                      src={projectDetail.project.image}
                      alt="Project"
                      className="w-full rounded-lg"
                    />
                }
              {/* <div className="dots-menu">
                <Dots />
              </div> */}
            </div>

            <div className="relative mx-8 mb-0">
              <div className="absolute top-[-60px]">
                  {projectDetail && 
                        <img
                        src={projectDetail.project.image}
                        alt="Project"
                        className="w-[120px] h-[120px] object-cover rounded-lg"
                      />
                  }
              </div>
              <div className="lg:pl-[140px] mt-20 lg:mt-0">
                <div className="lg:flex justify-between items-end mb-4">
                {projectDetail &&
                    <div className="flex flex-col mt-4 max-w-[60%]">
                      <div className="flex items-center">
                        <h5 className="font-bold text-white text-lg capitalize">{projectDetail.project.name}</h5>
                        <span className="font-bold text-lg text-white mx-2">•</span>
                        <p className="text-base">{projectDetail.project.symbol.toUpperCase()}</p>
          
                        {creatorInfo &&
                        <div className="ml-4 bg-[#21005EB2] border-lg px-3 py-1 rounded-lg">
                          {creatorInfo.username}
                        </div>
                        }

                      </div>
          
                      <p className="text-sm">
                        {projectDetail.project.desc}
                      </p>
                    </div>
                }
                {profileInfo &&
                  <>
                    {projectInfo.profiles.length == 0 &&
                      <div className="mr-8 mt-4 lg:mt-0">
                        {passSubmit &&
                          <Button
                            isLoading={false}
                            size="small"
                            title={passButtonStatus}
                            action={() => {}}
                            isPrimary
                          />
                        }

                        {(!passSubmit && projectDetail) &&
                          <Button
                            isLoading={false}
                            size="small"
                            title={"Mint Project Pass"}
                            action={() => {passAction()}}
                            isPrimary
                          />
                        }

                      </div>
                    }
                    {projectInfo.profiles.length > 0 &&
                      <Button
                        isLoading={false}
                        size="small"
                        title={"Project Pass Minted"}
                        action={() => {}}
                        isPrimary
                        disabled
                      />
                    }
                  </>
                }
                </div>
              </div>
            </div>




            <div className="flex flex-col mt-6">
              <h6 className="text-white font-bold text-lg ml-6">Project Coins</h6>
              <div className="w-full grid lg:grid-cols-4 md:grid-cols-3 grid-cols-auto gap-4 2xl:px-8 md:px-4 px-6 mt-4">
                {coins.map((coin) => (
                  <CoinCardItem
                    key={coin.symbol + coin.name}
                    coin={coin}
                    displayGraph
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 mt-8">
                <div className="flex grow flex-col items-start">
                  <h6 className="text-white font-bold text-lg mb-4 ml-4">
                    Communities
                  </h6>

                  <div className="w-full h-full grid grid-cols-auto 2xl:grid-cols-2 grid-rows-min gap-4 2xl:px-8 md:px-4 px-6 py-6 bg-[#202061] max-h-[500px] overflow-y-auto">
                    {communities.map((community) => (
                      <CommunityCard community={community} />
                    ))}
                  </div>
                </div>
                <div className="flex grow flex-col items-start">
                  <div className="flex justify-between">
                    <h6 className="text-white font-bold text-lg mb-4 ml-4">
                      Community Coins
                    </h6>

                    <div id="all-trading-pairs"></div>
                  </div>

                  <div className="w-full h-full grid grid-cols-auto lg:grid-cols-2 md:gap-2 gap-4 2xl:gap-4 py-6 bg-[#202061] max-h-[500px] overflow-y-auto">
                    {coins.map((coin) => (
                      <div
                        key={coin.name + coin.symbol}
                        className="max-h-[80px] mb-2"
                      >
                        <CoinCardItem coin={coin} displayGraph={false} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex grow flex-col items-start">
                  <h6 className="text-white font-bold text-lg mb-4 ml-4">
                    Members
                  </h6>

                  <div className="w-full h-full grid grid-cols-auto gap-4 2xl:px-8 md:px-4 px-6 py-6 bg-[#202061] max-h-[500px] overflow-y-auto">
                    {members.map((member) => (
                      <SimpleMemberCard user={member} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>

  );
};

export default Project;
