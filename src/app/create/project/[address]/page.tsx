"use client";
import Input from "@/app/components/common/Input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PieChart } from 'reaviz';
import { Bars } from "react-loader-spinner";
import { useAtom } from "jotai";
import { userWeb3Info } from "@/app/store";
export default function ProjectView({ params }: { params: { address: string } }) {
    const navigate = useRouter();
    const [profileInfo] = useAtom(userWeb3Info);
    const [projectLoading, setProjectLoading] = useState(true);
    const [projectDetail, setProjectDetail] = useState<any>(null)
    const countDownDate = new Date("2024-08-27").getTime();
    const [countDown, setCountDown] = useState(
        countDownDate - new Date().getTime()
    );

    useEffect(() => {
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

    const getProjectDetailFromAPI = async() => {
        try {
            setProjectLoading(true)
            let listResult = await axios.get(`/api/project/detail?project=${params.address}`);
            setProjectDetail(listResult.data)
            let tokenomics:any = [];
            for (let index = 0; index < listResult.data.tokenomics.length; index++) {
                const element = listResult.data.tokenomics[index];
                tokenomics.push({
                    key: element.type,
                    data: element.value
                })
            }
            tokenomics.push({
                key: "presale",
                data: Math.ceil((listResult.data.project.presalesupply / listResult.data.coins.supply) * 100)
            })
            tokenomics.push({
                key: "MMOSH DAO",
                data: 2
            })
            tokenomics.push({
                key: "Curator",
                data: 1
            })
            setTokenomicsChart(tokenomics);
            setProjectLoading(false)
        } catch (error) {
            setProjectLoading(false)
            setProjectDetail(null)
        }
    }

      
    const [tokenomicschart, setTokenomicsChart] = useState([])

    const capitalizeString = (str: any) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };


    return (
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
                                            <div className="px-2.5 mt-3">
                                            <img src="/dot.png" className="w-1.5 h-1.5" />
                                            </div>
                                            
                                            <span className="text-header-small-font-size font-poppins leading-8">{projectDetail.coins.symbol.toUpperCase()}</span>
                                            </h2>
                                        <p className="text-header-small-font-size mt-3.5 mb-8">{projectDetail.coins.desc}</p>
                                    </div>
                                    <div className="flex pt-8 border-t border-white border-opacity-20">
                                        <div className="flex">
                                            <div className="rounded-md mr-3.5"><img src="/profile.png" className="w-32 h-32 object-cover rounded-md" /></div>
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
                                            <div>
                                                    <PieChart
                                                        className="w-[300px]"
                                                        height={150}
                                                        data={tokenomicschart}
                                                    />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div className="border-t border-white border-opacity-20 pt-8 mt-8">
                            <h2 className="text-white font-goudy font-normal text-xl mb-8 text-center">Countdown to Launch</h2>
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
                            {profileInfo &&
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                    <div className="col-span-3">
                                        <div>
                                            <h4 className="text-header-small-font-size font-normal text-white mt-2.5 pl-2.5">Project Passes</h4>
                                            <div className="rounded-md bg-black bg-opacity-[0.4] p-2.5">
                                                <div className="border-container rounded-md">
                                                    <img src={projectDetail.project.image} alt="project pass" className="w-full object-cover p-0.5 rounded-md"/>
                                                </div>
                                                <h5 className="text-white font-goudy font-normal text-header-small-font-size flex justify-center mt-2.5 mb-6">
                                                    {capitalizeString(projectDetail.project.name)}
                                                </h5>
                                                <div className="mb-10">
                                                <p className="text-para-font-size text-center">Pass to Mint</p>
                                                <div className="max-w-28 mx-auto">
                                                    <Input
                                                            type="text"
                                                            title=""
                                                            required={false}
                                                            helperText=""
                                                            placeholder="0"
                                                            value={""}
                                                            onChange={(e:any) =>{}}
                                                        />
                                                </div>
                                                </div>
                                                <div className="text-center">
                                                    <button className="btn-sm btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white rounded-md px-10">Mint</button>
                                                    <p className="text-para-font-size text-center leading-none mt-1">Price {projectDetail.project.price} MMOSH</p>
                                                    <p className="text-small-font-size text-center leading-none my-2">Plus you will be charged a small amount of SOL in transaction fees.</p>
                                                    <p className="text-para-font-size text-center leading-none mb-1">Current Balance {profileInfo?.mmoshBalance.toFixed(2)} MMOSH</p>
                                                    <p className="text-para-font-size text-center leading-none">Current Balance {profileInfo?.solBalance.toFixed(2)} SOL</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                                                            value={""}
                                                            onChange={(e:any) =>{}}
                                                        />
                                                </div>
                                                </div>
                                                <div className="text-center">
                                                    <button className="btn-sm btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white rounded-md px-10">Mint</button>
                                                    <p className="text-para-font-size text-center leading-none mt-1">Price {projectDetail.project.invitationprice - (projectDetail.project.invitationprice * (projectDetail.project.discount / 100))} MMOSH</p>
                                                    <p className="text-small-font-size text-center leading-none my-2">Plus you will be charged a small amount of SOL in transaction fees.</p>
                                                    <p className="text-para-font-size text-center leading-none mb-1">Current Balance {profileInfo?.mmoshBalance.toFixed(2)} MMOSH</p>
                                                    <p className="text-para-font-size text-center leading-none">Current Balance {profileInfo?.mmoshBalance.toFixed(2)} SOL</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {projectDetail.passes.map((passItem:any, i:any) => (
                                        <div className="col-span-3">
                                            <div>
                                                <h4 className="text-header-small-font-size font-normal text-white mt-2.5 pl-2.5">Launch Pass 1</h4>
                                                <div className="rounded-md bg-black bg-opacity-[0.4] p-2.5">
                                                    <div className="border-container rounded-md">
                                                        <img src={passItem.image} alt="pass image" className="w-full object-cover p-0.5 rounded-md"/>
                                                    </div>
                                                    <h5 className="text-white font-goudy font-normal text-header-small-font-size flex justify-center mt-2.5 mb-6">
                                                        {capitalizeString(passItem.name)}
                                                        <div className="px-1.5 mt-1.5">
                                                            <img src="/dot.png" className="w-1.5 h-1.5" />
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
                                                        <button className="btn-sm btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white rounded-md px-10">Buy</button>
                                                        <p className="text-para-font-size text-center leading-none mt-1">Price {passItem.price} USDC</p>
                                                        <p className="text-small-font-size text-center leading-none my-2">Plus you will be charged a small amount of SOL in transaction fees.</p>
                                                        <p className="text-para-font-size text-center leading-none mb-1">Current Balance {profileInfo?.usdcBalance.toFixed(2)} USDC</p>
                                                        <p className="text-para-font-size text-center leading-none">Current Balance {profileInfo?.solBalance.toFixed(2)} SOL</p>
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
    );
}
