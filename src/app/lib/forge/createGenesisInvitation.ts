import * as anchor from "@coral-xyz/anchor";

import { Connectivity as AdConn } from "@/anchor/admin";
import { web3Consts } from "@/anchor/web3Consts";
import { pinFileToShadowDrive } from "../uploadFileToShdwDrive";
import { capitalizeString } from "../capitalizeString";
import { getPronouns } from "../getPronouns";
import { Connection } from "@solana/web3.js";
import { CreateInvitationParams } from "@/app/models/createInvitationParams";
import { MintResultMessage } from "@/app/models/mintResultMessage";

export const createGenesisInvitation = async ({
  wallet,
  amount,
  profileInfo,
  name,
  pronouns,
}: CreateInvitationParams): Promise<MintResultMessage> => {
  const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_CLUSTER!);

  const firstTime = profileInfo.firstTimeInvitation;

  const env = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: "processed",
  });
  anchor.setProvider(env);
  let userConn: AdConn = new AdConn(env, web3Consts.programID);

  console.log("createGenesisInvitation starting");

  let isSuccess = false;
  if (firstTime) {
    let desc =
      "Cordially invites you to join on the MMOSH. The favor of a reply is requested.";
    if (name != "") {
      desc =
        capitalizeString(name) +
        " cordially invites you to join " +
        getPronouns(pronouns) +
        " on the MMOSH. The favor of a reply is requested.";
    }
    const body = {
      name: name != "" ? "Invitation from " + name : "Invitation",
      symbol: "INVITE",
      description: desc,
      image:
        "https://shdw-drive.genesysgo.net/FuBjTTmQuqM7pGR2gFsaiBxDmdj8ExP5fzNwnZyE2PgC/invite.png",
      external_url: process.env.NEXT_PUBLIC_APP_MAIN_URL,
      minter: name,
    };
    const shdwHash: any = await pinFileToShadowDrive(body);

    if (shdwHash === "") {
      return {
        message:
          "We’re sorry, there was an error while trying to prepare meta url. please try again later.",
        type: "error",
      };
    }

    console.log("Metadata setted up");

    const symbol = "INVITE";
    const uri = shdwHash;
    const res: any = await userConn.initActivationToken({
      name: "Invitation",
      symbol,
      uri,
    });

    console.log("invitation gensis 1 ", res);
    setTimeout(async () => {
      const res1 = await userConn.mintActivationToken(amount, wallet.publicKey);
      console.log("invitation gensis 2 ", res1);
      if (res1.Ok) {
        isSuccess = true;
      }
      if (isSuccess) {
        return {
          message: "Congrats! You have minted your Invitation(s) successfully.",
          type: "success",
        };
      }
      return {
        message:
          "We’re sorry, there was an error while trying to mint your Invitation Badge(s). Check your wallet and try again.",
        type: "error",
      };
    }, 15000);
  } else {
    const res1 = await userConn.mintActivationToken(amount, wallet.publicKey);
    console.log("invitation gensis 2 ", res1);
    if (res1.Ok) {
      isSuccess = true;
    }

    if (isSuccess) {
      return {
        message: "Congrats! You have minted your Invitation(s) successfully.",
        type: "success",
      };
    }
    return {
      message:
        "We’re sorry, there was an error while trying to mint your Invitation Badge(s). Check your wallet and try again.",
      type: "error",
    };
  }

  return {
    message: "",
    type: "",
  };
};
