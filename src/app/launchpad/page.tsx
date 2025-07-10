"use client";

import useWallet from "@/utils/wallet";
import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";
import { trasferUsdCoin } from "../lib/forge/createProfile";
import { Connection, Transaction } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { Bars } from "react-loader-spinner";
import { LaunchPad } from "../components/LaunchPad/LaunchPad";

const LaunchPadVC = () => {
  const wallet: any = useWallet();

  const [showMsg, setShowMsg] = useState(false);
  const [msgClass, setMsgClass] = useState("");
  const [msgText, setMsgText] = useState("");
  const [countDownDate, setCountDownDate] = useState(0);
  const [countDown, setCountDown] = useState(0);
  const [presaleDetail, setPresaleDetail] = useState<any>([]);
  const [projectLoading, setProjectLoading] = useState(false);
  const [creator, setCreator] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState(0);
  const [isBuying, setIsBuying] = useState(false);
  const [groupedCards, setGroupedCards] = React.useState<any[]>([]);
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
        const creatorName = await getUserName(presaleDetail.data.result[0].presaleDetail.wallet);
        setCreator(creatorName == "" ? presaleDetail.data.result[0].presaleDetail.wallet.substring(0, 5) + "..." + presaleDetail.data.result[0].presaleDetail.wallet.substring(presaleDetail.data.result[0].presaleDetail.wallet.length - 5) : creatorName);
        setCountDownDate(new Date(presaleDetail.data.result[0].presaleDetail.lockPeriod).getTime());
        setCountDown(new Date(presaleDetail.data.result[0].presaleDetail.lockPeriod).getTime());
      }
      setTimeout(() => {
        setProjectLoading(false);
      }, 2000);
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

  const buyToken = async (tokenInfo: any) => {
    if (validate(tokenInfo)) {
      setIsBuying(true);
      const result = await trasferUsdCoin(wallet, tokenInfo.presaleDetail.wallet, Number(amount));
      console.log("transfer usd coin result", result.message);
      if (result.data) {
        const trasferTokenResult = await axios.post("/api/project/buy-token", {
          receiver: wallet.publicKey.toString(),
          supply: token,
          key: tokenInfo.presaleDetail.key,
          amount: Number(amount),
        });
        console.log("transfer token result", trasferTokenResult);
        if (trasferTokenResult.data.status) {
          try {
            const connection = new Connection(
              process.env.NEXT_PUBLIC_SOLANA_CLUSTER!,
              { confirmTransactionInitialTimeout: 120000 }
            );
            const env = new anchor.AnchorProvider(connection, wallet, {
              preflightCommitment: "processed",
            });
            anchor.setProvider(env);
            const hex = trasferTokenResult.data.transaction;
            const buffer = Buffer.from(hex, "hex");
            const tx = Transaction.from(buffer);
            const signedTx = await wallet.signTransaction(tx);
            const txid = await connection.sendRawTransaction(signedTx.serialize(), {
              skipPreflight: false,
            });
            console.log("Transaction ID:", txid);
          } catch (error) {
            console.log("tx error", error);
            setIsBuying(false);
            createMessage("Something went wrong", "danger-container");
          }
        } else {
          createMessage(trasferTokenResult.data.message, "danger-container");
          setIsBuying(false);
        }
      } else {
        createMessage(result.message, "danger-container");
        setIsBuying(false);
      }
    }
  };
  const createMessage = (message: any, type: any) => {
    window.scrollTo(0, 0);
    setMsgText(message);
    setMsgClass(type);
    setShowMsg(true);
    setIsBuying(false);
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

  const validate = (tokenInfo: any): boolean => {
    if (token < Number(tokenInfo.presaleDetail.presaleMinimum)) {
      createMessage(`Token should be greater than or equal to the ${tokenInfo.presaleDetail.presaleMinimum}.`, "danger-container");
      return false;
    }
    if (token > Number(tokenInfo.presaleDetail.presaleMaximum)) {
      createMessage(`Token should be less than or equal to ${tokenInfo.presaleDetail.presaleMaximum}.`, "danger-container");
      return false;
    }
    if (Number(amount) < Number(tokenInfo.presaleDetail.purchaseMinimum)) {
      createMessage(`Amount should be greater than or equal to the ${tokenInfo.presaleDetail.purchaseMinimum}.`, "danger-container");
      return false;
    }
    if (Number(amount) > Number(tokenInfo.presaleDetail.purchaseMaximum)) {
      createMessage(`Amount should be less than or equal to ${tokenInfo.presaleDetail.purchaseMaximum}.`, "danger-container");
      return false;
    }
    return true;
  }

  const handleAmount = (event: React.ChangeEvent<HTMLInputElement>, tokenInfo: any) => {
    setAmount(event.target.value);
    setToken(Number(event.target.value) / tokenInfo.presaleDetail.launchPrice);
  }

  const getTrancheLabel = (index: number) => {
    const labels = ["1st Tranche", "2nd Tranche", "3rd Tranche", "4th Tranche"];
    return labels[index];
  };

  const renderTranche = (data: any) => {
    let available: number = 0;
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
  React.useEffect(() => {
    const data = [];
    let i = 0;
    while (i < presaleDetail.length) {
      if (i === 0) {
        data.push([presaleDetail[i]]);
        i += 1;
      } else {
        data.push(presaleDetail.slice(i, i + 3));
        i += 3;
      }
    }
    setGroupedCards(data);
  }, [presaleDetail])

  return (
    <>
      {showMsg && (
        <div className={"message-container text-white text-center text-header-small-font-size py-5 px-3.5 " + msgClass}>{msgText}</div>
      )}
      {projectLoading &&
        <div className="backdrop-container rounded-xl border border-white border-opacity-20 my-10 p-5">
          <div className="p-10 text-center items-center">
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
        </div>
      }
      {!projectLoading &&
        <div className="min-h-screen bg-[#010117] py-10 px-4">
          <div className="min-h-screen bg-[#010117] py-10 px-4">
            {groupedCards.map((group, groupIdx) => (
              <div
                key={groupIdx}
                className={`flex flex-wrap justify-center gap-6 mb-8`}
              >
                <LaunchPad getCountDownValues={getCountDownValues} creator={creator} buyToken={(presale: any) => buyToken(presale)} group={group} />
              </div>
            ))}
          </div>
        </div>
      }
    </>
  );
};

export default LaunchPadVC;