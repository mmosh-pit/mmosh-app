"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Bars } from "react-loader-spinner";
import { CoinDetail } from "@/app/models/coin";
import { useAtom } from "jotai";
import { userWeb3Info } from "@/app/store";
import useWallet from "@/utils/wallet";
import { Connection } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { Connectivity as UserConn } from "@/anchor/user";
import { Connectivity as CommunityConn } from "@/anchor/community";
import { web3Consts } from "@/anchor/web3Consts";
import { token } from "@metaplex-foundation/js";

const Offer = ({ params }: { params: { symbol: string, offersymbol: string } }) => {
    const [profileInfo] = useAtom(userWeb3Info);
    const [offerDetail, setOfferDetail] =  React.useState<any>(null)
    const [loading, setLoading] = useState(true);
    const [projectDetail, setProjectDetail] =  React.useState<any>(null)
    const [supplyValue, setSupplyValue] = useState(1)
    const [usdcPrice, setUsdcPrice] = useState(0)
    const [tokenBalance, setTokenBlance] = useState(0)
    const wallet = useWallet();

    const [showMsg, setShowMsg] = useState(false);
    const [msgClass, setMsgClass] = useState("");
    const [msgText, setMsgText] = useState("");


    const [oneTimeLoading, setOneTimeLoading] = useState(false);
    const [monthlyLoading, setMonthlyLoading] = useState(false);
    const [yearlyLoading, setYearlyLoading] = useState(false);
    const [inviteLoading, setInviteLoading] = useState(false);
    const [hasInivtation, setHasInvitation] = useState(false)

    const [owner, setOwner] = useState(false);

    useEffect(()=>{
        getProjectDetailFromAPI()
        getOfferDetailFromAPI()
    },[])

    useEffect(()=>{
        if(projectDetail) {
            getCoinDetail()
        }
    },[projectDetail, wallet])

    useEffect(()=>{
        if(offerDetail) {
            checkHasInvitation()
            getUserProfileInfo()
            
        }
    },[offerDetail, wallet])

    const createMessage = (message: any, type: any) => {
        window.scrollTo(0, 0);
        setMsgText(message);
        setMsgClass(type);
        setShowMsg(true);
        setLoading(false);
        if (type == "success-container") {
          setTimeout(() => {
            setShowMsg(false);
          }, 4000);
        } else {
          setTimeout(() => {
            setShowMsg(false);
          }, 4000);
        }
    };

    const getCoinDetail = async() => {
        try {
            const result = await axios.get<CoinDetail>(
                `/api/get-token-by-symbol?symbol=${projectDetail.coins[0].symbol}`,
            );
            getTokenPrice(result.data)
        } catch (error) {
            console.log("getCoinDetail error", error)
            setLoading(false)
        }
    }

    const getTokenPrice = async (coin: CoinDetail) => {
        try {
            let priceInUsd = 0;
            if(coin.status === "completed") {
                priceInUsd = await axios.get(
                    process.env.NEXT_PUBLIC_JUPITER_PRICE_API + `?ids=${coin!.target.token},EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`,
                );
            } else {
                let lastPriceResult = await axios.get(
                    "/api/token/lastprice?key=" + coin?.bonding,
                );
                const lookupUsdPrice = await axios.get(
                    process.env.NEXT_PUBLIC_JUPITER_PRICE_API + `?ids=${coin!.base.token},EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`,
                );
                console.log("lookup price ", Number(lookupUsdPrice.data?.data["EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"].price || 0.003));
                console.log("last price ", lastPriceResult.data.price);
                priceInUsd = lastPriceResult.data.price * Number(lookupUsdPrice.data?.data["EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"].price || 0.003)
                console.log("price in usd ", priceInUsd);
            }

            setUsdcPrice(priceInUsd)

            if(wallet) {
                const connection = new Connection(
                    process.env.NEXT_PUBLIC_SOLANA_CLUSTER!,
                    {
                      confirmTransactionInitialTimeout: 120000,
                    },
                  );
                const env = new anchor.AnchorProvider(connection, wallet, {
                preflightCommitment: "processed",
                });
        
                anchor.setProvider(env);
        
                const userConn: UserConn = new UserConn(env, web3Consts.programID);
                let balance = await userConn.getUserBalance({
                    address: wallet.publicKey,
                    token: coin.target.token,
                    decimals: 10 ** coin.target.decimals
                })
                setTokenBlance(balance)
            }


      
            setLoading(false)
        } catch (error) {
            console.log("getTokenPrice error", error)
            setUsdcPrice(0)
            setLoading(false)
        }

    };

    const checkHasInvitation = async () => {
        if(!wallet) {
            setHasInvitation(false)
            return;
        }
        const connection = new Connection(
            process.env.NEXT_PUBLIC_SOLANA_CLUSTER!,
            {
              confirmTransactionInitialTimeout: 120000,
            },
          );
        const env = new anchor.AnchorProvider(connection, wallet, {
        preflightCommitment: "processed",
        });

        anchor.setProvider(env);

        try {
            const projectConn: CommunityConn = new CommunityConn(env, web3Consts.programID, new anchor.web3.PublicKey(offerDetail.key));
            let isAvailable = await projectConn.isCreatorInvitation(
                new anchor.web3.PublicKey(offerDetail.badge),
                wallet.publicKey.toBase58()
            )
            setHasInvitation(isAvailable)
        } catch (error) {
            setHasInvitation(false)
        }


    }

    const getUserProfileInfo = async () => {
        if(!wallet) {
            return
        }
        const connection = new Connection(
            process.env.NEXT_PUBLIC_SOLANA_CLUSTER!,
            {
              confirmTransactionInitialTimeout: 120000,
            },
          );
        const env = new anchor.AnchorProvider(connection, wallet, {
            preflightCommitment: "processed",
        });

        anchor.setProvider(env);
        let projectConn: CommunityConn = new CommunityConn(env, web3Consts.programID, new anchor.web3.PublicKey(offerDetail.key));
        let projectInfo = await projectConn.getProjectUserInfo(offerDetail.key);

        if(projectInfo.profiles.length > 0) {
            if(projectInfo.profiles[0].address == offerDetail.key) {
                setOwner(true)
            } else {
                setOwner(false)
            }
        }
        console.log("projectInfo ", projectInfo)
    }
    
    const getProjectDetailFromAPI = async() => {
        try {
            let listResult = await axios.get(`/api/project/detail?symbol=${params.symbol}`);
            setProjectDetail(listResult.data)
        } catch (error) {
            console.log("getProjectDetailFromAPI error", error)
            setLoading(false)
            setProjectDetail(null)
        }
    }

    const getOfferDetailFromAPI = async() => {
        try {
            let listResult = await axios.get(`/api/offer/detail?symbol=${params.offersymbol}`);
            setOfferDetail(listResult.data)
            getCoinDetail()
        } catch (error) {
            console.log("getOfferDetailFromAPI error", error)
            setLoading(false)
            setOfferDetail(null)
        }
    }

    const prepareNumber = (inputValue:any) => {
        if(isNaN(inputValue)) {
            return 0
        }
        return inputValue;
    }

    const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));

    const mintOffer = async (type:string) => {
        if(supplyValue == 0) {
            createMessage("pls add supply before do mint", "danger-container")
            return
        }
        if(!wallet) {
            createMessage("Wallet is not connected", "danger-container")
            return
        }
        if(!profileInfo) {
            createMessage("profile is not connected", "danger-container")
            return
        }

        if(!profileInfo.profile.address) {
            createMessage("profile is not created", "danger-container")
            return
        }

        if(offerDetail.invitationype === "required" && !hasInivtation) {
            createMessage("Invitation required to mint offer", "danger-container")
            return
        }

        try {
            if(type === "onetime") {
                setOneTimeLoading(true)
            } else if(type === "month") {
                setMonthlyLoading(true)
            } else if(type === "year") {
                setYearlyLoading(true)
            } else {
                setInviteLoading(true)
            }
            const result: any = await axios.post("/api/offer/buy", {
                receiver: wallet.publicKey?.toBase58(),
                symbol: offerDetail.symbol,
                type,
                supply: supplyValue
            });
            if(result.data) {
                const connection = new Connection(
                    process.env.NEXT_PUBLIC_SOLANA_CLUSTER!,
                    {
                      confirmTransactionInitialTimeout: 120000,
                    },
                  );
                const env = new anchor.AnchorProvider(connection, wallet, {
                preflightCommitment: "processed",
                });
        
                anchor.setProvider(env);
        
                const userConn: UserConn = new UserConn(env, web3Consts.programID);
                const tx = anchor.web3.VersionedTransaction.deserialize(
                   Buffer.from(result.data.transaction, "base64"),
                );

                const signature = await userConn.provider.sendAndConfirm(tx);
                console.log("signature is ", signature)

                await delay(15000)
            } else {
                createMessage("Something went wrong", "danger-container")
            }

            setOneTimeLoading(false)
            setMonthlyLoading(false)
            setYearlyLoading(false)
            setInviteLoading(false)
        } catch (error) {
            console.log("error ", error)
            createMessage("Something went wrong", "danger-container");
            setOneTimeLoading(false)
            setMonthlyLoading(false)
            setYearlyLoading(false)
            setInviteLoading(false)
        }

    }

    const showInvitation = () => {

    }

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
            <div className="drawer drawer-end">
               <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <div className="container mx-auto py-10">
                    {loading &&
                        <div className="flex justify-center">
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

                    {!loading && !offerDetail &&
                        <div className="text-center mt-10">Offer not found</div>
                    }
                    {(!loading && offerDetail && projectDetail) &&
                        <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                            <div className="col-span-1">
                                <img
                                src={offerDetail.image}
                                alt="Profile Image"
                                className="rounded-md object-cover"
                                />
                            </div>
                            <div className="col-span-2">
                            <div className="md:flex justify-between mb-3.5">
                                <div>
                                    <h2 className="text-white text-lg underline capitalize">
                                        {offerDetail.name}
                                    </h2>
                                    <p className="text-white text-base underline">
                                        {offerDetail.symbol}
                                    </p>
                                </div>
                                {offerDetail.invitationype != "none" && owner &&
                                    <label htmlFor="my-drawer-4" className="drawer-button btn btn-primary bg-[#6607FF] text-white border-none hover:bg-primary hover:text-white md:mt-0 mt-5" onClick={showInvitation}>
                                        Mint Invitation
                                    </label>
                                }

                            </div>
                            <div className="mb-3.5">
                                <p className="text-base">{offerDetail.desc}</p>
                            </div>
                            <div className="md:flex mb-10">
                                <div className="flex items-center rounded-lg md:mr-10 md:mb-0 mb-3.5">
                                    <p className="text-sm text-white">
                                    <span className="font-bold text-sm text-white mr-4">
                                        Type of Offer
                                    </span>
                                    </p>
                                    <div className="px-2 bg-[#19066B] rounded-lg">
                                    <p className="text-sm text-white">{offerDetail.pricetype === "onetime" ? "One Time" : "Subscription"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center rounded-lg md:mr-10 md:mb-0 mb-3.5">
                                    <p className="text-sm text-white">
                                    <span className="font-bold text-sm text-white mr-4">
                                        Quantity
                                    </span>
                                    </p>
                                    <div className="px-2 bg-[#19066B] rounded-lg">
                                        <input 
                                        type="number" 
                                        placeholder="0"
                                        value={supplyValue > 0 ? supplyValue.toString() : ""}
                                        onChange={(e) => setSupplyValue(prepareNumber(Number(e.target.value)))}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center rounded-lg md:mb-0 mb-3.5">
                                    <p className="text-sm text-white">
                                    <span className="font-bold text-sm text-white mr-4">
                                        Available
                                    </span>
                                    </p>
                                    <div className="px-2 bg-[#19066B] rounded-lg">
                                    <p className="text-sm text-white">{offerDetail.supply > 0 ? offerDetail.supply : "Unlimited"}</p>
                                    </div>
                                </div>     
                            </div>
                            {usdcPrice > 0 && (offerDetail.supply == 0 || offerDetail.supply >= (offerDetail.sold + supplyValue)) && 
                                <>
                                    {offerDetail.pricetype === "onetime" && 
                                            <div className="mb-10">
                                                <p className="text-base">Current Price</p>
                                                <h2 className="text-white text-lg uppercase mb-3.5">
                                                    {projectDetail.coins[0].symbol.toUpperCase()} 
                                                    {offerDetail.discount == 0 && 
                                                    <span className="ml-3.5 text-lg text-white">{(Number(offerDetail.priceonetime) / usdcPrice).toFixed(2)}</span>
                                                    }
                                                    {offerDetail.discount > 0 && 
                                                    <>
                                                        <span className="line-through ml-3.5 text-lg text-white">{(Number(offerDetail.priceonetime) / usdcPrice).toFixed(2)}</span>
                                                        <span className="ml-3.5 text-lg text-white">{((Number(offerDetail.priceonetime) - (Number(offerDetail.priceonetime) * (offerDetail.discount / 100))) / usdcPrice).toFixed(2)}</span>
                                                    </>
                                                    }
                                                    
                                                </h2>
                                                {!oneTimeLoading && 
                                                    <button
                                                    className="btn btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white"
                                                    onClick={()=>{mintOffer("onetime")}}
                                                    >
                                                    Mint Offer
                                                    </button>
                                                
                                                }

                                                {oneTimeLoading && 
                                                    <button
                                                    className="btn btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white"
                                                    >
                                                    Minting...
                                                    </button>
                                                
                                                }

                                            </div>
                                    }

                                    {offerDetail.pricetype !== "onetime" && 
                                        <div className="md:flex mb-10">
                                            {offerDetail.pricemonthly > 0 &&
                                                <div className="md:mb-0 md:mr-10 mb-3.5">
                                                    <p className="text-base">Current Price</p>
                                                    <h2 className="text-white text-lg uppercase mb-3.5">
                                                        {projectDetail.coins[0].symbol.toUpperCase()} 
                                                        {offerDetail.discount == 0 && 
                                                            <span className="mr-3.5 ml-3.5 text-lg text-white">{(Number(offerDetail.pricemonthly) / usdcPrice).toFixed(2)} / Monthly</span>
                                                        }
                                                        {offerDetail.discount > 0 && 
                                                        <>
                                                            <span className="line-through ml-3.5 text-lg text-white">{(Number(offerDetail.pricemonthly) / usdcPrice).toFixed(2)}</span>
                                                            <span className="text-lg text-white">{((Number(offerDetail.pricemonthly) - (Number(offerDetail.pricemonthly) * (offerDetail.discount / 100))) / usdcPrice).toFixed(2)} / Monthly</span>
                                                        </>
                                                        }
                                                    </h2>
                                                    {!monthlyLoading &&
                                                        <button
                                                        className="btn btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white"
                                                        onClick={()=>{mintOffer("month")}}
                                                        >
                                                        Mint Offer
                                                        </button>
                                                    }
                                                    {monthlyLoading &&
                                                        <button
                                                        className="btn btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white"
                                                        >
                                                        Minting...
                                                        </button>
                                                    }
                                                </div>
                                            }

                                            {offerDetail.priceyearly > 0 &&
                                                <div>
                                                    <p className="text-base">Current Price</p>
                                                    <h2 className="text-white text-lg uppercase mb-3.5">
                                                        {projectDetail.coins[0].symbol.toUpperCase()}
                                                        {offerDetail.discount == 0 && 
                                                            <span className="text-lg ml-3.5 text-white">{(Number(offerDetail.priceyearly) / usdcPrice).toFixed(2)} / Yearly</span>
                                                        }
                                                        {offerDetail.discount > 0 && 
                                                        <>
                                                            <span className="line-through ml-3.5 text-lg text-white">{(Number(offerDetail.priceyearly) / usdcPrice).toFixed(2)}</span>
                                                            <span className="ml-3.5 text-lg text-white">{((Number(offerDetail.priceyearly) - (Number(offerDetail.priceyearly) * (offerDetail.discount / 100))) / usdcPrice).toFixed(2)} / Yearly</span>
                                                        </>
                                                        }
                                                    </h2>
                                                    {!yearlyLoading &&
                                                        <button
                                                            className="btn btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white"
                                                            onClick={()=>{mintOffer("year")}}
                                                            > 
                                                            Mint Offer
                                                        </button>
                                                    }
                                                    {yearlyLoading &&
                                                        <button
                                                            className="btn btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white"
                                                            > 
                                                            Minting...
                                                        </button>
                                                    }
                                                </div>
                                            }
                                        </div>
                                    }
                                </>
                            } 

                            <div className="flex flex-col">
                                <div className="flex items-center">
                                    <p className="text-sm text-white">Current balance</p>
                                    <div className="bg-black bg-opacity-[0.2] px-1 py-2 min-w-[3vmax] mx-2 rounded-md">
                                    {tokenBalance}
                                    </div>
                                    <p className="text-sm text-white">{projectDetail.coins[0].symbol.toUpperCase()}</p>
                                </div>

                                <div className="flex items-center">
                                    <p className="text-sm text-white">Current balance</p>
                                    <div className="bg-black bg-opacity-[0.2] px-1 py-2 min-w-[3vmax] mx-2 rounded-md">
                                    {profileInfo?.solBalance || 0}
                                    </div>
                                    <p className="text-sm text-white">SOL</p>
                                </div>
                            </div>

                        </div>
                        </div>
                    }
                    </div>
                </div>
                <div className="drawer-side z-10">
                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    {/* Sidebar content here */}
                    <li><a>Sidebar Item 1</a></li>
                    <li><a>Sidebar Item 2</a></li>
                    </ul>
                </div>
            </div>

        </>
    )
}

export default Offer