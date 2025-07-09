"use client";

import useWallet from "@/utils/wallet";
import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";

const LaunchPad = () => {
    const wallet: any = useWallet();

  const [countDownDate, setCountDownDate] = useState(0);
  const [countDown, setCountDown] = useState(0);
  const [presaleDetail, setPresaleDetail] = useState<any>(
    [
      {
        coinDetail: {
          coingeckoid: "",
          created_date: "2025-07-08T13:52:33.820Z",
          creator: "8aJC2u7SHMyG454rBoFWtx6ereFVEZDtRTLSQs9D7eGu",
          decimals: 9,
          desc: "new desc",
          image: "https://shdw-drive.genesysgo.net/Ejpot7jAYngByq5EgjvgEMgqJjD8dnjN4kSkiz6QJMsH/8a1c86d5-5be6-4968-b731-22cad558c423-Tue%20Jul%2008%202025%2016%3A54%3A54%20GMT%2B0530%20(India%20Standard%20Time).png",
          key: "2mFeUAoGnFaKGuwZYvF6xqiApeEpjseaaGGRRGSELizX",
          name: "new token",
          presalediscount: [],
          pricepercentage: 0,
          prices: [],
          projectkey: "45svpLnzo4s1YcPozGwd35KnCSeK37Ao6nnB7E85m25t",
          supply: 100000,
          symbol: "new token",
          updated_date: "2025-07-08T13:52:33.820Z",
          _id: "686d22a1833ddc0c7db45c0c",
        },
        presaleDetail: {
          coinId: "686d22a1833ddc0c7db45c0c",
          created_date: "2025-07-08T13:52:34.574Z",
          launchMarketCap: 10000,
          launchPrice: 1,
          lockPeriod: "Sat, 16 Aug 2025 01:26:10 GMT",
          presaleMaximum: "1000",
          presaleMinimum: "100",
          presaleStartDate: "Sun, 26 May 2002 18:30:00 GMT",
          purchaseMaximum: "2000",
          purchaseMinimum: "200",
          totalSold: 0,
          updated_date: "2025-07-08T13:52:34.574Z",
          userId: "8aJC2u7SHMyG454rBoFWtx6ereFVEZDtRTLSQs9D7eGu",
          _id: "686d22a2833ddc0c7db45c0d",
          discount: [
            { value: '100', percentage: '10' },
            { value: '100', percentage: '10' },
            { value: '100', percentage: '10' },
            { value: '100', percentage: '10' },
          ]
        }
      }
    ]
  )
  const [projectLoading, setProjectLoading] = useState(false);
  const [creator, setCreator] = useState("");

  const timerData = [
    { value: "13", label: "Days" },
    { value: "03", label: "Hours" },
    { value: "12", label: "Minutes" },
    { value: "48", label: "Seconds" },
  ];

  useEffect(() => {
    if (countDownDate == 0) {
      return;
    }
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);
    useEffect(() => {
      if (wallet) {
        getProjectDetailFromAPI();
      }
    }, [wallet])

  const getProjectDetailFromAPI = async () => {
    try {
      setProjectLoading(true)
      const presaleDetail = await axios.get(`/api/project/get-presale-details?userId=${wallet.publicKey}`);
      if (presaleDetail.data.status) {
        setPresaleDetail(presaleDetail.data.result);
        const creatorName = await getUserName(presaleDetail.data.result[0].presaleDetail.userId);
        setCreator(creatorName == "" ? presaleDetail.data.result[0].presaleDetail.userId.substring(0, 5) + "..." + presaleDetail.data.result[0].presaleDetail.userId.substring(presaleDetail.data.result[0].presaleDetail.userId.length - 5) : creatorName);
        setCountDownDate(new Date(presaleDetail.data.result[0].presaleDetail.lockPeriod).getTime());
        setCountDown(new Date(presaleDetail.data.result[0].presaleDetail.lockPeriod).getTime());
      }
      setProjectLoading(false);
    } catch (error) {
      setProjectLoading(false);
      setPresaleDetail(null);
    }
  }

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

  const getCountDownValues = (countDown: number, type: string) => {
    const timeUnits: any = {
      Days: Math.floor(countDown / (1000 * 60 * 60 * 24)),
      Hours: Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      Minutes: Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60)),
      Seconds: Math.floor((countDown % (1000 * 60)) / 1000),
    };

    return timeUnits[type];
  };

  const getTrancheLabel = (index: number) => {
    const labels = ["1st Tranche", "2nd Tranche", "3rd Tranche", "4th Tranche"];
    return labels[index];
  };

  const renderTranche = (data: any) => {
    let available: number = 0;
    console.log("RENDER PRE SALE DETAILS", data);
    for (let index = 0; index < data.presaleDetail.discount.length; index++) {
      const element = data.presaleDetail.discount[index];
      available = Number(element.value);
      if (available - data.presaleDetail.totalSold > 0) {
        return (
          <div className="w-[55%] pl-2 pt-[2px]">
            <p className="text-header-small-font-size font-[800] mb-2">{getTrancheLabel(index)}</p>

            <div className="grid grid-cols-3 gap-[6px] mb-[6px]">
              <div className="bg-[#211F5A] rounded-[6px] px-2 py-1 text-center">
                <p className="text-white font-[700] text-para-font-size">Available</p>
                <p className="text-white font-normal text-para-font-size mt-[2px]">{available - data.presaleDetail.totalSold}</p>
              </div>
              <div className="bg-[#211F5A] rounded-[6px] px-2 py-1 text-center">
                <p className="text-white font-[700] text-para-font-size">Purchased</p>
                <p className="text-white font-normal text-para-font-size mt-[2px]">{Number(element.value) - (available - data.presaleDetail.totalSold)}</p>
              </div>
              <div className="bg-[#211F5A] rounded-[6px] px-2 py-1 text-center">
                <p className="text-white font-[700] text-para-font-size">Discount</p>
                <p className="text-white font-normal text-para-font-size mt-[2px]">{element.percentage}%</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-[6px]">
              <div className="bg-[#211F5A] rounded-[6px] px-2 py-1 text-center">
                <p className="text-white font-[700] text-para-font-size leading-tight">Maximum Supply</p>
                <p className="text-white font-normal text-para-font-size mt-[2px]">{data.coinDetail.supply} {data.coinDetail.symbol}</p>
              </div>
              <div className="bg-[#211F5A] rounded-[6px] px-2 py-1 text-center">
                <p className="text-white font-[700] text-para-font-size leading-tight">Launch Price <span className="text-small-font-size font-[400]">(per coin)</span></p>
                <p className="text-white font-normal text-para-font-size mt-[2px]">{data.presaleDetail.launchPrice} USDC</p>
              </div>
              <div className="bg-[#211F5A] rounded-[6px] px-2 py-1 text-center">
                <p className="text-white font-[700] text-para-font-size leading-tight">Launch Market Cap</p>
                <p className="text-white font-normal text-para-font-size mt-[2px]">{data.presaleDetail.launchMarketCap} USDC</p>
              </div>
            </div>
          </div>
        )
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#010117] flex flex-col items-center pt-10 pb-12">
      <div className="w-full max-w-[1280px] px-4">
        <h2 className="text-center text-[4vmax] sm:text-[3vmax] md:text-[5vmax] font-extrabold font-goudy text-transparent bg-clip-text bg-[linear-gradient(155deg,#FFF_11.53%,rgba(255,255,255,0.30)_109.53%)] tracking-[-0.02em]">
          Next launch
        </h2>

        <div className="flex justify-center items-center gap-5 mt-3">
          {timerData.map((item, index) => (
            <div key={index} className="relative flex flex-col items-center w-[71px] h-[64px]">
              <span className="text-[54px] leading-[50px] font-[500] font-goudy text-transparent bg-clip-text bg-[linear-gradient(155deg,#FFF_11.53%,rgba(255,255,255,0.30)_109.53%)]">
                {getCountDownValues(countDown, item.label)}
              </span>
              <span className="text-base text-[#FFFFFFC7] font-avenir font-medium mt-[2px]">
                {item.label}
              </span>
              {index !== timerData.length - 1 && (
                <span className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-px h-[60px] bg-[#66666638] border border-[#FFFFFF38] rounded-[6px] backdrop-blur-[39px]" />
              )}
            </div>
          ))}
        </div>

        {presaleDetail && (
          <>
            {presaleDetail.map((presale: any, index: number) => (
              <div key={index} className="relative w-[392px] mx-auto mt-8 bg-[#181747] border border-[#3F3D84] rounded-[14px] text-white shadow-md overflow-hidden backdrop-blur-sm">
                <div className="absolute -left-0 top-[2px] z-10">
                  <div className="w-[64px] h-[64px] rounded-full border-2 border-[#040432] bg-white shadow-md overflow-hidden">
                    <img
                      src="https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149622021.jpg"
                      alt="Frankie"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="h-[40px] w-full bg-[#0A34C4] rounded-t-[14px] pl-[80px] pr-3 flex items-center justify-between">
                  <div className="flex flex-col font-poppins">
                    <div className="text-sub-title-font-size font-[500] underline">
                      {presale.coinDetail.name} <span className="text-[#C2C2C2]">• {presale.coinDetail.symbol}</span>
                    </div>
                    <div className="text-para-font-size text-[#3C99FF] underline cursor-pointer">
                      {creator}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {timerData.map((item, i) => (
                      <div key={i} className="text-center">
                        <div className="text-base font-bold">{item.value}</div>
                        <div className="text-para-font-size text-white/70">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex w-full px-3 pt-3 pb-4">
                  <div className="w-[45%] flex flex-col items-center pt-1">
                    <div className="w-[79px] h-[60px] mt-[6px] bg-[#1A184D] rounded-[6px] p-[5px]">

                      <label className=" absolute top-[78px] left-[10px] text-[9px] leading-[100%] tracking-[-0.04em] text-white font-poppins font-extrabold">Amount</label>
                      <div className="flex items-center w-[49px] h-[17px] px-[4px] rounded-[3px] border-[0.4px] border-[#FF8FE714] overflow-hidden">
                        <input
                          type="number"
                          placeholder="0.00"
                          className="bg-transparent text-white text-[8px] leading-[11px] tracking-[0em] font-poppins font-normal w-[26px] outline-none pr-[1px] pt-[5px]"
                        />
                        <span className="ml-1 text-para-font-size font-poppins">USDC</span>
                      </div>
                      <div className="text-header-small-font-size text-right font-poppins mb-[4px]">
                        0.00 <span>FRANKIE</span>
                      </div>
                      <div className="text-small-font-size text-[#CFCFCF] font-poppins mt-[6px] leading-snug">
                        Minimum purchase: {presale.presaleDetail.purchaseMinimum} USDC<br />
                        Maximum purchase: {presale.presaleDetail.purchaseMaximum} USDC
                      </div>
                    </div>

                    <button className="w-[70px] h-[21px] bg-[#FF00AE]/70 mt-[8px] rounded-[3px] text-white text-small-font-size font-[800] font-poppins leading-[21px]">
                      Buy
                    </button>

                    <div className="text-[#CFCFCF] text-[4.4px] font-poppins font-[500] tracking-[-0.05em] leading-[100%] text-center mt-[2px]">
                      Plus a small amount of SOL for gas fees
                    </div>
                  </div>
                  {renderTranche(presale)}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default LaunchPad;