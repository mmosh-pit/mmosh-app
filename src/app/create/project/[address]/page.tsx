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

export default function ProjectView({ params }: { params: { address: string } }) {
    const navigate = useRouter();
    const connection = useConnection();
    const wallet = useAnchorWallet();
    const [profileInfo] = useAtom(userWeb3Info);
    const [projectLoading, setProjectLoading] = useState(true);
    const [projectDetail, setProjectDetail] = useState<any>(null)
  
    const [tokenomicschart, setTokenomicsChart] = useState([])
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
    const [inviteSubmit, setInviteSubmit] = useState(false)
    const [inviteButtonStatus, setInviteButtonStatus] = useState("Mint")

    const [showMsg, setShowMsg] = useState(false);
    const [msgClass, setMsgClass] = useState("");
    const [msgText, setMsgText] = useState("");

    const [passSubmit, setPassSubmit] = useState(false)
    const [passButtonStatus, setPassButtonStatus] = useState("Mint")

    const [countDownDate, setCountDownDate] = useState(0);
    const [countDown, setCountDown] = useState(0);
    const [launchState, setLaunchState] = useState("")
    const [launchStatus, setLaunchStatus] = useState("Countdown to Launch")

    const [passes, setPasses] = useState([])
    const [stakes, setStakes] = useState([])
    const [presaleDetail, setPresaleDetail] = useState<any>()

    const [claimSubmit, setClaimSubmit] = useState(false)
    const [claimButtonStatus, setClaimButtonStatus] = useState("Claim") 

    const delay = (ms:any) => new Promise(res => setTimeout(res, ms));

    useEffect(() => {
        if(countDownDate == 0) {
            return
        }
        const interval = setInterval(() => {
          setCountDown(countDownDate - new Date().getTime());
        }, 1000);
    
        return () => clearInterval(interval);
      }, [countDownDate]);

    const getCountDownValues = (countDown:any) => {
        // calculate time left
        const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((countDown % (1000 * 60)) / 1000);
      
        return {days, hours, minutes, seconds};
    };

    useEffect(()=>{
        getProjectDetailFromAPI()
    },[])

    useEffect(()=>{
        if(wallet) {
            getUserProfileInfo()
        }
    },[wallet])

    const getProjectDetailFromAPI = async() => {
        try {
            setProjectLoading(true)
            let listResult = await axios.get(`/api/project/detail?project=${params.address}`);
            setProjectDetail(listResult.data)
            let tokenomics:any = [];
            for (let index = 0; index < listResult.data.tokenomics.length; index++) {
                const element = listResult.data.tokenomics[index];
                tokenomics.push({
                    name: element.type,
                    value: element.value,
                    color: getDarkColor()
                })
            }
            tokenomics.push({
                name: "presale",
                value: Math.ceil((listResult.data.project.presalesupply / listResult.data.coins.supply) * 100),
                color: getDarkColor()
            })
            tokenomics.push({
                name: "MMOSH DAO",
                value: 2,
                color: getDarkColor()
            })
            tokenomics.push({
                name: "Curator",
                value: 1,
                color: getDarkColor()
            })

            let presaleStart = convertUTCDateToLocalDate(new Date(listResult.data.project.presalestartdate))
            let presaleEnd = convertUTCDateToLocalDate(new Date(listResult.data.project.presaleenddate))
            let dexListDate = convertUTCDateToLocalDate(new Date(listResult.data.project.dexlistingdate))

            console.log("presaleStart ", presaleStart)
            console.log("presaleEnd ", presaleEnd)
            console.log("dexListDate ", dexListDate)

            let saleStartdiff = new Date().getTime() - presaleStart.getTime();
            let saleEnddiff = new Date().getTime() - presaleEnd.getTime();
            let dexdiff = new Date().getTime() - dexListDate.getTime();
            if(saleStartdiff < 0) {
                setLaunchStatus("Countdown  to Launch")
                setCountDownDate(presaleStart.getTime())
            }

            if(saleStartdiff > 0 && saleEnddiff < 0) {
                setLaunchStatus("Countdown  to Presale End")
                setCountDownDate(presaleEnd.getTime())
            }

            if(saleStartdiff > 0 && saleEnddiff > 0 && dexdiff < 0) {
                setLaunchStatus("Countdown  to Dex Listing")
                setCountDownDate(dexListDate.getTime())
            }

            const passList:any = []
            for (let index = 0; index < listResult.data.passes.length; index++) {
                const element = listResult.data.passes[index];
                let redeemDate = convertUTCDateToLocalDate(new Date(element.redemptiondate))
                let redeemdiff = new Date().getTime() - redeemDate.getTime();
                if(saleStartdiff > 0 && saleEnddiff < 0) {
                    element.isbuy = true;
                    element.isclaim = false;
                } else {
                    element.isbuy = false;
                    element.isclaim = redeemdiff > 0
                }
                element.isloading = false;
                passList.push(element)
            }
            setPasses(passList);

            setTokenomicsChart(tokenomics);
            setProjectLoading(false)
        } catch (error) {
            setProjectLoading(false)
            setProjectDetail(null)
        }
    }

    const getDarkColor = () => {
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += Math.floor(Math.random() * 10);
        }
        return color;
    }

    const convertUTCDateToLocalDate = (date: any) => {
        var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
        var offset = date.getTimezoneOffset() / 60;
        var hours = date.getHours();
        newDate.setHours(hours - offset);
        return newDate;   
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
        let projectConn: ProjectConn = new ProjectConn(env, web3Consts.programID, new anchor.web3.PublicKey(params.address));
        let projectInfo = await projectConn.getProjectUserInfo(params.address);

        let tokenInfo = await projectConn.metaplex.nfts().findByMint({
            mintAddress: new anchor.web3.PublicKey(params.address) 
        })
        let creator = tokenInfo.creators[0].address.toBase58()
        let userInfo = await getUserData(creator);
        setCreatorInfo(userInfo);
        if(projectInfo.profiles.length > 0) {
            if(projectInfo.profiles[0].address == params.address) {
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
        setProfile(profileInfo.profiles[0].address);
        getStakeListFromAPI();
        setProjectLoading(false)
    };

    const getStakeListFromAPI = async () =>{
        try {
            let listResult = await axios.get(`/api/project/get-stake-list?project=${params.address}`);
            setPresaleDetail(listResult.data.presale)
            setStakes(listResult.data.stake)
        } catch (error) {
            console.log("getStakeListFromAPI error ", error)
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

    const prepareNumber = (inputValue:any) => {
        if(isNaN(inputValue)) {
            return 0
        }
        return inputValue;
    }

    const inviteAction = async () => {

        if (Number(inputValue) == 0) {
            createMessage(
                "Please Enter invitation mint count",
                "warning-container",
              );
            return;
        }
        if (profileInfo?.solBalance == 0) {
            createMessage(
              "Hey! We checked your wallet and you don’t have enough SOL for the gas fees. Get some Solana and try again!",
              "warning-container",
            );
            return;
        }

        let tolBalance = profileInfo ? profileInfo?.mmoshBalance : 0;

        if(tolBalance < Number(inputValue) * (projectInfo.invitationPrice / 1000_000_000)) {
            createMessage(
                "Hey! We checked your wallet and you don’t have enough "+projectDetail.coins.symbol+" to mint. Get some MMOSH here and try again!",
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

    
        try {
            const env = new anchor.AnchorProvider(connection.connection, wallet, {
                preflightCommitment: "processed",
            });
            setInviteSubmit(true)
            anchor.setProvider(env);
            let projectConn: ProjectConn = new ProjectConn(env, web3Consts.programID, new anchor.web3.PublicKey(params.address));
            let activationToken;
            if(projectInfo.activationTokens.length == 0) {
                setInviteButtonStatus("Preparing Metadata ...")
                let attributes = [];

                // get promoter name
                if (projectInfo.profilelineage.promoter.length > 0) {
                  let promoter: any = await getUserName(projectInfo.profilelineage.promoter);
                  if (promoter != "") {
                    attributes.push({
                      trait_type: "Parent",
                      value: promoter,
                    });
                  } else {
                    attributes.push({
                      trait_type: "Parent",
                      value: projectInfo.profilelineage.promoter,
                    });
                  }
                }

                attributes.push({
                    trait_type: "Seniority",
                    value: projectInfo.generation,
                });

                attributes.push({
                    trait_type: "Gen",
                    value: projectInfo.generation,
                });

                attributes.push({
                    trait_type: "Project",
                    value: params.address,
                });

                let desc =
                "Cordially invites you to join on the "+capitalizeString(projectDetail.project.name)+". The favor of a reply is requested.";
                if (profileInfo?.profile.name != "") {
                    desc =
                    capitalizeString(profileInfo?.profile.name) +
                    " cordially invites you to join on the "+capitalizeString(projectDetail.project.name)+". The favor of a reply is requested.";
                }
        
              const body = {
                name: profileInfo?.profile.name != "" ? "Invitation from " + capitalizeString(projectDetail.project.name) : "Invitation",
                symbol: projectDetail.project.symbol,
                description: desc,
                image: projectDetail.project.image,
                external_url: process.env.NEXT_PUBLIC_APP_MAIN_URL,
                minter: profileInfo?.profile.name,
                attributes: attributes,
              };

              const shdwHashInvite: any = await pinFileToShadowDrive(body);

              if (shdwHashInvite === "") {
                createMessage(
                  "We’re sorry, there was an error while trying to prepare meta url. please try again later.",
                  "danger-container",
                );
                return;
              }
              const inviteMetaURI = "https://shdw-drive.genesysgo.net/" +process.env.NEXT_PUBLIC_SHDW_DRIVE_PUB_KEY +"/"+ shdwHashInvite;

              setInviteButtonStatus("Initialize Badge Account...")
              const initResult:any = await projectConn.initBadge({
                name: "Invitation",
                symbol: "BADGE",
                uri:inviteMetaURI,
                profile: projectInfo.profiles[0].address
              })
               console.log("initResult ", initResult)
               activationToken = initResult.Ok.info.subscriptionToken
               setInviteButtonStatus("Wait for confirmation...")
               await delay(15000)
            } else {
               activationToken = projectInfo.activationTokens[0].activation
            }
            
            console.log("activationToken ", activationToken)
            setInviteButtonStatus("Mint Badge...")
            let res;
            if(Number(projectInfo.invitationPrice) / 1000_000_000 > 0) {
                res = await projectConn.mintBadge({
                    amount: Number(inputValue),
                    subscriptionToken: activationToken
                })
            } else {
                res = await projectConn.createBadge({
                    amount: Number(inputValue),
                    subscriptionToken: activationToken
                })
            }

            console.log("mintBadge ",res);
            if(res.Ok) {
                createMessage(
                    "Congrats! You have minted your Invitation(s) successfully.",
                    "success-container",
                );
            } else {
                createMessage(
                    "We’re sorry, there was an error while trying to mint your Invitation Badge(s). Check your wallet and try again.",
                    "danger-container",
                );
            }

            setInviteSubmit(false)
            setInviteButtonStatus("Mint")
            setInputValue("");
            await getProjectDetailFromAPI()
            await getUserProfileInfo()
        } catch (error) {
            createMessage(
                "We’re sorry, there was an error while trying to mint your Invitation Badge(s). Check your wallet and try again.",
                "danger-container",
            );
            setInviteSubmit(false)
            setInviteButtonStatus("Mint")
        }

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
                "Hey! We checked your wallet and you don’t have enough "+projectDetail.coins.symbol+" to mint. Get some MMOSH here and try again!",
                "warning-container",
            );
            return
        }
       
        try {
            setPassSubmit(true);
            const genesisProfile = projectDetail.project.key;
            const activationToken = new anchor.web3.PublicKey(projectInfo.activationTokens[0].activation);
            const env = new anchor.AnchorProvider(connection.connection, wallet, {
              preflightCommitment: "processed",
            });
            let projectConn: ProjectConn = new ProjectConn(env, web3Consts.programID, new anchor.web3.PublicKey(params.address));
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
                    value:params.address,
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
            const passMetaURI = "https://shdw-drive.genesysgo.net/" +process.env.NEXT_PUBLIC_SHDW_DRIVE_PUB_KEY +"/"+ shadowHash;

            setPassButtonStatus("Minting Pass...")

            console.log("params", {
                name: projectDetail.project.name,
                symbol: projectDetail.project.symbol,
                uriHash: passMetaURI,
                activationToken: activationToken.toBase58(),
                genesisProfile: genesisProfile,
                commonLut: projectDetail.project.lut
            })

            console.log("profile ", profile)

            const res = await projectConn.mintPass({
                name: projectDetail.project.name,
                symbol: projectDetail.project.symbol,
                uriHash: passMetaURI,
                activationToken,
                genesisProfile,
                commonLut: projectDetail.project.lut
            },profile);

            if(res.Ok) {
                setPassButtonStatus("Waiting for confirmations...")
                await delay(15000)
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
                 
            setPassSubmit(false)
            setPassButtonStatus("Mint")
        } catch (error) {
            createMessage(
                "We’re sorry, there was an error while trying to mint your Pass. Check your wallet and try again.",
                "danger-container",
            );
            setPassSubmit(false)
            setPassButtonStatus("Mint")
        }
    }

    const handlePassBuy = async(passItem:any) => {

        if(!wallet) {
            createMessage(
                "Hey! We checked your wallet is not connected",
                "warning-container",
            );
            return
        }
        try {
            const passList:any = []
            for (let index = 0; index < passes.length; index++) {
                const element:any = passes[index];
                if(element.key == passItem.key) {
                    element.isbuy = false;
                    element.isclaim = false;
                    element.isloading = true;
                }
                passList.push(element)
            }
            setPasses(passList);

            const env = new anchor.AnchorProvider(connection.connection, wallet, {
                preflightCommitment: "processed",
            });

            console.log("buyLaunchPass", {
                owner: projectDetail.coins.creator,
                mint: passItem.key,
                gensis: params.address,
            })
    
            anchor.setProvider(env);
            let projectConn: ProjectConn = new ProjectConn(env, web3Consts.programID, new anchor.web3.PublicKey(params.address));
            await projectConn.buyLaunchPass({
                owner: new anchor.web3.PublicKey(projectDetail.coins.creator),
                mint: new anchor.web3.PublicKey(passItem.key),
                gensis: new anchor.web3.PublicKey(params.address),
            })

            const newPassList:any = []
            for (let index = 0; index < passes.length; index++) {
                const element:any = passes[index];
                if(element.key == passItem.key) {
                    element.isbuy = false;
                    element.isclaim = false;
                    element.isloading = false;
                }
                newPassList.push(element)
            }
            setPasses(newPassList);

        } catch (error) {
            console.log("error ", error)
            createMessage(
                "We’re sorry, there was an error while trying to buy launch Pass. Check your wallet and try again.",
                "danger-container",
            );
            const passList:any = []
            for (let index = 0; index < passes.length; index++) {
                const element:any = passes[index];
                if(element.key == passItem.key) {
                    element.isbuy = true;
                    element.isclaim = false;
                    element.isloading = false;
                }
                passList.push(element)
            }
            setPasses(passList);
        }
    }

    const handlePassClaim = async(passItem:any) => {
        if(!wallet) {
            createMessage(
                "Hey! We checked your wallet is not connected",
                "warning-container",
            );
            return
        }
        try {
            const passList:any = []
            for (let index = 0; index < passes.length; index++) {
                const element:any = passes[index];
                if(element.key == passItem.key) {
                    element.isbuy = false;
                    element.isclaim = false;
                    element.isloading = true;
                }
                passList.push(element)
            }
            setPasses(passList);

            const env = new anchor.AnchorProvider(connection.connection, wallet, {
                preflightCommitment: "processed",
            });
    
            anchor.setProvider(env);
            let projectConn: ProjectConn = new ProjectConn(env, web3Consts.programID, new anchor.web3.PublicKey(params.address));
            await projectConn.redeemLaunchPass({
                owner: new anchor.web3.PublicKey(projectDetail.coins.creator),
                launchToken: new anchor.web3.PublicKey(passItem.key),
                mint: new anchor.web3.PublicKey(projectDetail.coins.key),
                stakeKey: presaleDetail.key
            })

            const newPassList:any = []
            for (let index = 0; index < passes.length; index++) {
                const element:any = passes[index];
                if(element.key == passItem.key) {
                    element.isbuy = false;
                    element.isclaim = false;
                    element.isloading = false;
                }
                newPassList.push(element)
            }
            setPasses(newPassList);

        } catch (error) {
            createMessage(
                "We’re sorry, there was an error while trying to buy launch Pass. Check your wallet and try again.",
                "danger-container",
            );
            const passList:any = []
            for (let index = 0; index < passes.length; index++) {
                const element:any = passes[index];
                if(element.key == passItem.key) {
                    element.isbuy = false;
                    element.isclaim = true;
                    element.isloading = false;
                }
                passList.push(element)
            }
            setPasses(passList);
        }
    }

    const handleRedeemCoins = async() => {
        if(!wallet) {
            createMessage(
                "Hey! We checked your wallet is not connected",
                "warning-container",
            );
            return
        }
        try {
            setClaimButtonStatus("Claiming...")
            setClaimSubmit(true)
            const env = new anchor.AnchorProvider(connection.connection, wallet, {
                preflightCommitment: "processed",
            });
    
            anchor.setProvider(env);
            let projectConn: ProjectConn = new ProjectConn(env, web3Consts.programID, new anchor.web3.PublicKey(params.address));
            for (let index = 0; index < stakes.length; index++) {
                const element:any = stakes[index];
                await projectConn.unStakeCoin({
                    amount: element.value,
                    mint: new anchor.web3.PublicKey(element.mint),
                    stakeKey: element.key,
                })
            }
        } catch (error) {
            createMessage(
                "We’re sorry, there was an error while trying to buy launch Pass. Check your wallet and try again.",
                "danger-container",
            );
            setClaimButtonStatus("Claim")
            setClaimSubmit(false)
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
                                <div className="border border-white p-2.5 rounded-xl border-opacity-20 relative min-h-[340px]">
                                    <div className="md:absolute left-2.5 top-2.5 rounded-xl sm:mb-2.5">
                                        <img src={projectDetail.coins.image} alt="coin image" className="md:w-80 md:h-80 sm:wd-full object-cover rounded-xl"/>
                                    </div>
                                    <div className="md:ml-[335px]">
                                    <div>
                                        <div>
                                            <h2 className="text-white font-goudy font-normal text-xl flex">{capitalizeString(projectDetail.coins.name)}
                                                <div className="px-2.5">
                                                •
                                                </div>
                                                
                                                <span className="text-header-small-font-size font-poppins leading-8">{projectDetail.coins.symbol.toUpperCase()}</span>
                                                </h2>
                                            <p className="text-header-small-font-size mt-3.5 mb-8">{projectDetail.coins.desc}</p>
                                        </div>
                                        <div className="flex pt-8 border-t border-white border-opacity-20">
                                            <div className="flex">
                                                <div className="rounded-md mr-3.5"><img src={projectDetail.project.image} className="w-32 h-32 object-cover rounded-md" /></div>
                                                <div className="mr-8">
                                                    <h4 className="text-[15px] text-white">Creator</h4>
                                                    <ul>
                                                    {projectDetail.profiles.map((profileItem:any, i:any) => (
                                                        <li className="underline"><a href="javascript:void(0)">{capitalizeString(profileItem.name)}</a></li>
                                                    ))}
                                                    </ul>
                                                </div>
                                                <div className="mr-20">
                                                    <h4 className="text-[15px] text-white">Community</h4>
                                                    <ul>
                                                    {projectDetail.community.map((communityItem:any, i:any) => (
                                                        <li className="underline"><a href="javascript:void(0)">{capitalizeString(communityItem.name)}</a></li>
                                                    ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-[15px] text-white">Tokenomics</h4>
                                                <div className="flex">
                                                    <div>
                                                        <PieChart
                                                            width={200}
                                                            height={200}
                                                        >
                                                            <Pie
                                                                dataKey="value"
                                                                startAngle={360}
                                                                endAngle={0}
                                                                data={tokenomicschart}
                                                                outerRadius={80}
                                                                fill="none"
                                                                stroke="none"
                                                            >
                                                                {tokenomicschart.map((entry:any, index) => (
                                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                                ))}
                                                            </Pie>
                                                        </PieChart>
                                                    </div>
                                                    <div className="pl-5 pt-5">
                                                       {tokenomicschart.map((tokenomicschartItem:any, i:any) => (
                                                            <div className="flex">
                                                                <div className={"w-2.5 h-2.5 rounded-full relative top-1"} style={{"backgroundColor":tokenomicschartItem.color}}></div>
                                                                <p className="pl-2.5 text-header-small-font-size min-w-32">{tokenomicschartItem.name}</p>
                                                                <p className="text-header-small-font-size">{tokenomicschartItem.value}%</p>
                                                            </div>
                                                       ))}
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                <div className="border-t border-white border-opacity-20 pt-8 mt-8">
                                    {countDown != 0 &&
                                    <>
                                        <h2 className="text-white font-goudy font-normal text-xl mb-8 text-center">{launchStatus}</h2>
                                        <div className="flex justify-center mb-8">
                                            <div>
                                                <div className="w-16 h-16 font-goudy text-xl text-center text-white rounded-md border border-white border-opacity-20 flex justify-center align-center items-center">
                                                    {getCountDownValues(countDown).days}
                                                </div>
                                                <p className="text-header-small-font-size text-center">days</p>
                                            </div>
                                            <div className="flex flex-col h-16 justify-center align-center">
                                                <img src="/time.png" alt="time" className="w-[6px] mx-1.5" />
                                            </div>
                                            <div>
                                                    <div className="w-16 h-16 font-goudy text-xl text-center text-white rounded-md border border-white border-opacity-20 flex justify-center align-center items-center">
                                                    {getCountDownValues(countDown).hours}
                                                </div>
                                                <p className="text-header-small-font-size text-center">Hours</p>
                                            </div>
                                            <div className="flex flex-col h-16 justify-center align-center">
                                                <img src="/time.png" alt="time" className="w-[6px] mx-1.5" />
                                            </div>
                                            <div>
                                                    <div className="w-16 h-16 font-goudy text-xl text-center text-white rounded-md border border-white border-opacity-20 flex justify-center align-center items-center">
                                                    {getCountDownValues(countDown).minutes}
                                                </div>
                                                <p className="text-header-small-font-size text-center">Minutes</p>
                                            </div>
                                            <div className="flex flex-col h-16 justify-center align-center">
                                                <img src="/time.png" alt="time" className="w-[6px] mx-1.5" />
                                            </div>
                                            <div>
                                                    <div className="w-16 h-16 font-goudy text-xl text-center text-white rounded-md border border-white border-opacity-20 flex justify-center align-center items-center">
                                                    {getCountDownValues(countDown).seconds}
                                                </div>
                                                <p className="text-header-small-font-size text-center">Seconds</p>
                                            </div>
                                        </div>
                                    </>                               
                                    }
                                    {stakes.length > 0 && 
                                      <div className="flex justify-center mb-8">
                                        {!claimSubmit &&
                                           <button className="btn btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white rounded-md px-10" onClick={handleRedeemCoins}>Claim</button>
                                        }
                                        {claimSubmit &&
                                           <button className="btn btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white rounded-md px-10">{claimButtonStatus}</button>
                                        }
                                      </div>
                                    } 
                                
                                {profileInfo &&
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                        {projectInfo.profiles.length == 0 && projectInfo.activationTokens.length > 0 &&
                                            <div className="col-span-3">
                                                <div>
                                                    <h4 className="text-header-small-font-size font-normal text-white mt-2.5 pl-2.5">Project Passes</h4>
                                                    <div className="rounded-md bg-black bg-opacity-[0.4] p-2.5">
                                                        <div className="border-container rounded-md">
                                                            <img src={projectDetail.project.image} alt="project pass" className="w-full object-cover p-0.5 rounded-md"/>
                                                        </div>
                                                        <h5 className="text-white font-goudy font-normal text-header-small-font-size flex justify-center mt-2.5 mb-10">
                                                            {capitalizeString(projectDetail.project.name)}
                                                        </h5>
                                                        <div className="text-center">
                                                            {!passSubmit &&
                                                               <button className="btn-sm btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white rounded-md px-10" onClick={passAction}>Mint</button>
                                                            }
                                                            {passSubmit &&
                                                               <button className="btn-sm btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white rounded-md px-10">{passButtonStatus}</button>
                                                            }
                                                            <p className="text-para-font-size text-center leading-none mt-1">Price {projectDetail.project.price} MMOSH</p>
                                                            <p className="text-small-font-size text-center leading-none my-2">Plus you will be charged a small amount of SOL in transaction fees.</p>
                                                            <p className="text-para-font-size text-center leading-none mb-1">Current Balance {profileInfo?.mmoshBalance.toFixed(2)} MMOSH</p>
                                                            <p className="text-para-font-size text-center leading-none">Current Balance {profileInfo?.solBalance.toFixed(2)} SOL</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {projectInfo.profiles.length > 0 &&
                                            <div className="col-span-3">
                                                <div>
                                                    <h4 className="text-header-small-font-size font-normal text-white mt-2.5 pl-2.5">Invitation Badge</h4>
                                                    <div className="rounded-md bg-black bg-opacity-[0.4] p-2.5">
                                                        <div className="rounded-md">
                                                            <img src={projectDetail.project.image} alt="invitation" className="w-full object-cover p-0.5 rounded-md"/>
                                                        </div>
                                                        <h5 className="text-white font-goudy font-normal text-header-small-font-size flex justify-center mt-2.5 mb-6">
                                                        {capitalizeString(projectDetail.project.name)}               
                                                        </h5>
                                                        <div className="mb-10">
                                                        <p className="text-para-font-size text-center">Invitations to Mint</p>
                                                        <div className="max-w-28 mx-auto">
                                                            <Input
                                                                    type="text"
                                                                    title=""
                                                                    required={false}
                                                                    helperText=""
                                                                    placeholder="0"
                                                                    value={inputValue}
                                                                    onChange={(e) => setInputValue(prepareNumber(Number(e.target.value)))}
                                                                />
                                                        </div>
                                                        </div>
                                                        <div className="text-center">
                                                            {!inviteSubmit &&
                                                                <button className="btn-sm btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white rounded-md px-10" onClick={inviteAction}>Mint</button>
                                                            }
                                                            {inviteSubmit &&
                                                                <button className="btn-sm btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white rounded-md px-10">{inviteButtonStatus}</button>
                                                            }
                                                            <p className="text-para-font-size text-center leading-none mt-1">Price {projectDetail.project.invitationprice - (projectDetail.project.invitationprice * (projectDetail.project.discount / 100))} MMOSH</p>
                                                            <p className="text-small-font-size text-center leading-none my-2">Plus you will be charged a small amount of SOL in transaction fees.</p>
                                                            <p className="text-para-font-size text-center leading-none mb-1">Current Balance {profileInfo?.mmoshBalance.toFixed(2)} MMOSH</p>
                                                            <p className="text-para-font-size text-center leading-none">Current Balance {profileInfo?.solBalance.toFixed(2)} SOL</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {passes.map((passItem:any, i:any) => (
                                            <div className="col-span-3">
                                                <div>
                                                    <h4 className="text-header-small-font-size font-normal text-white mt-2.5 pl-2.5">Launch Pass {i}</h4>
                                                    <div className="rounded-md bg-black bg-opacity-[0.4] p-2.5">
                                                        <div className="border-container rounded-md">
                                                            <img src={passItem.image} alt="pass image" className="w-full object-cover p-0.5 rounded-md"/>
                                                        </div>
                                                        <h5 className="text-white font-goudy font-normal text-header-small-font-size flex justify-center mt-2.5 mb-6">
                                                            {capitalizeString(passItem.name)}
                                                            <div className="px-1.5 mt-1.5">
                                                            •
                                                            </div>
                                                        
                                                            <span className="text-small-font-size font-poppins leading-5">{passItem.symbol.toUpperCase()}</span>
                                                        </h5>
                                                        <div className="mb-2.5">
                                                        <div className="flex gap-4">
                                                            <div>
                                                                    <h5 className="text-white font-goudy font-normal text-header-small-font-size">
                                                                        Price of Pass
                                                                    </h5>
                                                                    <p className="text-para-font-size">{passItem.price}</p>
                                                            </div>
                                                            <div>
                                                                    <h5 className="text-white font-goudy font-normal text-header-small-font-size">
                                                                        Supply
                                                                    </h5>
                                                                    <p className="text-para-font-size">{passItem.supply}</p>
                                                            </div>
                                                            <div>
                                                                    <h5 className="text-white font-goudy font-normal text-header-small-font-size">
                                                                        Number of Tokens
                                                                    </h5>
                                                                    <p className="text-para-font-size">{Math.ceil(passItem.price / (projectDetail.coins.listingprice - (projectDetail.coins.listingprice * (passItem.discount / 100))))}</p>
                                                            </div>
                                                            </div>
                                                            <div className="flex gap-4 mt-2.5">
                                                            <div>
                                                                    <h5 className="text-white font-goudy font-normal text-header-small-font-size">
                                                                        Listing Price
                                                                    </h5>
                                                                    <p className="text-para-font-size">{projectDetail.coins.listingprice} USD</p>
                                                            </div>
                                                            <div>
                                                                    <h5 className="text-white font-goudy font-normal text-header-small-font-size">
                                                                        Discount
                                                                    </h5>
                                                                    <p className="text-para-font-size">{passItem.discount}%</p>
                                                            </div>
                                                        </div>
                                                        </div>
                                                        <div className="text-center">
                                                            {passItem.isbuy &&
                                                                <button className="btn-sm btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white rounded-md px-10" onClick={()=>{handlePassBuy(passItem)}}>Buy</button>
                                                            } 
                                                            {passItem.isclaim &&
                                                                <button className="btn-sm btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white rounded-md px-10" onClick={()=>{handlePassClaim(passItem)}}>Claim</button>
                                                            }
                                                            {(passItem.isbuy && passItem.isclaim) &&
                                                                <>
                                                                    <p className="text-para-font-size text-center leading-none mt-1">Price {passItem.price} USDC</p>
                                                                    <p className="text-small-font-size text-center leading-none my-2">Plus you will be charged a small amount of SOL in transaction fees.</p>
                                                                    <p className="text-para-font-size text-center leading-none mb-1">Current Balance {profileInfo?.usdcBalance.toFixed(2)} USDC</p>
                                                                    <p className="text-para-font-size text-center leading-none">Current Balance {profileInfo?.solBalance.toFixed(2)} SOL</p>
                                                                </>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

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
