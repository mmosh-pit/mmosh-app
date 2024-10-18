"use client";
import * as React from "react";


import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAtom } from "jotai";
import { userWeb3Info } from "@/app/store";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Connectivity as ProjectConn } from "@/anchor/community";
import * as anchor from "@coral-xyz/anchor";
import { web3Consts } from "@/anchor/web3Consts";
import axios from "axios";
import { Bars } from "react-loader-spinner";
import CopyIcon from "@/assets/icons/CopyIcon";
import AddIcon from "@/assets/icons/AddIcon";
import CloseIcon from "@/assets/icons/CloseIcon";
import Search from "@/app/components/common/Search";
import { Coin } from "@/app/models/coin";
import CoinListItem from "@/app/components/common/CoinListItem";
import { SwapCoin } from "@/app/models/swapCoin";
import { getPriceForPTV } from "@/app/lib/forge/jupiter";
import Image from "next/image";
import { walletAddressShortener } from "@/app/lib/walletAddressShortener";
import OpenInNew from "@/assets/icons/OpenInNew";
import Input from "@/app/components/common/Input";

const defaultBaseToken = {
    name: "",
    symbol: "Select",
    token: "",
    image:
      "https://shdw-drive.genesysgo.net/7nPP797RprCMJaSXsyoTiFvMZVQ6y1dUgobvczdWGd35/MMoshCoin.png",
    bonding: "",
    desc: "",
    creatorUsername: "",
    decimals: 9,
    iscoin: false
  };
  

