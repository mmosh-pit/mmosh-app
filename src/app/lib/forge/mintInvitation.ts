import * as anchor from "@coral-xyz/anchor";
import { Connectivity as ProjectConn } from "@/anchor/project";
import { Connection } from "@solana/web3.js";

import { web3Consts } from "@/anchor/web3Consts";
import { MintResultMessage } from "@/app/models/mintResultMessage";
import { pinFileToShadowDrive } from "../uploadFileToShdwDrive";
import { capitalizeString } from "../capitalizeString";
import { getPronouns } from "../getPronouns";
import axios from "axios";
import { MintInvitationParams } from "@/app/models/mintInvitationParams";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const mintInvitation = async ({
  amount,
  wallet,
  setInvitationStatus,
  projectInfo,
  pronouns,
  userName,
  community,
}: MintInvitationParams): Promise<MintResultMessage> => {
  try {
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_CLUSTER!, {
      confirmTransactionInitialTimeout: 120000
    });

    const env = new anchor.AnchorProvider(connection, wallet, {
      preflightCommitment: "processed",
    });

    anchor.setProvider(env);

    const projectConn: ProjectConn = new ProjectConn(
      env,
      web3Consts.programID,
      new anchor.web3.PublicKey(community.project),
    );
    let activationToken;
    if (projectInfo.activationTokens.length == 0) {
      setInvitationStatus("Preparing Metadata ...");
      const attributes = [];

      // get promoter name
      if (projectInfo.profilelineage.promoter.length > 0) {
        const result = await axios.get(
          `/api/get-wallet-data?wallet=${projectInfo.profilelineage.promoter}`,
        );

        const promoter = result.data?.profile?.username;
        attributes.push({
          trait_type: "Parent",
          value: promoter || projectInfo.profilelineage.promoter,
        });
      }

      attributes.push({
        trait_type: "Seniority",
        value: projectInfo.generation,
      });

      attributes.push({
        trait_type: "Gen",
        value: projectInfo.generation,
      });

      attributes.push({
        trait_type: "Community",
        value: community.tokenAddress,
      });

      const desc =
        userName && pronouns
          ? `${capitalizeString(userName)} Cordially invites you to join ${getPronouns(pronouns)} on the ${capitalizeString(`${community.name}. The favor of a reply is requested.`)}. `
          : `Cordially invites you to join ${community.name}. The favor of a reply is requested.`;

      const body = {
        name: `Invitation from ${capitalizeString(userName)}`,
        symbol: community.symbol,
        description: desc,
        image: community.inviteImg,
        external_url: process.env.NEXT_PUBLIC_APP_MAIN_URL,
        minter: userName,
        attributes: attributes,
      };

      const shdwHash: any = await pinFileToShadowDrive(body);

      if (shdwHash === "") {
        return {
          message:
            "There was an error while minting your tokens. Please, try again.",
          type: "error",
        };
      }
      setInvitationStatus("Initialize Badge Account...");
      const initResult = await projectConn.initBadge({
        name: "Invitation",
        symbol: "BADGE",
        uri: shdwHash,
        profile: projectInfo.profiles[0].address,
      });
      console.log("initResult ", initResult);
      activationToken = initResult.Ok?.info?.subscriptionToken;
      setInvitationStatus("Wait for confirmation...");
      await delay(15000);
    } else {
      activationToken = projectInfo.activationTokens[0].activation;
    }

    console.log("activationToken ", activationToken);
    setInvitationStatus("Mint Badge...");
    let res;
    if (Number(projectInfo.invitationPrice) / 1000_000_000 > 0) {
      res = await projectConn.mintBadge({
        amount: Number(amount),
        subscriptionToken: activationToken,
      });
    } else {
      res = await projectConn.createBadge({
        amount: Number(amount),
        subscriptionToken: activationToken,
      });
    }

    console.log("mintBadge ", res);
    if (res.Ok) {
      return {
        message: "Congrats! Your tokens have been minted successfully.",
        type: "success",
      };
    } else {
      setInvitationStatus("Mint");
      return {
        message:
          "There was an error while minting your tokens. Please, try again.",
        type: "error",
      };
    }
  } catch (error) {
    console.error(error);
    setInvitationStatus("Mint");
    return {
      message:
        "There was an error while minting your tokens. Please, try again.",
      type: "error",
    };
  }
};
