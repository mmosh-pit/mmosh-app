"use client";
import React, { useState } from "react";
import Select from "../components/common/Select";
import moment from "moment";
import useWallet from "@/utils/wallet";
import axios from "axios";
import internalClient from "../lib/internalHttpClient";
import { useRouter } from "next/navigation";
import { Connection } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { Connectivity as UserConn } from "@/anchor/user";
import { web3Consts } from "@/anchor/web3Consts";
import MessageBanner from "../components/common/MessageBanner";
import { useAtom } from "jotai";
import { bagsBalance } from "../store/bags";
import USDCIcon from "@/assets/icons/UsdcIcon";
import KinshipTransactionIcon from "@/assets/icons/KinshipTransactionIcon";
import SolanaIcon from "@/assets/icons/SolanaIcon";

export default function MyWalley() {
  const wallet = useWallet();
  const router = useRouter();
  const [totalBalance] = useAtom(bagsBalance);
  const categoriesOptions = [
    { label: "All Categories", value: "" },
    { label: "Various Coins", value: "token_exchange" },
    { label: "Airdrop", value: "airdrop" },
    { label: "Royalties", value: "membership_royalty" },
    { label: "Transfers", value: "transfer" },
  ];
  const sortingOptions = [
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [openSortingFilter, setOpenSortingFilter] = useState(false);
  const [stakedHistory, setStakedHistory] = useState<any[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<{
    label: string;
    value: string;
  }>({ label: "All Categories", value: "" });
  const [selectedSortingOptions, setSelectedSortingOptions] = useState<{
    label: string;
    value: string;
  }>({ label: "Newest First", value: "newest" });

  const [earnedAmount, setEarnedAmount] = useState<number>(0);
  const [availableTokens, setAvailableTokens] = useState<number>(0);
  const [stakedTokens, setStakedTokens] = useState<number>(0);
  const [showMsg, setShowMsg] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState({
    type: "",
    message: "",
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [historyLoading, setHistoryLoading] = React.useState<boolean>(false);

  const [transactionHistory, setTransactionHistory] = React.useState<{
    transactions: any[];
    pagination: any;
  }>({
    transactions: [],
    pagination: {},
  });
  const [selectedTab, setSelectedTab] = React.useState<number>(3);
  const [isTooltipShown, setIsTooltipShown] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (wallet) {
      getHistory();
      setHistoryLoading(true);
      getTransactionHistory();
    }
  }, [wallet]);

  const getTransactionHistory = async () => {
    const result = await internalClient.get(
      `api/history/get?wallet=${wallet?.publicKey.toBase58()}`
    );
    console.log(
      "----- TRANSACTION HISTORY -----",
      result.data.result.transactions
    );
    setTransactionHistory(result.data.result);
    setHistoryLoading(false);
  };

  React.useEffect(() => {
    filterHistory();
  }, [selectedCategory, transactionHistory]);

  React.useEffect(() => {
    sortedData(selectedSortingOptions.value);
  }, [selectedSortingOptions]);

  const createMessage = React.useCallback((text: string, type: string) => {
    setMessage({ message: text, type });
    setShowMsg(true);
    setTimeout(() => {
      setShowMsg(false);
    }, 4000);
  }, []);

  const getHistory = async () => {
    const result = await internalClient.get(
      `api/get-staked-history?wallet=${wallet?.publicKey.toBase58()}`
    );
    const history = [];
    console.log("result.data", result.data);
    for (let i = 0; i < result.data.length; i++) {
      const element = result.data[i];
      let stakedAmount = 0;
      let unStakedAmount = 0;
      for (let j = 0; j < element.royalty.length; j++) {
        const royaltyElement = element.royalty[j];
        if (
          royaltyElement.receiver === wallet?.publicKey.toBase58() &&
          !royaltyElement.isUnstaked
        ) {
          stakedAmount += royaltyElement.amount;
        } else if (
          royaltyElement.receiver === wallet?.publicKey.toBase58() &&
          royaltyElement.isUnstaked
        ) {
          unStakedAmount += royaltyElement.amount;
        }
      }
      element.stakedAmountByUser = stakedAmount;
      element.unStakedAmount = unStakedAmount;
    }
    updateAmounts(result.data);
    setStakedHistory(result.data);
  };

  const formatUnlocksIn = (target: any) => {
    let m;
    if (typeof target === "number") {
      m = moment(target);
    } else if (typeof target === "string") {
      const digitsOnly = /^\d+$/;
      if (digitsOnly.test(target)) {
        m = moment(Number(target));
      } else {
        m = moment.parseZone(target);
        if (!m.isValid()) {
          const d = new Date(target);
          if (!isNaN(d.getTime())) m = moment(d);
        }
      }
    } else if (target instanceof Date) {
      m = moment(target);
    } else {
      return "Invalid timestamp";
    }

    if (!m || !m.isValid()) return "Invalid timestamp";

    const diffMs = m.valueOf() - Date.now();

    if (diffMs <= 0) return "Unlocked!";

    const duration = moment.duration(diffMs);
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();
    const D = days === 1 ? "day" : "days";
    const H = hours === 1 ? "hour" : "hours";
    const M = minutes === 1 ? "minute" : "minutes";

    return `Unlocks in ${days} ${D}, ${hours} ${H} ${minutes} ${M}`;
  };

  const filterHistory = () => {
    if (selectedCategory.value === "") {
      setFilteredHistory(transactionHistory.transactions);
      return;
    }
    console.log(
      "transactionHistory.transactions",
      transactionHistory.transactions
    );
    const result = transactionHistory.transactions.filter(
      (history) =>
        history.transactionType.toLowerCase() ===
        selectedCategory.value.toLowerCase()
    );
    setFilteredHistory(result);
  };

  const updateAmounts = (history: any[]) => {
    let total: number = 0;
    let availableTokens: number = 0;
    let stakedTokens: number = 0;

    for (let i = 0; i < history.length; i++) {
      const element = history[i];

      for (let j = 0; j < element.royalty.length; j++) {
        const royaltyElement = element.royalty[j];
        if (royaltyElement.receiver === wallet?.publicKey.toBase58()) {
          if (royaltyElement.isUnstaked && royaltyElement.isClaimed) {
            total += royaltyElement.amount / 10 ** 6;
          } else if (royaltyElement.isUnstaked && !royaltyElement.isClaimed) {
            availableTokens += royaltyElement.amount / 10 ** 6;
          } else {
            stakedTokens += royaltyElement.amount / 10 ** 6;
          }
        }
      }
    }
    setEarnedAmount(total);
    setAvailableTokens(availableTokens);
    setStakedTokens(stakedTokens);
  };
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const claimRewardAmount = async (history: any) => {
    try {
      if (isLoading) {
        return;
      }
      if (!wallet) {
        createMessage(
          "Wallet info not found; please try again later.",
          "error"
        );
        return;
      }
      let isValidReceipt: boolean = false;
      try {
        const params = {
          wallet: wallet?.publicKey.toString(),
          purchase_token: history.purchaseId,
        };
        const result = await axios.post(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/verify-receipt",
          params,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        isValidReceipt = result.data.data === "completed";
      } catch (error: any) {
        createMessage(
          error.response.data.error ||
            "Something went wrong, please try again later",
          "error"
        );
        return;
      }
      if (!isValidReceipt) {
        createMessage("invalid subscription.", "error");
        return;
      }
      setIsLoading(true);

      const result = await internalClient.post("/api/distribute-to-pool", {
        purchaseId: history.purchaseId,
      });
      console.log("----- DISTRIBUTE TO POOL RESULT -----", result.data);
      if (
        !result.data.status &&
        !result.data.message.includes("Funds already distributed to the pool")
      ) {
        createMessage(result.data.message, "error");
        setIsLoading(false);
        return;
      }
      const updateResult = await internalClient.post(
        "/api/update-staked-history",
        {
          wallet: wallet.publicKey.toBase58(),
          purchaseId: history.purchaseId,
          historyId: history._id,
          royaltyLevel: history.royaltyLevel,
        }
      );
      createMessage(
        updateResult.data.message,
        updateResult.data.status ? "success" : "error"
      );
      setIsLoading(false);
      await getHistory();
      await getTransactionHistory();
      console.log("unstaked updateResult", updateResult.data);
    } catch (error: any) {
      createMessage(error?.message, "error");
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return moment(timestamp).format("DD MMM hh:mm A").toUpperCase();
  };
  const isPastTimestamp = (timestamp: number) => {
    return moment(timestamp).isBefore(moment());
  };
  const copyToClipboard = async (text: string) => {
    setIsTooltipShown(true);
    await navigator.clipboard.writeText(text);

    setTimeout(() => {
      setIsTooltipShown(false);
    }, 2000);
  };

  const sortedData = (type: string) => {
    const result = filteredHistory.sort((a, b) => {
      if (type === "newest") {
        return Number(b.updated_date) - Number(a.updated_date);
      } else {
        return Number(a.updated_date) - Number(b.updated_date);
      }
    });
    setFilteredHistory(result);
  };

  return (
    <div>
      {showMsg && (
        <MessageBanner type={message.type} message={message.message} />
      )}
      <p className="text-2xl font-bold text-center mt-10 mb-10">My Wallet</p>
      <div className="bg-[#0A044C63] border-2 border-[#FFFFFF38] lg:w-[52rem] w-full m-auto rounded-xl p-4">
        <div className="bg-[#FFFFFF14] border-2 border-[#FFFFFF38] lg:w-[13rem] m-auto p-1 rounded-lg">
          <p className="text-center font-bold text-[1.938rem]">
            {formatAmount(totalBalance)}
          </p>
          <div className="flex items-center justify-center">
            <p className="mr-2">
              {wallet?.publicKey
                ? `${wallet.publicKey.toBase58().substring(0, 10)}...${wallet.publicKey
                    .toBase58()
                    .slice(-5)}`
                : ""}
            </p>
            <button
              onClick={() =>
                copyToClipboard(wallet?.publicKey.toBase58() || "")
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#fff"
                  d="M15.24 2h-3.894c-1.764 0-3.162 0-4.255.148c-1.126.152-2.037.472-2.755 1.193c-.719.721-1.038 1.636-1.189 2.766C3 7.205 3 8.608 3 10.379v5.838c0 1.508.92 2.8 2.227 3.342c-.067-.91-.067-2.185-.067-3.247v-5.01c0-1.281 0-2.386.118-3.27c.127-.948.413-1.856 1.147-2.593s1.639-1.024 2.583-1.152c.88-.118 1.98-.118 3.257-.118h3.07c1.276 0 2.374 0 3.255.118A3.6 3.6 0 0 0 15.24 2"
                />
                <path
                  fill="#fff"
                  d="M6.6 11.397c0-2.726 0-4.089.844-4.936c.843-.847 2.2-.847 4.916-.847h2.88c2.715 0 4.073 0 4.917.847S21 8.671 21 11.397v4.82c0 2.726 0 4.089-.843 4.936c-.844.847-2.202.847-4.917.847h-2.88c-2.715 0-4.073 0-4.916-.847c-.844-.847-.844-2.21-.844-4.936z"
                />
              </svg>
            </button>
            {isTooltipShown && (
              <div className="absolute z-10   ml-[17rem] inline-block rounded-xl bg-gray-900 px-3 py-4ont-medium text-white shadow-sm dark:bg-gray-700">
                Copied!
              </div>
            )}
          </div>
        </div>
        <div className="lg:flex justify-center mt-6">
          <div className="bg-[#FFFFFF14] border-2 border-[#FFFFFF38] lg:w-24 w-full p-2 rounded-lg lg:mr-5 hover:bg-[#FFFFFF29] hover:border-[#FFFFFF] cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 16 16"
              className="place-self-center"
            >
              <path
                fill="#fff"
                fill-rule="evenodd"
                d="M8 0c-.69 0-1.843.265-2.928.56c-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625c.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625a11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263a63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m0 5a1.5 1.5 0 0 1 .5 2.915l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99A1.5 1.5 0 0 1 8 5"
              />
            </svg>
            <p className="text-center">Vault</p>
          </div>
          <div className="bg-[#FFFFFF14] border-2 border-[#FFFFFF38] lg:w-24 w-full p-2 rounded-lg lg:mr-5 my-2 lg:my-0 hover:bg-[#FFFFFF29] hover:border-[#FFFFFF] cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="place-self-center"
            >
              <path
                fill="#fff"
                fill-rule="evenodd"
                d="M4 6.8V8H2.8A1.8 1.8 0 0 0 1 9.8v8.4A1.8 1.8 0 0 0 2.8 20h16.4a1.8 1.8 0 0 0 1.8-1.8V17h1.2c.992 0 1.8-.808 1.8-1.8V6.8c0-.992-.808-1.8-1.8-1.8H5.8C4.808 5 4 5.808 4 6.8M6 7v1h13.2A1.8 1.8 0 0 1 21 9.8V15h1V7zm3 7a2 2 0 1 1 4 0a2 2 0 0 1-4 0"
                clip-rule="evenodd"
              />
            </svg>
            <p className="text-center">Ramps</p>
          </div>
          <div className="bg-[#FFFFFF14] border-2 border-[#FFFFFF38] lg:w-24 w-full p-2 rounded-lg lg:mr-5 my-2 lg:my-0 hover:bg-[#FFFFFF29] hover:border-[#FFFFFF] cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="place-self-center"
            >
              <g
                fill="none"
                stroke="#fff"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
              >
                <path d="M5.636 18.364A9 9 0 1 0 3 12.004V14" />
                <path d="m1 12l2 2l2-2m6-4v5h5" />
              </g>
            </svg>
            <p className="text-center">History</p>
          </div>
          <div
            className={`${selectedTab === 3 ? "bg-[#FFFFFF29] border-[#FFFFFF]" : "bg-[#FFFFFF14] border-[#FFFFFF38]"} border-2 lg:w-24 w-full p-2 rounded-lg hover:bg-[#FFFFFF29] hover:border-[#FFFFFF] cursor-pointer`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 48 48"
              className="place-self-center"
            >
              <path
                fill="#fff"
                fill-rule="evenodd"
                d="M24.039 6c-4.517 0-8.632 1.492-11.067 2.711q-.33.165-.616.322c-.378.206-.7.398-.956.567l2.77 4.078l1.304.519c5.096 2.571 11.93 2.571 17.027 0l1.48-.768L36.6 9.6a16 16 0 0 0-1.689-.957C32.488 7.437 28.471 6 24.04 6m-6.442 4.616a25 25 0 0 1-2.901-.728C16.978 8.875 20.377 7.8 24.04 7.8c2.537 0 4.936.516 6.92 1.17c-2.325.327-4.806.882-7.17 1.565c-1.86.538-4.034.48-6.192.081m15.96 5.064l-.246.124c-5.606 2.828-13.042 2.828-18.648 0l-.233-.118C6.008 24.927-.422 41.997 24.039 41.997S41.913 24.61 33.557 15.68M23 24a2 2 0 1 0 0 4zm2-2v-1h-2v1a4 4 0 0 0 0 8v4c-.87 0-1.611-.555-1.887-1.333a1 1 0 1 0-1.885.666A4 4 0 0 0 23 36v1h2v-1a4 4 0 0 0 0-8v-4c.87 0 1.611.555 1.887 1.333a1 1 0 1 0 1.885-.666A4 4 0 0 0 25 22m0 8v4a2 2 0 1 0 0-4"
                clip-rule="evenodd"
              />
            </svg>
            <p className="text-center">Earnings</p>
          </div>
        </div>
        <div className="lg:flex justify-center mt-6">
          <div className="bg-[#FFFFFF14] border-2 border-[#FFFFFF38] lg:w-[13.5rem] w-full p-3 rounded-lg lg:mr-5 ">
            <p>Total Amount Earned</p>
            <p className="text-4xl font-bold">{formatAmount(earnedAmount)}</p>
          </div>
          <div className="bg-[#FFFFFF14] border-2 border-[#FFFFFF38] lg:w-[13.5rem] w-full p-3 rounded-lg lg:mr-5 my-2 lg:my-0 ">
            <p>Available Tokens</p>
            <p className="text-4xl font-bold">
              {formatAmount(availableTokens)}
            </p>
          </div>
          <div className="bg-[#FFFFFF14] border-2 border-[#FFFFFF38] lg:w-[13.5rem] w-full p-3 rounded-lg  ">
            <p>Staked Tokens</p>
            <p className="text-4xl font-bold">{formatAmount(stakedTokens)}</p>
          </div>
        </div>
        <div className="lg:flex justify-between mt-6">
          <div className="relative w-full lg:w-[15.375rem]">
            {/* Dropdown Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex w-full items-center justify-between rounded-lg bg-[#FFFFFF14] border-2 border-[#FFFFFF47] px-4 py-2.5 text-white"
            >
              <span>{selectedCategory.label}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="#fff"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="m7 10l5 5l5-5"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute mt-2 w-full rounded-xl bg-[#FFFFFF14] shadow-lg border border-[#FFFFFF47] z-10 backdrop-blur-xl">
                <ul className="py-2">
                  {categoriesOptions.map((option) => (
                    <li key={option.value}>
                      <button
                        onClick={() => {
                          setSelectedCategory(option);
                          setIsOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-white hover:bg-[#FFFFFF29] ${
                          selectedCategory.value === option.value
                            ? "font-semibold"
                            : "font-normal"
                        }`}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="relative w-full lg:w-[15.375rem] mt-1 lg:mt-0">
            {/* Dropdown Button */}
            <button
              onClick={() => setOpenSortingFilter(!openSortingFilter)}
              className="flex w-full items-center justify-between rounded-lg bg-[#FFFFFF14] border-2 border-[#FFFFFF47] px-4 py-2.5 text-white"
            >
              <span>{selectedSortingOptions.label}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="#fff"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="m7 10l5 5l5-5"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {openSortingFilter && (
              <div className="absolute mt-2 w-full rounded-xl bg-[#FFFFFF14] shadow-lg border border-[#FFFFFF47] z-10 backdrop-blur-xl">
                <ul className="py-2">
                  {sortingOptions.map((option) => (
                    <li key={option.value}>
                      <button
                        onClick={() => {
                          setSelectedSortingOptions(option);
                          setOpenSortingFilter(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-white hover:bg-[#FFFFFF29] ${
                          selectedSortingOptions.value === option.value
                            ? "font-semibold"
                            : "font-normal"
                        }`}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="mt-6">
          {filteredHistory.map((data, index) => (
            <div className="bg-[#FFFFFF14] border-2 border-[#FFFFFF38]  px-3 py-5 rounded-lg my-5 ">
              <div className="lg:flex lg:justify-between justify-center">
                <div className="flex items-start">
                  <div>
                    {(data.currency === "USDT" || data.currency === "USDC") && (
                      <USDCIcon />
                    )}
                    {data.currency === "KINSHIP" && <KinshipTransactionIcon />}
                    {data.currency === "SOL" && <SolanaIcon />}
                    {data.currency !== "USDT" &&
                      data.currency !== "USDC" &&
                      data.currency !== "SOL" && (
                        // <div className="lg:w-[50px]">
                        //   <img src={"https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149622021.jpg"} alt="icon" />
                        // </div>
                        <SolanaIcon />
                      )}
                  </div>
                  <div>
                    <div className="ml-3 flex  justify-between lg:flex-col">
                      <p className="text-sm">{data.description}</p>
                      <p className="text-xs text-[#FFFFFFBF] mt-1">
                        {formatTimestamp(data.created_date)}
                      </p>
                    </div>
                    <div>
                      {data.isStaked && !isPastTimestamp(data.unlock_date) && (
                        <div className="flex items-center mt-5 ml-3">
                          <button className="btn btn-sm mr-2 bg-transparent hover:bg-[#FFFFFF29] hover:border-[#FFFFFF] border-2 border-[#FFFFFF47] mb-2 lg:mb-0 lg:block hidden">
                            Locked
                          </button>
                          <p className="ml-2 text-xs">
                            {formatUnlocksIn(data.unlock_date)}
                          </p>
                        </div>
                      )}
                      {data.isStaked &&
                        isPastTimestamp(data.unlock_date) &&
                        !data.isUnlocked && (
                          <button
                            className="btn btn-sm mr-2 bg-[#FF00AE] hover:bg-[#FF00AE] text-white mb-2 lg:mb-0 lg:block hidden ml-3 mt-4 "
                            onClick={() => claimRewardAmount(data)}
                          >
                            Unlock
                          </button>
                        )}
                    </div>
                  </div>
                </div>
                <div className=" flex justify-center items-center lg:items-start">
                  <div className="flex  mt-2 lg:mt-0">
                    {!data.isSend && (
                      <svg
                        width="13"
                        height="16"
                        viewBox="0 0 13 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mt-2"
                      >
                        <path
                          d="M12 9.55556L6.5 15M6.5 15L1 9.55556M6.5 15L6.5 0.999999"
                          stroke="#00EB72"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    )}
                    {data.isSend && (
                      <svg
                        width="13"
                        height="16"
                        viewBox="0 0 13 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mt-2"
                      >
                        <path
                          d="M0.999999 6.44444L6.5 1M6.5 1L12 6.44445M6.5 1L6.5 15"
                          stroke="#FF5B56"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    )}
                    <p className="text-xl font-bold ml-2">
                      {(data.currency === "USDT" ||
                        data.currency === "USDC") && (
                        <>
                          {data.amount < 1
                            ? `$ ${data.amount.toString().length > 6 ? data.amount.toFixed(6) : data.amount}`
                            : formatAmount(data.amount / 10 ** 6)}
                        </>
                      )}
                      {data.currency !== "USDT" && data.currency !== "USDC" && (
                        <>{`${data.amount} ${data.currency.toUpperCase()}`}</>
                      )}
                    </p>
                  </div>
                  <div>
                    {data.isStaked && !isPastTimestamp(data.unlock_date) && (
                      <div className="flex items-center mt-5 ml-3">
                        <button className="btn btn-sm mr-2 bg-transparent hover:bg-[#FFFFFF29] hover:border-[#FFFFFF] border-2 border-[#FFFFFF47] mb-2 lg:mb-0 lg:hidden  rounded-full ">
                          Locked
                        </button>
                      </div>
                    )}
                    {data.isStaked &&
                      isPastTimestamp(data.unlock_date) &&
                      !data.isUnlocked && (
                        <button
                          className="btn btn-sm mr-2 bg-[#FF00AE] hover:bg-[#FF00AE] text-white mb-2 lg:mb-0 lg:hidden ml-3 mt-4 rounded-full"
                          onClick={() => claimRewardAmount(data)}
                        >
                          Unlock
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredHistory.length === 0 && (
            <div className="bg-[#FFFFFF14] border-2 border-[#FFFFFF38]  px-3 py-5 rounded-lg my-5 ">
              <p className="text-sm text-center">
                {historyLoading ? "Loading..." : "No transactions found"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