const Page = () => {
    const fetching = React.useRef(false);
    const navigate = useRouter();
    const connection = useConnection();
    const wallet = useAnchorWallet();
    const [profileInfo] = useAtom(userWeb3Info);
    const [projectLoading, setProjectLoading] = useState(true);
    const [projectDetail, setProjectDetail] = useState<any>(null)
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
    const [searchText, setSearchText] = React.useState("");
    const [coinsList, setCoinsList] = React.useState<Coin[]>([]);
    const [symbol, setSymbol] = useState("")
    const [usdPrice, setUSDPrice] = useState(0)
    const [donation, setDonation] = useState(0)
    const [selectedToken, setSelectedToken] = React.useState<Coin>(defaultBaseToken);

    const getProjectDetailFromAPI = async() => {
        try {
            let listResult = await axios.get(`/api/project/detail?symbol=PTV`);
            setProjectDetail(listResult.data)
        } catch (error) {
            setProjectLoading(false)
            setProjectDetail(null)
        }
    }


    const getUserProfileInfo = async () => {
        if(!wallet) {
            return
        }
        const env = new anchor.AnchorProvider(connection.connection, wallet, {
            preflightCommitment: "processed",
        });

        anchor.setProvider(env);
        let projectConn: ProjectConn = new ProjectConn(env, web3Consts.programID, new anchor.web3.PublicKey(projectDetail.project.key));
        let projectInfo = await projectConn.getProjectUserInfo(projectDetail.project.key);

        if(projectInfo.profiles.length == 0) {
            setProjectLoading(false)
            return
        }
        
        let tokenInfo = await projectConn.metaplex.nfts().findByMint({
            mintAddress: new anchor.web3.PublicKey(projectInfo.profiles[0].address) 
        })
        const price = await getPriceForPTV(tokenInfo.symbol.toUpperCase() == "PTVR" ? process.env.NEXT_PUBLIC_PTVR_TOKEN : process.env.NEXT_PUBLIC_PTVB_TOKEN)
        console.log("price is ", price)
        setSymbol(tokenInfo.symbol)
        setUSDPrice(price> 0 ? price : 0.0003)
        setProjectInfo(projectInfo)
        setProjectLoading(false)
    }
    React.useEffect(()=>{
        getProjectDetailFromAPI()
     },[wallet])

    React.useEffect(()=>{
        if(projectDetail) {
            getUserProfileInfo()
        }
    },[projectDetail])

    React.useEffect(()=>{
        if(!projectLoading) {
            if(projectInfo.profiles.length == 0) {
                navigate.push("/create/project/PTV/join");
            }
        }
    },[projectLoading])

    React.useEffect(() => {
        getCoinsList();
      }, [searchText]);

    const copyToClipboard = React.useCallback(async (text: string) => {
        await navigator.clipboard.writeText(text);
    }, []);

    const chooseMemeCoin = async () => {
        await getCoinsList();
        (document.getElementById("coin_modal") as any)?.showModal()
    }

    const handleTokenSelect = (token: Coin) => {
        setSelectedToken(token);
        (document.getElementById("coin_modal") as any)?.close();
    }

    const getCoinsList = async() => {
        let newCoinList = []
        fetching.current = true;
        const listResult = await axios.get(`/api/list-tokens?search=${searchText}&&symbol=${symbol}`);
        fetching.current = false;

        for (let index = 0; index < listResult.data.length; index++) {
            const element = listResult.data[index];
            element.decimals = 9
            element.iscoin = false
            newCoinList.push(element)
        }
        setCoinsList(newCoinList);
    };

    const openLink = () => {
        window.open(
          "https://solscan.io/account/" + selectedToken.token + "?cluster=mainnet",
          "_blank",
          "noopener,noreferrer",
        );
    };

    const onNextAction = () => {
         // have enough balance
         // navigate to next page
    }
    

    return (
        <div className="relative background-content">
            <div className="container mx-auto">
            <div className="my-10 p-5">
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
                {(!projectLoading && projectDetail && projectInfo.profiles.length > 0) &&
                    <>
                        <h2 className="text-center text-white font-goudy font-normal text-xl">Collect Bounties</h2>  
                        <p className="text-center text-white text-xs">Join Pump The Vote and collect bounties for every donor you bring to the party!</p>

                        <h3 className="text-center text-white font-goudy font-normal text-xs mt-10 mb-2.5">Get your PTV referral link</h3>  
                        <div className="rounded-md bg-black bg-opacity-[0.4] p-2.5 max-w-xl mx-auto mb-10">
                        <div className="rounded-md bg-black px-10 p-3.5">
                            <div className="copy-container">
                                <p className="text-left text-white text-xs">Web app</p>
                                <div className="border border-white border-opacity-20 cursor-pointer justify-between flex p-2.5 rounded-md" onClick={()=>{copyToClipboard(process.env.NEXT_PUBLIC_APP_MAIN_URL +"?refer="+projectInfo.profiles[0].address)}}>
                                    <p className="text-center text-white text-xs">{process.env.NEXT_PUBLIC_APP_MAIN_URL +"?refer="+projectInfo.profiles[0].address.substring(0, 5) +"..."+ projectInfo.profiles[0].address.substring(projectInfo.profiles[0].address.length-5)}</p>
                                    <CopyIcon />
                                </div>
                            </div>
                            <div className="copy-container mt-5">
                                <p className="text-left text-white text-xs">Telegram bot</p>
                                <div className="border border-white border-opacity-20 cursor-pointer justify-between flex p-2.5 rounded-md" onClick={()=>{copyToClipboard("https://t.me/liquidheartsbot?start=liquidheartsbot")}}>
                                    <p className="text-center text-white text-xs">https://t.me/liquidheartsbot?start=liquidheartsbot</p>
                                    <CopyIcon />
                                </div>
                            </div>
                        </div>
                        </div>
                        <div className="max-w-xl flex flex-col justify-center mx-auto">
                            <h2 className="text-center text-white font-goudy font-normal text-xl">Donate Memecoins to Pumb The Vote!</h2>  
                            <p className="text-center text-white text-xs">If you're a US citizen, you can donate political memecoins to Pumb The Vote's Super PAC and get out the vote for your candidates</p>
                            {selectedToken.token != "" &&
                                <div className="flex justify-center mt-3.5">
                                    <div className="mr-3.5">
                                    <p className="text-center text-white text-xs">Amount of tokens</p>
                                    <input
                                            value={donation > 0 ? donation.toString() : ""}
                                            type="number"
                                            onChange={(e) => {
                                            const number = Number(e.target.value);

                                            if (Number.isNaN(number)) return;

                                            setDonation(number);
                                            }}
                                            placeholder="0.00"
                                            className="input input-bordered h-10 text-base bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3] backdrop-container w-28 h-14"
                                        />
                                    </div>
                                    <div
                                        className="w-full flex items-center min-w-[2.5vmax] min-h-[2vmax] bg-[#9D9D9D12] cursor-pointer border-[1px] border-[#FFFFFF30] rounded-lg px-2 mx-1 h-14 mt-[19px]"
                                        onClick={() => {
                                        return (document.getElementById("coin_modal") as any)?.showModal();
                                        }}
                                    >
                                        <div className="flex items-center">
                                        <div className="relative w-[2vmax] h-[2vmax] mt-2 mr-1">
                                            <Image
                                            src={selectedToken.image}
                                            alt="coin"
                                            layout="fill"
                                            className="rounded-full"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-sm text-white">{selectedToken.symbol}</p>
                                            <p className="text-tiny">{selectedToken.name}</p>
                                        </div>

                                        <div
                                            className="flex self-start mb-4 rounded-md px-1 bg-[#030139]"
                                            onClick={openLink}
                                        >
                                            <p className="text-tiny">
                                            {walletAddressShortener(selectedToken.token)}
                                            </p>
                                            <OpenInNew />
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            }

                            <button className="btn btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white mx-auto mt-5 mb-10" onClick={chooseMemeCoin}><AddIcon />Add MemeCoin</button>
                            {donation > 0 &&
                              <>
                                <div className="text-center">
                                    <p className="backdrop-container rounded-xl px-5 py-2.5 mb-5 inline-block text-white text-base">Total Donation: {donation * usdPrice}</p>
                                </div>
                                    
                                <button className="btn btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white mx-auto" onClick={onNextAction}>Next</button>
                              </>
                            }
                        </div>
                    </>
                }
            </div>
            </div>
            <dialog id={"coin_modal"} className="modal">
            <div className="flex flex-col modal-box w-[40%] bg-[#02001A] p-8">
            <div className="custom-select-open grow">
                <div className="flex w-full justify-between mb-2">
                    <p className="text-xs text-white font-bold ml-4">Creator Coins</p>

                    <button
                        className="cursor-pointer"
                        onClick={() =>
                        (document.getElementById("coin_modal") as any)?.close()
                        }
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div className="my-2 w-[80%] ml-8">
                <Search
                    value={searchText}
                    onChange={(e) => setSearchText(e)}
                    darker
                />
                </div>


                <div className="w-full h-[0.5px] bg-[#36357C] px-2 mb-8 mt-2" />

                {coinsList.map((coin) => {
                return (
                    <div className="my-2">
                    <CoinListItem
                        token={coin.token}
                        bonding={coin.bonding}
                        name={coin.name}
                        desc={coin.desc}
                        creatorUsername={coin.creatorUsername}
                        symbol={coin.symbol}
                        image={coin.image}
                        iscoin={coin.iscoin}
                        decimals={coin.decimals}
                        onTokenSelect={handleTokenSelect}
                        key={coin.token}
                    />
                    </div>
                );
                })}
            </div>
            </div>
        </dialog>
        </div>          
  );
};

export default Page;
