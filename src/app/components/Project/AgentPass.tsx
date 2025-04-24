"use client";

import ImagePicker from "@/app/components/ImagePicker";
import Input from "@/app/components/common/Input";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { pinImageToShadowDrive } from "@/app/lib/uploadImageToShdwDrive";
import axios from "axios";

import BalanceBox from "../common/BalanceBox";
import useConnection from "@/utils/connection";
import * as anchor from "@coral-xyz/anchor";
import useWallet from "@/utils/wallet";
import { useAtom } from "jotai";
import { data, isAuth, userWeb3Info } from "@/app/store";
import { Connectivity as Community } from "@/anchor/community";
import { Connectivity as UserConn } from "@/anchor/user";
import { web3Consts } from "@/anchor/web3Consts";
import { pinFileToShadowDriveUrl } from "@/app/lib/uploadFileToShdwDrive";
import { calcNonDecimalValue } from "@/anchor/curve/utils";
import {
  LAMPORTS_PER_SOL,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import client from "@/app/lib/httpClient";

const AgentPass = ({ symbol, type }: { symbol?: string; type: string }) => {
  const connection = useConnection();
  const wallet: any = useWallet();
  const [profileInfo] = useAtom(userWeb3Info);
  const [currentUser] = useAtom(data);
  const [isAuthenticated] = useAtom(isAuth);

  const navigate = useRouter();
  const [loading, setLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [msgClass, setMsgClass] = useState("");
  const [msgText, setMsgText] = useState("");
  const [image, setImage] = React.useState<File | null>(null);

  const [fields, setFields] = useState({
    image: {
      preview: "",
      type: "",
    },
    name: "",
    symbol: "",
    desc: "",
    passPrice: 0,
    website: "",
    telegram: "",
    twitter: "",
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

  const [usdPrice, setUsdPrice] = useState(0);
  const [buttonText, setButtonText] = useState(symbol ? "Modify" : "Mint");
  const [projectDetail, setProjectDetail] = React.useState<any>(null);

  React.useEffect(() => {
    if (!image) return;
    const objectUrl = URL.createObjectURL(image);
    let imageObj = {
      preview: objectUrl,
      type: image.type,
    };
    setFields({ ...fields, image: imageObj });
  }, [image]);

  React.useEffect(() => {
    if (localStorage.getItem("projectstep1")) {
      let savedData: any = localStorage.getItem("projectstep1");
      setFields(JSON.parse(savedData));
    }
    getMmoshPrice();
    if (symbol) {
      getProjectDetailFromAPI();
    }
  }, []);

  const getProjectDetailFromAPI = async () => {
    try {
      setLoading(true);
      let listResult = await axios.get(`/api/project/detail?symbol=${symbol}`);
      setFields({
        ...fields,
        image: {
          preview: listResult.data.project.image,
          type: "",
        },
        name: listResult.data.project.name,
        symbol: listResult.data.project.symbol,
        desc: listResult.data.project.desc,
        passPrice: listResult.data.project.price,
        website: listResult.data.project.website,
        telegram: listResult.data.project.telegram,
        twitter: listResult.data.project.twitter,
      });
      setProjectDetail(listResult.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setProjectDetail(null);
    }
  };

  const getMmoshPrice = async () => {
    const mmoshUsdcPrice = await axios.get(
      `https://api.jup.ag/price/v2?ids=${process.env.NEXT_PUBLIC_OPOS_TOKEN},${process.env.NEXT_PUBLIC_USDC_TOKEN}`,
    );
    setUsdPrice(mmoshUsdcPrice.data?.data?.MMOSH?.price || 0.003);
  };

  React.useEffect(() => {
    setIsReady(validateFields(false));
  }, [fields]);

  const createMessage = (message: any, type: any) => {
    window.scrollTo(0, 0);
    setMsgText(message);
    setMsgClass(type);
    setShowMsg(true);
    setLoading(false);
    setButtonText(symbol ? "Modify" : "Mint");
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

    if (fields.image.preview.length == 0) {
      if (isMessage) {
        createMessage("Project pass Image is required", "danger-container");
      }
      return false;
    }

    if (fields.website.length > 0) {
      if (!isValidHttpUrl(fields.website)) {
        if (isMessage) {
          createMessage("Invalid website url", "danger-container");
        }
        return false;
      }
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

  const mintGensisPass = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    if (validateFields(true)) {
      if (!symbol) {
        const result = await axios.get(
          `/api/project/check-project?symbol=${fields.symbol}`,
        );
        if (result.data) {
          createMessage("Symbol already exist", "danger-container");
          return;
        }
        if (!isValidHttpUrl(fields.image.preview)) {
          let imageFile = await fetch(fields.image.preview)
            .then((r) => r.blob())
            .then(
              (blobFile) =>
                new File([blobFile], uuidv4(), { type: fields.image.type }),
            );
          let imageUri = await pinImageToShadowDrive(imageFile);
          fields.image.preview = imageUri;
        }
        localStorage.setItem("projectstep1", JSON.stringify(fields));
      }

      const projectKeyPair = anchor.web3.Keypair.generate();
      const env = new anchor.AnchorProvider(connection.connection, wallet, {
        preflightCommitment: "processed",
      });
      anchor.setProvider(env);
      let communityConnection: Community = new Community(
        env,
        web3Consts.programID,
        symbol
          ? new anchor.web3.PublicKey(projectDetail.project.key)
          : projectKeyPair.publicKey,
      );

      try {
        setButtonText("Uploading pass metadata...");
        let projectBody = {
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
              trait_type: "Project",
              value: symbol
                ? projectDetail.project.key
                : projectKeyPair.publicKey.toBase58(),
            },
            {
              trait_type: "Founder",
              value: "Moto",
            },
          ],
        };

        if (fields.website.length > 0) {
          projectBody.attributes.push({
            trait_type: "Website",
            value: fields.website,
          });
        }

        if (fields.telegram.length > 0) {
          projectBody.attributes.push({
            trait_type: "Telegram",
            value: fields.telegram,
          });
        }

        if (fields.twitter.length > 0) {
          projectBody.attributes.push({
            trait_type: "Bluesky",
            value: fields.twitter,
          });
        }

        const projectMetaURI: any = await pinFileToShadowDriveUrl(projectBody);
        if (projectMetaURI === "") {
          createMessage(
            "We’re sorry, there was an error while trying to prepare meta url. please try again later.",
            "danger-container",
          );
          return;
        }

        if (symbol) {
          let res = await communityConnection.updateToken({
            mint: new anchor.web3.PublicKey(projectDetail.project.key),
            authority: wallet.publicKey,
            payer: wallet.publicKey,
            name: fields.name,
            symbol: fields.symbol,
            uri: projectMetaURI,
          });
          console.log("update result", res);

          setButtonText("Updating pass...");
          await axios.put("/api/project/update-project", {
            key: projectDetail.project.key,
            name: fields.name,
            symbol: fields.symbol.toUpperCase(),
            desc: fields.desc,
            telegram: fields.telegram,
            twitter: fields.twitter,
            website: fields.website,
          });
          navigate.push("/projects/" + fields.symbol);
          setLoading(false);
          return;
        }

        const profileMintingCost = new anchor.BN(
          calcNonDecimalValue(Number(fields.passPrice), 9),
        );
        const invitationMintingCost = new anchor.BN(
          calcNonDecimalValue(fields.invitationPrice, 9),
        );
        setButtonText("Minting Pass...");
        const res1: any = await communityConnection.mintGenesisPass({
          name: fields.name,
          symbol: fields.symbol,
          uri: projectMetaURI,
          mintKp: projectKeyPair,
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

        setButtonText("Creating LUT Registration...");
        const res4: any = await communityConnection.registerCommonLut();
        console.log("register lookup result ", res4);

        setButtonText("Buying new Pass...");
        console.log("Profile info: ", profileInfo);
        const res5 = await communityConnection.sendProjectPrice(
          profileInfo?.profile.address,
          25000,
        );

        if (res5.Err) {
          console.log("Error is here... ", res5.Err);
          createMessage("error creating new project", "danger-container");
          return;
        }
        console.log("send price result ", res5.Ok?.info);

        await client.post("/agents/create", {
          name: fields.name,
          symbol: fields.symbol.toUpperCase(),
          desc: fields.desc,
          image: fields.image.preview,
          inviteimage: "",
          key: projectKeyPair.publicKey.toBase58(),
          lut: res4.Ok.info.lookupTable,
          seniority: 0,
          price: fields.passPrice,
          distribution: fields.priceDistribution,
          invitationprice: fields.invitationPrice,
          discount: fields.discount,
          telegram: fields.telegram,
          twitter: fields.twitter,
          website: fields.website,
          presalesupply: 0,
          minpresalesupply: 0,
          presalestartdate: "",
          presaleenddate: "",
          dexlistingdate: "",
          creator: wallet.publicKey.toBase58(),
          creatorUsername: currentUser?.profile?.username,
          type,
        });
        setButtonText(symbol ? "Modify" : "Mint");
        localStorage.removeItem("projectstep1");
        navigate.push("/projects/" + fields.symbol);
      } catch (error) {
        console.log("error ", error);
        setButtonText(symbol ? "Modify" : "Mint");
        setLoading(false);
      }
    }
  };

  const testFrost = async () => {
    const env = new anchor.AnchorProvider(connection.connection, wallet, {
      preflightCommitment: "processed",
    });
    anchor.setProvider(env);

    let userConn: UserConn = new UserConn(env, web3Consts.programID);

    console.log("wallet.publicKey ", wallet.publicKey.toBase58());

    try {
      console.log("testing 1");
      let txis: any = SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: new anchor.web3.PublicKey(
          "HMvvRsoHAjCcCK6YUckdTezaxgZ9QBJApK1hY6NLfZA4",
        ),
        lamports: 0.01 * LAMPORTS_PER_SOL,
      });
      console.log("testing 2");
      const latestBlockhash = await connection.connection.getLatestBlockhash();

      // const tx1 = await new anchor.web3.Transaction().add(...txis);
      // txis = [];
      console.log("testing 3");
      const messageV0 = new TransactionMessage({
        payerKey: wallet.publicKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: [txis],
      }).compileToV0Message(); // 👈 compile to v0 message

      console.log("testing 4");
      // Create and sign the versioned transaction
      const tx = new VersionedTransaction(messageV0);
      console.log("testing 5");
      const res3 = await userConn.provider.sendAndConfirm(tx);

      console.log("res3 ", res3);
    } catch (error) {
      console.log("error ", error);
    }
  };

  const prepareNumber = (inputValue: any) => {
    if (isNaN(inputValue)) {
      return 0;
    }
    return inputValue;
  };

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

      <div className="py-5 px-5 xl:px-32 lg:px-16 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-8 gap-4">
          <div className="xl:col-span-2">
            <ImagePicker
              changeImage={setImage}
              image={fields.image.preview}
              readonly={symbol ? true : false}
            />
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
                placeholder="Describe your Community."
                value={fields.desc}
                onChange={(e) => setFields({ ...fields, desc: e.target.value })}
              />
            </div>
          </div>
          <div className="xl:col-span-3">
            <div className="form-element pt-2.5">
              <Input
                type="text"
                title="Project Website"
                required={false}
                helperText=""
                placeholder="https://www.example.com/"
                value={fields.website}
                onChange={(e) =>
                  setFields({ ...fields, website: e.target.value })
                }
              />
            </div>
            <div className="form-element pt-2.5">
              <Input
                type="text"
                title="Project Telegram"
                required={false}
                helperText=""
                placeholder="https://t.me/example"
                value={fields.telegram}
                onChange={(e) =>
                  setFields({ ...fields, telegram: e.target.value })
                }
              />
            </div>
            <div className="form-element pt-2.5">
              <Input
                type="text"
                title="Project Bluesky"
                required={false}
                helperText=""
                placeholder="https://bsky.app/profile/example.bsky.social"
                value={fields.twitter}
                onChange={(e) =>
                  setFields({ ...fields, twitter: e.target.value })
                }
              />
            </div>

            <div className="form-element pt-2.5">
              <Input
                type="text"
                title="Agent Email Address"
                required={false}
                readonly
                helperText=""
                placeholder=""
                value={`${fields.symbol}@kinship.codes`}
                onChange={() => { }}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-10">
          {!loading && (
            <button
              className="btn btn-primary bg-primary text-white border-none hover:bg-primary hover:text-white"
              onClick={mintGensisPass}
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
    </>
  );
};

export default AgentPass;
