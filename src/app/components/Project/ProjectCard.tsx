"use client"
import CaretDown from "@/assets/icons/CaretDown";
import CaretUp from "@/assets/icons/CaretUp";
import React, { useEffect, useState } from "react"
import { Line, LineChart, ResponsiveContainer } from "recharts";
const ProjectCard = (projectData: any) => {
    const [totalSold, setTotalSold] = useState(0)
    const [countDownDate, setCountDownDate] = useState(0);
    const [countDown, setCountDown] = useState(0);

    useEffect(()=>{
       let totalSoldValue = 0
       if(projectData) {

            if(projectData.data.pass) {
                if(projectData.data.pass.length > 0) {
                    for (let index = 0; index < projectData.data.pass.length; index++) {
                        const element = projectData.data.pass[index];
                        totalSoldValue = totalSoldValue + element.sold;
                    }
                }
            }
            let dexListDate = convertUTCDateToLocalDate(new Date(projectData.data.dexlistingdate))
            console.log("dexListDate ", dexListDate)
            let dexdiff = new Date().getTime() - dexListDate.getTime();
            if(dexdiff < 0) {
                setCountDownDate(dexListDate.getTime())
            }
       }
       setTotalSold(totalSoldValue)
       console.log("projectData ", projectData)
    },[])

    const convertUTCDateToLocalDate = (date: any) => {
        var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
        var offset = date.getTimezoneOffset() / 60;
        var hours = date.getHours();
        newDate.setHours(hours - offset);
        return newDate;   
    }

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

    const minTwoDigits = (n:number) => {
        return (n < 10 ? '0' : '') + n;
    }

    const getChartColor = React.useCallback((prices: number[]) => {
        if (Number(prices[prices.length - 1]) < Number(prices[prices.length - 2])) {
          return "#DC2626";
        }
    
        return "#22C55E";
      }, []);

    return (
        <>
        {projectData &&
            <div className="project-card relative rounded-md overflow-hidden cursor-pointer" onClick={projectData.onClick}>
                <img src={projectData.data.image} className="w-full object-cover aspect-square"></img>
                <div className="absolute project-card-background rounded-md overflow-hidden bottom-2 left-2 right-2 px-2.5 py-3.5">
                    <div className="project-card-head grid grid-cols-12 gap-3">
                        <div className={projectData.showTimer ? "project-card-head-left  col-span-4" : "project-card-head-left  col-span-12"}>
                            <h4 className="text-lg text-white leading-3 capitalize text-ellipsis whitespace-nowrap overflow-hidden">{projectData.data.name}</h4>
                            <p className="text-tiny text-gray-300 inline-block capitalize underline">{projectData.data.symbol}</p>
                        </div>
                        {countDown != 0 && projectData.showTimer &&

                            <div className="col-span-8 flex flex-1 justify-end">
                                                   <div className="project-card-head-right col-span-8 flex">
                       <p className="text-tiny text-gray-300 text-ellipsis whitespace-nowrap overflow-hidden">Time to<br/> Listing</p>
                       <div className="timer flex">
                       <div className="timer-item ml-1 text-center bg-black bg-opacity-[0.56] p-1.5 rounded-md">
                           <label className="block text-lg text-white font-bold leading-none"> {minTwoDigits(getCountDownValues(countDown).days)}</label>
                           <span className="block text-[6px] text-gray-300 leading-none">Days</span>
                       </div>
                       <div className="timer-item ml-1 text-center bg-black bg-opacity-[0.56] p-1.5 rounded-md">
                           <label className="block text-lg text-white font-bold leading-none"> {minTwoDigits(getCountDownValues(countDown).hours)}</label>
                           <span className="block text-[6px] text-gray-300 leading-none">Hours</span>
                       </div>
                       <div className="timer-item ml-1 text-center bg-black bg-opacity-[0.56] p-1.5 rounded-md">
                           <label className="block text-lg text-white font-bold leading-none"> {minTwoDigits(getCountDownValues(countDown).minutes)}</label>
                           <span className="block text-[6px] text-gray-300 leading-none">Minutes</span>
                       </div>
                       <div className="timer-item ml-1 text-center bg-black bg-opacity-[0.56] p-1.5 rounded-md">
                           <label className="block text-lg text-white font-bold leading-none"> {minTwoDigits(getCountDownValues(countDown).seconds)}</label>
                           <span className="block text-[6px] text-gray-300 leading-none">Seconds</span>
                       </div>
                       </div>
                       </div>
                            </div>

                        }

                        {countDown == 0  &&
                          <div className="col-span-8 flex flex-1 justify-end project-card-graph">
                            <div>
                                <h4 className="text-base text-white leading-4 capitalize text-ellipsis whitespace-nowrap overflow-hidden">{projectData.data.coins[0].name}</h4>
                                <p className="text-tiny text-gray-300 inline-block capitalize">{projectData.data.coins[0].symbol}</p>
                            </div>
                            {projectData.data.coins[0].prices.length > 0 &&
                                <div className="text-right pl-3.5">
                                    <p className="text-tiny text-white">24h</p>
                                    <div>
                                        <ResponsiveContainer width={50} height={30}>
                                            <LineChart
                                            width={50}
                                            height={30}
                                            data={[1,3,4,5,6,9].map((val) => ({ value: val }))}
                                            >
                                            <Line
                                                type="monotone"
                                                dataKey="value"
                                                stroke={getChartColor([1,3,4,5,6,9])}
                                                dot={false}
                                                strokeWidth={2}
                                            />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    {projectData.data.coins[0].pricepercentage < 0 &&
                                       <p className="text-small-font-size flex justify-end crate-down-container"><CaretDown /><span className="ml-1">{projectData.data.coins[0].pricepercentage}%</span></p>
                                    }

                                    {projectData.data.coins[0].pricepercentage >= 0 &&
                                       <p className="text-small-font-size flex justify-end crate-up-container"><CaretUp /><span className="ml-1">{projectData.data.coins[0].pricepercentage}%</span></p>
                                    }
                                </div>
                            }

                          </div>
                        }
                    </div>
                    <div className="project-card-desc text-tiny text-gray-300 py-2.5">
                        {projectData.data.desc}
                    </div>
                    <div className="project-card-details grid grid-cols-2 gap-3">
                        <div className="project-card-detail-item flex">
                            <label className="text-xs text-white pr-1.5 leading-none">Listing Price</label>
                            <span className="text-xs text-gray-300 leading-none">${projectData.data.coins[0].listingprice.toLocaleString()}</span>
                        </div>
                        <div className="project-card-detail-item flex">
                            <label className="text-xs text-white pr-1.5 leading-none">Total Supply</label>
                            <span className="text-xs text-gray-300 leading-none">{projectData.data.coins[0].supply.toLocaleString()}</span>
                        </div>
                        {countDown != 0 &&
                            <div className="project-card-detail-item flex">
                                <label className="text-xs text-white pr-1.5 leading-none">Sold in Presale</label>
                                <span className="text-xs text-gray-300 leading-none">{totalSold.toLocaleString()}</span>
                            </div>
                        }

                        <div className="project-card-detail-item flex">
                            <label className="text-xs text-white pr-1.5 leading-none">Fully Diluted Value</label>
                            <span className="text-xs text-gray-300 leading-none">{(projectData.data.coins[0].listingprice * projectData.data.coins[0].supply).toLocaleString()} <label className="text-tiny text-white font-bold">USDC</label>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        }

        </>

    )
}

export default ProjectCard

