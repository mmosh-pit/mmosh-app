"use client";
import * as React from "react";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAtom } from "jotai";
import { userWeb3Info } from "@/app/store";
import useConnection from "@/utils/connection";
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
import { Connectivity as UserConn } from "@/anchor/user";
import MessageBanner from "@/app/components/common/MessageBanner";
import ImagePicker from "@/app/components/ImagePicker";
import CameraPicker from "@/app/components/CameraPicker";
import Select from "@/app/components/common/Select";
import { usstates } from "./usstates";
import { pinImageToShadowDrive } from "@/app/lib/uploadImageToShdwDrive";
import { calculateTimeForTransactionTable } from "@/app/lib/dateUtils";
import moment from "moment";
import { incomingReferAddress } from "@/app/store/signup";
import { pinFileToShadowDrive } from "@/app/lib/uploadFileToShdwDrive";
import useWallet from "@/utils/wallet";
import internalClient from "@/app/lib/internalHttpClient";

const defaultBaseToken = {
  name: "",
  symbol: "Select",
  token: "",
  image:
    "https://shdw-drive.genesysgo.net/7nPP797RprCMJaSXsyoTiFvMZVQ6y1dUgobvczdWGd35/MMoshCoin.png",
  bonding: "",
  basesymbol: "",
  desc: "",
  creatorUsername: "",
  decimals: 9,
  iscoin: false,
};

const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));

