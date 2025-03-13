"use client";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
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
import ArrowBack from "@/assets/icons/ArrowBack";
import Input from "@/app/components/common/Input";
import moment from "moment";

const Offer = ({ params }: { params: { symbol: string, offersymbol: string } }) => {
    const drawerRef = useRef<HTMLInputElement>(null);
    const [profileInfo] = useAtom(userWeb3Info);
    const [offerDetail, setOfferDetail] =  React.useState<any>(null)
    const [loading, setLoading] = useState(true);
    const [projectDetail, setProjectDetail] =  React.useState<any>(null)
    const [supplyValue, setSupplyValue] = useState(1)
    const [inputValue, setInputValue] = useState(0)
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

    const [subscription, setSubscription] =  React.useState<any>(null)

    const [owner, setOwner] = useState(false);

    const [histories, setHistories] = React.useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [historyPage, setHistoryPage] = useState(1);
    const [isHistoryPaging, setIsHistoryPaging] = useState(false);

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
            getUserSubscription()
            listHistoryApi(1);
        }
     
    },[offerDetail, wallet])

    const listHistoryApi = async (page: any) => {
        if (!wallet) {
          return;
        }
        try {
          setHistoryLoading(true);
          setIsHistoryPaging(false);
          let url = "/api/offer/receipts?page=" + page + "&&offer=" + offerDetail.key;
          let apiResult = await axios.get(url);
    
          let newHistories: any = page == 1 ? [] : histories;
    
          for (let index = 0; index < apiResult.data.length; index++) {
            const element: any = apiResult.data[index];
            newHistories.push(element);
          }
          console.log("listHistoryApi ", histories);
          setHistories(newHistories);
          if (apiResult.data.length < 8) {
            setIsHistoryPaging(false);
          } else {
            setIsHistoryPaging(true);
          }
          setHistoryLoading(false);
        } catch (error) {
          console.log("listHistoryApi error", error);
          setHistoryLoading(false);
          setHistories([]);
        }
      };
    
    const nextHistoryPage = () => {
        let currentPage = historyPage + 1;
        setHistoryPage(currentPage);
        listHistoryApi(currentPage);
    };
    

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

    const getUserSubscription = async() => {
        try {
            if(!wallet) {
               setSubscription(null)
            }
            let subscriptionResult = await axios.get("/api/offer/subscriptions?wallet="+wallet?.publicKey.toBase58()+"&&offer="+offerDetail.key);
            setSubscription(subscriptionResult.data)
        } catch (error) {
            setSubscription(null)
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
            if(result.data.status) {
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
                createMessage(result.data.message, "danger-container")
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

    const closeDrawer = () => {
        if (drawerRef.current) {
          drawerRef.current.checked = false;
        }
    };

    const inviteAction = async() => {
        if(!wallet) {
            createMessage(
                "Hey! We checked your wallet is not connected",
                "warning-container",
            );
            closeDrawer()
            return
        }

        if (Number(inputValue) == 0) {
            createMessage(
                "Please Enter invitation mint count",
                "warning-container",
              );
              closeDrawer()
            return;
        }
        if (profileInfo?.solBalance == 0) {
            createMessage(
              "Hey! We checked your wallet and you don’t have enough SOL for the gas fees. Get some Solana and try again!",
              "warning-container",
            );
            closeDrawer()
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
        setInviteLoading(true)
        anchor.setProvider(env);
        let projectConn: CommunityConn = new CommunityConn(env, web3Consts.programID, new anchor.web3.PublicKey(offerDetail.key));

        try {
            const res = await projectConn.createBadge({
                amount: Number(inputValue),
                subscriptionToken: new anchor.web3.PublicKey(offerDetail.badge)
            })
    
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
            closeDrawer()
            setInviteLoading(false)
        } catch (error) {
            createMessage(
                "We’re sorry, there was an error while trying to mint your Invitation Badge(s). Check your wallet and try again.",
                "danger-container",
            );
            setInviteLoading(false)
            closeDrawer()
        }

    }

    const actionSubscribe = async () => {
        try {
            if(!wallet) {
               setSubscription(null)
            }
            let subscriptionResult = await axios.post("/api/offer/cancel-subscription",{wallet:wallet?.publicKey.toBase58(), offer:offerDetail.key});
            if(subscriptionResult.data) {
                await getUserSubscription()
            }
        } catch (error) {
            createMessage(
                "Error on subscription action",
                "danger-container",
            );
        }
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
               <input ref={drawerRef} id="my-drawer-4" type="checkbox" className="drawer-toggle" />
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
                      <>
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
                            <div className="md:flex mb-5">
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
                                <div className="md:flex md:flex-1 md:flex-col">
                                    <div className="md:flex md:justify-between md:mb-5">

                                       <div className="flex items-center rounded-lg md:mb-0 mb-3.5">
                                            <p className="text-sm text-white">
                                            <span className="font-bold text-sm text-white mr-4">
                                                Total Supply
                                            </span>
                                            </p>
                                            <div className="px-2 py-1 bg-[#08002B] rounded-lg w-20">
                                            <p className="text-sm text-white">{offerDetail.supply > 0 ? offerDetail.supply : "Unlimited"}</p>
                                            </div>
                                        </div>   
                                        <div className="flex items-center rounded-lg md:mr-10 md:mb-0 mb-3.5">
                                            <p className="text-sm text-white">
                                            <span className="font-bold text-sm text-white mr-4">
                                                Quantity
                                            </span>
                                            </p>
                                            <div className="px-2 bg-[#08002B] rounded-lg">
                                                <input 
                                                className="w-20 bg-transparent"
                                                type="number" 
                                                placeholder="0"
                                                value={supplyValue > 0 ? supplyValue.toString() : ""}
                                                onChange={(e) => setSupplyValue(prepareNumber(Number(e.target.value)))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:flex md:justify-between md:mb-5">
                                        <div className="flex items-center rounded-lg md:mb-0 mb-3.5">
                                            <p className="text-sm text-white">
                                            <span className="font-bold text-sm text-white mr-4">
                                                Available
                                            </span>
                                            </p>
                                            <div className="px-2 py-1 bg-[#08002B] rounded-lg w-20">
                                            <p className="text-sm text-white">{offerDetail.supply > 0 ? offerDetail.supply - offerDetail.sold : "Unlimited"}</p>
                                            </div>
                                        </div>   
                                        <div className="flex items-center rounded-lg md:mb-0 mb-3.5">
                                            <p className="text-sm text-white">
                                            <span className="font-bold text-sm text-white mr-4">
                                                Total Purchased
                                            </span>
                                            </p>
                                            <div className="px-2 py-1 bg-[#08002B] rounded-lg w-20">
                                            <p className="text-sm text-white">{offerDetail.sold}</p>
                                            </div>
                                        </div>   
                                    </div>
                                </div> 
                            </div>
                            {usdcPrice > 0 && (offerDetail.supply == 0 || offerDetail.supply >= (offerDetail.sold + supplyValue)) && 
                                <>
                                    {offerDetail.pricetype === "onetime" && 
                                        <div className="mb-5">
                                          {!(offerDetail.discount > 0 && hasInivtation) &&
                                            <>
                                                <p className="text-base">Current Price</p>
                                                <h2 className="text-white text-lg uppercase mb-3.5">
                                                    {projectDetail.coins[0].symbol.toUpperCase()} 
                                                    {offerDetail.discount == 0 && 
                                                    <span className="ml-3.5 text-lg text-white">{(Number(offerDetail.priceonetime) / usdcPrice).toFixed(2)}</span>
                                                    }
                                
                                                    
                                                </h2>
                                            </>
                                          }
                                          {(offerDetail.discount > 0 && hasInivtation) &&
                                             <>
                                                <p className="text-base font-bold">Original Price:  <span className="font-normal">{projectDetail.coins[0].symbol.toUpperCase()} {(Number(offerDetail.priceonetime) / usdcPrice).toFixed(2)}</span></p>
                                                <p className="text-[#08FCEF] text-sm">{offerDetail.discount}% INVITE discount applied: {((Number(offerDetail.priceonetime) * (offerDetail.discount / 100)) / usdcPrice).toFixed(2)}</p>
                                                <p className="text-base font-bold mb-5">New Price:  <span className="font-normal">{((Number(offerDetail.priceonetime) - (Number(offerDetail.priceonetime) * (offerDetail.discount / 100))) / usdcPrice).toFixed(2)}</span></p>
                                             </>
                                          }
                                        {!oneTimeLoading && 
                                            <button
                                            className="btn btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white"
                                            onClick={()=>{mintOffer("onetime")}}
                                            >
                                            Buy Now
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
                                        <div className="md:flex mb-5">
                                            {offerDetail.pricemonthly > 0 &&
                                                <div className="md:mb-0 md:mr-10 mb-3.5 bg-[#08002B] rounded-md py-3.5 px-10 text-center">
                                                    <p className="text-base mb-5">Monthly</p>

                                                        {!(offerDetail.discount > 0 && hasInivtation) &&
                                                        <>                                                                                             <p className="text-base">Current Price</p>
                                                                                                                                                                 <h2 className="text-white text-lg uppercase mb-3.5">
                                                                                                                                                                    {projectDetail.coins[0].symbol.toUpperCase()}  
                                                            <span className="mr-3.5 ml-3.5 text-lg text-white">{(Number(offerDetail.pricemonthly) / usdcPrice).toFixed(2)}</span>
                                                            </h2>
                                                        </>
                                                        }
                                                        {(offerDetail.discount > 0 && hasInivtation) && 
                                                        <>
                                                <p className="text-base font-bold">Original Price:  <span className="font-normal">{projectDetail.coins[0].symbol.toUpperCase()} {(Number(offerDetail.pricemonthly) / usdcPrice).toFixed(2)}</span></p>
                                                <p className="text-[#08FCEF] text-sm">{offerDetail.discount}% INVITE discount applied: {((Number(offerDetail.pricemonthly) * (offerDetail.discount / 100)) / usdcPrice).toFixed(2)}</p>
                                                <p className="text-base font-bold mb-5">New Price:  <span className="font-normal">{((Number(offerDetail.pricemonthly) - (Number(offerDetail.pricemonthly) * (offerDetail.discount / 100))) / usdcPrice).toFixed(2)}</span></p>
                                                        </>
                                                        }
                                                    {!monthlyLoading &&
                                                        <button
                                                        className="btn btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white rounded-full"
                                                        onClick={()=>{mintOffer("month")}}
                                                        >
                                                        Buy Now
                                                        </button>
                                                    }
                                                    {monthlyLoading &&
                                                        <button
                                                        className="btn btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white rounded-full"
                                                        >
                                                        Minting...
                                                        </button>
                                                    }
                                                </div>
                                            }

                                            {offerDetail.priceyearly > 0 &&
                                                <div className="bg-[#08002B] rounded-md py-3.5 px-10 text-center">
                                                    <p className="text-base mb-5">Yearly</p>
                                                        {!(offerDetail.discount > 0 && hasInivtation) && 
                                                        <>                                                                                          <p className="text-base">Current Price</p>
                                                        <h2 className="text-white text-lg uppercase mb-3.5">
                                                           {projectDetail.coins[0].symbol.toUpperCase()}  
<span className="mr-3.5 ml-3.5 text-lg text-white">{(Number(offerDetail.priceyearly) / usdcPrice).toFixed(2)}</span>
</h2>
</>
                                                        }
                                                        {(offerDetail.discount > 0 && hasInivtation) &&
                                                        <>
                                                <p className="text-base font-bold">Original Price:  <span className="font-normal">{projectDetail.coins[0].symbol.toUpperCase()} {(Number(offerDetail.priceyearly) / usdcPrice).toFixed(2)}</span></p>
                                                <p className="text-[#08FCEF] text-sm">{offerDetail.discount}% INVITE discount applied: {((Number(offerDetail.priceyearly) * (offerDetail.discount / 100)) / usdcPrice).toFixed(2)}</p>
                                                <p className="text-base font-bold mb-5">New Price:  <span className="font-normal">{((Number(offerDetail.priceyearly) - (Number(offerDetail.priceyearly) * (offerDetail.discount / 100))) / usdcPrice).toFixed(2)}</span></p>
                                                        </>
                                                        }
                                                    {!yearlyLoading &&
                                                        <button
                                                            className="btn btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white rounded-full"
                                                            onClick={()=>{mintOffer("year")}}
                                                            > 
                                                            Buy Now
                                                        </button>
                                                    }
                                                    {yearlyLoading &&
                                                        <button
                                                            className="btn btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white rounded-full"
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
                        <div className={!subscription ? "md:grid-cols-1" : "md:grid-cols-3" + " grid grid-cols-1 gap-4 my-10"}>
                            {subscription &&
                                <div className="col-span-1">
                                    {subscription &&
                                        <div className="card bg-[#08002B] shadow-sm">
                                            <div className="card-body">
                                                <h2 className="card-title">Subscription Details</h2>
                                                <figure>
                                                 <h2>Balance: {projectDetail.coins[0].symbol.toUpperCase()} 0</h2> 
                                                </figure>
                                                <p className="text-base font-bold">
                                                    Current Plan:  
                                                    <span className="ml-3.5 font-normal">
                                                        {subscription.type}
                                                    </span>
                                                </p>
                                                <p className="text-base font-bold">
                                                    Ends at:
                                                    <span className="ml-3.5 font-normal">
                                                        {moment(subscription.end).format("L")}
                                                    </span>
                                                </p>
                                                <p className="text-base font-bold">
                                                    Plan Status:
                                                    <span className="ml-3.5 font-normal">
                                                        {subscription.status}
                                                    </span>
                                                </p>
                                                <div className="card-actions justify-between">
                                                  <button className="btn btn-primary bg-primary hover:text-white text-white hover:bg-primary border-none">Deposit</button>
                                                  <button className="btn btn-primary bg-primary hover:text-white text-white hover:bg-primary border-none">Withdraw</button>
                                                  {subscription.status === "active" &&
                                                        <button className="btn btn-primary bg-primary hover:text-white text-white hover:bg-primary border-none" onClick={actionSubscribe}>Cancel</button>
                                                  }
                                                  {subscription.status === "cancelled" &&
                                                        <button className="btn btn-primary bg-primary hover:text-white text-white hover:bg-primary border-none" onClick={actionSubscribe}>Activate</button>
                                                  }
                                                </div>
                                            </div>
                                        </div>
                                    }

                                </div>
                            }
                            <div className={subscription ? "col-span-2" : ""}>
                                <div className="card bg-[#08002B] shadow-sm">
                                    <div className="card-body">
                                       <h2 className="card-title">Billing History</h2>
                           
<div className="overflow-x-auto pt-2.5">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th>Type</th>
        <th>Amount</th>
        <th>Supply</th>
        <th>Buyer</th>
        <th>Signature</th>
      </tr>
    </thead>
    <tbody>
        {historyLoading &&
            <tr>
                <td colSpan={5}>
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
                </td>

            </tr>
        }
        {!historyLoading && histories.length == 0 && (
            <tr>
                <td colSpan={5}>
                    <div className="mb-5 text-header-small-font-size text-center">
                        {" "}
                        No History found{" "}
                    </div>
                </td>
            </tr>
        )}

{!historyLoading && histories.length > 0 &&
    <>
        {histories.map((item: any, index: number) => (
           <tr>
              <th>{item.type}</th>
              <th>{projectDetail.coins[0].symbol.toUpperCase() + " " + item.price}</th>
              <th>{item.supply}</th>
              <th><a href={"https://explorer.solana.com/address/" + item.buyer} target="_blank">{item.buyer.substring(0,4)}...{item.buyer.substring(item.buyer.length - 4, item.buyer.length)}</a></th>
              <th><a href={"https://explorer.solana.com/tx/" + item.signature} target="_blank">{item.signature.substring(0,4)}...{item.signature.substring(item.signature.length - 4, item.signature.length)}</a></th>
           </tr>
        ))}
    </>
}

        {isHistoryPaging && !historyLoading && (
            <tr>
                <td colSpan={5}>
                    <div className="flex justify-center mt-5">
                        <button
                            className="btn btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white"
                            onClick={nextHistoryPage}
                        >
                            Load More
                        </button>
                    </div>
                </td>
            </tr>
        )}
    </tbody>
  </table>
</div>
</div>
                                </div>
                            </div>

                        </div>
                      </>
                    }
                    </div>
                </div>
                <div className="drawer-side z-10">
                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                    <div className="menu bg-profile text-base-content min-h-full w-80 md:w-1/3 px-4 py-10">
                        <div
                            className="flex cursor-pointer"
                            onClick={closeDrawer}
                        >
                            <ArrowBack />
                            <h2 className="text-white text-lg ml-5">Offers</h2>
                        </div>
                        {offerDetail &&
                            <div className="m-5">

                            <div className="rounded-md p-2.5 border-[#FFFFFF47] border-[1px]">
                               <h4 className="text-lg font-bold text-white">Invitation Badge</h4>
                                <div className="rounded-md">
                                    <img src={offerDetail.inviteimage} alt="invitation" className="w-full object-cover p-0.5 rounded-md"/>
                                </div>

                                <div className="mt-2 mb-5">
                                <p className="text-para-font-size text-center">Invitations to Mint</p>
                                <div className="max-w-28 mx-auto">
                                    <Input
                                            type="text"
                                            title=""
                                            required={false}
                                            helperText=""
                                            placeholder="0"
                                            value={inputValue > 0 ? inputValue.toString() : ""}
                                            onChange={(e) => setInputValue(prepareNumber(Number(e.target.value)))}
                                        />
                                </div>
                                </div>
                                <div className="text-center">
                                    {!inviteLoading &&
                                        <button className="btn-sm btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white rounded-md px-10" onClick={inviteAction}>Mint</button>
                                    }
                                    {inviteLoading &&
                                        <button className="btn-sm btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white rounded-md px-10">Minting...</button>
                                    }
                                    <p className="text-para-font-size text-center font-bold">Current Balance</p>
                                    <p className="text-para-font-size text-center leading-none">{profileInfo?.solBalance.toFixed(2)} SOL</p>
                                </div>
                            </div>
                            </div>
                        }

                    </div>
                </div>
            </div>

        </>
    )
}

export default Offer