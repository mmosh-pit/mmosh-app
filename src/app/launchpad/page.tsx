"use client";

import useWallet from "@/utils/wallet";
import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";

const LaunchPad = () => {
  const wallet: any = useWallet();

  const [countDownDate, setCountDownDate] = useState(0);
  const [countDown, setCountDown] = useState(0);
  const [projectDetail, setProjectDetail] = useState<any>(null);
  const [projectLoading, setProjectLoading] = useState(true);
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
        setProjectDetail(presaleDetail.data.result);
        console.log("===== PRESALE DETAILS API RESULT =====", presaleDetail.data.result);
        const creatorName = await getUserName(presaleDetail.data.result[0].presaleDetail.userId);
        setCreator(creatorName == "" ? presaleDetail.data.result[0].presaleDetail.userId.substring(0, 5) + "..." + presaleDetail.data.result[0].presaleDetail.userId.substring(presaleDetail.data.result[0].presaleDetail.userId.length - 5) : creatorName);
        setCountDownDate(new Date(presaleDetail.data.result[0].presaleDetail.lockPeriod).getTime());
        setCountDown(new Date(presaleDetail.data.result[0].presaleDetail.lockPeriod).getTime());
      }
      setProjectLoading(false);
    } catch (error) {
      setProjectLoading(false);
      setProjectDetail(null);
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

        <div className="relative w-[392px] mx-auto mt-8 bg-[#181747] border border-[#3F3D84] rounded-[14px] text-white shadow-md overflow-hidden backdrop-blur-sm">
          <div className="absolute -left-5 top-[-32px] z-10">
            <div className="w-[64px] h-[64px] rounded-full border-2 border-[#0A34C4] bg-white shadow-md overflow-hidden">
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
                Frank <span className="text-[#C2C2C2]">• FRAKIE</span>
              </div>
              <div className="text-para-font-size text-[#3C99FF] underline cursor-pointer">
                Bot Frank
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
              <div className="w-[180px] mt-[6px] bg-[#1A184D] rounded-[6px] p-[5px]">
                <label className="text-header-small-font-size font-[800] font-poppins">Amount</label>
                <div className="flex items-center bg-[#0E0C2C] border border-[#FF00E4] px-[8px] py-[3px] rounded-[4px] mb-[4px]">
                  <input
                    type="number"
                    placeholder="0.00"
                    className="bg-transparent text-white text-para-font-size w-full outline-none placeholder-gray-500 font-poppins"
                  />
                  <span className="ml-1 text-para-font-size font-poppins">USDC</span>
                </div>
                <div className="text-header-small-font-size text-right font-poppins mb-[4px]">
                  0.00 <span>FRANKIE</span>
                </div>
                <div className="text-small-font-size text-[#CFCFCF] font-poppins mt-[6px] leading-snug">
                  Minimum purchase: 1.000 USDC<br />
                  Maximum purchase: 12.000 USDC
                </div>
              </div>

              <button className="w-[70px] h-[21px] bg-[#FF00AE]/70 mt-[8px] rounded-[3px] text-white text-small-font-size font-[800] font-poppins leading-[21px]">
                Buy
              </button>

              <div className="text-[#CFCFCF] text-[4.4px] font-poppins font-[500] tracking-[-0.05em] leading-[100%] text-center mt-[2px]">
                Plus a small amount of SOL for gas fees
              </div>
            </div>

            <div className="w-[55%] pl-2 pt-[2px]">
              <p className="text-header-small-font-size font-[800] mb-2">1st Tranche</p>

              <div className="grid grid-cols-3 gap-[6px] mb-[6px]">
                {[
                  { label: "Available", value: "247" },
                  { label: "Purchased", value: "419.71" },
                  { label: "Discount", value: "13 %" },
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#211F5A] rounded-[6px] px-2 py-1 text-center">
                    <p className="text-white font-[700] text-para-font-size">{item.label}</p>
                    <p className="text-white font-normal text-para-font-size mt-[2px]">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-[6px]">
                {[
                  { label: "Maximum Supply", value: "23.56 FRAKIE" },
                  {
                    label: (
                      <>
                        Launch Price <span className="text-small-font-size font-[400]">(per coin)</span>
                      </>
                    ),
                    value: "23.56 USDC",
                  },
                  { label: "Launch Market Cap", value: "7,823.56 USDC" },
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#211F5A] rounded-[6px] px-2 py-1 text-center">
                    <p className="text-white font-[700] text-para-font-size leading-tight">{item.label}</p>
                    <p className="text-white font-normal text-para-font-size mt-[2px]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LaunchPad;