"use client";

import Image from "next/image";
import ImagePicker from "@/app/components/ImagePicker";
import Button from "@/app/components/common/Button";
import Input from "@/app/components/common/Input";
import Radio from "@/app/components/common/Radio";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { pinImageToShadowDrive } from "@/app/lib/uploadImageToShdwDrive";
import useWallet from "@/utils/wallet";
import axios from "axios";
import useConnection from "@/utils/connection";
import * as anchor from "@coral-xyz/anchor";
import { Connectivity as CurveConn } from "@/anchor/curve/bonding";
import { web3Consts } from "@/anchor/web3Consts";
import { pinFileToShadowDriveUrl } from "@/app/lib/uploadFileToShdwDrive";

import Modal from "react-modal";
import SearchIcon from "@/assets/icons/SearchIcon";
import TokenCard from "./TokenCard";
import { Bars } from "react-loader-spinner";
import { Coin, CoinDetail } from "@/app/models/coin";
import Calender from "@/assets/icons/Calender";
import TimeIcon from "@/assets/icons/TimeIcon";
import { walletAddressShortener } from "@/app/lib/walletAddressShortener";
import OpenInNew from "@/assets/icons/OpenInNew";
import Select from "../common/Select";
import SimpleInput from "../common/SimpleInput";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { calculatePrice, getCoinPrice } from "@/app/lib/forge/setupCoinPrice";
import { ExponentialCurve, ExponentialCurveConfig } from "@/anchor/curve/curves";
import { useAtom } from "jotai";
import { data } from "@/app/store";
import baseCoins from "@/app/lib/baseCoins";
import { Minting } from "./Minting";
import { Vesting } from "./Vesting";
import { PreSale } from "./PreSale";
import { Launch } from "./Launch";

const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#180E4F",
      minWidth: "300px",
      maxWidth: "500px",
      width: "100%",
    },
  };

