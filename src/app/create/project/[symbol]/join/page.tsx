"use client";
import Input from "@/app/components/common/Input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bars } from "react-loader-spinner";
import { useAtom } from "jotai";
import { userWeb3Info } from "@/app/store";
import * as anchor from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Connectivity as ProjectConn } from "@/anchor/community";
import { Connectivity as UserConn } from "@/anchor/user";
import { web3Consts } from "@/anchor/web3Consts";
import { pinFileToShadowDrive } from "@/app/lib/uploadFileToShdwDrive";
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ProjectView({ params }: { params: { symbol: string } }) {
    const navigate = useRouter();
    const connection = useConnection();
    const wallet = useAnchorWallet();
    const [profileInfo] = useAtom(userWeb3Info);
    const [projectLoading, setProjectLoading] = useState(true);
    const [projectDetail, setProjectDetail] = useState<any>(null)
  

    const [creatorInfo, setCreatorInfo] = useState(null)
    const [isOwner, setOwner] = useState(false)
    const [projectInfo, setProjectInfo] = useState<any>({
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
    const [profile, setProfile] = useState("")

    const [inputValue, setInputValue] = useState("")

    const [showMsg, setShowMsg] = useState(false);
    const [msgClass, setMsgClass] = useState("");
    const [msgText, setMsgText] = useState("");

    const [passBlueSubmit, setPassBlueSubmit] = useState(false)
    const [passBlueButtonStatus, setPassBlueButtonStatus] = useState("Mint")

    const [passRedSubmit, setPassRedSubmit] = useState(false)
    const [passRedButtonStatus, setPassRedButtonStatus] = useState("Mint")

    const [creator, setCreator] = useState("")

    const delay = (ms:any) => new Promise(res => setTimeout(res, ms));


    useEffect(()=>{
        console.log("params ", params)
        getProjectDetailFromAPI()
    },[])

    useEffect(()=>{
        if(wallet && projectDetail) {
            getUserProfileInfo()
        }
    },[wallet, projectDetail])

    const getProjectDetailFromAPI = async() => {
        try {
            setProjectLoading(true)
            let listResult = await axios.get(`/api/project/detail?symbol=${params.symbol}`);
            setProjectDetail(listResult.data)
            
            const creatorName = await getUserName(listResult.data.coins[0].creator)
            setCreator(creatorName == "" ? listResult.data.coins[0].creator.substring(0, 5) +"..."+ listResult.data.coins[0].creator.substring(listResult.data.coins[0].creator.length-5) : creatorName) ;

            setProjectLoading(false)
        } catch (error) {
            setProjectLoading(false)
            setProjectDetail(null)
        }
    }

    const capitalizeString = (str: any) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

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
        console.log("projectInfo ", projectInfo)
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
        if(profileInfo.profiles.length > 0) {
            setProfile(profileInfo.profiles[0].address);
        }
        setProjectLoading(false)
    };

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

    const prepareNumber = (inputValue:any) => {
        if(isNaN(inputValue)) {
            return 0
        }
        return inputValue;
    }

    const createMessage = (message: any, type: any) => {
        window.scrollTo(0, 0);
        setMsgText(message);
        setMsgClass(type);
        setShowMsg(true);
        setTimeout(() => {
        setShowMsg(false);
        }, 4000);
    };

    const passAction = async (type:any) => {
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
                "Hey! We checked your wallet and you don’t have enough usdc to mint. Get some MMOSH here and try again!",
                "warning-container",
            );
            return
        }
       
        try {
            if(type === "Blue") {
                setPassBlueSubmit(true);
            } else {
                setPassRedSubmit(true);
            }
      
            const genesisProfile = projectDetail.project.key;
            let activationToken;
            if(projectInfo.activationTokens.length > 0) {
                activationToken = new anchor.web3.PublicKey(projectInfo.activationTokens[0].activation);
            }
           
            const env = new anchor.AnchorProvider(connection.connection, wallet, {
              preflightCommitment: "processed",
            });
            let projectConn: ProjectConn = new ProjectConn(env, web3Consts.programID, new anchor.web3.PublicKey(projectDetail.project.key));
            if(type === "Blue") {
                setPassBlueButtonStatus("Preparing Metadata...")
            } else {
                setPassRedButtonStatus("Preparing Metadata...")
            }
      

            let name = "Pump The Vote Blue"
            const body = {
                name:  type === "Red" ? "Pump The Vote Red" : "Pump The Vote Blue",
                symbol: type === "Red" ? "PTVR" : "PTVB",
                description: type === "Red" ? "Pump The Vote is a PolitiFi project within the MMOSH ecosystem. The Pump The Vote Red project pass is for conservatives united by a desire to protect and strengthen the principles that we believe have made America a great and prosperous nation, such as the principles of limited government, personal responsibility, and the preservation of traditional values. We are proponents of fiscal responsibility, advocating for lower taxes, reduced government spending, and balanced budgets to promote economic growth and ensure long-term sustainability." : "Pump The Vote is a PolitiFi project within the MMOSH ecosystem. The Pump The Vote Blue project pass is for progressives who are deeply committed to the principles of social justice, equality, and the protection of individual rights. We believe in a government that plays an active role in ensuring that all citizens have access to essential services like healthcare, education, and economic opportunities, and that it should work to reduce disparities and promote fairness in society. We are united by a vision of an inclusive America where government acts as a force for good, ensuring that every person has the opportunity to succeed and live a life of dignity, respect and personal freedom.",
                image: type === "Blue" ? "https://shdw-drive.genesysgo.net/Ejpot7jAYngByq5EgjvgEMgqJjD8dnjN4kSkiz6QJMsH/Pump%20the%20Vote%20Square%20Icon%20Only%20Blue.png" : "https://shdw-drive.genesysgo.net/Ejpot7jAYngByq5EgjvgEMgqJjD8dnjN4kSkiz6QJMsH/Pump%20the%20Vote%20Square%20Icon%20Only%20Red.png",
                enternal_url: process.env.NEXT_PUBLIC_APP_MAIN_URL + "create/project/" + projectDetail.project.symbol,
                family: "MMOSH",
                collection: "MMOSH Pass Collection",
                attributes: [
                  {
                    trait_type: "Project",
                    value: projectDetail.project.key,
                  },
                  {
                    trait_type: "Primitive",
                    value:"Pass",
                  },
                  {
                    trait_type: "Ecosystem",
                    value:"MMOSH",
                  },
                  {
                    trait_type: "Founder",
                    value:"Moto",
                  },
                  {
                    trait_type: "Party",
                    value: type,
                  },
                  {
                    trait_type: "Seniority",
                    value: projectDetail.project.seniority + 1,
                  },
                  {
                    trait_type: "Website",
                    value:type === "Red" ? "https://www.pumpthevote.red" : "https://www.pumpthevote.blue",
                  },
                  {
                    trait_type: "Telegram",
                    value:projectDetail.project.telegram,
                  },
                  {
                    trait_type: "X",
                    value:projectDetail.project.twitter,
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

            const passMetaURI: any = await pinFileToShadowDrive(body);
            if (passMetaURI === "") {
                if(type === "Blue") {
                    setPassBlueSubmit(false);
                } else {
                    setPassRedSubmit(false);
                }
          
                createMessage(
                    "We’re sorry, there was an error while trying to prepare meta url. please try again later.",
                    "danger-container",
                );
                return;
            }

            if(type === "Blue") {
                setPassBlueButtonStatus("Minting Pass...")
            } else {
                setPassRedButtonStatus("Minting Pass...")
            }
            
            console.log("params", {
                name: body.name,
                symbol: body.symbol,
                uriHash: passMetaURI,
                activationToken: activationToken ? activationToken.toBase58() :  "",
                genesisProfile: genesisProfile,
                commonLut: projectDetail.project.lut
            })

            console.log("profile ", profile)
            let res;
            if(projectInfo.invitationPrice > 0) {
                res = await projectConn.mintPass({
                    name: body.name,
                    symbol: body.symbol,
                    uriHash: passMetaURI,
                    activationToken: activationToken ? activationToken.toBase58() :  "",
                    genesisProfile,
                    commonLut: projectDetail.project.lut
                },profile);
            } else {
                console.log("guest pass implementation")
                res = await projectConn.mintGuestPass({
                    name: body.name,
                    symbol: body.symbol,
                    uriHash: passMetaURI,
                    genesisProfile,
                    commonLut: projectDetail.project.lut
                },profile);
            }



            if(res.Ok) {
                if(type === "Blue") {
                    setPassBlueButtonStatus("Waiting for confirmations...")
                } else {
                    setPassRedButtonStatus("Waiting for confirmations...")
                }
                
                await delay(15000)
                await axios.put("/api/project/update-seniority", {
                    key: projectDetail.project.key,
                });
                createMessage(
                    "Congrats! You have minted your Pass successfully.",
                    "success-container",
                );
                await getProjectDetailFromAPI()
                await getUserProfileInfo()
            } else {
                createMessage(
                    "We’re sorry, there was an error while trying to mint your Pass. Check your wallet and try again.",
                    "danger-container",
                );
            }
            if(type === "Blue") {
                setPassBlueSubmit(false)
                setPassBlueButtonStatus("Mint")
            } else {
                setPassRedSubmit(false)
                setPassRedButtonStatus("Mint")
            }

        } catch (error) {
            console.log("error ", error)
            createMessage(
                "We’re sorry, there was an error while trying to mint your Pass. Check your wallet and try again.",
                "danger-container",
            );
            if(type === "Blue") {
                setPassBlueSubmit(false)
                setPassBlueButtonStatus("Mint")
            } else {
                setPassRedSubmit(false)
                setPassRedButtonStatus("Mint")
            }
        }
    }




    return (
        <>
            {showMsg && (
                <div className={"message-container text-white text-center text-header-small-font-size py-5 px-3.5 " + msgClass}>{msgText}</div>
            )}
            <div className="relative background-content">
                <div className="container mx-auto">
                    <div className="backdrop-container rounded-xl border border-white border-opacity-20 my-10 p-5">
                        {projectLoading &&
                            <div className="p-10 text-center">
                                <Bars
                                    height="80"
                                    width="80"
                                    color="rgba(255, 0, 199, 1)"
                                    ariaLabel="bars-loading"
                                    wrapperStyle={{}} 
                                    wrapperClass="bars-loading"
                                    visible={true}
                                />
                            </div>
                        }
                        {(!projectLoading && projectDetail) &&
                        <>
                            <h2 className="text-left text-white font-goudy font-normal text-xl">Pump The Vote</h2>  
                            <div className="border-t border-white border-opacity-20 pt-8 mt-5">
                            
                            {profileInfo  &&
                                <div className="flex gap-4 justify-center">
                                    <div className="w-80">
                                        <div>
                                            <div className="rounded-md bg-black bg-opacity-[0.4] p-2.5">
                                                <div className="border-container rounded-md">
                                                    <img src="https://shdw-drive.genesysgo.net/Ejpot7jAYngByq5EgjvgEMgqJjD8dnjN4kSkiz6QJMsH/Pump%20the%20Vote%20Square%20Icon%20Only%20Blue.png" alt="project pass" className="w-full object-cover p-0.5 rounded-md"/>
                                                </div>
                                                <h5 className="text-white font-goudy font-normal text-header-small-font-size flex justify-center mt-2.5 mb-10">
                                                    Pump the Vote Blue
                                                </h5>
                                                <div className="text-center">
                                                    {projectInfo.profiles.length == 0 && (projectInfo.activationTokens.length > 0 || projectInfo.invitationPrice === 0) &&
                                                        <>
                                                            {!passBlueSubmit &&
                                                                <p><button className="btn-sm btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white rounded-md px-10" onClick={()=>{passAction("Blue")}}>Blue Vote</button></p>
                                                            }
                                                            {passBlueSubmit &&
                                                                <button className="btn-sm btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white rounded-md px-10">{passBlueButtonStatus}</button>
                                                            }
                                                                                                                    <p className="text-small-font-size text-center leading-none my-2">Plus you will be charged a small amount of SOL in transaction fees.</p>
                                                                                                                    <p className="text-para-font-size text-center leading-none">Current Balance {profileInfo?.solBalance.toFixed(2)} SOL</p>
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-80">
                                        <div>
                                            <div className="rounded-md bg-black bg-opacity-[0.4] p-2.5">
                                                <div className="border-container rounded-md">
                                                    <img src="https://shdw-drive.genesysgo.net/Ejpot7jAYngByq5EgjvgEMgqJjD8dnjN4kSkiz6QJMsH/Pump%20the%20Vote%20Square%20Icon%20Only%20Red.png" alt="project pass" className="w-full object-cover p-0.5 rounded-md"/>
                                                </div>
                                                <h5 className="text-white font-goudy font-normal text-header-small-font-size flex justify-center mt-2.5 mb-10">
                                                    Pump the Vote Red
                                                </h5>
                                                <div className="text-center">
                                                    {projectInfo.profiles.length == 0 && (projectInfo.activationTokens.length > 0 || projectInfo.invitationPrice === 0) &&
                                                        <>
                                                            {!passRedSubmit &&
                                                                <p><button className="btn-sm btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white rounded-md px-10" onClick={()=>{passAction("Red")}}>Red Vote</button></p>
                                                            }
                                                            {passRedSubmit &&
                                                                <button className="btn-sm btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white rounded-md px-10">{passRedButtonStatus}</button>
                                                            }
                                                                                                                                                                            <p className="text-small-font-size text-center leading-none my-2">Plus you will be charged a small amount of SOL in transaction fees.</p>
                                                                                                                                                                            <p className="text-para-font-size text-center leading-none">Current Balance {profileInfo?.solBalance.toFixed(2)} SOL</p>
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
            
                                </div>
                            }

                            </div>
                        </>
                        }
                        {(!projectLoading && !projectDetail) &&
                            <div className="text-center">project not found</div>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}
