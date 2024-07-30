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
import { pinFileToShadowDriveUrl } from "@/app/lib/uploadFileToShdwDrive";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Connectivity as Community } from "../../../anchor/community";
import { Connectivity as UserConn } from "../../../anchor/user";
import { web3Consts } from "@/anchor/web3Consts";
import { calcNonDecimalValue } from "@/anchor/curve/utils";
import axios from "axios";
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { NATIVE_MINT } from "forge-spl-token";

export default function ProjectCreateStep10({ onPageChange }: { onPageChange: any }) {
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
            name: "Presale",
            value: presale.maxPresale,
            color: getDarkColor()
        })
        chartData.push({
            name: "MMOSH DAO",
            value: 2,
            color: getDarkColor()
        })
        chartData.push({
            name: "Curator",
            value: 1,
            color: getDarkColor()
        })
        for (let index = 0; index < tokenomics.length; index++) {
            const element:any = tokenomics[index];
            chartData.push({
                name: element.type,
                value: element.value,
                color: getDarkColor()
            })
        }
        setTokenomicsChart(chartData)
    },[tokenomics])

    const getDarkColor = () => {
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += Math.floor(Math.random() * 10);
        }
        return color;
    }


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
            let userConn: UserConn = new UserConn(env, web3Consts.programID);
            const myProfileInfo = await userConn.getUserInfo();
            let stakeData:any = [];

            let botUri = []
            for (let index = 0; index < files.length; index++) {
                const element:any = files[index];
                botUri.push(element.preview)
            }
            console.log("boturi", botUri)


            // uploading community coin metadata
            setButtonText("Uploading community coin metadata...")
            let coinBody = {
                name: coins.name,
                symbol: coins.symbol,
                description: coins.desc,
                image: coins.image.preview
            }
            const coinMetaURI: any = await pinFileToShadowDriveUrl(coinBody);
            if (coinMetaURI === "") {
                createMessage("We’re sorry, there was an error while trying to prepare meta url. please try again later.","danger-container")
                return;
            }
            console.log("coinMetaURI", coinMetaURI)

            // creating community coins
            setButtonText("Creating community coin...")
            const mintKey = await communityConnection.createCoin(coins.name,coins.symbol, coinMetaURI, coins.supply * web3Consts.LAMPORTS_PER_OPOS, 9)
            console.log("community coin key", mintKey)


            let passKeys:any = []
            for (let index = 0; index < passes.length; index++) {
                const passItem:any = passes[index];

                // uploading launcpasses metadata
                setButtonText("Creating "+passItem.name+" metadata...")
                let passBody = {
                    name: passItem.name,
                    symbol: passItem.symbol,
                    description: passItem.desc,
                    image: passItem.image.preview,
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

                const passMetaURI: any = await pinFileToShadowDriveUrl(passBody);
                if (passMetaURI === "") {
                    createMessage("We’re sorry, there was an error while trying to prepare meta url. please try again later.","danger-container")
                    return;
                }
                
                setButtonText("Creating "+passItem.name+"...")
                let redemptionDate = new Date(new Date(passItem.redemptionDate + " "+passItem.redemptionTime).toUTCString()).valueOf()
                const passKey = await communityConnection.createLaunchPass({
                    name: passItem.name,
                    symbol:passItem.symbol, 
                    uri: passMetaURI,
                    redeemDate:0, 
                    redeemAmount: prepareNumber(Math.ceil(passItem.price / (coins.listingPrice - (coins.listingPrice * (passItem.discount / 100))))) * web3Consts.LAMPORTS_PER_OPOS,
                    cost: passItem.price * 1000_000,
                    distribution: {
                          parent: 100 * passItem.scoutRoyalty,
                          grandParent: 0,
                          greatGrandParent: 0,
                          ggreatGrandParent: 100 * project.priceDistribution.scout,
                          genesis: 0,
                    }
                })
                passKeys.push(passKey)
                // creating launch pass
            }
            console.log("passKeys ", passKeys)

            // stake coins for liqudity bool
            // live only
            // setButtonText("Converting SOL to WSOL");
            // await communityConnection.createWrappedSol(Math.ceil(liquidity.sol * web3Consts.LAMPORTS_PER_OPOS))
            // stake coins for liqudity bool
            setButtonText("Staking fund for liqudity pool...");

            // live only
            // stakeData.push({
            //     user: wallet.publicKey,
            //     mint: NATIVE_MINT,
            //     value: Math.ceil(liquidity.sol * web3Consts.LAMPORTS_PER_OPOS),
            //     duration: new Date(new Date(presale.presaleEndDate + " "+presale.presaleEndTime).toUTCString()).valueOf(),
            //     type: "liqudity"
            // })

            let mmoshOwner:any = await userConn.getNftProfileOwner(web3Consts.genesisProfile);
            if(mmoshOwner.profileHolder != anchor.web3.PublicKey.default) {
                stakeData.push({
                  mint: new anchor.web3.PublicKey(mintKey),
                  user: mmoshOwner.profileHolder,
                  value: Math.ceil(coins.supply * (2 / 100) * web3Consts.LAMPORTS_PER_OPOS),
                  duration: 0,
                  type: "liqudity"
               })
            }
           
            stakeData.push({
                mint: new anchor.web3.PublicKey(mintKey),
                user: new anchor.web3.PublicKey(myProfileInfo.profilelineage.promoter),
                value: Math.ceil(coins.supply * (1 / 100) * web3Consts.LAMPORTS_PER_OPOS),
                duration: 0,
                type: "liqudity"
            })
           
            if(presale.minPresale > 0) {
                stakeData.push({
                    mint: new anchor.web3.PublicKey(mintKey),
                    user: wallet.publicKey,
                    value: Math.ceil(coins.supply * (presale.maxPresale / 100)  * web3Consts.LAMPORTS_PER_OPOS),
                    duration: new Date(new Date(presale.presaleEndDate + " "+presale.presaleEndTime).toUTCString()).valueOf(),
                    type: "presale"
                })
            }
            

            stakeData.push({
                user: wallet.publicKey,
                mint: web3Consts.oposToken,
                duration: new Date(new Date(presale.presaleEndDate + " "+presale.presaleEndTime).toUTCString()).valueOf(),
                value: Math.ceil(Math.ceil(liquidity.mmosh * web3Consts.LAMPORTS_PER_OPOS)),
                type: "liqudity"
            })
            

            stakeData.push({
                user: wallet.publicKey,
                mint: web3Consts.usdcToken, 
                value: Math.ceil(liquidity.usd * 1000_000),
                duration: new Date(new Date(presale.presaleEndDate + " "+presale.presaleEndTime).toUTCString()).valueOf(),
                type: "liqudity"
            });

            // calculate stake value from tokenomics
            var date = new Date();
            for (let index = 0; index < tokenomics.length; index++) {
                const element:any = tokenomics[index];
                for (let index = 0; index < communities.profiles.length; index++) {
                    const element1:any = communities.profiles[index];
                    if(element1.role == element.type) {
                        stakeData.push({
                            mint: new anchor.web3.PublicKey(mintKey),
                            user: new anchor.web3.PublicKey(element1.wallet),
                            value:Math.ceil(((coins.supply * (element.value / 100)) * (element.cliff.percentage / 100)) * web3Consts.LAMPORTS_PER_OPOS),
                            duration: new Date(date.setMonth(date.getMonth() + element.cliff.months)).valueOf(),
                            type: "tokenomics"
                        })

                        stakeData.push({
                            mint: new anchor.web3.PublicKey(mintKey),
                            user: new anchor.web3.PublicKey(element1.wallet),
                            value:Math.ceil(((coins.supply * (element.value / 100)) * (element.vesting.percentage / 100)) * web3Consts.LAMPORTS_PER_OPOS),
                            duration: new Date(date.setMonth(date.getMonth() + element.vesting.months)).valueOf(),
                            type: "tokenomics"
                        })
                        break;
                    }
                }
            }
            console.log("stake Data ", stakeData)

            for (let index = 0; index < stakeData.length; index++) {
                if(stakeData[index].value == 0) {
                    continue;
                }
                const stakePair = anchor.web3.Keypair.generate();
                const stakeres = await communityConnection.stakeCoin(stakeData[index], stakePair);
                console.log("stake signature ", stakeres)
            }

            // uploading project metadata
            setButtonText("Uploading project metadata...")
            let projectBody = {
                name: project.name,
                symbol: project.symbol,
                description: project.desc,
                image: project.image.preview,
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

            const projectMetaURI: any = await pinFileToShadowDriveUrl(projectBody);
            if (projectMetaURI === "") {
                createMessage("We’re sorry, there was an error while trying to prepare meta url. please try again later.","danger-container")
                return;
            }

            console.log("projectMetaURI ", projectMetaURI)

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

            console.log("genesisProfileStr ", genesisProfileStr)

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
                description: desc,
                image: project.image.type,
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
        
            const inviteMetaURI: any = await pinFileToShadowDriveUrl(invitebody);
            if (inviteMetaURI === "") {
                createMessage(
                    "We’re sorry, there was an error while trying to prepare meta url. please try again later.",
                    "danger-container",
                );
                return;
            }
            // creating invitation
            setButtonText("Creating Badge Account...")
        
            const res2: any = await communityConnection.initBadge({
                name: "Invitation",
                symbol:  "INVITE",
                uri:inviteMetaURI,
                profile: genesisProfileStr,
            });
            console.log("invite result ", res2)

            setButtonText("Waiting for Confirmation...")
            await delay(15000)

            setButtonText("Minting Badges...")
            const res3 = await communityConnection.createBadge({
                amount: 100,
                subscriptionToken: res2.Ok.info.subscriptionToken,
            });
            console.log("invite badge result ", res3)

            setButtonText("Waiting for Confirmation...")
            await delay(15000)

            setButtonText("Creating LUT Registration...")
            const res4:any = await communityConnection.registerCommonLut();
            console.log("register lookup result ", res4)

            setButtonText("Buying new Project...")
            const res5 = await communityConnection.sendProjectPrice(profileInfo?.profile.address,1);
            if(res5.Err) {
                createMessage("error creating new project","danger-container")
                return
            }
            console.log("send price result ", res5.Ok?.info)

            // save coins
            await axios.post("/api/project/save-coins", {
                name: coins.name,
                symbol: coins.symbol,
                image: coins.image.preview,
                key: mintKey,
                desc: coins.desc,
                supply: coins.supply,
                creator: wallet.publicKey.toBase58(), 
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
                    image: passItem.image.preview,
                    key: passKeys[index],
                    desc: passItem.desc,
                    price: passItem.price,
                    supply: passItem.supply,
                    discount: passItem.discount,
                    promoterroyality: passItem.promoterRoyalty,
                    scoutroyalty: passItem.scoutRoyalty,
                    creator: wallet.publicKey.toBase58(), 
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
                    name: element.title,
                    communitykey: element.community,
                    projectkey: projectKeyPair.publicKey.toBase58()
                });
            }

           // save profile
            for (let index = 0; index < communities.profiles.length; index++) {
                const element:any = communities.profiles[index];
                await axios.post("/api/project/save-profile", {
                    name: element.name,
                    profilekey: element.profilenft,
                    role: element.role,
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
                image: project.image.preview, 
                key: projectKeyPair.publicKey.toBase58(), 
                lut: res4.Ok.info.lookupTable, 
                seniority: 0, 
                price: project.passPrice,
                distribution: project.priceDistribution,
                invitationprice: project.invitationPrice,
                discount: project.discount,
                telegram: project.telegram, 
                twitter: project.twitter, 
                website: project.website, 
                presalesupply: coins.supply * (presale.maxPresale/100),
                minpresalesupply: (coins.supply * (presale.maxPresale/100)) * (presale.minPresale/100), 
                presalestartdate: presaleStart, 
                presaleenddate: presaleEnd, 
                dexlistingdate: dexDate
            });
            localStorage.removeItem("projectstep1")
            localStorage.removeItem("projectstep2")
            localStorage.removeItem("projectstep3")
            localStorage.removeItem("projectstep4")
            localStorage.removeItem("projectstep5")
            localStorage.removeItem("projectstep6")
            localStorage.removeItem("projectstep7")
            localStorage.removeItem("projectstep8")
            localStorage.removeItem("projectstep9")
            setLoading(false)
            setButtonText("Deploy Token Presale")
            navigate.push("/create/project/"+projectKeyPair.publicKey.toBase58());
        } catch (error) {
           console.log("error", error);
           createMessage("error processing new project","danger-container")
        }
    }

    // const testPrograms = async () => {
    //     try {
    //         setLoading(true)
    //         setButtonText("test pass test...");
    //         const projectKeyPair = anchor.web3.Keypair.generate();

    //         const mintKey = anchor.web3.Keypair.generate().publicKey;

    //         const env = new anchor.AnchorProvider(connection.connection, wallet, {
    //             preflightCommitment: "processed",
    //         });
    //         anchor.setProvider(env);
    //         let communityConnection: Community = new Community(env, web3Consts.programID, projectKeyPair.publicKey);
    //         let userConn: UserConn = new UserConn(env, web3Consts.programID);
    //         const myProfileInfo = await userConn.getUserInfo();


    //         let passKeys = []
    //         for (let index = 0; index < passes.length; index++) {
    //             const passItem:any = passes[index];

    //             // uploading launcpasses metadata
    //             setButtonText("Creating "+passItem.name+" metadata...")
    //             let passBody = {
    //                 name: passItem.name,
    //                 symbol: passItem.symbol,
    //                 description: passItem.desc,
    //                 image: passItem.image.preview,
    //                 enternal_url: process.env.NEXT_PUBLIC_APP_MAIN_URL,
    //                 family: "MMOSH",
    //                 collection: "MMOSH Pass Collection",
    //                 attributes: [
    //                   {
    //                     trait_type: "Primitive",
    //                     value: "Pass",
    //                   },
    //                   {
    //                     trait_type: "MMOSH",
    //                     value: " Genesis MMOSH",
    //                   },
    //                   {
    //                     trait_type: "Community Coin",
    //                     value: mintKey,
    //                   },
    //                   {
    //                     trait_type: "Founder",
    //                     value: profileInfo?.profile.name,
    //                   },
    //                   {
    //                     trait_type: "Discount",
    //                     value: passItem.discount,
    //                   },
    //                   {
    //                     trait_type: "Supply",
    //                     value: passItem.supply,
    //                   },
    //                 ],
    //             }

    //             const passMetaHash: any = await pinFileToShadowDrive(passBody);
    //             if (passMetaHash === "") {
    //                 createMessage("We’re sorry, there was an error while trying to prepare meta url. please try again later.","danger-container")
    //                 return;
    //             }
    //             const passMetaURI = "https://shdw-drive.genesysgo.net/" +process.env.NEXT_PUBLIC_SHDW_DRIVE_PUB_KEY +"/"+ passMetaHash;

    //             setButtonText("Creating "+passItem.name+"...")
    //             let redemptionDate = new Date(new Date(passItem.redemptionDate + " "+passItem.redemptionTime).toUTCString()).valueOf()
    //             const passKey = await communityConnection.createLaunchPass({
    //                 name: passItem.name,
    //                 symbol:passItem.symbol, 
    //                 uri: passMetaURI,
    //                 redeemDate:0, 
    //                 redeemAmount: prepareNumber(Math.ceil(passItem.price / (coins.listingPrice - (coins.listingPrice * (passItem.discount / 100))))) * web3Consts.LAMPORTS_PER_OPOS,
    //                 cost: passItem.price * 1000_000,
    //                 distribution: {
    //                       parent: 100 * passItem.scoutRoyalty,
    //                       grandParent: 0,
    //                       greatGrandParent: 0,
    //                       ggreatGrandParent: 100 * project.priceDistribution.scout,
    //                       genesis: 0,
    //                 }
    //             })
    //             passKeys.push(passKey)
    //             // creating launch pass
    //         }
    //         console.log("passKeys ", passKeys)


    //         setLoading(false)
    //         setButtonText("Deploy Token Presale")
    //     } catch (error) {
    //         console.log("error", error);
    //         createMessage("error processing new project","danger-container")
    //     }

    // }

    const goBack = () => {
        onPageChange("step9")
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
                <div className="backdrop-container rounded-xl border border-white border-opacity-20 my-10 container mx-auto">
                    <div className="border-b border-white border-opacity-20 p-3.5">
                       <h2 className="text-center text-white font-goudy font-normal text-xl">Launch Your Community Coin</h2>
                    </div>
                    <div className="p-5">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            <div className="col-span-3">
                                <div className="md:mb-3.5">
                                    <h3 className="text-sub-title-font-size text-while font-poppins mb-3.5">Project Pass</h3>
                                    <div>
                                        <h3 className="text-sub-title-font-size text-while font-poppins text-center">{project.name}</h3>
                                        <div>
                                        <div className="rounded-md gradient-container p-1.5 mr-5">
                                                <img src={project.image.preview}className="w-full object-cover aspect-square"/>
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
                                                <img src={coins.image.preview} className="w-full rounded-full aspect-square object-cover"/>
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
                                {presale.minPresale > 0 &&
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
                                }
                            </div>
                        </div>

                        {passes.map((passItem:any, i) => (
                            <div className="pt-10">
                                    <h3 className="text-sub-title-font-size text-while font-poppins mb-3.5">LaunchPass {i+1}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                        <div className="col-span-2">
                                            <img src={passItem.image.preview} className="w-full aspect-square object-cover rounded-md"/>
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
                                                    <p className="text-para-font-size light-gray-color text-center">{fileItem.name}</p>
                                                    <div className="w-8 mx-auto"><FileIcon /></div>          
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                            </div>
                            <div className="col-span-4">
                                    <h3 className="text-sub-title-font-size text-while font-poppins mb-3.5">Tokenomics</h3>
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
                                                    <p className="pl-2.5 text-header-small-font-size">{tokenomicschartItem.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                            </div>
                        </div>
                        </div>
            
                        <h3 className="text-sub-title-font-size text-while font-poppins text-center pt-10">Summary of Costs</h3>
                        <p className="text-header-small-font-size text-white text-center mt-1.5">for Liquidity Pool</p>
                        <div className="flex justify-center mt-3.5">
                            <div className="flex justify-center mr-3.5">
                                <p className="text-header-small-font-size text-white mr-1">USDC</p>
                                <p className="text-header-small-font-size text-white">{liquidity.usd.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-center mr-3.5">
                                <p className="text-header-small-font-size text-white mr-1">SOL</p>
                                <p className="text-header-small-font-size text-white">{liquidity.sol.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-center mr-3.5">
                                <p className="text-header-small-font-size text-white mr-1">MMOSH</p>
                                <p className="text-header-small-font-size text-white">{liquidity.mmosh.toFixed(2)}</p>
                            </div>
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
                            <p className="text-para-font-size text-white min-w-24">MMOSH</p>
                            <p className="text-para-font-size text-white min-w-24">100,000</p>
                        </div>
                        <div className="flex justify-center">
                            <p className="text-para-font-size text-white mr-3.5">Current Balance</p>
                            <p className="text-para-font-size text-white min-w-24">{profileInfo?.usdcBalance.toFixed(2)} USDC</p>
                        </div>
                        <div className="flex justify-center">
                            <p className="text-para-font-size text-white mr-3.5">Current Balance</p>
                            <p className="text-para-font-size text-white min-w-24">{profileInfo?.solBalance.toFixed(2)} SOL</p>
                        </div>
                        <div className="flex justify-center">
                            <p className="text-para-font-size text-white mr-3.5">Current Balance</p>
                            <p className="text-para-font-size text-white min-w-24">{profileInfo?.mmoshBalance.toFixed(2)} MMOSH</p>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}