export default function AgentCoin({ onPageChange, symbol }: { onPageChange: any, symbol: any }) {
  const wallet: any = useWallet();
  const [currentUser] = useAtom(data);
  const connection = useConnection();
  const navigate = useRouter();

  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [keyword, setKeyword] = React.useState("");
  const [coinLoader, setCoinLoader] = React.useState(false);
  const [coinAllList, setCoinAllList] = React.useState([]);
  const [coinList, setCoinList] = React.useState([]);
  const [buttonStatus, setButtonStatus] = React.useState("Button");

  const [selectedCoin, setSelectedCoin] = React.useState<Coin>({
    name: "MMOSH: The Stoked Token",
    desc: "",
    image:
      "https://shdw-drive.genesysgo.net/7nPP797RprCMJaSXsyoTiFvMZVQ6y1dUgobvczdWGd35/MMoshCoin.png",
    token: process.env.NEXT_PUBLIC_OPOS_TOKEN!,
    symbol: "MMOSH",
    decimals: 9
  });

  const [fields, setFields] = useState({
    image: {
      preview: "",
      type: ""
    },
    name: "",
    symbol: "",
    desc: "",
    bonding: "exponential",
    maxsupply: 0,
    deadlineDate: "",
    deadlineTime: "",
    multiplier: 0,
    initialPrice: 0,
  })
  const [loading, setLoading] = useState(false)

  const [image, setImage] = React.useState<File | null>(null);

  const [showMsg, setShowMsg] = useState(false);
  const [msgClass, setMsgClass] = useState("");
  const [msgText, setMsgText] = useState("");

  const [isReady, setIsReady] = useState(false)
  const [projectDetail, setProjectDetail] = React.useState<any>(null)
  const bondingSelectOptions = [
    {
      label: "Exponential",
      value: "exponential",
    },
    {
      label: "Linear",
      value: "linear",
    },
  ];

  const [datasets, setDatasets] = React.useState<{ data: number }[]>([]);
  const [tabIndex, setTabIndex] = React.useState<string>("minting");
  const [coinId, setCoinId] = React.useState<string>("");

  const tickXFormat = React.useCallback(
    (value: number) => {
      if (value === datasets.length - 1) return "Supply = x";

      return "";
    },
    [datasets],
  );

  React.useEffect(() => {
    if (!image) return;
    const objectUrl = URL.createObjectURL(image);
    let imageObj = {
      preview: objectUrl,
      type: image.type
    }
    setFields({ ...fields, image: imageObj })
  }, [image]);

  React.useEffect(() => {
    const isLinear = fields.bonding === "linear";
    const isExponential = fields.bonding === "exponential";

    if (
      (isLinear && fields.initialPrice === 0) ||
      (isExponential && fields.multiplier === 0)
    ) {
      setDatasets([{ data: 0 }, { data: 0 }, { data: 0 }]);
      return;
    }


    const multiplier = isLinear ? 0 : fields.multiplier;

    const initialPrice = isLinear ? fields.initialPrice : 0;

    const res = getCoinPrice(
      1000,
      initialPrice.toString(),
      fields.bonding,
      multiplier,
    );

    const datasetsValue = res.data.map((value) => ({
      data: value,
    }));

    const datasetsResult = isLinear
      ? [{ data: 0 }, ...datasetsValue]
      : datasetsValue;

    setDatasets(datasetsResult);
  }, [fields.multiplier, fields.initialPrice, fields.bonding]);


  React.useEffect(() => {
    getProjectDetailFromAPI()
  }, [])

  const getProjectDetailFromAPI = async () => {
    try {
      setLoading(true)
      let listResult = await axios.get(`/api/project/detail?symbol=${symbol}`);
      setProjectDetail(listResult.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setProjectDetail(null)
    }
  }

  React.useEffect(() => {
    setIsReady(validateFields(false))
  }, [fields])

  const createMessage = (message: any, type: any) => {
    window.scrollTo(0, 0);
    setMsgText(message);
    setMsgClass(type);
    setShowMsg(true);
    setLoading(false);
    setButtonStatus("Mint")
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

  const validateFields = (isMessage: boolean) => {
    if (fields.name.length == 0) {
      if (isMessage) {
        createMessage("Name is required", "danger-container");
      }

      return false;
    }

    if (fields.name.length > 50) {
      if (isMessage) {
        createMessage("Name should have less than 50 characters", "danger-container");
      }
      return false;
    }

    if (fields.symbol.length == 0) {
      if (isMessage) {
        createMessage("Symbol is required", "danger-container");
      }
      return false;
    }

    if (fields.maxsupply < 10000) {
      if (isMessage) {
        createMessage("Minimum market cap value should be greater than $10k", "danger-container");
      }
      return false;
    }

    if (fields.maxsupply > 1000000) {
      if (isMessage) {
        createMessage("Maximum market cap value should be less than $1m", "danger-container");
      }
      return false;
    }

    let currentDate = new Date();
    let deadlineDate = new Date(
      fields.deadlineDate + " " + fields.deadlineTime,
    );

    if (deadlineDate < currentDate) {
      if (isMessage) {
        createMessage("Deadline date should be selected in future dates", "danger-container");
      }
      return false;
    }

    if (fields.symbol.length > 10) {
      if (isMessage) {
        createMessage("Symbol should have less than 10 characters", "danger-container");
      }
      return false;
    }

    if (fields.desc.length == 0) {
      if (isMessage) {
        createMessage("Description is required", "danger-container");
      }
      return false;
    }

    if (fields.desc.length > 160) {
      if (isMessage) {
        createMessage("Description should have less than 160 characters", "danger-container");
      }
      return false;
    }

    if (fields.image.preview.length == 0) {
      if (isMessage) {
        createMessage("Community coin image is required", "danger-container");
      }
      return false;
    }

    if (fields.bonding === "linear") {
      if (fields.initialPrice > 5 || fields.initialPrice < 1) {
        if (isMessage) {
          createMessage("Mulitpler should be between 1 to 5", "danger-container");
        }
        return false;
      }
    } else {
      if (fields.multiplier > 2 || fields.multiplier < 1) {
        if (isMessage) {
          createMessage("Mulitpler should be 1 or 2", "danger-container");
        }
        return false;
      }
    }

    return true;
  };

  const actionSubmit = async () => {

    if (!wallet) {
      createMessage("Wallet is not connected", "danger-container");
      return;
    }

    if (projectDetail.coins.length > 0) {
      createMessage("Project already have coin", "danger-container");
      return;
    }

    try {
      setLoading(true);
      if (validateFields(true)) {
        setButtonStatus("validating symbol...");
        const symbolResult = await axios.get(
          `/api/check-token-symbol?symbol=${fields.symbol}`,
        );
        if (symbolResult.data) {
          createMessage("Symbol already exist. please choose different symbol and try again", "danger-container");
          return;
        }

        if (!isValidHttpUrl(fields.image.preview)) {
          setButtonStatus("Uploading image...");
          let imageFile = await fetch(fields.image.preview).then(r => r.blob()).then(blobFile => new File([blobFile], uuidv4(), { type: fields.image.type }));
          let imageUri = await pinImageToShadowDrive(imageFile)
          fields.image.preview = imageUri;
        }

        const env = new anchor.AnchorProvider(connection.connection, wallet, {
          preflightCommitment: "processed",
        });
        anchor.setProvider(env);
        let curveConn = new CurveConn(
          env,
          web3Consts.programID,
        );

        setButtonStatus("Creating Coin...");
        const targetMint = await curveConn.createTargetMint(fields.name, fields.symbol, fields.image.preview);

        console.log("target mint", targetMint)

        let targetCoin: Coin = {
          name: fields.name,
          desc: fields.desc,
          image: fields.image.preview,
          token: targetMint,
          symbol: fields.symbol,
          decimals: 9
        }

        const initPrice = 1000000000000;
        const basePrice = calculatePrice(initPrice, 1000, fields.multiplier);
        const coinValue = (Number(1000) / basePrice) * initPrice;

        const curveConfig = new ExponentialCurve(
          {
            c: new anchor.BN(fields.bonding == "linear" ? 0 : coinValue), // c = 1
            b: new anchor.BN(Number(fields.initialPrice) * initPrice),
            // @ts-ignore
            pow: Number(fields.multiplier),
            // @ts-ignore
            frac: 1,
          },
          0,
          0,
        );

        setButtonStatus("Creating Curve Config...");
        let curve = await curveConn.initializeCurve({
          config: new ExponentialCurveConfig(curveConfig),
        });

        setButtonStatus("Creating Curve...");

        const res = await curveConn.createTokenBonding({
          name: fields.name,
          symbol: fields.symbol,
          url: fields.image.preview,
          curve: curve,
          baseMint: new anchor.web3.PublicKey(selectedCoin.token),
          generalAuthority: new anchor.web3.PublicKey(process.env.NEXT_PUBLIC_PTV_WALLET_KEY!),
          reserveAuthority: new anchor.web3.PublicKey(process.env.NEXT_PUBLIC_PTV_WALLET_KEY!),
          buyBaseRoyaltyPercentage: 0,
          buyTargetRoyaltyPercentage: 0,
          sellBaseRoyaltyPercentage: 0,
          sellTargetRoyaltyPercentage: 0,
          targetMint: new anchor.web3.PublicKey(targetMint),
        });

        console.log("bonding result ", res)

        setButtonStatus("Save token details...");

        // creating community coins
        await axios.post("/api/project/save-coins", {
          name: fields.name,
          symbol: fields.symbol,
          image: fields.image.preview,
          key: targetMint,
          desc: fields.desc,
          decimals: 9,
          creator: wallet.publicKey.toBase58(),
          projectkey: projectDetail.project.key
        });

        let deadlineDate = new Date(
          fields.deadlineDate + " " + fields.deadlineTime,
        ).toUTCString();

        let coinDetail: CoinDetail = {
          base: selectedCoin,
          target: targetCoin,
          symbol: fields.symbol.toUpperCase(),
          token: targetMint,
          bonding: res.tokenBonding.toBase58(),
          status: "active",
          pool: "",
          maxsupplyusd: fields.maxsupply,
          creatorUsername: currentUser ? currentUser!.profile.username : "",
          expiredDate: deadlineDate
        }
        await axios.post("/api/save-token", coinDetail);

        navigate.push("/projects/" + symbol);
      }
    } catch (error) {
      console.log("error ", error)
      setLoading(false);
    }
  }

  const prepareNumber = (inputValue: any) => {
    if (isNaN(inputValue)) {
      return 0
    }
    return inputValue;
  }

  const isValidHttpUrl = (url: any) => {
    try {
      const newUrl = new URL(url);
      return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
    } catch (err) {
      return false;
    }
  }


  const openJupiterCoins = () => {
    setIsOpen(true);
    getCompletedCoins();
  };

  const getCompletedCoins = async () => {
    try {
      setCoinLoader(true);
      const result = await axios.get("/api/list-tokens?status=completed");
      let newCoinList: any = baseCoins
      for (let index = 0; index < result.data.length; index++) {
        newCoinList.push(result.data[index]);
      }
      setCoinAllList(newCoinList);
      setCoinList(newCoinList);
      setCoinLoader(false);
    } catch (error) {
      setCoinLoader(false);
      setCoinList([]);
      setCoinAllList([]);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setKeyword("");
    setCoinList([]);
    setCoinAllList([]);
  };

  const onCoinSearch = (event: any) => {
    setKeyword(event.target.value);
    console.log(event.target.value);
    if (event.target.value.trim().length == 0) {
      setCoinList(coinAllList);
    } else {
      let newCoinList = coinAllList.filter(
        (item: any) =>
          item.name
            .toLowerCase()
            .includes(event.target.value.trim().toLowerCase()) ||
          item.symbol
            .toLowerCase()
            .includes(event.target.value.trim().toLowerCase()) ||
          item.symbol
            .toLowerCase()
            .includes(event.target.value.trim().toLowerCase()),
      );
      setCoinList(newCoinList);
    }
  };

  const onTokenSelect = (token: any) => {
    setSelectedCoin({
      name: token.name,
      desc: "",
      image: token.image,
      token: token.token,
      symbol: token.symbol,
      decimals: token.decimals,
    })
    closeModal();
  };

  const openLink = () => {
    window.open(
      "https://solscan.io/account/" + selectedCoin.token + "?cluster=mainnet",
      "_blank",
      "noopener,noreferrer",
    );
  };

  const callback = async (data: any) => {
    if (tabIndex === "minting") {
      const env = new anchor.AnchorProvider(connection.connection, wallet, {
        preflightCommitment: "processed",
      });
      anchor.setProvider(env);
      let curveConn = new CurveConn(
        env,
        web3Consts.programID,
      );
      console.log("----- MINTING DATA -----", data);
      const targetMint = await curveConn.createTargetMint(data.name, data.symbol, data.image.preview);
      console.log("----- TARGET MINT -----", targetMint);
      const result = await axios.post("/api/project/save-coins", {
        name: data.name,
        symbol: data.symbol,
        image: data.image.preview,
        key: targetMint,
        desc: data.description,
        decimals: 9,
        creator: wallet.publicKey.toBase58(),
        projectkey: projectDetail.project.key,
        supply: Number(data.tokenSupply)
      });
      console.log("===== CLIENT RESULT CHECK =====", result.data.id);
      setCoinId(result.data.id);
      setTabIndex("presale");
    } else if (tabIndex === "vesting") {
      setTabIndex("presale");
    } else if (tabIndex === "presale") {
      console.log("===== DATA =====", data.discounts);
      const result = await axios.put("/api/project/update-coins", {
        id: coinId,
        presalediscount: data.discounts,
      });
      console.log("===== CLIENT RESULT CHECK =====", result);
      setTabIndex("launch");
    } else if (tabIndex === "launch") {
    }
  }

  return (

    <main className="relative py-5 px-5 xl:px-32 lg:px-16 md:px-8 text-white bg-transparent">
      {/* Tabs */}
      <div className="flex justify-center mb-5">
        <div className="flex w-[644px] h-[44px] rounded-[8px] border border-white/10 overflow-hidden">
          {["minting", "vesting", "presale", "launch"].map((tab, index) => (
            <button
              key={index}
              onClick={() => setTabIndex(tab)}
              className={`flex-1 text-sm font-bold leading-6 transition capitalize ${tabIndex === tab ? "text-white" : "text-white/70"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {tabIndex === "minting" && <Minting callback={(data) => callback(data)} />}
      {tabIndex === "presale" && <PreSale callback={(data) => callback(data)} />}
      {tabIndex === "launch" && <Launch />}
    </main>
  );

  // return (
  //     <>
  //         {showMsg && (
  //             <div className={"message-container text-white text-center text-header-small-font-size py-5 px-3.5 " + msgClass}>{msgText}</div>
  //         )}
  //         <div className="background-content">
  //             <div className="py-5 px-5 xl:px-32 lg:px-16 md:px-8">
  //                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  //                     <div>
  //                         <ImagePicker
  //                         changeImage={(file:any)=> {
  //                             setImage(file)
  //                         }}
  //                         image={fields.image.preview}
  //                         />
  //                     </div>
  //                     <div>
  //                         <div className="form-element pt-2.5">
  //                             <Input
  //                                 type="text"
  //                                 title="Name"
  //                                 required
  //                                 helperText="Up to 50 characters, can have spaces."
  //                                 placeholder="Name"
  //                                 value={fields.name}
  //                                 onChange={(e) => setFields({ ...fields, name: e.target.value })}
  //                             />
  //                         </div>
  //                         <div className="form-element pt-2.5">
  //                             <Input
  //                                 type="text"
  //                                 title="Symbol"
  //                                 required
  //                                 helperText="Symbol can only be letters and numbers up to 10 characters"
  //                                 placeholder="Symbol"
  //                                 value={fields.symbol}
  //                                 onChange={(e) => setFields({ ...fields, symbol: e.target.value })}
  //                             />
  //                         </div>
  //                         <div className="form-element pt-2.5">
  //                             <div className="flex">
  //                                 <div className="mt-8 mr-1 text-white text-header-small-font-size">$</div>
  //                                 <div className="form-element col-span-5">
  //                                     <Input
  //                                         type="text"
  //                                         title="Set the market cap for DEX listing"
  //                                         required
  //                                         helperText="Minimum is $10K - Maximum of $1M"
  //                                         placeholder="0"
  //                                         value={(fields.maxsupply > 0 ? fields.maxsupply.toString() : "")}
  //                                         onChange={(e) => setFields({ ...fields, maxsupply: prepareNumber(Number(e.target.value))})}
  //                                     />
  //                                 </div>

  //                             </div>
  //                         </div>

  //                         <div className="form-element pt-2.5">
  //                             <p className="text-xs text-whilte">
  //                                 Deadline to reach Market Cap 
  //                             </p>
  //                             <div className="grid grid-cols-2 gap-4">
  //                             <div>
  //                                 <label
  //                                 className={
  //                                     "input input-bordered h-10 text-base bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3] backdrop-container flex items-center gap-2 px-2"
  //                                 }
  //                                 >
  //                                 <div className="border-r border-white border-opacity-20 pr-2 h-full pt-2">
  //                                     <Calender />
  //                                 </div>

  //                                 <input
  //                                     type="date"
  //                                     className="grow text-base"
  //                                     placeholder="Start Date"
  //                                     value={fields.deadlineDate}
  //                                     onChange={(e) =>
  //                                     setFields({
  //                                         ...fields,
  //                                         deadlineDate: e.target.value,
  //                                     })
  //                                     }
  //                                 />
  //                                 </label>
  //                             </div>
  //                             <div>
  //                                 <label className="input input-bordered h-10 text-base bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3] backdrop-container flex items-center gap-2 px-2">
  //                                 <div className="border-r border-white border-opacity-20 pr-2 h-full pt-2.5">
  //                                     <TimeIcon />
  //                                 </div>

  //                                 <input
  //                                     type="time"
  //                                     className="grow text-base"
  //                                     placeholder="Time"
  //                                     value={fields.deadlineTime}
  //                                     onChange={(e) =>
  //                                     setFields({
  //                                         ...fields,
  //                                         deadlineTime: e.target.value,
  //                                     })
  //                                     }
  //                                 />
  //                                 </label>
  //                             </div>
  //                             </div>
  //                             <p className="text-tiny">If your Agent Coin doesn't reach the market cap you've set by the deadline, all funds locked in the bonding curve will be returned to purchasers and the Agent Coins will be burned.</p>
  //                         </div>

  //                     </div>
  //                     <div>
  //                         <div className="form-element h-full">
  //                             <Input
  //                                 textarea
  //                                 type="text"
  //                                 title="Description"
  //                                 required
  //                                 helperText=""
  //                                 placeholder="Describe your Community Coin and associated project and protocol."
  //                                 value={fields.desc}
  //                                 onChange={(e) => setFields({ ...fields, desc: e.target.value })}
  //                             />
  //                         </div>
  //                     </div>
  //                     <div>
  //                        <div className="form-element pt-2.5">
  //                             <p className="text-xs text-white">
  //                                 Select a Free Agent Coin to pair with your Bonded Agent Coin on the bonding curve
  //                             </p>
  //                             <div
  //                                 className="w-full flex items-center min-w-[2.5vmax] min-h-[2vmax] bg-[#9D9D9D12] cursor-pointer border-[1px] border-[#FFFFFF30] rounded-lg p-2 mt-1"
  //                                 onClick={openJupiterCoins}
  //                             >
  //                                 <div className="flex items-center">
  //                                 <div className="relative w-[2vmax] h-[2vmax] mt-2 mr-1">
  //                                     <img
  //                                     src={selectedCoin.image}
  //                                     alt="coin"
  //                                     className="rounded-full object-cover"
  //                                     />
  //                                 </div>
  //                                 <div className="flex flex-col">
  //                                     <p className="text-sm text-white">{selectedCoin.symbol}</p>
  //                                     <p className="text-tiny">{selectedCoin.name}</p>
  //                                 </div>

  //                                 <div
  //                                     className="flex self-start mb-4 rounded-md px-1 bg-[#030139]"
  //                                     onClick={openLink}
  //                                 >
  //                                     <p className="text-tiny">
  //                                     {walletAddressShortener(selectedCoin.token)}
  //                                     </p>
  //                                     <OpenInNew />
  //                                 </div>
  //                                 </div>
  //                             </div>

  //                         </div>
  //                         <div className="form-element pt-2.5">
  //                             <p className="text-xs text-white">
  //                                Choose a Bonding Curve for your Coin.
  //                             </p>
  //                             <Select
  //                                 value={fields.bonding}
  //                                 onChange={(e) => {
  //                                    setFields({ ...fields, bonding: e.target.value, initialPrice: 0, multiplier: 0 });
  //                                 }}
  //                                 options={bondingSelectOptions}
  //                             />
  //                         </div>

  //                         <div className="flex w-full h-full mt-4">
  //               <div className="flex w-full h-full flex-col">
  //                 <ResponsiveContainer
  //                   width="100%"
  //                   height={200}
  //                   className="pt-2"
  //                 >
  //                   <AreaChart
  //                     width={120}
  //                     height={200}
  //                     data={datasets}
  //                     margin={{
  //                       top: 30,
  //                     }}
  //                   >
  //                     <defs>
  //                       <linearGradient
  //                         id="gradient"
  //                         x1="1"
  //                         y1="1"
  //                         x2="2"
  //                         y2="2"
  //                       >
  //                         <stop
  //                           offset="100%"
  //                           stopColor="#0765FF"
  //                           stopOpacity={0.6}
  //                         />
  //                         <stop
  //                           offset="30%"
  //                           stopColor="#09073A"
  //                           stopOpacity={0}
  //                         />
  //                       </linearGradient>
  //                     </defs>
  //                     <XAxis tickFormatter={tickXFormat} tickLine={false} />
  //                     <YAxis
  //                       width={5}
  //                       tick={false}
  //                       tickLine={false}
  //                       label={{
  //                         value: "Price = Y",
  //                         position: "top",
  //                         offset: 5,
  //                         dx: 30,
  //                       }}
  //                     />
  //                     <Area
  //                       type="monotone"
  //                       dataKey="data"
  //                       stroke="#0047FF"
  //                       fill="url(#gradient)"
  //                     />
  //                   </AreaChart>
  //                 </ResponsiveContainer>
  //                 <div className="flex justify-center items-end self-end">
  //                   {fields.bonding === "linear" ? (
  //                     <p className="text-lg text-white">X=4(Y)</p>
  //                   ) : (
  //                     <p className="text-lg text-white">
  //                       Y=X<sup>2</sup>
  //                     </p>
  //                   )}
  //                 </div>
  //               </div>

  //               {fields.bonding === "linear" ? (
  //                 <div className="flex flex-col justify-center items-center lg:ml-4 md:ml-2 sm:ml-1">
  //                   <p className="text-white text-tiny">
  //                     Adjust the slope for your Bonding Curve by changing the
  //                     multiplier
  //                   </p>
  //                   <SimpleInput
  //                     value={fields.initialPrice.toString()}
  //                     onChange={(e) => {
  //                       const value = Number(e.target.value);

  //                       if (Number.isNaN(value)) return;

  //                       setFields({
  //                         ...fields,
  //                         initialPrice: value,
  //                       });
  //                     }}
  //                     placeholder="0"
  //                   />
  //                 </div>
  //               ) : (
  //                 <div className="flex flex-col justify-center items-center lg:ml-4 md:ml-2 sm:ml-1">
  //                   <p className="text-white text-tiny">
  //                     Adjust the slope for your Bonding Curve by changing the
  //                     multiplier
  //                   </p>
  //                   <div className="max-w-[50%]">
  //                     <SimpleInput
  //                       value={fields.multiplier.toString()}
  //                       onChange={(e) => {
  //                         const value = Number(e.target.value);

  //                         if (Number.isNaN(value)) return;

  //                         setFields({ ...fields, multiplier: value });
  //                       }}
  //                       placeholder="0"
  //                     />
  //                   </div>
  //                 </div>
  //               )}
  //             </div>

  //                     </div>
  //                 </div>
  //                 <div className="flex justify-center mt-10">
  //                     {!loading &&
  //                         <>
  //                             <button className="btn btn-primary ml-10 bg-primary text-white border-none hover:bg-primary hover:text-white" onClick={actionSubmit} disabled={!isReady}>Mint</button>
  //                         </>
  //                     }
  //                     {loading &&
  //                         <button className="btn btn-primary ml-10 bg-primary text-white border-none hover:bg-primary hover:text-white">{buttonStatus}</button>
  //                     }
  //                 </div>
  //             </div>
  //         </div>
  //         <Modal
  //         isOpen={modalIsOpen}
  //         onRequestClose={closeModal}
  //         style={customStyles}
  //     >
  //         <h2 className="pb-2.5 mb-2.5 text-sub-title-font-size font-goudy border-b border-white border-opacity-20">
  //         Coin List{" "}
  //         </h2>
  //         <div>
  //         {!coinLoader && (
  //             <>
  //             <div className="search-container">
  //                 <label
  //                 className={
  //                     "h-10 text-base bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3] backdrop-container flex items-center gap-2 px-2"
  //                 }
  //                 >
  //                 <div className="p-2">
  //                     <SearchIcon />
  //                 </div>
  //                 <input
  //                     type="text"
  //                     className="grow text-base bg-transparent focus:outline-0 outline-0 hover:outline-0 active:outline-0"
  //                     placeholder="Search by Coin Name"
  //                     value={keyword}
  //                     onChange={onCoinSearch}
  //                 />
  //                 </label>
  //             </div>
  //             <div
  //                 className="overflow-y-auto"
  //                 style={{ maxHeight: window.innerHeight * 0.7 + "px" }}
  //             >
  //                 {coinList.map((coinItem: any) => (
  //                 <TokenCard data={coinItem} onChoose={onTokenSelect} />
  //                 ))}
  //             </div>
  //             </>
  //         )}

  //         {coinLoader && (
  //             <div className="flex justify-center">
  //             <Bars
  //                 height="80"
  //                 width="80"
  //                 color="rgba(255, 0, 199, 1)"
  //                 ariaLabel="bars-loading"
  //                 wrapperStyle={{}}
  //                 wrapperClass="bars-loading"
  //                 visible={true}
  //             />
  //             </div>
  //         )}
  //         </div>
  //         </Modal>
  //     </>
  // );
}
