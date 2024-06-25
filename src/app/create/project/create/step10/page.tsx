"use client";

import ImagePicker from "@/app/components/ImagePicker";
import Button from "@/app/components/common/Button";
import Input from "@/app/components/common/Input";
import Radio from "@/app/components/common/Radio";
import Select from "@/app/components/common/Select";
import AddIcon from "@/assets/icons/AddIcon";
import Calender from "@/assets/icons/Calender";
import FileIcon from "@/assets/icons/FileIcon";
import MinusIcon from "@/assets/icons/MinusIcon";
import TimeIcon from "@/assets/icons/TimeIcon";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { init, uploadFile } from "@/app/lib/firebase";
import { v4 as uuidv4 } from "uuid";
import { pinImageToShadowDrive } from "@/app/lib/uploadImageToShdwDrive";
import * as anchor from "@coral-xyz/anchor";
import { useAtom } from "jotai";
import { userWeb3Info } from "@/app/store";
import { pinFileToShadowDrive } from "@/app/lib/uploadFileToShdwDrive";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Connectivity as Community } from "../../../../../anchor/community";
import { web3Consts } from "@/anchor/web3Consts";
import { calcNonDecimalValue } from "@/anchor/curve/utils";
import axios from "axios";
import { PieChart } from 'reaviz';

