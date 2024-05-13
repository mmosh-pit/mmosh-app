import * as anchor from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";

import { Connectivity as UserConn } from "@/anchor/user";
import { MintResultMessage } from "@/app/models/mintResultMessage";
import { CreateInvitationParams } from "@/app/models/createInvitationParams";
import { web3Consts } from "@/anchor/web3Consts";
import { getUsername } from "./getUsername";
import { pinFileToShadowDrive } from "../uploadFileToShdwDrive";

const capitalizeString = (str: any) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const getPronouns = (pronoun: string) => {
  if (pronoun == "they/them") {
    return "them";
  } else if (pronoun == "he/him") {
    return "him";
  } else {
    return "her";
  }
};

export const createSubscriptionInvitation = async ({
  wallet,
  profileInfo,
  amount,
  name,
  pronouns,
  seniority,
}: CreateInvitationParams): Promise<MintResultMessage> => {
  const profileLineage = profileInfo?.profileLineage;

  const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_CLUSTER!);
  const env = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: "processed",
  });
  anchor.setProvider(env);
  const userConn: UserConn = new UserConn(env, web3Consts.programID);

  let isSuccess = false;
  if (profileInfo.firstTimeInvitation) {
    let attributes = [];
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

    const body = {
      name: name != "" ? "Invitation from " + name : "Invitation",
      symbol: "INVITE",
      description: desc,
      image:
        "https://shdw-drive.genesysgo.net/FuBjTTmQuqM7pGR2gFsaiBxDmdj8ExP5fzNwnZyE2PgC/invite.png",
      external_url: process.env.NEXT_PUBLIC_APP_MAIN_URL,
      minter: name,
      attributes: attributes,
    };

    const shdwHash: any = await pinFileToShadowDrive(body);

    if (shdwHash === "") {
      return {
        message:
          "We’re sorry, there was an error while trying to prepare meta url. please try again later.",
        type: "error",
      };
    }

    const symbol = "INVITE";
    const uri = shdwHash;
    const res: any = await userConn.initSubscriptionBadge({
      name: "Invitation",
      symbol,
      uri,
      profile: profileInfo.profile.address,
    });

    // setTimeout(async () => {
    const res1 = await userConn.mintSubscriptionToken({
      amount,
      subscriptionToken: res.Ok.info.subscriptionToken,
    });

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
    // }, 15000);
  } else {
    const res = await userConn.initSubscriptionBadge({
      name: "Invitation",
      profile: profileInfo.profile.address,
    });

    const res1 = await userConn.mintSubscriptionToken({
      amount,
      subscriptionToken: res.Ok?.info?.subscriptionToken,
    });

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
