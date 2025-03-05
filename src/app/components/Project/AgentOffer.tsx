import { data, userWeb3Info } from "@/app/store";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import Input from "@/app/components/common/Input";
import axios from "axios";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ImagePicker from "../ImagePicker";
import BalanceBox from "../common/BalanceBox";
import Radio from "../common/Radio";
import { pinImageToShadowDrive } from "@/app/lib/uploadImageToShdwDrive";
import { v4 as uuidv4 } from "uuid";
import * as anchor from "@coral-xyz/anchor";
import { Connectivity as Community } from "@/anchor/community";
import { web3Consts } from "@/anchor/web3Consts";
import { pinFileToShadowDriveUrl } from "@/app/lib/uploadFileToShdwDrive";
import { calcNonDecimalValue } from "@/anchor/curve/utils";
import { fetchImage } from "@/app/lib/forge/fetchImage";
import { generateCommunityInvitationImage } from "@/app/lib/forge/generateCommunityInvitationImage";
import { uploadImageFromBlob } from "@/app/lib/uploadImageFromBlob";

const AgentOffer = ({ symbol }: { symbol?: string }) => {
    const connection = useConnection();
    const wallet: any = useWallet();
    const [profileInfo] = useAtom(userWeb3Info);
    const [currentUser] = useAtom(data);
    const navigate = useRouter();

    const [fields, setFields] = useState({
        image: {
            preview: "",
            type: "",
        },
        name: "",
        symbol: "",
        desc: "",
        supply: 1,
        priceonetime: 0,
        pricemonthly: 0,
        priceyearly: 0,
        pricetype: "onetime",
        priceDistribution: {
            echosystem: 3,
            curator: 7,
            creator: 90,
            promoter: 0,
            scout: 0,
        },
        invitationType: "none",
        invitationPrice: 0,
        discount: 0.0,
    });
    const [isReady, setIsReady] = useState(false);
    const [buttonText, setButtonText] = useState("Mint");
    const [projectDetail, setProjectDetail] =  React.useState<any>(null)
    const [image, setImage] = React.useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [showMsg, setShowMsg] = useState(false);
    const [msgClass, setMsgClass] = useState("");
    const [msgText, setMsgText] = useState("");
    const [currentMenu, setCurrentMenu] = useState("offer");
    const [invitationTypes, setInvitationTypes] = React.useState([
        "optional",
        "none",
    ]);

    React.useEffect(() => {
    setIsReady(validateFields(false));
    }, [fields]);

    React.useEffect(() => {
       getProjectDetailFromAPI()
    }, []);

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

    const capitalizeString = (str: any) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const chooseInvitationType = (currentInvitationType: any) => {
        let invitationPrice = fields.invitationPrice;
        let distribution = {
          echosystem: 3,
          curator: 2,
          creator: 70,
          promoter: 20,
          scout: 5,
        };
        if (currentInvitationType == "none") {
          distribution = {
            echosystem: 3,
            curator: 7,
            creator: 90,
            promoter: 0,
            scout: 0,
          };
          invitationPrice = 0;
        }
        setFields({
          ...fields,
          invitationPrice,
          invitationType: currentInvitationType,
          priceDistribution: distribution
        });
    };

      const prepareNumber = (inputValue: any) => {
        if (isNaN(inputValue)) {
          return 0;
        }
        return inputValue;
      };

      const getTotalPercentage = () => {
        return (
          Number(fields.priceDistribution.echosystem) +
          Number(fields.priceDistribution.creator) +
          Number(fields.priceDistribution.curator) +
          Number(fields.priceDistribution.promoter) +
          Number(fields.priceDistribution.scout)
        );
      };

      const createMessage = (message: any, type: any) => {
        window.scrollTo(0, 0);
        setMsgText(message);
        setMsgClass(type);
        setShowMsg(true);
        setLoading(false);
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
            createMessage(
              "Name should have less than 50 characters",
              "danger-container",
            );
          }
          return false;
        }
    
        if (fields.symbol.length == 0) {
          if (isMessage) {
            createMessage("Symbol is required", "danger-container");
          }
          return false;
        }
    
        if (fields.symbol.length > 10) {
          if (isMessage) {
            createMessage(
              "Symbol should have less than 10 characters",
              "danger-container",
            );
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
            createMessage(
              "Description should have less than 160 characters",
              "danger-container",
            );
          }
          return false;
        }
    
        if (fields.image.preview.length == 0) {
          if (isMessage) {
            createMessage("Offer Image is required", "danger-container");
          }
          return false;
        }

    
        if (fields.invitationType == "optional") {
          if (fields.discount == 0) {
            if (isMessage) {
              createMessage("Discount not mentioned", "danger-container");
            }
            return false;
          }
        }
    
    
        if (getTotalPercentage() != 100) {
          if (isMessage) {
            createMessage("Price distribution is not 100%", "danger-container");
          }
          return false;
        }
    
        return true;
      };

      const isValidHttpUrl = (url: any) => {
        try {
          const newUrl = new URL(url);
          return newUrl.protocol === "http:" || newUrl.protocol === "https:";
        } catch (err) {
          return false;
        }
      };

      const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));

      const mintOfferPass = async () => {
        if(projectDetail.coins.length == 0) {
            createMessage( "Project have no coin", "danger-container");
            return;
        }
        setLoading(true);
        if (validateFields(true)) {
            if (!isValidHttpUrl(fields.image.preview)) {
                setButtonText("Uploading offer image...");
                let imageFile = await fetch(fields.image.preview)
                .then((r) => r.blob())
                .then(
                    (blobFile) =>
                    new File([blobFile], uuidv4(), { type: fields.image.type }),
                );
                let imageUri = await pinImageToShadowDrive(imageFile);
                fields.image.preview = imageUri;
            }

            const offerKeyPair = anchor.web3.Keypair.generate();
            const env = new anchor.AnchorProvider(connection.connection, wallet, {
            preflightCommitment: "processed",
            });
            anchor.setProvider(env);
            let communityConnection: Community = new Community(
                env,
                web3Consts.programID,
                offerKeyPair.publicKey,
            );
            try {
                setButtonText("Uploading project metadata...");
                let offerBody = {
                  name: fields.name,
                  symbol: fields.symbol,
                  description: fields.desc,
                  image: fields.image.preview,
                  enternal_url: "https://liquidhearts.app",
                  family: "MMOSH",
                  collection: "MMOSH Pass Collection",
                  attributes: [
                    {
                      trait_type: "Primitive",
                      value: "Pass",
                    },
                    {
                      trait_type: "Ecosystem",
                      value: " MMOSH",
                    },
                    {
                      trait_type: "Offer",
                      value: offerKeyPair.publicKey.toBase58(),
                    },
                    {
                      trait_type: "Founder",
                      value: "Moto",
                    },
                  ],
                };

                const offerMetaURI: any = await pinFileToShadowDriveUrl(offerBody);
                if (offerMetaURI === "") {
                    createMessage(
                    "We’re sorry, there was an error while trying to prepare meta url. please try again later.",
                    "danger-container",
                    );
                    return;
                }

                const profileMintingCost = new anchor.BN(
                    calcNonDecimalValue(Number(fields.pricetype === "onetime" ? fields.priceonetime : fields.pricemonthly), 9),
                );
                const invitationMintingCost = new anchor.BN(
                    calcNonDecimalValue(fields.invitationPrice, 9),
                );
                setButtonText("Minting Offer...");
                const res1: any = await communityConnection.mintGenesisPass({
                    name: fields.name,
                    symbol: fields.symbol,
                    uri: offerMetaURI,
                    mintKp: offerKeyPair,
                    input: {
                    oposToken: web3Consts.oposToken,
                    profileMintingCost,
                    invitationMintingCost,
                    mintingCostDistribution: {
                        parent: 100 * fields.priceDistribution.curator,
                        grandParent: 100 * fields.priceDistribution.creator,
                        greatGrandParent: 100 * fields.priceDistribution.promoter,
                        ggreatGrandParent: 100 * fields.priceDistribution.scout,
                        genesis: 100 * fields.priceDistribution.echosystem,
                    },
                    tradingPriceDistribution: {
                        seller: 100 * fields.priceDistribution.curator,
                        parent: 100 * fields.priceDistribution.creator,
                        grandParent: 100 * fields.priceDistribution.promoter,
                        greatGrandParent: 100 * fields.priceDistribution.scout,
                        genesis: 100 * fields.priceDistribution.echosystem,
                    },
                    },
                });
                
                const genesisProfileStr = res1.Ok.info.profile;
                console.log("genesisProfileStr ", genesisProfileStr);
        
                setButtonText("Waiting for Confirmation...");
                await delay(15000);
                communityConnection.setMainState();
                
                let invitationImageUri = ""
                let badge = ""
                if (fields.invitationType != "none") {

                    const coinImage = await fetchImage(projectDetail.coins[0].image);
                    const mainImage = await fetchImage(fields.image.preview);
                    const invitationImage = await generateCommunityInvitationImage(
                        mainImage,
                        coinImage,
                    );
            
                    let invitationImageUri = await uploadImageFromBlob(invitationImage);
                    console.log("invitationImageUri ", invitationImageUri);
                        // create invite metadata
                
                    setButtonText("Preparing Badge Metadata...");
                        let desc =
                          "Cordially invites you to join on the " +
                          capitalizeString(fields.name) +
                          ". The favor of a reply is requested.";
                    if (fields.name != "") {
                        desc =
                        capitalizeString(fields.name) +
                        " cordially invites you to join " +
                        capitalizeString(fields.name) +
                        " on the MMOSH. The favor of a reply is requested.";
                    }
                
                    const invitebody = {
                        name: "Invitation from join " + fields.name,
                        symbol: fields.symbol,
                        description: desc,
                        image: invitationImageUri,
                        external_url:
                        process.env.NEXT_PUBLIC_APP_MAIN_URL +
                        "project/" +
                        projectDetail.project.key,
                        minter: profileInfo?.profile.name,
                        attributes: [
                        {
                            trait_type: "Offer",
                            value: offerKeyPair.publicKey.toBase58(),
                        },
                        {
                            trait_type: "Seniority",
                            value: "0",
                        },
                        ],
                    };
                
                        const inviteMetaURI: any = await pinFileToShadowDriveUrl(invitebody);
                        if (inviteMetaURI === "") {
                          createMessage(
                            "We’re sorry, there was an error while trying to prepare meta url. please try again later.",
                            "danger-container",
                          );
                          return;
                        }
                        // creating invitation
                        setButtonText("Creating Badge Account...");
                
                        const res2: any = await communityConnection.initBadge({
                          name: "Invitation",
                          symbol: "INVITE",
                          uri: inviteMetaURI,
                          profile: genesisProfileStr,
                        });
                        console.log("invite result ", res2);
                
                        setButtonText("Waiting for Confirmation...");
                        await delay(15000);
                
                        setButtonText("Minting Badges...");
                        const res3 = await communityConnection.createBadge({
                          amount: 100,
                          subscriptionToken: res2.Ok.info.subscriptionToken,
                        });
                        badge = res2.Ok.info.subscriptionToken
                        console.log("invite badge result ", res3);
                
                        setButtonText("Waiting for Confirmation...");
                        await delay(15000);
                      }
                
        
                setButtonText("Creating LUT Registration...");
                const res4: any = await communityConnection.registerCommonLut();
                console.log("register lookup result ", res4);


                await axios.post("/api/project/save-offer", {
                    name: fields.name,
                    symbol: fields.symbol.toUpperCase(),
                    desc: fields.desc,
                    image: fields.image.preview,
                    inviteimage: invitationImageUri,
                    key: offerKeyPair.publicKey.toBase58(),
                    lut: res4.Ok.info.lookupTable,
                    badge,
                    priceonetime: fields.priceonetime,
                    pricemonthly: fields.pricemonthly,
                    priceyearly: fields.priceyearly,
                    distribution: fields.priceDistribution,
                    discount: fields.discount,
                    project: projectDetail.project.key, 
                    creator: wallet.publicKey.toBase58(),
                    creatorUsername: currentUser?.profile?.username,
                    supply: fields.supply
                });

            } catch (error) {
                console.log("error ", error);
                setButtonText("Mint");
                setLoading(false);
            }
        }
      }

      return (
        <>
          {showMsg && (
            <div
              className={
                "message-container text-white text-center text-header-small-font-size py-5 px-3.5 " +
                msgClass
              }
            >
              {msgText}
            </div>
          )}

          <div className="flex justify-center mb-8">
            <div className="flex bg-[#FFFFFF0F] rounded-full">
                <div className={(currentMenu === "offer" ? "text-white " : "") + "py-3.5 px-10 cursor-pointer hover:text-white text-lg"} onClick={()=>{setCurrentMenu("offer")}}>Offer</div>
                <div className={(currentMenu !== "offer" ? "text-white " : "") + "py-3.5 px-10 cursor-pointer hover:text-white text-lg"} onClick={()=>{setCurrentMenu("distribution")}}>Distribution</div>
            </div>
          </div>

          {currentMenu === "offer" &&
                <div className="py-5 px-5 xl:px-32 lg:px-16 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-7 gap-4">
                      <div className="xl:col-span-2">
                        <ImagePicker changeImage={setImage} image={fields.image.preview} readonly={false} />
                      </div>
                      <div className="xl:col-span-3">
                        <div className="form-element pt-2.5">
                          <Input
                            type="text"
                            title="Name"
                            required
                            helperText="Up to 50 characters, can have spaces."
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
                            helperText="Symbol can only be letters and numbers up to 10 characters"
                            placeholder="Symbol"
                            value={fields.symbol}
                            onChange={(e) =>
                              setFields({ ...fields, symbol: e.target.value })
                            }
                          />
                        </div>
                        <div className="form-element pt-2.5">
                          <Input
                            textarea
                            type="text"
                            title="Description"
                            required
                            helperText=""
                            placeholder="Describe your Offer."
                            value={fields.desc}
                            onChange={(e) => setFields({ ...fields, desc: e.target.value })}
                          />
                        </div>
                        <div className="form-element pt-2.5">
                          <div className="flex">
                            <p className="text-xs text-whilte mt-3 mr-2.5">
                              Supply
                            </p>
                            <div className="w-20">
                                <Input
                                    type="text"
                                    title=""
                                    required={false}
                                    helperText=""
                                    placeholder=""
                                    value={fields.supply > 0 ? fields.supply.toString() : ""}
                                    onChange={(e) => setFields({ ...fields, supply: prepareNumber(Number(e.target.value)) })}
                                />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="xl:col-span-2">
                         <div className="form-element">
                            <div className="flex">
                                <Radio
                                    title="One Time"
                                    checked={fields.pricetype === "onetime"}
                                    onChoose={() => {
                                    setFields((prev) => {
                                        const newValue = { ...prev };
                                        fields.pricetype = "onetime";
                                        return newValue;
                                    });
                                    }}
                                    name={`radio-open`}
                                />
                                <Radio
                                    title="Subscription"
                                    checked={fields.pricetype === "subscription"}
                                    onChoose={() => {
                                    setFields((prev) => {
                                        const newValue = { ...prev };
                                        fields.pricetype = "subscription";
                                        return newValue;
                                    });
                                    }}
                                    name={`radio-open`}
                                />
                            </div>
        
                         </div>
                         {fields.pricetype === "onetime" &&
                            <div className="form-element pt-2.5">
                                <div className="flex">
                                <p className="text-xs text-whilte mt-3 mr-2.5">
                                    Price
                                </p>
                                <div className="w-28">
                                    <Input
                                        type="text"
                                        title=""
                                        required={false}
                                        helperText=""
                                        placeholder=""
                                        value={fields.priceonetime > 0 ? fields.priceonetime.toString() : ""}
                                        onChange={(e) => setFields({ ...fields, priceonetime: prepareNumber(Number(e.target.value)) })}
                                    />
                                </div>
                                <p className="text-xs text-whilte mt-3 ml-2.5">
                                    USD
                                </p>
                                </div>
                            </div>
                         }
                         {fields.pricetype !== "onetime" &&
                            <>
                                <div className="form-element pt-2.5">
                                    <div className="flex">
                                    <p className="text-xs text-whilte mt-3 mr-2.5">
                                        Price
                                    </p>
                                    <div className="w-28">
                                        <Input
                                            type="text"
                                            title=""
                                            required={false}
                                            helperText=""
                                            placeholder=""
                                            value={fields.pricemonthly > 0 ? fields.pricemonthly.toString() : ""}
                                            onChange={(e) => setFields({ ...fields, pricemonthly: prepareNumber(Number(e.target.value)) })}
                                        />
                                    </div>
                                    <p className="text-xs text-whilte mt-3 ml-2.5">
                                        USD per month
                                    </p>
                                    </div>
                                </div>
                                <div className="form-element pt-2.5">
                                    <div className="flex">
                                    <p className="text-xs text-whilte mt-3 mr-2.5">
                                        Price
                                    </p>
                                    <div className="w-28">
                                        <Input
                                            type="text"
                                            title=""
                                            required={false}
                                            helperText=""
                                            placeholder=""
                                            value={fields.priceyearly > 0 ? fields.priceyearly.toString() : ""}
                                            onChange={(e) => setFields({ ...fields, priceyearly: prepareNumber(Number(e.target.value)) })}
                                        />
                                    </div>
                                    <p className="text-xs text-whilte mt-3 ml-2.5">
                                        USD per year
                                    </p>
                                    </div>
                                </div>
                            </>
                         }
                      </div>
                    </div>
                    <div className="flex justify-center mt-10">
                      {!loading && (
                        <button
                          className="btn btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white"
                          onClick={mintOfferPass}
                          disabled={!isReady}
                        >
                          {buttonText}
                        </button>
                      )}
                      {loading && (
                        <button className="btn btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white">
                          {buttonText}
                        </button>
                      )}
                    </div>
                    <div className="w-full flex flex-col justify-center items-center mt-5">
                      <div className="flex flex-col justify-center items-center">
                        <p className="text-sm text-white">Price: 25,000 MMOSH</p>
                        <p className="text-tiny text-white">
                          plus a small amount of SOL for gas fees
                        </p>
                      </div>
                      <BalanceBox />
                    </div>
                </div>
          }
          {currentMenu !== "offer" &&
            <div className="py-5 px-5 xl:px-32 lg:px-16 md:px-8">
                <div className="max-w-lg mx-auto">
                    <h4 className="text-header-small-font-size mb-2">
                    Revenue Share
                    </h4>
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-5">
                        <div className="col-span-5">
                            <div className="invitation-type-options">
                            <p className="text-xs text-white">
                                Invitation to Purchase this Offer
                            </p>
                            <div className="grid grid-cols-3 gap-4 ">
                                {invitationTypes.map(
                                    (invitationTypeItem: any, index: any) => (
                                        <div
                                        className="text-center"
                                        key={index}
                                        onClick={() => {
                                            chooseInvitationType(invitationTypeItem);
                                        }}
                                        >
                                        <div
                                            className={
                                            invitationTypeItem == fields.invitationType
                                                ? "invitation-type-option-item-select active"
                                                : "invitation-type-option-item-select"
                                            }
                                        >
                                            {invitationTypeItem == fields.invitationType && (
                                            <input
                                                type="checkbox"
                                                checked
                                                className="checkbox"
                                            />
                                            )}
                                            {invitationTypeItem != fields.invitationType && (
                                            <input type="checkbox" className="checkbox" />
                                            )}
                                        </div>
                                        <p className="text-xs text-white leading-3">
                                            {capitalizeString(invitationTypeItem)}
                                        </p>
                                        </div>
                                    ),
                                )}
                            </div>
                            </div>
                        </div>
                        {fields.invitationType == "optional" && (
                            <div className="col-span-3">
                            <div className="profile-container-element">
                                <Input
                                type="text"
                                title="Discount"
                                required
                                helperText=""
                                placeholder="%"
                                value={
                                    fields.discount > 0 ? fields.discount.toString() : ""
                                }
                                onChange={(e) =>
                                    setFields({
                                    ...fields,
                                    discount: prepareNumber(Number(e.target.value)),
                                    })
                                }
                                />
                            </div>
                            </div>
                        )}

                    </div>
                    <div className="project-share-royalties">
                        <h4 className="text-header-small-font-size mt-2">
                        Set Commissions for Promoters
                        </h4>
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-2.5">
                        <div>
                            <div className="project-share-royalties-info">
                            <label className="text-xs text-white mr-2">
                                Ecosystem
                            </label>
                            <span className="text-header-small-font-size text-white ">
                                MMOSH DAO {fields.priceDistribution.echosystem} %
                            </span>
                            </div>
                        </div>
                        <div>
                            <div className="project-share-royalties-info">
                            <label className="text-xs text-white mr-2">Curator</label>
                            <span className="text-header-small-font-size text-white">
                                Your Promoter {fields.priceDistribution.curator} %
                            </span>
                            </div>
                        </div>
                        </div>
                        <div className="flex mt-2 mb-3.5">
                        <label className="text-xs text-white leading-10 min-w-12">
                            Creator
                        </label>
                        {fields.invitationType == "none" && (
                            <span className="text-header-small-font-size text-white mx-2 leading-10">
                            {fields.priceDistribution.creator}%{" "}
                            </span>
                        )}
                        {fields.invitationType != "none" && (
                            <div className="mx-2">
                            <input
                                type="text"
                                value={fields.priceDistribution.creator}
                                onChange={(event) => {
                                let priceDetails = {
                                    echosystem: 3,
                                    curator: 2,
                                    creator: prepareNumber(Number(event.target.value)),
                                    promoter: fields.priceDistribution.promoter,
                                    scout: fields.priceDistribution.scout,
                                };
                                setFields({
                                    ...fields,
                                    priceDistribution: priceDetails,
                                });
                                }}
                                placeholder="0"
                                className="input input-bordered h-10 text-base bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3] backdrop-container w-16"
                            />
                            </div>
                        )}
                        <span className="text-header-small-font-size text-white leading-10">
                            Your royalties as the Agent founder
                        </span>
                        </div>
                    </div>
                    {fields.invitationType != "none" && (
                        <div className="project-share-royalties-agents">
                        <h4 className="text-header-small-font-size">Agents</h4>
                        <div className="flex">
                            <label className="text-xs text-white leading-10 min-w-12">
                            Promoter
                            </label>
                            <div className="mx-2">
                            <input
                                type="text"
                                value={fields.priceDistribution.promoter}
                                onChange={(event) => {
                                let priceDetails = {
                                    echosystem: 3,
                                    curator: 2,
                                    creator: fields.priceDistribution.creator,
                                    promoter: prepareNumber(Number(event.target.value)),
                                    scout: fields.priceDistribution.scout,
                                };
                                setFields({
                                    ...fields,
                                    priceDistribution: priceDetails,
                                });
                                }}
                                placeholder="0"
                                className="input input-bordered h-10 text-base bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3] backdrop-container w-16"
                            />
                            </div>
                            <span className="text-header-small-font-size text-white leading-10">
                            Promotes your Agent
                            </span>
                        </div>
                        <div className="flex mt-2">
                            <label className="text-xs text-white leading-10 min-w-12">
                            Scout
                            </label>
                            <div className="mx-2">
                            <input
                                type="text"
                                value={fields.priceDistribution.scout}
                                onChange={(event) => {
                                let priceDetails = {
                                    echosystem: 3,
                                    curator: 2,
                                    creator: fields.priceDistribution.creator,
                                    promoter: fields.priceDistribution.promoter,
                                    scout: prepareNumber(Number(event.target.value)),
                                };
                                setFields({
                                    ...fields,
                                    priceDistribution: priceDetails,
                                });
                                }}
                                placeholder="0"
                                className="input input-bordered h-10 text-base bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3] backdrop-container w-16"
                            />
                            </div>
                            <span className="text-header-small-font-size text-white">
                            Organizes, encourages, trains and motivates Promoters
                            </span>
                        </div>
                        </div>
                    )}

                    <div className="mt-3.5">
                        <h6>
                        <label className="text-header-small-font-size text-white font-bold mr-2">
                            Total:{" "}
                        </label>{" "}
                        <span className="text-header-small-font-size text-white font-bold">
                            {getTotalPercentage()}
                        </span>
                        </h6>
                    </div>
                </div>
            </div>
          }
        </>
      );
    
}

export default AgentOffer