export default function ProjectCreateStep9() {
    const navigate = useRouter();
    const connection = useConnection();
    const wallet: any = useAnchorWallet();

    const [profileInfo] = useAtom(userWeb3Info);

    const [showMsg, setShowMsg] = useState(false);
    const [msgClass, setMsgClass] = useState("");
    const [msgText, setMsgText] = useState("");

    const [buttonText, setButtonText] = useState("Deploy Token Presale")
    const [loading, setLoading] = useState(false)
    // step1
    const [project, setProject] = useState({
        image: {preview: "", type: ""},
        name: "", 
        symbol: "",
        desc: "",
        passPrice: 0,
        website: "",
        telegram: "",
        twitter:"",
        priceDistribution: {
            echosystem: 3,
            curator: 2,
            creator: 70,
            promoter: 20,
            scout: 5,
        },
        invitationType: "required",
        invitationPrice: 0,
        discount: 0.0,
    })

    // step2
    const [communities, setCommunities] = useState({
        communities: [],
        profiles: []
    })

    // step3
    const [coins, setCoins] = useState({
        image: {preview: "", type:""},
        name: "", 
        symbol: "",
        desc: "",
        supply: 0,
        listingPrice: 0,
    })

    // step4
    const [presale, setPresale] = useState({
        presaleStartDate: "",
        presaleStartTime: "",
        presaleEndDate: "",
        presaleEndTime: "",
        dexListingDate: "",
        dexListingTime: "",
        maxPresale: 0,
        minPresale: 0
    })

    // step5
    const [passes, setPasses] = useState([])

    // step6, 7
    const [tokenomics, setTokenomics] = useState([])

    const [tokenomicschart, setTokenomicsChart] = useState([])

    // step 8
    const [liquidity, setLiquidity] = useState({
        usd: 0,
        mmosh:0,
        sol:0
    })
    
    // step 9
    const [files, setFiles] = useState([])

    React.useEffect(()=>{
        init()
        if(localStorage.getItem("projectstep1")) {
            let savedData:any = localStorage.getItem("projectstep1");
            setProject(JSON.parse(savedData));
        }

        if(localStorage.getItem("projectstep2")) {
            let savedData:any = localStorage.getItem("projectstep2");
            setCommunities(JSON.parse(savedData));
        }

        if(localStorage.getItem("projectstep3")) {
            let savedData:any = localStorage.getItem("projectstep3");
            setCoins(JSON.parse(savedData));
        }

        if(localStorage.getItem("projectstep4")) {
            let savedData:any = localStorage.getItem("projectstep4");
            setPresale(JSON.parse(savedData));
        }

        if(localStorage.getItem("projectstep5")) {
            let savedData:any = localStorage.getItem("projectstep5");
            setPasses(JSON.parse(savedData));
        }

        if(localStorage.getItem("projectstep6")) {
            let savedData:any = localStorage.getItem("projectstep6");
            setTokenomics(JSON.parse(savedData));
        }

        if(localStorage.getItem("projectstep8")) {
            let savedData:any = localStorage.getItem("projectstep8");
            setLiquidity(JSON.parse(savedData));
        }

        if(localStorage.getItem("projectstep9")) {
            let savedData:any = localStorage.getItem("projectstep9");
            setFiles(JSON.parse(savedData));
        }
    },[])

    useEffect(()=>{
        let chartData:any = []
        chartData.push({
            key: "Presale",
            data: presale.maxPresale
        })
        chartData.push({
            key: "MMOSH DAO",
            data: 2
        })
        chartData.push({
            key: "Curator",
            data: 1
        })
        for (let index = 0; index < tokenomics.length; index++) {
            const element:any = tokenomics[index];
            chartData.push({
                key: element.type,
                data: element.value
            })
        }
        setTokenomicsChart(chartData)
    },[tokenomics])

    const delay = (ms:any) => new Promise(res => setTimeout(res, ms));


    const capitalizeString = (str: any) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };


    const submitAction = async () => {
        try {
            setLoading(true)

            // project key
            const projectKeyPair = anchor.web3.Keypair.generate();

            const env = new anchor.AnchorProvider(connection.connection, wallet, {
                preflightCommitment: "processed",
              });
            anchor.setProvider(env);
            let communityConnection: Community = new Community(env, web3Consts.programID, projectKeyPair.publicKey);
        

            // mmosh bot file upload
            setButtonText("Uploading files to MMOSH Bot...")
            let botUri = []
            for (let index = 0; index < files.length; index++) {
                const element:any = files[index];
                let file = await fetch(element.preview).then(r => r.blob()).then(blobFile => new File([blobFile], uuidv4(), { type: element.type }));
                botUri.push(await uploadFile(file,file.name,"bot"))
            }
            console.log("boturi", botUri)


            // uploading community coin image
            setButtonText("Uploading community coin image...")
            let coinImageFile = await fetch(coins.image.preview).then(r => r.blob()).then(blobFile => new File([blobFile], uuidv4(), { type: project.image.type }));
            let coinImageUri = await pinImageToShadowDrive(coinImageFile)

            // uploading community coin metadata
            setButtonText("Uploading community coin metadata...")
            let coinBody = {
                name: coins.name,
                symbol: coins.symbol,
                description: coins.desc,
                image: coinImageUri
            }
            const coinMetaHash: any = await pinFileToShadowDrive(coinBody);
            if (coinMetaHash === "") {
                createMessage("We’re sorry, there was an error while trying to prepare meta url. please try again later.","danger-container")
                return;
            }
            const coinMetaURI = "https://shdw-drive.genesysgo.net/" +process.env.NEXT_PUBLIC_SHDW_DRIVE_PUB_KEY +"/"+ coinMetaHash;

            // creating community coins
            setButtonText("Creating community coin...")
            const mintKey = await communityConnection.createCoin(coins.name,coins.symbol, coinMetaURI, coins.supply, 9)

            let passKeys = []
            let passImages = []
            for (let index = 0; index < passes.length; index++) {
                const passItem:any = passes[index];
                // uploading launcpasses image
                setButtonText("Creating "+passItem.name+" image...")
                let passImageFile = await fetch(passItem.image.preview).then(r => r.blob()).then(blobFile => new File([blobFile], uuidv4(), { type: project.image.type }));
                let passImageUri = await pinImageToShadowDrive(passImageFile)
                passImages.push(passImageUri)
                // uploading launcpasses metadata
                setButtonText("Creating "+passItem.name+" metadata...")
                let passBody = {
                    name: passItem.name,
                    symbol: passItem.symbol,
                    description: passItem.desc,
                    image: passImageUri,
                    enternal_url: process.env.NEXT_PUBLIC_APP_MAIN_URL,
                    family: "MMOSH",
                    collection: "MMOSH Pass Collection",
                    attributes: [
                      {
                        trait_type: "Primitive",
                        value: "Pass",
                      },
                      {
                        trait_type: "MMOSH",
                        value: " Genesis MMOSH",
                      },
                      {
                        trait_type: "Community Coin",
                        value: mintKey,
                      },
                      {
                        trait_type: "Founder",
                        value: profileInfo?.profile.name,
                      },
                      {
                        trait_type: "Discount",
                        value: passItem.discount,
                      },
                      {
                        trait_type: "Supply",
                        value: passItem.supply,
                      },
                    ],
                }

                const passMetaHash: any = await pinFileToShadowDrive(passBody);
                if (passMetaHash === "") {
                    createMessage("We’re sorry, there was an error while trying to prepare meta url. please try again later.","danger-container")
                    return;
                }
                const passMetaURI = "https://shdw-drive.genesysgo.net/" +process.env.NEXT_PUBLIC_SHDW_DRIVE_PUB_KEY +"/"+ passMetaHash;

                setButtonText("Creating "+passItem.name+"...")
                const passKey = await communityConnection.createCoin(passItem.name,passItem.symbol, passMetaURI, passItem.supply, 0)
                passKeys.push(passKey)

                // creating launch pass
            }

            // stake coins for liqudity bool
            setButtonText("Staking fund for liqudity pool...")
            let stakeInfo = [{
                coin: web3Consts.oposToken,
                amount: liquidity.mmosh * web3Consts.LAMPORTS_PER_OPOS,
            },{
                coin: new anchor.web3.PublicKey("So11111111111111111111111111111111111111112"),
                amount: liquidity.sol * web3Consts.LAMPORTS_PER_OPOS,
            },{
                coin: web3Consts.usdcToken,
                amount: liquidity.usd * 1000_000,
            }];
            const stakeres = await communityConnection.stakeCoin(mintKey,stakeInfo);


            // uploading project image
            setButtonText("Uploading project image...")
            let projectImageFile = await fetch(project.image.preview).then(r => r.blob()).then(blobFile => new File([blobFile], uuidv4(), { type: project.image.type }));
            let projectImageUri = await pinImageToShadowDrive(projectImageFile)

            // uploading project metadata
            setButtonText("Uploading project metadata...")
            let projectBody = {
                name: project.name,
                symbol: project.symbol,
                description: project.desc,
                image: projectImageUri,
                enternal_url: process.env.NEXT_PUBLIC_APP_MAIN_URL+"create/projects/"+projectKeyPair.publicKey.toBase58(),
                family: "MMOSH",
                collection: "MMOSH Pass Collection",
                attributes: [
                  {
                    trait_type: "Primitive",
                    value: "Pass",
                  },
                  {
                    trait_type: "MMOSH",
                    value: " Genesis MMOSH",
                  },
                  {
                    trait_type: "Project",
                    value: projectKeyPair.publicKey.toBase58(),
                  },
                  {
                    trait_type: "Seniority",
                    value: "0",
                  },
                  {
                    trait_type: "Founder",
                    value: profileInfo?.profile.name,
                  },
                  {
                    trait_type: "Website",
                    value: project.website,
                  },
                  {
                    trait_type: "Telegram",
                    value: project.telegram,
                  },
                  {
                    trait_type: "X",
                    value: project.twitter,
                  },
                ],
            }
            
            for (let index = 0; index < communities.communities.length; index++) {
                const element:any = communities.communities[index];
                projectBody.attributes.push({
                    trait_type: "Communities",
                    value: element.community,
                })
            }

            for (let index = 0; index < communities.profiles.length; index++) {
                const element:any = communities.profiles[index];
                projectBody.attributes.push({
                    trait_type: "Team",
                    value: element.name,
                })
            }

            for (let index = 0; index < passKeys.length; index++) {
                const element = passKeys[index];
                projectBody.attributes.push({
                    trait_type: "Pass",
                    value: element,
                })
            }

            const projectMetaHash: any = await pinFileToShadowDrive(projectBody);
            if (projectMetaHash === "") {
                createMessage("We’re sorry, there was an error while trying to prepare meta url. please try again later.","danger-container")
                return;
            }
            const projectMetaURI = "https://shdw-drive.genesysgo.net/" +process.env.NEXT_PUBLIC_SHDW_DRIVE_PUB_KEY +"/"+ projectMetaHash;            

            // creating project
            setButtonText("Creating Gensis Project Pass...")
            let invPrice = project.invitationPrice
            if(project.discount > 0) {
                invPrice = invPrice - (invPrice * (project.discount / 100))
            }

            const profileMintingCost = new anchor.BN(calcNonDecimalValue(Number(project.passPrice), 9))
            const invitationMintingCost = new anchor.BN(calcNonDecimalValue(invPrice, 9))

            const res1:any = await communityConnection.mintGenesisPass({
                name: project.name,
                symbol: project.symbol,
                uri: projectMetaURI,
                mintKp: projectKeyPair,
                input:{
                  oposToken: web3Consts.oposToken,
                  profileMintingCost,
                  invitationMintingCost,
                  mintingCostDistribution: {
                    parent: 100 * project.priceDistribution.curator,
                    grandParent: 100 * project.priceDistribution.creator,
                    greatGrandParent: 100 * project.priceDistribution.promoter,
                    ggreatGrandParent: 100 * project.priceDistribution.scout,
                    genesis: 100 * project.priceDistribution.echosystem,
                  },
                  tradingPriceDistribution: {
                      seller: 100 * project.priceDistribution.curator,
                      parent: 100 * project.priceDistribution.creator,
                      grandParent: 100 * project.priceDistribution.promoter,
                      greatGrandParent: 100 * project.priceDistribution.scout,
                      genesis: 100 * project.priceDistribution.echosystem,
                  }
              }
            });
            const genesisProfileStr = res1.Ok.info.profile

            setButtonText("Waiting for Confirmation...")
            await delay(15000)
            communityConnection.setMainState();

            // create invite metadata

            setButtonText("Preparing Badge Metadata...")
            let desc =
            "Cordially invites you to join on the "+capitalizeString(project.name)+". The favor of a reply is requested.";
            if (project.name != "") {
                desc =
                capitalizeString(project.name) +
                " cordially invites you to join "+ capitalizeString(project.name)+" on the MMOSH. The favor of a reply is requested.";
            }

            const invitebody = {
                name: "Invitation from join " +  project.name,
                symbol: project.symbol,
                description: project.desc,
                image:projectImageUri,
                external_url: process.env.NEXT_PUBLIC_APP_MAIN_URL+"create/projects/"+projectKeyPair.publicKey.toBase58(),
                minter: profileInfo?.profile.name,
                attributes: [
                    {
                        trait_type: "Project",
                        value: projectKeyPair.publicKey.toBase58(),
                    },
                    {
                      trait_type: "Seniority",
                      value: "0",
                    },
                ]
            };
        
            const shdwHashInvite: any = await pinFileToShadowDrive(invitebody);
            if (shdwHashInvite === "") {
                createMessage(
                    "We’re sorry, there was an error while trying to prepare meta url. please try again later.",
                    "danger-container",
                );
                return;
            }
            const inviteMetaURI = "https://shdw-drive.genesysgo.net/" +process.env.NEXT_PUBLIC_SHDW_DRIVE_PUB_KEY +"/"+ shdwHashInvite;

            // creating invitation
            setButtonText("Creating Badge Account...")
        
            const uri = shdwHashInvite;
            const res2: any = await communityConnection.initBadge({
                name: "Invitation",
                symbol:  "INVITE",
                uri:inviteMetaURI,
                profile: genesisProfileStr,
            });
            console.log("badge result ", res2)

            setButtonText("Waiting for Confirmation...")
            await delay(15000)

            setButtonText("Minting Badges...")
            const res3 = await communityConnection.createBadge({
                amount: 100,
                subscriptionToken: res2.Ok.info.subscriptionToken,
            });
            console.log("create badge result ", res3)

            setButtonText("Waiting for Confirmation...")
            await delay(15000)

            setButtonText("Creating LUT Registration...")
            const res4:any = await communityConnection.registerCommonLut();
            console.log("register lookup result ", res4)

            setButtonText("Buying new Project...")
            const res5 = await communityConnection.sendProjectPrice(profileInfo?.profile.address,100000);
            console.log("send price result ", res5)

            
            // save coins
            await axios.post("/api/project/save-coin", {
                name: coins.name,
                symbol: coins.symbol,
                image: coinImageUri,
                key: mintKey,
                desc: coins.desc,
                supply: coins.supply,
                creator: profileInfo?.profile.address, 
                listingprice: coins.listingPrice,
                projectkey: projectKeyPair.publicKey.toBase58()
            });

            // save pass
            for (let index = 0; index < passes.length; index++) {
                const passItem:any = passes[index];
                let redemptionDate = new Date(passItem.redemptionDate + " "+passItem.redemptionTime).toUTCString()
                await axios.post("/api/project/save-pass", {
                    name: passItem.name,
                    symbol: passItem.symbol,
                    image: passImages[index],
                    key: passKeys[index],
                    desc: passItem.desc,
                    price: passItem.price,
                    supply: passItem.supply,
                    discount: passItem.discount,
                    promoterroyality: passItem.promoterRoyalty,
                    scoutroyalty: passItem.scoutRoyalty,
                    creator: profileInfo?.profile.address, 
                    redemptiondate: redemptionDate,
                    projectkey: projectKeyPair.publicKey.toBase58()
                });
            }


            // save liquidity
            await axios.post("/api/project/save-liquidity", {
                sol: liquidity.sol,
                usdc: liquidity.usd,
                mmosh: liquidity.mmosh,
                projectkey: projectKeyPair.publicKey.toBase58()
            });

            // save community
            for (let index = 0; index < communities.profiles.length; index++) {
                const element:any = communities.communities[index];
                await axios.post("/api/project/save-community", {
                    communitykey: element.community,
                    projectkey: projectKeyPair.publicKey.toBase58()
                });
            }

           // save profile
            for (let index = 0; index < communities.profiles.length; index++) {
                const element:any = communities.profiles[index];
                await axios.post("/api/project/save-profile", {
                    profilekey: element.profilenft,
                    role: element.profile,
                    projectkey: projectKeyPair.publicKey.toBase58()
                });
            }

            // save tokenomics
            for (let index = 0; index < tokenomics.length; index++) {
                const element:any = tokenomics[index];
                await axios.post("/api/project/save-tokenomics", {
                    type: element.type,
                    value: element.value,
                    cliff: element.cliff,
                    vesting: element.vesting,
                    projectkey: projectKeyPair.publicKey.toBase58()
                });
            }
   
            // save project
            let presaleStart = new Date(presale.presaleStartDate + " "+presale.presaleStartTime).toUTCString()
            let presaleEnd = new Date(presale.presaleEndDate + " "+presale.presaleEndTime).toUTCString()
            let dexDate = new Date(presale.dexListingDate + " "+presale.dexListingTime).toUTCString()
            await axios.post("/api/project/save-project", { 
                name: project.name, 
                symbol: project.symbol, 
                desc: project.desc, 
                image: project.image, 
                key: projectKeyPair.publicKey.toBase58(), 
                lut: res4.Ok.info.lookupTable, 
                seniority: 0, 
                telegram: project.telegram, 
                twitter: project.twitter, 
                website: project.website, 
                presalesupply: coins.supply * (presale.maxPresale/100),
                minpresalesupply: (coins.supply * (presale.maxPresale/100)) * (presale.minPresale/100), 
                presalestartdate: presaleStart, 
                presaleenddate: presaleEnd, 
                dexlistingdate: dexDate
            });

            setLoading(false)
            setButtonText("Deploy Token Presale")
            navigate.push("/create/project/create/"+projectKeyPair.publicKey.toBase58());
        } catch (error) {
           createMessage("error processing new project","danger-container")
        }
    }

    const goBack = () => {
        navigate.back();
    }

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
        setButtonText("Deploy Token Presale")
        setLoading(false)
        if(type == "success-container") {
          setTimeout(() => {
            setShowMsg(false);
          }, 4000);
        } else {
          setTimeout(() => {
            setShowMsg(false);
          }, 4000);
        }
    };


    return (
        <>
            {showMsg && (
                <div className={"message-container text-white text-center text-header-small-font-size py-5 px-3.5 " + msgClass}>{msgText}</div>
            )}
            <div className="relative background-content">
                <div className="flex flex-col items-center justify-center w-full">
                    <div className="relative w-full flex flex-col justify-center items-center pt-5">
                        <div className="max-w-md">
                            <h2 className="text-center text-white font-goudy font-normal text-xl">Launch Your Project</h2>
                            <h3 className="text-center text-white font-goudy text-sub-title-font-size pt-2.5">Step 10</h3>
                            <h3 className="text-center text-white font-goudy font-normal text-sub-title-font-size pt-1.5">Deploy Your Project</h3>
                            <p className="text-para-font-size light-gray-color text-center para-line-height pt-2.5 text-light-gray leading-4">When you deploy your Project, your Launchpasses will appear on the launchpad and your Project will appear in the directory. While we do not censor Projects, listings on our web app and in our telegram bot are guided by our <span className="underline">community standards.</span></p>
                        </div>
                    </div>
                </div>
                <div className="py-5 px-5 xl:px-32 lg:px-16 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="col-span-3">
                            <div className="md:mb-3.5">
                                <h3 className="text-sub-title-font-size text-while font-poppins mb-3.5">Project Pass</h3>
                                <div>
                                    <h3 className="text-sub-title-font-size text-while font-poppins text-center">{project.name}</h3>
                                    <div>
                                    <div className="rounded-md gradient-container p-1.5 mr-5">
                                            <img src={project.image.preview}className="w-full object-cover"/>
                                    </div>
                                    </div>
                                    <p className="text-header-small-font-size text-white mt-2 text-center">{project.symbol}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-9">
                            <div className="mt-5">
                                <h3 className="text-sub-title-font-size text-while font-poppins mb-3.5">Community Coin</h3>
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                    <div className="col-span-3">
                                        <div className="rounded-full gradient-container p-1.5">
                                            <img src={coins.image.preview} className="w-full rounded-full object-cover"/>
                                        </div>
                                    </div>
                                    <div className="col-span-4">
                                        <div className="grid grid-flow-col justify-stretch gap-4">
                                            <div>
                                                <p className="text-para-font-size">Name</p>
                                                <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md">{coins.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-para-font-size">Symbol</p>
                                                <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md">{coins.symbol}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-flow-col justify-stretch gap-4">
                                            <div>
                                                <p className="text-para-font-size">Supply</p>
                                                <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md">{coins.supply}</p>
                                            </div>
                                            <div>
                                                <p className="text-para-font-size">Listing Price</p>
                                                <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md">{coins.listingPrice}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-flow-col justify-stretch gap-4">
                                            <div>
                                                <p className="text-para-font-size">Fully Diluted Value (FDV)</p>
                                                <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md">{coins.listingPrice * coins.supply}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-5">
                                    <p className="text-para-font-size">Description</p>
                                    <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md h-full">{coins.desc}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5">
                                <h3 className="text-sub-title-font-size text-while font-poppins mb-3.5">Presale Supply</h3>
                                <div className="grid md:grid-flow-col justify-stretch gap-4">
                                    <div>
                                        <p className="text-para-font-size">Maximum Supply for presale</p>
                                        <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md">{coins.supply * (presale.maxPresale/100)}</p>
                                    </div>
                                    <div>
                                        <p className="text-para-font-size">Token Presale</p>
                                        <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md">{coins.supply * (presale.maxPresale/100)}</p>
                                    </div>
                                    <div>
                                        <p className="text-para-font-size">Minimum tokens sold required to close presale</p>
                                        <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md">{(coins.supply * (presale.maxPresale/100)) * (presale.minPresale/100)}</p>
                                    </div>
                                </div>
                                <div className="grid md:grid-flow-col justify-stretch gap-4">
                                    <div>
                                        <p className="text-para-font-size">Start Date</p>
                                        <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md">{presale.presaleStartDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-para-font-size">Start Time</p>
                                        <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md">{presale.presaleStartTime}</p>
                                    </div>
                                    <div>
                                        <p className="text-para-font-size">End Date</p>
                                        <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md">{presale.presaleEndDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-para-font-size">End Time</p>
                                        <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md">{presale.presaleEndTime}</p>
                                    </div>
                                    <div>
                                        <p className="text-para-font-size">Listing Date</p>
                                        <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md">{presale.dexListingDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-para-font-size">Listing Time</p>
                                        <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md">{presale.dexListingTime}</p>
                                    </div>
                                </div>
                                <div className="grid md:grid-flow-col justify-stretch gap-4">
                                    <div>
                                        <p className="text-para-font-size">Project Website</p>
                                        <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md">{project.website}</p>
                                    </div>
                                    <div>
                                        <p className="text-para-font-size">Project Telegram</p>
                                        <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md">{project.telegram}</p>
                                    </div>
                                    <div>
                                        <p className="text-para-font-size">Project Twitter</p>
                                        <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md">{project.twitter}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {passes.map((passItem:any, i) => (
                        <div className="pt-10">
                                <h3 className="text-sub-title-font-size text-while font-poppins mb-3.5">LaunchPass {i+1}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                    <div className="col-span-2">
                                        <img src={passItem.image.preview} className="w-full object-cover rounded-md"/>
                                    </div>
                                    <div className="col-span-6">
                                        <div className="grid md:grid-flow-col justify-stretch gap-4">
                                            <div>
                                                <p className="text-para-font-size">Name</p>
                                                <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md">{passItem.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-para-font-size">Symbol</p>
                                                <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md">{passItem.symbol}</p>
                                            </div>
                                            <div>
                                                <p className="text-para-font-size">Price of Pass</p>
                                                <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md">{passItem.price}</p>
                                            </div>
                                            <div>
                                                <p className="text-para-font-size">Supply</p>
                                                <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md">{passItem.supply}</p>
                                            </div>
                                        </div>
                                        <div className="grid md:grid-flow-col justify-stretch gap-4">
                                            <div>
                                                <p className="text-para-font-size">Number of Tokens
            12</p>
                                                <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md">{prepareNumber(Math.ceil(passItem.price / (coins.listingPrice - (coins.listingPrice * (passItem.discount / 100)))))}</p>
                                            </div>
                                            <div>
                                                <p className="text-para-font-size">Listing Price</p>
                                                <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md">{prepareNumber(coins.listingPrice - (coins.listingPrice * (passItem.discount / 100))).toString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-para-font-size">Royalties to Promoter</p>
                                                <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md">{passItem.promoterRoyalty}%</p>
                                            </div>
                                            <div>
                                                <p className="text-para-font-size">Promoter Royalty to Scout</p>
                                                <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md">{passItem.scoutRoyalty}%</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-4">
                                        <div>
                                            <p className="text-para-font-size">Description</p>
                                            <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md h-full">{passItem.desc}</p>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    
                    ))}


                    <div className="pt-10">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="col-span-4">
                                <h3 className="text-sub-title-font-size text-while font-poppins mb-3.5">Vesting Schedule</h3>
                                <div className="grid grid-cols-12 gap-4 mb-5">
                                    <div className="col-span-4">
                                        <p className="text-header-small-font-size">Distribution Plan</p>
                                    </div>
                                    <div className="col-span-4">
                                        <p className="text-header-small-font-size text-center">Cliff Month</p>
                                    </div>
                                    <div className="col-span-4">
                                        <p className="text-header-small-font-size text-center">Vesting Months</p>
                                    </div>
                                </div>
                                {tokenomics.map((tokenomicsItem:any,i)=>(
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="col-span-4">
                                            <p className="text-para-font-size">{tokenomicsItem.type} {tokenomicsItem.value}%</p>
                                        </div>
                                        <div className="col-span-4">
                                            <div className="text-center">
                                                <p className="text-para-font-size text-center bg-black bg-opacity-[0.2] px-3.5 py-2.5 inline-block">{tokenomicsItem.cliff.months}</p>
                                            </div>
                                        </div>
                                        <div className="col-span-4">
                                            <div className="text-center">
                                                <p className="text-para-font-size text-center bg-black bg-opacity-[0.2] px-3.5 py-2.5 inline-block">{tokenomicsItem.vesting.months}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <div className="col-span-4">
                                <h3 className="text-sub-title-font-size text-while font-poppins mb-3.5">Inform our AI Bot</h3>
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                    {files.map((fileItem:any, i)=>(
                                        <div className="col-span-4">
                                            <div className="backdrop-container rounded-xl px-5 py-10 border border-white border-opacity-20 text-center">
                                                <p className="text-para-font-size light-gray-color text-center">File{i+1}.pdf</p>
                                                <div className="w-8 mx-auto"><FileIcon /></div>          
                                            </div>
                                        </div>
                                    ))}
                                </div>
                        </div>
                        <div className="col-span-4">
                                <h3 className="text-sub-title-font-size text-while font-poppins mb-3.5">Tokenomics</h3>
                                <div>
                                    <PieChart
                                        className="w-full"
                                        height={300}
                                        data={tokenomicschart}
                                    />
                                </div>
                        </div>
                    </div>
                    </div>
        
                    <h3 className="text-sub-title-font-size text-while font-poppins text-center pt-10">Summary of Costs</h3>
                    <div className="flex justify-center mt-3.5">
                        <p className="text-header-small-font-size text-white mr-3.5 min-w-16">USDC</p>
                        <p className="text-header-small-font-size text-white">{liquidity.usd.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-center mt-3.5">
                        <p className="text-header-small-font-size text-white mr-3.5 min-w-16">SOL</p>
                        <p className="text-header-small-font-size text-white">{liquidity.sol.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-center mt-3.5">
                        <p className="text-header-small-font-size text-white mr-3.5 min-w-16">MMOSH</p>
                        <p className="text-header-small-font-size text-white">{liquidity.mmosh.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex justify-center mt-10">
                        <button className="btn btn-link text-white no-underline" onClick={goBack}>Back</button>
                        {!loading &&
                            <button className="btn btn-primary ml-10 bg-primary text-white border-none hover:bg-primary hover:text-white" onClick={submitAction}>Deploy Token Presale</button>
                        }

                        {loading&&
                            <button className="btn btn-primary ml-10 bg-primary text-white border-none hover:bg-primary hover:text-white">{buttonText}</button>
                        }

                    </div>
                    <div className="flex justify-center mt-3.5">
                        <p className="text-para-font-size text-white mr-3.5">Current Balance</p>
                        <p className="text-para-font-size text-white min-w-24">{profileInfo?.usdcBalance} USDC</p>
                    </div>
                    <div className="flex justify-center">
                        <p className="text-para-font-size text-white mr-3.5">Current Balance</p>
                        <p className="text-para-font-size text-white min-w-24">{profileInfo?.solBalance} SOL</p>
                    </div>
                    <div className="flex justify-center">
                        <p className="text-para-font-size text-white mr-3.5">Current Balance</p>
                        <p className="text-para-font-size text-white min-w-24">{profileInfo?.mmoshBalance} MMOSH</p>
                    </div>
                </div>
            </div>
        </>

    );
}
