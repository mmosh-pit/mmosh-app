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
import React, { useState } from "react";

export default function ProjectCreateStep9() {
    const navigate = useRouter();
    // step1
    const [project, setProject] = useState({
        preview: "",
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
        community: "",
        profiles: []
    })

    // step3
    const [coins, setCoins] = useState({
        preview: "",
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

    // step 8
    const [liquidity, setLiquidity] = useState({
        usd: 0,
        mmosh:0,
        sol:0
    })
    
    // step 9
    const [files, setFiles] = useState([])

    React.useEffect(()=>{
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

    const submitAction = () => {
    }

     const goBack = () => {
        navigate.back();
     }

    return (
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
                                        <img src={project.preview}className="w-full object-cover"/>
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
                                        <img src={coins.preview} className="w-full rounded-full object-cover"/>
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
                                    <img src={passItem.preview} className="w-full object-cover rounded-md"/>
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
                                            <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md">{passItem.tokens}</p>
                                        </div>
                                        <div>
                                            <p className="text-para-font-size">Listing Price</p>
                                            <p className="text-para-font-size bg-black bg-opacity-[0.2] px-3.5 py-2.5 rounded-md">{passItem.price}</p>
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
                                            <p className="text-para-font-size text-center bg-black bg-opacity-[0.2] px-3.5 py-2.5 inline-block">{tokenomicsItem.cliff}</p>
                                        </div>
                                    </div>
                                    <div className="col-span-4">
                                        <div className="text-center">
                                            <p className="text-para-font-size text-center bg-black bg-opacity-[0.2] px-3.5 py-2.5 inline-block">{tokenomicsItem.vesting}</p>
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
                            {/* <h3 className="text-sub-title-font-size text-while font-poppins mb-3.5">Tokenomics</h3> */}
                      </div>
                   </div>
                </div>
     
                <h3 className="text-sub-title-font-size text-while font-poppins text-center pt-10">Summary of Costs</h3>
                <div className="flex justify-center mt-3.5">
                    <p className="text-header-small-font-size text-white mr-3.5 min-w-16">USDC</p>
                    <p className="text-header-small-font-size text-white">111</p>
                </div>
                <div className="flex justify-center mt-3.5">
                    <p className="text-header-small-font-size text-white mr-3.5 min-w-16">SOL</p>
                    <p className="text-header-small-font-size text-white">111</p>
                </div>
                <div className="flex justify-center mt-3.5">
                    <p className="text-header-small-font-size text-white mr-3.5 min-w-16">MMOSH</p>
                    <p className="text-header-small-font-size text-white">111</p>
                </div>
                <div className="flex justify-center mt-3.5">
                    <p className="text-header-small-font-sizetext-white mr-3.5 font-bold min-w-16">Total</p>
                    <p className="text-header-small-font-size text-white font-bold">333</p>
                </div>
                
                <div className="flex justify-center mt-10">
                    <button className="btn btn-link text-white no-underline" onClick={goBack}>Back</button>
                    <button className="btn btn-primary ml-10 bg-primary text-white border-none hover:bg-primary hover:text-white" onClick={submitAction}>Deploy Token Presale</button>
                </div>
                <div className="flex justify-center mt-3.5">
                    <p className="text-para-font-size text-white mr-3.5">Current Balance</p>
                    <p className="text-para-font-size text-white min-w-24">88.888 USDC</p>
                </div>
                <div className="flex justify-center">
                    <p className="text-para-font-size text-white mr-3.5">Current Balance</p>
                    <p className="text-para-font-size text-white min-w-24">88.888 SOL</p>
                </div>
                <div className="flex justify-center">
                    <p className="text-para-font-size text-white mr-3.5">Current Balance</p>
                    <p className="text-para-font-size text-white min-w-24">88.888 MMOSH</p>
                </div>
            </div>
        </div>
    );
}
