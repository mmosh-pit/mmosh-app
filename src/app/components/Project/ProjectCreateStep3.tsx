"use client";

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
import { useConnection } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { Connectivity as Community } from "@/anchor/community";
import { web3Consts } from "@/anchor/web3Consts";
import { pinFileToShadowDriveUrl } from "@/app/lib/uploadFileToShdwDrive";

import Modal from "react-modal";
import SearchIcon from "@/assets/icons/SearchIcon";
import TokenCard from "./TokenCard";
import { Bars } from "react-loader-spinner";
import ArrowDown from "@/assets/icons/ArrowDown";

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

export default function ProjectCreateStep3({ onPageChange, symbol }: { onPageChange: any, symbol:any }) {
    const wallet: any = useWallet();
    const connection = useConnection();
    const navigate = useRouter();

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [keyword, setKeyword] = React.useState("");
    const [coinLoader, setCoinLoader] = React.useState(false);
    const [coinAllList, setCoinAllList] = React.useState([]);
    const [coinList, setCoinList] = React.useState([]);
    const [isExternalCoin, setIsExternalCoin] = React.useState(false);
      
    const [fields, setFields] = useState({
        image: {
            preview: "",
            type: ""
        },
        name: "", 
        symbol: "",
        desc: "",
        supply: 0,
        listingPrice: 0,
        externalCoin: {
            name: "MMOSH: The Stoked Token",
            address: process.env.NEXT_PUBLIC_OPOS_TOKEN,
            image:
              "https://shdw-drive.genesysgo.net/7nPP797RprCMJaSXsyoTiFvMZVQ6y1dUgobvczdWGd35/MMoshCoin.png",
            symbol: "MMOSH",
            decimals: 9,
        },
    })
    const [loading, setLoading] = useState(false)

    const [image, setImage] = React.useState<File | null>(null);

    const [showMsg, setShowMsg] = useState(false);
    const [msgClass, setMsgClass] = useState("");
    const [msgText, setMsgText] = useState("");

    const [isReady, setIsReady] = useState(false)
    const [projectDetail, setProjectDetail] =  React.useState<any>(null)

    React.useEffect(() => {
        if (!image) return;
        const objectUrl = URL.createObjectURL(image);
        let imageObj = {
            preview: objectUrl,
            type: image.type
        }
        setFields({ ...fields, image: imageObj })
    }, [image]);
    
    React.useEffect(()=>{
        getProjectDetailFromAPI()
    },[])

    const getProjectDetailFromAPI = async() => {
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

    React.useEffect(()=>{
       setIsReady(validateFields(false))
    },[fields])

    const createMessage = (message: any, type: any) => {
        window.scrollTo(0, 0);
        setMsgText(message);
        setMsgClass(type);
        setShowMsg(true);
        setLoading(false);
        if(type == "success-container") {
          setTimeout(() => {
            setShowMsg(false);
          }, 4000);
        } else {
          setTimeout(() => {
            setShowMsg(false);
          }, 4000);
        }
    
    };

    const validateFields = (isMessage:boolean) => {
        if(isExternalCoin) {
            return true
        }
        if (fields.name.length == 0) {
          if(isMessage) {
            createMessage("Name is required", "danger-container");
          }  
    
          return false;
        }

        if (fields.name.length > 50) {
            if(isMessage) {
               createMessage("Name should have less than 50 characters", "danger-container");
            }
            return false;
        }
    
        if (fields.symbol.length == 0) {
            if(isMessage) {
               createMessage("Symbol is required", "danger-container");
            }
          return false;
        }

        if (fields.symbol.length > 10) {
            if(isMessage) {
                createMessage("Symbol should have less than 10 characters", "danger-container");
            }
            return false;
        }
    
        if (fields.desc.length == 0) {
            if(isMessage) {
              createMessage("Description is required", "danger-container");
            }
          return false;
        }

        if (fields.desc.length > 160) {
            if(isMessage) {
                createMessage("Description should have less than 160 characters", "danger-container");
            }
            return false;
        }
    
        if(fields.image.preview.length == 0) {
            if(isMessage) {
                createMessage("Community coin image is required", "danger-container");
            }
            return false;
        }

        return true;
    };

    const gotoStep4 = async () => {
        setLoading(true);
        if(validateFields(true)) {
            if(!isExternalCoin) {
                if(!isValidHttpUrl(fields.image.preview)) {
                    let imageFile = await fetch(fields.image.preview).then(r => r.blob()).then(blobFile => new File([blobFile], uuidv4(), { type: fields.image.type }));
                    let imageUri = await pinImageToShadowDrive(imageFile)
                    fields.image.preview = imageUri;
                }
    
                const env = new anchor.AnchorProvider(connection.connection, wallet, {
                   preflightCommitment: "processed",
                });
                anchor.setProvider(env);
                let communityConnection: Community = new Community(
                    env,
                    web3Consts.programID,
                    new anchor.web3.PublicKey(projectDetail.project.key),
                );
    
                let coinBody = {
                    name: fields.name,
                    symbol: fields.symbol,
                    description: fields.desc,
                    image: fields.image.preview,
                };
                const coinMetaURI: any = await pinFileToShadowDriveUrl(coinBody);
                if (coinMetaURI === "") {
                    createMessage(
                    "We’re sorry, there was an error while trying to prepare meta url. please try again later.",
                    "danger-container",
                    );
                    return;
                }
                console.log("coinMetaURI", coinMetaURI);
        
                // creating community coins
    
                let mintKey = await communityConnection.createCoin(
                    fields.name,
                    fields.symbol,
                    coinMetaURI,
                    fields.supply * web3Consts.LAMPORTS_PER_OPOS,
                    9,
                );
    
                await axios.post("/api/project/save-coins", {
                    name: fields.name,
                    symbol: fields.symbol,
                    image: fields.image.preview,
                    key: mintKey,
                    desc: fields.desc,
                    supply: fields.supply,
                    decimals: 9,
                    creator: wallet.publicKey.toBase58(),
                    listingprice: fields.listingPrice,
                    projectkey: projectDetail.project.key
                });
            } else {
                await axios.post("/api/project/save-coins", {
                    name: fields.externalCoin.name,
                    symbol: fields.externalCoin.symbol,
                    image: fields.externalCoin.image,
                    key: fields.externalCoin.address,
                    desc: "",
                    supply: 0,
                    decimals: fields.externalCoin.decimals,
                    creator: wallet.publicKey.toBase58(),
                    listingprice: 0,
                    projectkey: projectDetail.project.key
                });
            }

            navigate.push("/projects/" + symbol);
        }
    }

    const prepareNumber = (inputValue:any) => {
        if(isNaN(inputValue)) {
            return 0
        }
        return inputValue;
    }

    const isValidHttpUrl = (url:any) => {
        try {
          const newUrl = new URL(url);
          return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
        } catch (err) {
          return false;
        }
    }

    const onRadioChange = (value: any) => {
        console.log("radio change ", value);
        setIsExternalCoin(value);
    };
    
    const openJupiterCoins = () => {
        setIsOpen(true);
        getCoinsFromJupiter();
    };
    
    const getCoinsFromJupiter = async () => {
    try {
        setCoinLoader(true);
        const result = await axios.get("https://token.jup.ag/strict");
        setCoinAllList(result.data);
        setCoinList(result.data);
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
        setFields({
            ...fields,
            externalCoin: {
            name: token.name,
            address: token.address,
            image: token.logoURI,
            symbol: token.symbol,
            decimals: token.decimals,
            },
        });
        closeModal();
    };
    

    return (
        <>
            {showMsg && (
                <div className={"message-container text-white text-center text-header-small-font-size py-5 px-3.5 " + msgClass}>{msgText}</div>
            )}
            <div className="background-content">
                <div className="py-5 px-5 xl:px-32 lg:px-16 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <ImagePicker
                                changeImage={(file:any)=> {
                                    if(isExternalCoin) {
                                    return
                                    }
                                    setImage(file)
                                }}
                                image={isExternalCoin ? fields.externalCoin.image : fields.image.preview}
                                />
                            </div>
                            <div>
                            <div className="form-element flex pt-2.5">
                                <Radio
                                    title="Create a new Community Coin"
                                    checked={!isExternalCoin}
                                    onChoose={() => {
                                    onRadioChange(false);
                                    }}
                                    disabled={false}
                                />
                                <div className="relative">
                                    <Radio
                                    title="Use an Existing Coin"
                                    checked={isExternalCoin}
                                    onChoose={() => {
                                        onRadioChange(true);
                                    }}
                                    disabled={false}
                                    />
                                </div>
                            </div>
                            {isExternalCoin && (
                                <div className="form-element pt-2.5">
                                <p className="text-xs text-whilte">Select Coin</p>

                                <p
                                    className="input input-bordered h-10 text-base bg-black bg-opacity-[0.07] backdrop-container flex items-center justify-between gap-2 px-2 cursor-pointer"
                                    onClick={openJupiterCoins}
                                >
                                    {fields.externalCoin.name !== "" && (
                                    <>
                                        <span>{fields.externalCoin.name}</span>
                                    </>
                                    )}
                                    {fields.externalCoin.name === "" && (
                                    <span className="text-white text-opacity-[0.3]">
                                        {" "}
                                        Select Coin
                                    </span>
                                    )}
                                    <label className="mr-2.5">
                                       <ArrowDown />
                                    </label>
                                </p>
                                </div>
                            )}
                            {!isExternalCoin && (
                                <>
                                                                <div className="form-element pt-2.5">
                                    <Input
                                        type="text"
                                        title="Name"
                                        required
                                        helperText=""
                                        placeholder="Name"
                                        value={fields.name}
                                        onChange={(e) => setFields({ ...fields, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-element pt-2.5">
                                    <Input
                                        type="text"
                                        title="Symbol"
                                        required
                                        helperText=""
                                        placeholder="Symbol"
                                        value={fields.symbol}
                                        onChange={(e) => setFields({ ...fields, symbol: e.target.value })}
                                    />
                                </div>
                                <div className="form-element pt-2.5">
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="form-element col-span-5">
                                            <Input
                                                type="text"
                                                title="Supply"
                                                required
                                                helperText=""
                                                placeholder="Supply"
                                                value={(fields.supply > 0 ? fields.supply.toString() : "")}
                                                onChange={(e) => setFields({ ...fields, supply: prepareNumber(Number(e.target.value))})}
                                            />
                                        </div>
                                        <div className="form-element col-span-5">
                                            <Input
                                                type="text"
                                                title="Listing Price"
                                                required
                                                helperText=""
                                                placeholder="Listing Price"
                                                value={(fields.listingPrice > 0 ? fields.listingPrice.toString() : "")}
                                                onChange={(e) => setFields({ ...fields, listingPrice: prepareNumber(Number(e.target.value))})}
                                            />
                                        </div>
                                        <div className="col-span-2 mt-8 text-white text-header-small-font-size">USD</div>
                                    </div>
                                </div>
                                <div className="form-element pt-6">
                                    <div className="flex">
                                        <label className="text-white text-xs pr-2.5">
                                        Fully Diluted Value (FDV)
                                        </label>
                                        <span className="text-white text-xs pr-2.5">{fields.supply * fields.listingPrice > 0 ? fields.supply * fields.listingPrice : "--"}</span>
                                    </div>
                                </div>
                                </>
                            )}
                            </div>

                            <div>
                              {!isExternalCoin && (
                                <div className="form-element h-full">
                                    <Input
                                        textarea
                                        type="text"
                                        title="Description"
                                        required
                                        helperText=""
                                        placeholder="Describe your Community Coin and associated project and protocol."
                                        value={fields.desc}
                                        onChange={(e) => setFields({ ...fields, desc: e.target.value })}
                                    />
                                </div>
                                )}
                            </div>
                    </div>
                    <div className="flex justify-center mt-10">
                        {!loading &&
                            <>
                                <button className="btn btn-primary ml-10 bg-primary text-white border-none hover:bg-primary hover:text-white" onClick={gotoStep4} disabled={!isReady}>Mint</button>
                            </>
                        }
                        {loading &&
                            <button className="btn btn-primary ml-10 bg-primary text-white border-none hover:bg-primary hover:text-white">Loading...</button>
                        }
                    </div>
                </div>
            </div>
            <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
        >
            <h2 className="pb-2.5 mb-2.5 text-sub-title-font-size font-goudy border-b border-white border-opacity-20">
            Coin List{" "}
            </h2>
            <div>
            {!coinLoader && (
                <>
                <div className="search-container">
                    <label
                    className={
                        "h-10 text-base bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3] backdrop-container flex items-center gap-2 px-2"
                    }
                    >
                    <div className="p-2">
                        <SearchIcon />
                    </div>
                    <input
                        type="text"
                        className="grow text-base bg-transparent focus:outline-0 outline-0 hover:outline-0 active:outline-0"
                        placeholder="Search by Coin Name"
                        value={keyword}
                        onChange={onCoinSearch}
                    />
                    </label>
                </div>
                <div
                    className="overflow-y-auto"
                    style={{ maxHeight: window.innerHeight * 0.7 + "px" }}
                >
                    {coinList.map((coinItem: any) => (
                    <TokenCard data={coinItem} onChoose={onTokenSelect} />
                    ))}
                </div>
                </>
            )}

            {coinLoader && (
                <div className="flex justify-center">
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
            </div>
            </Modal>
        </>
    );
}