const Page = () => {
  const fetching = React.useRef(false);
  const navigate = useRouter();
  const connection = useConnection();
  const wallet = useWallet();
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectDetail, setProjectDetail] = useState<any>(null);
  const [profileInfo] = useAtom(userWeb3Info);
  const [projectInfo, setProjectInfo] = useState<any>({
    profiles: [],
    activationTokens: [],
    activationTokenBalance: 0,
    totalChild: 0,
    profilelineage: {
      promoter: "",
      promoterprofile: "",
      scout: "",
      scoutprofile: "",
      recruiter: "",
      recruiterprofile: "",
      originator: "",
      originatorprofile: "",
    },
    generation: "",
    invitationPrice: 0,
    mintPrice: 0,
  });
  const [searchText, setSearchText] = React.useState("");
  const [coinsList, setCoinsList] = React.useState<Coin[]>([]);
  const [symbol, setSymbol] = useState("");
  const [usdPrice, setUSDPrice] = useState(0);
  const [donation, setDonation] = useState(0);
  const [selectedToken, setSelectedToken] =
    React.useState<Coin>(defaultBaseToken);
  const [tokenAddress, setTokenAddress] = useState("");
  const [message, setMessage] = React.useState({
    message: "",
    type: "",
  });
  const [step, setStep] = useState("one");

  const [image, setImage] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    firstName: "",
    middleName: "",
    lastName: "",
    addressOne: "",
    addressTwo: "",
    city: "",
    state: "Arizona",
    zip: "",
  });

  const [histories, setHistories] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyPage, setHistoryPage] = useState(1);
  const [isHistoryPaging, setIsHistoryPaging] = useState(false);

  const [passBlueSubmit, setPassBlueSubmit] = useState(false);
  const [passBlueButtonStatus, setPassBlueButtonStatus] = useState("Mint");

  const [passRedSubmit, setPassRedSubmit] = useState(false);
  const [passRedButtonStatus, setPassRedButtonStatus] = useState("Mint");

  const getProjectDetailFromAPI = async () => {
    try {
      let listResult = await axios.get(`/api/project/detail?symbol=PTV`);
      setProjectDetail(listResult.data);
    } catch (error) {
      setProjectLoading(false);
      setProjectDetail(null);
    }
  };

  const getUserProfileInfo = async () => {
    if (!wallet) {
      return;
    }
    const env = new anchor.AnchorProvider(connection.connection, wallet, {
      preflightCommitment: "processed",
    });

    anchor.setProvider(env);
    let projectConn: ProjectConn = new ProjectConn(
      env,
      web3Consts.programID,
      new anchor.web3.PublicKey(projectDetail.project.key),
    );
    let projectInfo = await projectConn.getProjectUserInfo(
      projectDetail.project.key,
    );

    if (projectInfo.profiles.length == 0) {
      setProjectLoading(false);
      return;
    }

    let tokenInfo = await projectConn.metaplex.nfts().findByMint({
      mintAddress: new anchor.web3.PublicKey(projectInfo.profiles[0].address),
    });

    let tokenAddressInfo: any =
      tokenInfo.symbol.toUpperCase() === "PTVR"
        ? process.env.NEXT_PUBLIC_PTVR_TOKEN
        : process.env.NEXT_PUBLIC_PTVB_TOKEN;
    setTokenAddress(tokenAddressInfo);
    const price = await getPriceForPTV(
      tokenInfo.symbol.toUpperCase() == "PTVR"
        ? process.env.NEXT_PUBLIC_PTVR_TOKEN
        : process.env.NEXT_PUBLIC_PTVB_TOKEN,
    );
    console.log("price is ", price);
    setSymbol(tokenInfo.symbol);
    setUSDPrice(price > 0 ? price : 0.0003);
    setProjectInfo(projectInfo);
    setProjectLoading(false);
  };

  React.useEffect(() => {
    getProjectDetailFromAPI();
    loadDonationProfile();
    listHistory(1);
  }, [wallet]);

  useEffect(() => {
    console.log("newHistories ", histories);
  }, [histories]);

  React.useEffect(() => {
    if (projectDetail) {
      getUserProfileInfo();
    }
  }, [projectDetail]);

  React.useEffect(() => {
    getCoinsList();
  }, [searchText]);

  const loadDonationProfile = async () => {
    if (!wallet) {
      return;
    }
    const result = await axios.get(
      "/api/donation?wallet=" + wallet.publicKey.toBase58(),
    );
    if (result.data.status) {
      setForm({
        firstName: result.data.data.firstname,
        middleName: result.data.data.middlename,
        lastName: result.data.data.lastname,
        addressOne: result.data.data.addressone,
        addressTwo: result.data.data.addresstwo,
        city: result.data.data.city,
        state: result.data.data.state,
        zip: result.data.data.zip,
      });
      setPreview(result.data.data.image);
    }
  };

  const copyToClipboard = React.useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
  }, []);

  const chooseMemeCoin = async () => {
    await getCoinsList();
    (document.getElementById("coin_modal") as any)?.showModal();
  };

  const createLineageShare = async () => {
    if (!wallet) {
      return;
    }
    const env = new anchor.AnchorProvider(connection.connection, wallet, {
      preflightCommitment: "processed",
    });
    let userConn: UserConn = new UserConn(env, web3Consts.programID);
    let tokenInfo = await userConn.metaplex.nfts().findByMint({
      mintAddress: new anchor.web3.PublicKey(projectInfo.profiles[0].address),
    });

    let holdersfullInfo = [];
    let totalValue = 0;
    if (tokenInfo.json?.attributes) {
      for (let index = 0; index < tokenInfo.json?.attributes.length; index++) {
        const element = tokenInfo.json?.attributes[index];
        if (
          element.trait_type === "USER.Parent" ||
          element.trait_type === "USER.GrandParent" ||
          element.trait_type === "USER.GreatGrandParent" ||
          element.trait_type === "USER.GGreatGrandParent"
        ) {
          let mintAddress: any = element.value;
          let receiver = await (
            await userConn.getNftProfileOwner(
              new anchor.web3.PublicKey(mintAddress),
            )
          ).profileHolder.toBase58();

          let value = getShare(element.trait_type);
          totalValue = totalValue + value;
          holdersfullInfo.push({
            receiver,
            value: getShare(element.trait_type),
          });
        }
      }
    }

    console.log("holder info", holdersfullInfo);
    if (holdersfullInfo.length > 0) {
      if (totalValue < donation * web3Consts.LAMPORTS_PER_OPOS) {
        let finalValue = Math.ceil(
          donation * web3Consts.LAMPORTS_PER_OPOS - totalValue,
        );
        holdersfullInfo[0].value = holdersfullInfo[0].value + finalValue;
      }
      const res = await userConn.sendShare(
        selectedToken.token,
        holdersfullInfo,
      );
      console.log("res ", res);
      if (res.Err) {
        createMessage("Error on sending donation", "error");
        return false;
      }
      return true;
    } else {
      let receiver = await (
        await userConn.getNftProfileOwner(web3Consts.oposToken)
      ).profileHolder.toBase58();
      holdersfullInfo.push({
        receiver,
        value: Math.ceil(donation * web3Consts.LAMPORTS_PER_OPOS),
      });
      const res = await userConn.sendShare(
        selectedToken.token,
        holdersfullInfo,
      );
      console.log("res ", res);
      if (res.Err) {
        createMessage("Error on sending donation", "error");
        return false;
      }
      return true;
    }
  };

  const handleTokenSelect = (token: Coin) => {
    setSelectedToken(token);
    (document.getElementById("coin_modal") as any)?.close();
  };

  const getShare = (lineage: String) => {
    if (lineage === "USER.Parent") {
      return Math.ceil(donation * web3Consts.LAMPORTS_PER_OPOS * 0.4); // 40%
    } else if (lineage === "USER.GrandParent") {
      return Math.ceil(donation * web3Consts.LAMPORTS_PER_OPOS * 0.25); // 25%
    } else if (lineage === "USER.GreatGrandParent") {
      return Math.ceil(donation * web3Consts.LAMPORTS_PER_OPOS * 0.2); // 20%
    } else {
      return Math.ceil(donation * web3Consts.LAMPORTS_PER_OPOS * 0.15); // 15%
    }
  };

  const getCoinsList = async () => {
    let newCoinList = [];
    fetching.current = true;
    const listResult = await axios.get(
      `/api/list-tokens?search=${searchText}&&symbol=${symbol}`,
    );
    fetching.current = false;

    for (let index = 0; index < listResult.data.length; index++) {
      const element = listResult.data[index];
      element.decimals = 9;
      element.iscoin = false;
      newCoinList.push(element);
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

  const goBack = () => {
    setStep("one");
  };

  React.useEffect(() => {
    if (!image) return;
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
  }, [image]);

  const onNextAction = async () => {
    if (!wallet) {
      return;
    }

    if (selectedToken.token === "") {
      return;
    }

    const env = new anchor.AnchorProvider(connection.connection, wallet, {
      preflightCommitment: "processed",
    });

    anchor.setProvider(env);
    const userConn: UserConn = new UserConn(env, web3Consts.programID);
    const balance = await userConn.getUserBalance({
      address: wallet.publicKey,
      token: selectedToken.token,
    });

    if (balance < donation) {
      setMessage({
        type: "warn",
        message: "Balance is not enough to process transaction",
      });
      return;
    }
    setStep("two");
  };

  const createMessage = React.useCallback((text: string, type: string) => {
    setMessage({ message: text, type });
  }, []);

  const validateFields = () => {
    if (!wallet) {
      createMessage("Wallet is not connected", "error");
      return false;
    }

    if (!image && preview === "") {
      createMessage("Image is required", "error");
      return false;
    }

    if (form.firstName.length == 0) {
      createMessage("First name is required", "error");
      return false;
    }

    if (form.lastName.length == 0) {
      createMessage("Lastname is required", "error");
      return false;
    }

    if (form.state.length == 0) {
      createMessage("State is required", "error");
      return false;
    }

    if (form.zip.length == 0) {
      createMessage("Zip code is required", "error");
      return false;
    }

    return true;
  };

  const onSubmit = async () => {
    if (!validateFields()) {
      return;
    }
    try {
      setIsLoading(true);
      let imageUri = preview;
      if (image) {
        imageUri = await pinImageToShadowDrive(image);
      }

      const res = await createLineageShare();
      if (!res) {
        console.log("res ", res);
        createMessage("Error on donation", "error");
        setIsLoading(false);
        return;
      }

      const result = await internalClient.post("/api/donation/save", {
        wallet: wallet?.publicKey.toBase58(),
        firstname: form.firstName,
        middlename: form.middleName,
        lastname: form.lastName,
        addressone: form.addressOne,
        addresstwo: form.addressTwo,
        city: form.city,
        state: form.state,
        zip: form.zip,
        amount: donation,
        image: imageUri,
        usdvalue: donation * usdPrice,
        token: selectedToken.token,
      });

      setSelectedToken(defaultBaseToken);
      setStep("one");
      createMessage("Your donation has been successfully received!", "success");
      setIsLoading(false);
      setHistoryPage(1);
      listHistory(1);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const openPreviewDonation = () => {
    (document.getElementById("history_modal") as any)?.showModal();
  };

  const listHistory = async (page: any) => {
    if (!wallet) {
      return;
    }
    try {
      setHistoryLoading(true);
      setIsHistoryPaging(false);
      let url =
        "/api/donation/history?wallet=" +
        wallet.publicKey.toBase58() +
        "&skip=" +
        (page - 1) * 10;
      let apiResult = await axios.get(url);

      let newHistories: any = page == 1 ? [] : histories;

      for (let index = 0; index < apiResult.data.length; index++) {
        const element: any = apiResult.data[index];
        newHistories.push({
          created_date: element.created_date,
          coin: element.token.length > 0 ? element.token[0] : null,
          usdvalue: element.usdvalue,
          amount: element.amount,
        });
      }
      console.log("listhistory ", newHistories);
      setHistories(newHistories);
      if (apiResult.data.length < 10) {
        setIsHistoryPaging(false);
      } else {
        setIsHistoryPaging(true);
      }
      setHistoryLoading(false);
    } catch (error) {
      console.log("listhistory error", error);
      setHistoryLoading(false);
      setHistories([]);
    }
  };

  const nextHistoryPage = () => {
    let currentPage = historyPage + 1;
    setHistoryPage(currentPage);
    listHistory(currentPage);
  };

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

  const passAction = async (type: any) => {
    if (!profileInfo) {
      createMessage(
        "Hey! We checked your wallet is not connected",
        "warning-container",
      );
      return;
    }

    if (!wallet) {
      createMessage(
        "Hey! We checked your wallet is not connected",
        "warning-container",
      );
      return;
    }

    if (profileInfo?.solBalance < 0) {
      createMessage(
        "Hey! We checked your wallet and you don’t have enough SOL for the gas fees. Get some Solana and try again!",
        "warn",
      );
      return;
    }

    let tolBalance = profileInfo?.mmoshBalance;

    if (tolBalance < projectInfo.mintPrice / 1000_000_000) {
      createMessage(
        "Hey! We checked your wallet and you don’t have enough usdc to mint. Get some MMOSH here and try again!",
        "warn",
      );
      return;
    }

    try {
      if (type === "Blue") {
        setPassBlueSubmit(true);
      } else {
        setPassRedSubmit(true);
      }

      const genesisProfile = projectDetail.project.key;
      let activationToken;
      if (projectInfo.activationTokens.length > 0) {
        activationToken = new anchor.web3.PublicKey(
          projectInfo.activationTokens[0].activation,
        );
      }

      const env = new anchor.AnchorProvider(connection.connection, wallet, {
        preflightCommitment: "processed",
      });
      let projectConn: ProjectConn = new ProjectConn(
        env,
        web3Consts.programID,
        new anchor.web3.PublicKey(projectDetail.project.key),
      );
      if (type === "Blue") {
        setPassBlueButtonStatus("Preparing Metadata...");
      } else {
        setPassRedButtonStatus("Preparing Metadata...");
      }

      let name = "Pump The Vote Blue";
      const body = {
        name: type === "Red" ? "Pump The Vote Red" : "Pump The Vote Blue",
        symbol: type === "Red" ? "PTVR" : "PTVB",
        description:
          type === "Red"
            ? "Pump The Vote is a PolitiFi project within the MMOSH ecosystem. The Pump The Vote Red project pass is for conservatives united by a desire to protect and strengthen the principles that we believe have made America a great and prosperous nation, such as the principles of limited government, personal responsibility, and the preservation of traditional values. We are proponents of fiscal responsibility, advocating for lower taxes, reduced government spending, and balanced budgets to promote economic growth and ensure long-term sustainability."
            : "Pump The Vote is a PolitiFi project within the MMOSH ecosystem. The Pump The Vote Blue project pass is for progressives who are deeply committed to the principles of social justice, equality, and the protection of individual rights. We believe in a government that plays an active role in ensuring that all citizens have access to essential services like healthcare, education, and economic opportunities, and that it should work to reduce disparities and promote fairness in society. We are united by a vision of an inclusive America where government acts as a force for good, ensuring that every person has the opportunity to succeed and live a life of dignity, respect and personal freedom.",
        image:
          type === "Blue"
            ? "https://shdw-drive.genesysgo.net/Ejpot7jAYngByq5EgjvgEMgqJjD8dnjN4kSkiz6QJMsH/Pump%20the%20Vote%20Square%20Icon%20Only%20Blue.png"
            : "https://shdw-drive.genesysgo.net/Ejpot7jAYngByq5EgjvgEMgqJjD8dnjN4kSkiz6QJMsH/Pump%20the%20Vote%20Square%20Icon%20Only%20Red.png",
        enternal_url:
          process.env.NEXT_PUBLIC_APP_MAIN_URL +
          "create/project/" +
          projectDetail.project.symbol,
        family: "MMOSH",
        collection: "MMOSH Pass Collection",
        attributes: [
          {
            trait_type: "Project",
            value: projectDetail.project.key,
          },
          {
            trait_type: "Primitive",
            value: "Pass",
          },
          {
            trait_type: "Ecosystem",
            value: "MMOSH",
          },
          {
            trait_type: "Founder",
            value: "Moto",
          },
          {
            trait_type: "Party",
            value: type,
          },
          {
            trait_type: "Seniority",
            value: projectDetail.project.seniority + 1,
          },
          {
            trait_type: "Website",
            value:
              type === "Red"
                ? "https://www.pumpthevote.red"
                : "https://www.pumpthevote.blue",
          },
          {
            trait_type: "Telegram",
            value: projectDetail.project.telegram,
          },
          {
            trait_type: "X",
            value: projectDetail.project.twitter,
          },
        ],
      };

      let refer = localStorage.getItem("refer");
      if (refer != "" && refer != undefined) {
        let parentPass: any = refer;
        let parentInfo = await projectConn.metaplex.nfts().findByMint({
          mintAddress: new anchor.web3.PublicKey(parentPass),
        });
        body.attributes.push({
          trait_type: "USER.Parent",
          value: parentPass,
        });

        if (parentInfo.json?.attributes) {
          for (
            let index = 0;
            index < parentInfo.json?.attributes.length;
            index++
          ) {
            const element = parentInfo.json?.attributes[index];
            if (element.trait_type === "USER.Parent") {
              body.attributes.push({
                trait_type: "USER.GrandParent",
                value: element.value,
              });
            }
            if (element.trait_type === "USER.GrandParent") {
              body.attributes.push({
                trait_type: "USER.GreatGrandParent",
                value: element.value,
              });
            }

            if (element.trait_type === "USER.GreatGrandParent") {
              body.attributes.push({
                trait_type: "USER.GGreatGrandParent",
                value: element.value,
              });
            }
          }
        }
      }

      // get originator name
      if (projectInfo.profilelineage.originator.length > 0) {
        let originator: any = await getUserName(
          projectInfo.profilelineage.originator,
        );
        if (originator != "") {
          body.attributes.push({
            trait_type: "Creator",
            value: originator,
          });
        } else {
          body.attributes.push({
            trait_type: "Creator",
            value: projectInfo.profilelineage.originator,
          });
        }
        body.attributes.push({
          trait_type: "Creator_Profile",
          value: projectInfo.profilelineage.originatorprofile,
        });
      }

      const passMetaURI: any = await pinFileToShadowDrive(body);
      if (passMetaURI === "") {
        if (type === "Blue") {
          setPassBlueSubmit(false);
        } else {
          setPassRedSubmit(false);
        }

        createMessage(
          "We’re sorry, there was an error while trying to prepare meta url. please try again later.",
          "danger-container",
        );
        return;
      }

      if (type === "Blue") {
        setPassBlueButtonStatus("Minting Pass...");
      } else {
        setPassRedButtonStatus("Minting Pass...");
      }

      console.log("params", {
        name: body.name,
        symbol: body.symbol,
        uriHash: passMetaURI,
        activationToken: activationToken ? activationToken.toBase58() : "",
        genesisProfile: genesisProfile,
        commonLut: projectDetail.project.lut,
      });

      console.log("guest pass implementation");
      const apiResult = await internalClient.post("/api/ptv/free", {
        name: body.name,
        symbol: body.symbol,
        url: passMetaURI,
        gensis: genesisProfile,
        lut: projectDetail.project.lut,
        receiver: wallet.publicKey.toBase58(),
        key: projectDetail.project.key,
      });
      let res = apiResult.data;

      if (res.status) {
        if (type === "Blue") {
          setPassBlueButtonStatus("Waiting for confirmations...");
        } else {
          setPassRedButtonStatus("Waiting for confirmations...");
        }

        await delay(15000);
        await internalClient.put("/api/project/update-seniority", {
          key: projectDetail.project.key,
        });
        createMessage(
          "Congrats! You have minted your Pass successfully.",
          "success-container",
        );
        await getProjectDetailFromAPI();
        await getUserProfileInfo();
      } else {
        createMessage(
          "We’re sorry, there was an error while trying to mint your Pass. Check your wallet and try again.",
          "danger-container",
        );
      }
      if (type === "Blue") {
        setPassBlueSubmit(false);
        setPassBlueButtonStatus("Mint");
      } else {
        setPassRedSubmit(false);
        setPassRedButtonStatus("Mint");
      }
    } catch (error) {
      console.log("error ", error);
      createMessage(
        "We’re sorry, there was an error while trying to mint your Pass. Check your wallet and try again.",
        "danger-container",
      );
      if (type === "Blue") {
        setPassBlueSubmit(false);
        setPassBlueButtonStatus("Mint");
      } else {
        setPassRedSubmit(false);
        setPassRedButtonStatus("Mint");
      }
    }
  };

  return (
    <div className="relative background-content">
      <MessageBanner message={message.message} type={message.type} />
      {
        <>
          <>
            {step === "one" && (
              <>
                <div className="container mx-auto">
                  <div className="my-10 p-5">
                    {projectLoading && (
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
                    )}
                    {!projectLoading &&
                      projectDetail &&
                      projectInfo.profiles.length > 0 && (
                        <>
                          <h2 className="text-center text-white font-goudy font-normal text-xl">
                            Collect Bounties
                          </h2>
                          <p className="text-center text-white text-xs">
                            Join Pump The Vote and collect bounties for every
                            donor you bring to the party!
                          </p>

                          <h3 className="text-center text-white font-goudy font-normal text-xs mt-10 mb-2.5">
                            Get your PTV referral link
                          </h3>
                          <div className="rounded-md bg-black bg-opacity-[0.4] p-2.5 max-w-xl mx-auto mb-10">
                            <div className="rounded-md bg-black px-10 p-3.5">
                              <div className="copy-container">
                                <p className="text-left text-white text-xs">
                                  Web app
                                </p>
                                <div
                                  className="border border-white border-opacity-20 cursor-pointer justify-between flex p-2.5 rounded-md"
                                  onClick={() => {
                                    copyToClipboard(
                                      process.env.NEXT_PUBLIC_APP_MAIN_URL +
                                      "?refer=" +
                                      projectInfo.profiles[0].address,
                                    );
                                  }}
                                >
                                  <p className="text-center text-white text-xs">
                                    {process.env.NEXT_PUBLIC_APP_MAIN_URL +
                                      "?refer=" +
                                      projectInfo.profiles[0].address.substring(
                                        0,
                                        5,
                                      ) +
                                      "..." +
                                      projectInfo.profiles[0].address.substring(
                                        projectInfo.profiles[0].address.length -
                                        5,
                                      )}
                                  </p>
                                  <CopyIcon />
                                </div>
                              </div>
                              <div className="copy-container mt-5">
                                <p className="text-left text-white text-xs">
                                  Telegram bot
                                </p>
                                <div
                                  className="border border-white border-opacity-20 cursor-pointer justify-between flex p-2.5 rounded-md"
                                  onClick={() => {
                                    copyToClipboard(
                                      "https://t.me/liquidheartsbot?start=" +
                                      projectInfo.profiles[0].address,
                                    );
                                  }}
                                >
                                  <p className="text-center text-white text-xs">
                                    {"https://t.me/liquidheartsbot?start=" +
                                      projectInfo.profiles[0].address.substring(
                                        0,
                                        5,
                                      ) +
                                      "..." +
                                      projectInfo.profiles[0].address.substring(
                                        projectInfo.profiles[0].address.length -
                                        5,
                                      )}
                                  </p>
                                  <CopyIcon />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="max-w-xl flex flex-col justify-center mx-auto">
                            <h2 className="text-center text-white font-goudy font-normal text-xl">
                              Donate Memecoins to Pump The Vote!
                            </h2>
                            <p className="text-center text-white text-xs">
                              If you're a US citizen, you can donate political
                              memecoins to Pump The Vote's Super PAC and get out
                              the vote for your candidates
                            </p>
                            {selectedToken.token != "" && (
                              <div className="flex justify-center mt-3.5">
                                <div className="mr-3.5">
                                  <p className="text-center text-white text-xs">
                                    Amount of tokens
                                  </p>
                                  <input
                                    value={
                                      donation > 0 ? donation.toString() : ""
                                    }
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
                                    return (
                                      document.getElementById(
                                        "coin_modal",
                                      ) as any
                                    )?.showModal();
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
                                      <p className="text-sm text-white">
                                        {selectedToken.symbol}
                                      </p>
                                      <p className="text-tiny">
                                        {selectedToken.name}
                                      </p>
                                    </div>

                                    <div
                                      className="flex self-start mb-4 rounded-md px-1 bg-[#030139]"
                                      onClick={openLink}
                                    >
                                      <p className="text-tiny">
                                        {walletAddressShortener(
                                          selectedToken.token,
                                        )}
                                      </p>
                                      <OpenInNew />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="text-center">
                              <button
                                className="btn btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white mx-auto mt-5"
                                onClick={chooseMemeCoin}
                              >
                                <AddIcon />
                                Add MemeCoin
                              </button>
                            </div>
                            {histories.length > 0 && (
                              <div className="text-center">
                                <button
                                  className="btn btn-primary bg-[#7000FF] text-white border-none hover:bg-primary hover:text-white mt-2.5 mb-10"
                                  onClick={openPreviewDonation}
                                >
                                  Previous Donations
                                </button>
                              </div>
                            )}

                            {donation > 0 && (
                              <>
                                <div className="text-center">
                                  <p className="backdrop-container rounded-xl px-5 py-2.5 mb-5 inline-block text-white text-base">
                                    Total Donation: ${donation * usdPrice}
                                  </p>
                                </div>
                                <button
                                  className="btn btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white mx-auto"
                                  onClick={onNextAction}
                                >
                                  Next
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    {!projectLoading &&
                      projectDetail &&
                      projectInfo.profiles.length == 0 && (
                        <>
                          <h2 className="text-center text-white font-goudy font-normal text-xl">
                            Collect Bounties
                          </h2>
                          <p className="text-center text-white text-xs">
                            Join Pump The Vote and collect bounties for every
                            donor you bring to the party!
                          </p>
                          <div className="pt-8 mt-5">
                            {profileInfo && (
                              <div className="flex gap-4 justify-center">
                                <div className="w-80">
                                  <div>
                                    <div className="rounded-md bg-black bg-opacity-[0.4] p-2.5">
                                      <div className="border-container rounded-md mt-2.5">
                                        <img
                                          src="https://shdw-drive.genesysgo.net/Ejpot7jAYngByq5EgjvgEMgqJjD8dnjN4kSkiz6QJMsH/Pump%20the%20Vote%20Square%20Icon%20Only%20Blue.png"
                                          alt="project pass"
                                          className="w-full object-cover p-0.5 rounded-md"
                                        />
                                      </div>
                                      <p className="text-center text-white text-xs mt-2.5">
                                        Join the Blue Team and pump candidates
                                        who share your values and views
                                      </p>
                                      <p className="text-center text-white text-xs mt-3.5">
                                        Pump The Vote Blue project pass is for
                                        progressives who are deeply committed to
                                        the principles of social justice,
                                        equality, and the protection of
                                        individual rights. We believe in a
                                        government that plays an active role in
                                        ensuring that all citizens have access
                                        to essential services like healthcare,
                                        education, and economic opportunities,
                                        and that it should work to reduce
                                        disparities and promote fairness in
                                        society. We are united by a vision of an
                                        inclusive America where government acts
                                        as a force for good, ensuring that every
                                        person has the opportunity to succeed
                                        and live a life of dignity, respect and
                                        personal freedom.
                                      </p>

                                      <div className="text-center">
                                        {projectInfo.profiles.length == 0 &&
                                          (projectInfo.activationTokens.length >
                                            0 ||
                                            projectInfo.invitationPrice ===
                                            0) && (
                                            <>
                                              {!passBlueSubmit && (
                                                <p>
                                                  <button
                                                    className="btn-sm btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white rounded-md px-10 mt-3.5"
                                                    onClick={() => {
                                                      passAction("Blue");
                                                    }}
                                                  >
                                                    Free Mint
                                                  </button>
                                                </p>
                                              )}
                                              {passBlueSubmit && (
                                                <button className="btn-sm btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white rounded-md px-10 mt-3.5">
                                                  {passBlueButtonStatus}
                                                </button>
                                              )}
                                              <h5 className="text-white font-goudy font-normal text-header-small-font-size flex justify-center mt-2.5 mb-2.5">
                                                Mint a Blue Pass
                                              </h5>
                                            </>
                                          )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="w-80">
                                  <div>
                                    <div className="rounded-md bg-black bg-opacity-[0.4] p-2.5">
                                      <div className="border-container rounded-md mt-2.5">
                                        <img
                                          src="https://shdw-drive.genesysgo.net/Ejpot7jAYngByq5EgjvgEMgqJjD8dnjN4kSkiz6QJMsH/Pump%20the%20Vote%20Square%20Icon%20Only%20Red.png"
                                          alt="project pass"
                                          className="w-full object-cover p-0.5 rounded-md"
                                        />
                                      </div>
                                      <p className="text-center text-white text-xs mt-2.5">
                                        Join the Red Team and pump candidates
                                        who share your values and views
                                      </p>
                                      <p className="text-center text-white text-xs mt-3.5">
                                        Pump The Vote Red is for conservatives
                                        united by a desire to protect and
                                        strengthen the principles that we
                                        believe have made America a great and
                                        prosperous nation, such as the
                                        principles of limited government,
                                        personal responsibility, and the
                                        preservation of traditional values. We
                                        are proponents of fiscal responsibility,
                                        advocating for lower taxes, reduced
                                        government spending, and balanced
                                        budgets to promote economic growth and
                                        ensure long-term sustainability.
                                      </p>
                                      <div className="text-center">
                                        {projectInfo.profiles.length == 0 &&
                                          (projectInfo.activationTokens.length >
                                            0 ||
                                            projectInfo.invitationPrice ===
                                            0) && (
                                            <>
                                              {!passRedSubmit && (
                                                <p>
                                                  <button
                                                    className="btn-sm btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white rounded-md px-10 mt-3.5"
                                                    onClick={() => {
                                                      passAction("Red");
                                                    }}
                                                  >
                                                    Free Mint
                                                  </button>
                                                </p>
                                              )}
                                              {passRedSubmit && (
                                                <button className="btn-sm btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white rounded-md px-10 mt-3.5">
                                                  {passRedButtonStatus}
                                                </button>
                                              )}
                                              <h5 className="text-white font-goudy font-normal text-header-small-font-size flex justify-center mt-2.5 mb-2.5">
                                                Mint a Red Pass
                                              </h5>
                                            </>
                                          )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                  </div>
                </div>
                <dialog id={"coin_modal"} className="modal">
                  <div className="flex flex-col modal-box w-[40%] bg-[#02001A] p-8">
                    <div className="custom-select-open grow">
                      <div className="flex w-full justify-between mb-2">
                        <p className="text-xs text-white font-bold ml-4">
                          Political Memecoins
                        </p>

                        <button
                          className="cursor-pointer"
                          onClick={() =>
                            (
                              document.getElementById("coin_modal") as any
                            )?.close()
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
                              name={coin.name}
                              desc={coin.desc}
                              symbol={coin.symbol}
                              image={coin.image}
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

                <dialog id={"history_modal"} className="modal">
                  <div className="flex flex-col modal-box w-[60%] bg-[#02001A] p-8">
                    <div className="flex w-full justify-between mb-2">
                      <p className="text-base text-white font-bold ml-4 font-goudy">
                        Previous Donations
                      </p>

                      <button
                        className="cursor-pointer"
                        onClick={() =>
                          (
                            document.getElementById("history_modal") as any
                          )?.close()
                        }
                      >
                        <CloseIcon />
                      </button>
                    </div>
                    {!historyLoading && histories.length > 0 && (
                      <table className="w-full bg-[#100E5242] rounded-md overflow-x-auto">
                        <thead>
                          <tr>
                            <th align="center">
                              <div className="flex items-center justify-center">
                                <p className="text-white text-sm ml-2">Date</p>
                              </div>
                            </th>
                            <th align="center">
                              <p className="text-white text-sm">Time</p>
                            </th>
                            <th align="center">
                              <p className="text-white text-sm">Coins</p>
                            </th>

                            <th align="center">
                              <p className="text-white text-sm">
                                Total in $USD
                              </p>
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {histories.map((item: any, index: number) => (
                            <tr
                              className={`${index % 2 === 0 ? "bg-[#100E5242] hover:bg-[#100E5230]" : "bg-[#07076E70] hover:bg-[#07076E60]"} cursor`}
                              key={item._id}
                            >
                              <td align="center">
                                <p className="text-white text-sm">
                                  {moment(item.created_date).format("L")}
                                </p>
                              </td>

                              <td align="center">
                                <p className="text-white text-sm">
                                  {moment(item.created_date).format("LT")}
                                </p>
                              </td>

                              <td align="center">
                                {item.coin && (
                                  <div className="flex">
                                    <div className="relative">
                                      <img
                                        src={item.coin.image}
                                        className="w-8 h-8 rounded-full absolute left-0 top-0"
                                        alt={item.coin.name}
                                      />
                                      <div className="pl-10">
                                        <p className="text-white text-sm text-left">
                                          {item.coin.symbol.toUpperCase()}
                                        </p>
                                        <p className="text-gray text-xs text-left">
                                          {item.coin.name}
                                        </p>
                                      </div>
                                    </div>
                                    <p className="text-white text-sm text-left ml-10">
                                      {item.amount}
                                    </p>
                                  </div>
                                )}
                              </td>

                              <td align="center">
                                <p className="text-white text-sm">
                                  {"$" + item.usdvalue}
                                </p>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    {!historyLoading && histories.length == 0 && (
                      <div className="mb-5 text-header-small-font-size text-center">
                        {" "}
                        No History found{" "}
                      </div>
                    )}

                    {isHistoryPaging && !historyLoading && (
                      <div className="flex justify-center mt-5">
                        <button
                          className="btn btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white"
                          onClick={nextHistoryPage}
                        >
                          Load More
                        </button>
                      </div>
                    )}
                  </div>
                </dialog>
              </>
            )}
          </>
          <>
            {step === "two" && (
              <div className="container mx-auto">
                <div className="my-10 p-5">
                  <h2 className="text-center text-white font-goudy font-normal text-xl">
                    Collect Bounties
                  </h2>
                  <p className="text-center text-white text-xs mt-2.5">
                    Join Pump The Vote and collect bounties for every donor you
                    bring to the party!
                  </p>
                  <h3 className="text-center text-white font-goudy font-normal text-xs mt-10 mb-2.5">
                    Verify you’re a US citizen
                  </h3>
                  <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="col-span-7">
                        <div className="form-control-container mb-2.5">
                          <Input
                            type="text"
                            title="First Name"
                            required
                            helperText=""
                            placeholder="First Name"
                            value={form.firstName}
                            onChange={(e) =>
                              setForm({ ...form, firstName: e.target.value })
                            }
                          />
                        </div>
                        <div className="form-control-container mb-2.5">
                          <Input
                            type="text"
                            title="Middle Name or Initial"
                            required={false}
                            helperText=""
                            placeholder="Middle Name or Initial"
                            value={form.middleName}
                            onChange={(e) =>
                              setForm({ ...form, middleName: e.target.value })
                            }
                          />
                        </div>
                        <div className="form-control-container mb-2.5">
                          <Input
                            type="text"
                            title="Last Name"
                            required
                            helperText=""
                            placeholder="Last Name"
                            value={form.lastName}
                            onChange={(e) =>
                              setForm({ ...form, lastName: e.target.value })
                            }
                          />
                        </div>
                        <div className="form-control-container mb-2.5">
                          <Input
                            type="text"
                            title="Street Address Line 1"
                            required={false}
                            helperText=""
                            placeholder="Street Address Line 1"
                            value={form.addressOne}
                            onChange={(e) =>
                              setForm({ ...form, addressOne: e.target.value })
                            }
                          />
                        </div>
                        <div className="form-control-container mb-2.5">
                          <Input
                            type="text"
                            title="Street Address Line 2"
                            required={false}
                            helperText=""
                            placeholder="Street Address Line 2"
                            value={form.addressTwo}
                            onChange={(e) =>
                              setForm({ ...form, addressTwo: e.target.value })
                            }
                          />
                        </div>
                        <div className="form-control-container mb-2.5">
                          <Input
                            type="text"
                            title="City"
                            required={false}
                            helperText=""
                            placeholder="City"
                            value={form.city}
                            onChange={(e) =>
                              setForm({ ...form, city: e.target.value })
                            }
                          />
                        </div>
                        <div className="form-control-container mb-2.5">
                          <p className="text-xs text-white">
                            State<sup>*</sup>
                          </p>
                          <Select
                            value={form.state}
                            onChange={(e) =>
                              setForm({ ...form, state: e.target.value })
                            }
                            options={usstates}
                          />
                        </div>
                        <div className="form-control-container mb-2.5">
                          <Input
                            type="text"
                            title="Zip Code"
                            required
                            helperText=""
                            placeholder="Zip Code"
                            value={form.zip}
                            onChange={(e) =>
                              setForm({ ...form, zip: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="col-span-5">
                        <p className="text-sm">
                          Take a selfie with your ID <sup>*</sup>
                          <CameraPicker
                            changeImage={setImage}
                            image={preview}
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center mt-10">
                    <button
                      className="btn btn-link text-white no-underline"
                      onClick={goBack}
                    >
                      Back
                    </button>
                    {!isLoading && (
                      <button
                        className="btn btn-primary ml-10 bg-primary text-white border-none hover:bg-primary hover:text-white"
                        onClick={onSubmit}
                      >
                        Pump the Vote
                      </button>
                    )}
                    {isLoading && (
                      <button className="btn btn-primary ml-10 bg-primary text-white border-none hover:bg-primary hover:text-white">
                        Loading...
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        </>
      }
    </div>
  );
};

export default Page;
