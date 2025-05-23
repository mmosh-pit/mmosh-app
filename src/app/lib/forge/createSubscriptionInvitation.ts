import * as anchor from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";

import { Connectivity as UserConn } from "@/anchor/user";
import { MintResultMessage } from "@/app/models/mintResultMessage";
import { CreateInvitationParams } from "@/app/models/createInvitationParams";
import { web3Consts } from "@/anchor/web3Consts";
import { getUsername } from "./getUsername";
import { pinFileToShadowDrive } from "../uploadFileToShdwDrive";
import { capitalizeString } from "../capitalizeString";
import { getPronouns } from "../getPronouns";

export const createSubscriptionInvitation = async ({
  wallet,
  profileInfo,
  amount,
  name,
  pronouns,
  seniority,
}: CreateInvitationParams): Promise<MintResultMessage> => {
  const profileLineage = profileInfo?.profileLineage;

  const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_CLUSTER!, {
    confirmTransactionInitialTimeout: 120000
  });
  const env = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: "processed",
  });
  anchor.setProvider(env);
  const userConn: UserConn = new UserConn(env, web3Consts.programID);

  console.log("createSubscriptionInvitation starting");

  let isSuccess = false;
  if (profileInfo.firstTimeInvitation) {
    console.log("First time mint");
    const attributes = [];
    // get promoter name
    if (profileLineage.promoter.length > 0) {
      const promoter: any = await getUsername(profileLineage.promoter);
      if (promoter != "") {
        attributes.push({
          trait_type: "Promoter",
          value: promoter,
        });
      } else {
        attributes.push({
          trait_type: "Promoter",
          value: profileLineage.promoter,
        });
      }
    }

    // get scout name
    if (profileLineage.scout.length > 0) {
      const scout: any = await getUsername(profileLineage.scout);
      if (scout != "") {
        attributes.push({
          trait_type: "Scout",
          value: scout,
        });
      } else {
        attributes.push({
          trait_type: "Scout",
          value: profileLineage.scout,
        });
      }
    }

    // get recruiter name
    if (profileLineage.recruiter.length > 0) {
      const recruiter: any = await getUsername(profileLineage.recruiter);
      if (recruiter != "") {
        attributes.push({
          trait_type: "Recruiter",
          value: recruiter,
        });
      } else {
        attributes.push({
          trait_type: "Recruiter",
          value: profileLineage.recruiter,
        });
      }
    }

    // get originator name
    if (profileLineage.originator.length > 0) {
      const originator: any = await getUsername(profileLineage.originator);
      if (originator != "") {
        attributes.push({
          trait_type: "Originator",
          value: originator,
        });
      } else {
        attributes.push({
          trait_type: "Originator",
          value: profileLineage.originator,
        });
      }
    }

    attributes.push({
      trait_type: "Gen",
      value: profileInfo.generation,
    });

    attributes.push({
      trait_type: "Seniority",
      value: seniority,
    });

    let desc =
      "Cordially invites you to join on the MMOSH. The favor of a reply is requested.";
    if (name != "") {
      desc =
        capitalizeString(name) +
        " cordially invites you to join " +
        getPronouns(pronouns) +
        " on the MMOSH. The favor of a reply is requested.";
    }

    console.log("Setting up metadata");

    const body = {
      name: `Invitation from ${name}`,
      symbol: "INVITE",
      description: desc,
      image:
        "https://shdw-drive.genesysgo.net/FuBjTTmQuqM7pGR2gFsaiBxDmdj8ExP5fzNwnZyE2PgC/invite.png",
      external_url: process.env.NEXT_PUBLIC_APP_MAIN_URL,
      minter: name,
      attributes: attributes,
    };

    const shdwHash = await pinFileToShadowDrive(body);

    if (shdwHash === "") {
      return {
        message:
          "We’re sorry, there was an error while trying to prepare meta url. please try again later.",
        type: "error",
      };
    }

    console.log("Uploaded metadata");

    const symbol = "INVITE";
    const res: any = await userConn.initSubscriptionBadge({
      name: "Invitation",
      symbol,
      uri: shdwHash,
      profile: profileInfo.profile.address,
    });

    console.log("Initializing badge: ", res);

    const res1 = await userConn.mintSubscriptionToken({
      amount,
      subscriptionToken: res.Ok.info.subscriptionToken,
    });

    console.log("Minting subscription token: ", res1);

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
  } else {
    console.log("Not first time");
    const res = await userConn.initSubscriptionBadge({
      name: "Invitation",
      profile: profileInfo.profile.address,
    });

    console.log("Initializing subscription badge: ", res);

    const res1 = await userConn.mintSubscriptionToken({
      amount,
      subscriptionToken: res.Ok?.info?.subscriptionToken,
    });

    console.log("Minting subscription token", res1);

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
};
