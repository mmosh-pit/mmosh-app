"use client";

import useWallet from "@/utils/wallet";
import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";
import { trasferUsdCoin } from "../lib/forge/createProfile";

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
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState(0);

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
  const buyToken = async (tokenInfo: any) => {
    const result = await trasferUsdCoin(wallet, tokenInfo.presaleDetail.userId, Number(amount));
    console.log("==== TRANSFER USD COIN RESULT =====", result);
  }

  const handleAmount = (event: React.ChangeEvent<HTMLInputElement>, tokenInfo: any) => {
    setAmount(event.target.value);
    setToken(Number(event.target.value) / tokenInfo.presaleDetail.launchPrice);
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
              <div key={index} className="relative w-[392px] mx-auto mt-[50px] bg-[#181747] border border-[#1C1A584D] rounded-[14px] text-white shadow-md overflow-hidden backdrop-blur-sm font-poppins">
                <div className="absolute left-[8.29px] -top-[38px] z-20">
                  <div className="w-[85.6px] h-[78px] rounded-[72px] border-[2px] border-[#040432] overflow-hidden bg-white shadow-md">
                    <img
                      src="https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149622021.jpg"
                      alt="Frankie"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="h-[40px] w-full bg-[#0A34C4] rounded-t-[14px] pl-[80px] pr-3 flex items-center justify-between">
                  <div className="flex flex-col">
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

                  <div className="w-[392px] h-[173px] rounded-b-[14px] bg-[#1A184D] border border-[#5a84ff] flex px-3 pt-3 pb-3 text-white font-poppins overflow-hidden">
                    {/* Left: Amount Column */}
                    <div className="w-[160px] flex flex-col pr-3">
                      {/* Label */}
                      <label className="text-[10px] font-extrabold mb-[2px] leading-none tracking-tight">
                        Amount
                      </label>

                      {/* Input */}
                      <div className="flex items-center mb-[5px]">
                        <input
                          type="number"
                          placeholder="0.00"
                          value={amount}
                          onChange={(event) => handleAmount(event, presale)}
                          className="w-[70px] h-[24px] px-2 rounded-[4px] border border-[#FF8FE7] bg-[#1A184D] text-white text-[10px] font-normal outline-none pr-1 placeholder-white"
                        />
                        <span className="ml-[4px] text-[7px] text-white">USDC</span>
                      </div>

                      {/* Converted token */}
                      <div className="text-white font-semibold text-[7px] mb-[3px]">
                        {token} <span className="text-[#CFCFCF]">{presale.coinDetail.symbol}</span>
                      </div>

                      {/* Min/Max Purchase */}
                      <div className="text-[#CFCFCF] text-[5.4px] leading-[110%] mb-[6px]">
                        Minimum purchase: 1.000 USDC <br />
                        Maximum purchase: 12.000 USDC
                      </div>

                      {/* Buy Button */}
                      <button className="w-[90px] h-[28px] bg-[#FF00AE]/70 rounded-[4px] text-white text-[10px] font-extrabold leading-[28px] mb-[4px]" onClick={() => buyToken(presale)}>
                        Buy
                      </button>

                      {/* Gas Fee Note */}
                      <p className="text-[#CFCFCF] text-[4.4px] leading-[100%] text-center mt-[1px]">
                        Plus a small amount of SOL for gas fees
                      </p>
                    </div>

                    {/* Right Side - Tranche */}
                    <div className="flex-1">
                      {renderTranche(presale)}
                    </div>
                  </div>
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