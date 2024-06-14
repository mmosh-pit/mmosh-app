import * as anchor from "@coral-xyz/anchor";
import { MintCommunityPassParams } from "@/app/models/mintCommunityPassParams";
import { Connection, PublicKey } from "@solana/web3.js";

import { MintResultMessage } from "@/app/models/mintResultMessage";
import { Connectivity as ProjectConn } from "@/anchor/project";
import axios from "axios";
import { pinFileToShadowDrive } from "../uploadFileToShdwDrive";
import { web3Consts } from "@/anchor/web3Consts";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const mintCommunityPass = async ({
  setMintStatus,
  community,
  wallet,
  projectInfo,
  profile,
}: MintCommunityPassParams): Promise<MintResultMessage> => {
  try {
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_CLUSTER!);

    const genesisProfile = community.project;
    const activationToken = new anchor.web3.PublicKey(
      projectInfo.activationTokens[0].activation,
    );
    const env = new anchor.AnchorProvider(connection, wallet, {
      preflightCommitment: "processed",
    });
    const projectConn: ProjectConn = new ProjectConn(
      env,
      web3Consts.programID,
      new anchor.web3.PublicKey(community.project),
    );
    setMintStatus("Preparing Metadata...");

    const body = {
      name: community.name,
      symbol: community.symbol,
      description: community.description,
      image: community.image,
      enternal_url: process.env.NEXT_PUBLIC_APP_MAIN_URL,
      family: "MMOSH",
      collection: "MMOSH Pass Collection",
      attributes: [
        {
          trait_type: "Community",
          value: community.tokenAddress,
        },
        {
          trait_type: "Primitive",
          value: "Pass",
        },
        {
          trait_type: "MMOSH",
          value: "Genesis MMOSH",
        },
        {
          trait_type: "Seniority",
          value: "0",
        },
      ],
    };

    // get originator name
    if (projectInfo.profilelineage.originator.length > 0) {
      const result = await axios.get(
        `/api/get-wallet-data?wallet=${projectInfo.profilelineage.originator}`,
      );

      const originator = result.data?.profile?.username;

      body.attributes.push({
        trait_type: "Creator",
        value: originator || projectInfo.profilelineage.originator,
      });
    }
    body.attributes.push({
      trait_type: "Creator_Profile",
      value: projectInfo.profilelineage.originatorprofile,
    });

    const shadowHash: any = await pinFileToShadowDrive(body);
    if (shadowHash === "") {
      return {
        message:
          "We’re sorry, there was an error while trying to prepare meta url. please try again later.",
        type: "error",
      };
    }
    setMintStatus("Minting Pass...");

    const res = await projectConn.mintPass(
      {
        name: community.name,
        symbol: community.symbol,
        uriHash: shadowHash,
        activationToken,
        genesisProfile,
        commonLut: new PublicKey(community.lut),
      },
      profile,
    );

    if (res.Ok) {
      setMintStatus("Waiting for confirmations...");
      await delay(15000);

      setMintStatus("Mint");
      return {
        message: "Congrats! You have minted your Pass successfully.",
        type: "success",
      };
    }
    setMintStatus("Mint");
    return {
      message:
        "We’re sorry, there was an error while trying to mint your Pass. Check your wallet and try again.",
      type: "error",
    };
  } catch (error) {
    console.error(error);
    setMintStatus("Mint");
    return {
      message:
        "We’re sorry, there was an error while trying to mint your Pass. Check your wallet and try again.",
      type: "error",
    };
  }
};
