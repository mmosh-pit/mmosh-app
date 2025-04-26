import { Connection } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import axios from "axios";

import { CreateCoinParams } from "@/app/models/createCoinParams";
import { MintResultMessage } from "@/app/models/mintResultMessage";
import { web3Consts } from "@/anchor/web3Consts";
import { Connectivity as CurveConn } from "@/anchor/curve/bonding";
import {
  ExponentialCurve,
  ExponentialCurveConfig,
} from "@/anchor/curve/curves";
import { pinImageToShadowDrive } from "../uploadImageToShdwDrive";
import { pinFileToShadowDrive } from "../uploadFileToShdwDrive";
import { calculatePrice } from "./setupCoinPrice";
import { deleteShdwDriveFile } from "../deleteShdwDriveFile";
import { Connectivity as UserConn } from "@/anchor/user";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const createCoin = async ({
  name,
  symbol,
  description,
  imageFile,
  wallet,
  preview,
  multiplier,
  supply,
  initialPrice,
  type,
  setMintingStatus,
  username,
  baseToken,
}: CreateCoinParams): Promise<MintResultMessage> => {
  let shdwHash = "";

  const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_CLUSTER!, {
    confirmTransactionInitialTimeout: 120000
  });
  const env = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: "processed",
  });

  anchor.setProvider(env);

  const curveConn: CurveConn = new CurveConn(env, web3Consts.programID);

  const body = {
    name: name,
    symbol: symbol,
    description,
    image: "",
  };

  try {
    setMintingStatus("Vaidating Symbol...");
    const symbolResult = await axios.get(
      `/api/check-token-symbol?symbol=${symbol}`,
    );
    if (symbolResult.data) {
      return {
        message:
          "Symbol already exist. please choose different symbol and try again",
        type: "error",
      };
    }

    if (imageFile != null) {
      setMintingStatus("Uploading Image...");
      const imageUri = await pinImageToShadowDrive(imageFile);
      body.image = imageUri;
      if (imageUri === "") {
        return {
          message:
            "We’re sorry, there was an error while trying to uploading image. please try again later.",
          type: "error",
        };
      }
    } else {
      body.image = preview;
    }

    setMintingStatus("Uploading Metadata...");
    shdwHash = await pinFileToShadowDrive(body);

    if (shdwHash === "") {
      return {
        message:
          "We’re sorry, there was an error while trying to prepare metadata url. please try again later.",
        type: "error",
      };
    }

    const initPrice = 1000000000000;
    const basePrice = calculatePrice(initPrice, supply, multiplier);
    const coinValue = (Number(supply) / basePrice) * initPrice;

    const curveConfig = new ExponentialCurve(
      {
        c: new anchor.BN(type == "linear" ? 0 : coinValue), // c = 1
        b: new anchor.BN(Number(initialPrice) * initPrice),
        // @ts-ignore
        pow: Number(multiplier),
        // @ts-ignore
        frac: 1,
      },
      0,
      0,
    );

    setMintingStatus("Creating Curve Config...");
    let curve = await curveConn.initializeCurve({
      config: new ExponentialCurveConfig(curveConfig),
    });

    setMintingStatus("Creating Token...");
    await delay(15000);
    const targetMint = await curveConn.createTargetMint(name, symbol, shdwHash);

    setMintingStatus("Creating Bonding Curve...");

    console.log("basetoken ", baseToken)

    const res = await curveConn.createTokenBonding({
      name,
      symbol,
      url: shdwHash,
      curve: curve,
      baseMint: new anchor.web3.PublicKey(baseToken.token),
      generalAuthority: wallet.publicKey,
      reserveAuthority: wallet.publicKey,
      buyBaseRoyaltyPercentage: 0,
      buyTargetRoyaltyPercentage: 0,
      sellBaseRoyaltyPercentage: 0,
      sellTargetRoyaltyPercentage: 0,
      targetMint: new anchor.web3.PublicKey(targetMint),
    });

    setMintingStatus("Swapping Token...");
    await delay(15000);
    let buyres;
    if (baseToken.token === web3Consts.oposToken.toBase58()) {
      buyres = await curveConn.buy({
        tokenBonding: res.tokenBonding,
        desiredTargetAmount: new anchor.BN(
          Number(supply) * web3Consts.LAMPORTS_PER_OPOS,
        ),
        slippage: 0.5,
      });
    } else {
      const buytx = await axios.post("/api/ptv/swap", {
        coin: baseToken.token,
        bonding: res.tokenBonding,
        supply: Number(supply),
        address: wallet.publicKey.toBase58(),
      });
      if (buytx.data.status) {
        const data:any =  Buffer.from(buytx.data.transaction, "base64");
        const tx = anchor.web3.VersionedTransaction.deserialize(
          data,
        );
        buyres = await curveConn.provider.sendAndConfirm(tx);
        if (buyres) {
          let tokenType = "Blue";
          if (baseToken.token === process.env.NEXT_PUBLIC_PTVR_TOKEN) {
            tokenType = "Red";
          }
          await axios.post("/api/ptv/update-rewards", {
            coin: baseToken.token,
            wallet: wallet.publicKey.toBase58(),
            method: "buy",
            value: Number(supply),
          });
        }
      } else {
        let userConn: UserConn = new UserConn(env, web3Consts.programID);
        const balance = await userConn.getUserBalance({
          address: wallet.publicKey,
          token: baseToken.token,
          decimals: web3Consts.LAMPORTS_PER_OPOS,
        });
        if (balance > Number(supply)) {
          buyres = await curveConn.buy({
            tokenBonding: res.tokenBonding,
            desiredTargetAmount: new anchor.BN(
              Number(supply) * web3Consts.LAMPORTS_PER_OPOS,
            ),
            slippage: 0.5,
          });
        } else {
          return {
            message:
              "We’re sorry, there was an error while trying to mint. Check your wallet and try again.",
            type: "error",
          };
        }
      }
    }

    if (buyres) {
      const directoryParams = {
        basekey: baseToken.token,
        basename: baseToken.name,
        basesymbol: baseToken.symbol,
        baseimg: baseToken.logoURI,
        bonding: res.tokenBonding.toBase58(),
        targetkey: targetMint,
        targetname: name,
        targetsymbol: symbol,
        targetimg: body.image,
        value: Number(supply),
        price: curveConfig.current(),
        type: "buy",
        wallet: wallet.publicKey.toBase58(),
        tx: buyres
      };

      const tokenParams = {
        name,
        symbol,
        desc: description,
        image: body.image,
        basesymbol: baseToken.symbol,
        tokenAddress: res.targetMint.toBase58(),
        bondingAddress: res.tokenBonding.toBase58(),
        creatorUsername: username,
      };

      await axios.post("/api/save-directory", directoryParams);

      setMintingStatus("Saving Token...");

      await axios.post("/api/save-token", tokenParams);

      return {
        message:
          "Congrats! Your coin is minted and tradable in [swap](https://www.liquidhearts.app/swap)",
        type: "success",
      };
    } else {
      return {
        message:
          "We’re sorry, there was an error while trying to mint. Check your wallet and try again.",
        type: "error",
      };
    }
  } catch (error) {
    console.error("Error trying to create coin ", error);
    await deleteShdwDriveFile(body.image);
    await deleteShdwDriveFile(shdwHash);
    return {
      message:
        "We’re sorry, there was an error while trying to mint. Check your wallet and try again.",
      type: "error",
    };
  }
};
