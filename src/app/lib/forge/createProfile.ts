import { Connection } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

import { Connectivity as UserConn } from "@/anchor/user";
import { web3Consts } from "@/anchor/web3Consts";
import { pinImageToShadowDrive } from "../uploadImageToShdwDrive";
import { MintResultMessage } from "../../models/mintResultMessage";
import { CreateProfileParams } from "../../models/createProfileParams";
import { getTotalMints } from "../forge/getTotalMints";
import { getUsername } from "../forge/getUsername";
import { updateUserData } from "../forge/updateUserData";
import { updateTotalMints } from "../forge/updateTotalMints";
import { pinFileToShadowDrive } from "../uploadFileToShdwDrive";
import axios from "axios";

export const createProfile = async ({
  wallet,
  image,
  form,
  preview,
  parentProfile,
  banner,
  membership,
  membershipType,
  price
}: CreateProfileParams): Promise<MintResultMessage> => {
  try {
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_CLUSTER!, {
      confirmTransactionInitialTimeout: 120000,
    });
    const env = new anchor.AnchorProvider(connection, wallet, {
      preflightCommitment: "processed",
    });
    const userConn: UserConn = new UserConn(env, web3Consts.programID);

    const seniority = (await getTotalMints()) + 1;
    const generationData = await userConn.getProfileChilds(parentProfile);
    const generation = generationData.generation;
    const profileLineage = await userConn.getProfileLineage(parentProfile);
    if (profileLineage.promoter === "") {
      return {
        type: "error",
        message:
          "We’re sorry, there was an error while trying to find parent profile.",
      };
    }
    const genesisProfile = web3Consts.genesisProfile;

    let fullname = form.name;

    const body = {
      name: fullname,
      lastName: form.lastName,
      displayName: form.displayName,
      symbol: form.username.substring(0, 10),
      description: form.description,
      image: "",
      banner,
      enternal_url: process.env.NEXT_PUBLIC_APP_MAIN_URL + "/" + form.username,
      family: "MMOSH",
      collection: "MMOSH Profile Collection",
      attributes: [
        {
          trait_type: "Primitive",
          value: "Profile",
        },
        {
          trait_type: "Ecosystem",
          value: "Genesis MMOSH",
        },
        {
          trait_type: "Gen",
          value: generation,
        },
        {
          trait_type: "Seniority",
          value: seniority,
        },
        {
          trait_type: "Full Name",
          value: fullname,
        },
        {
          trait_type: "Username",
          value: form.username,
        },
        {
          trait_type: "Adjective",
          value: form.descriptor,
        },
        {
          trait_type: "Noun",
          value: form.noun,
        },
        {
          trait_type: "Membership",
          value: membership
        },
        {
          trait_type: "Renewal frequency",
          value: membershipType
        },
        {
          trait_type: "Membership status",
          value: "Active"
        },
        {
          trait_type: "Price",
          value: price + " USD"
        }
      ],
    };

    // get promoter name
    if (profileLineage.promoter.length > 0) {
      let promoter: any = await getUsername(profileLineage.promoter);
      if (promoter != "") {
        body.attributes.push({
          trait_type: "Source",
          value: promoter,
        });
        body.attributes.push({
          trait_type: "Promoter",
          value: promoter,
        });
      } else {
        body.attributes.push({
          trait_type: "Source",
          value: profileLineage.promoter,
        });
        body.attributes.push({
          trait_type: "Promoter",
          value: profileLineage.promoter,
        });
      }
      body.attributes.push({
        trait_type: "Promoter_Profile",
        value: profileLineage.promoterprofile,
      });
    }

    // get scout name
    if (profileLineage.scout.length > 0) {
      let scout: any = await getUsername(profileLineage.scout);
      if (scout != "") {
        body.attributes.push({
          trait_type: "Scout",
          value: scout,
        });
      } else {
        body.attributes.push({
          trait_type: "Scout",
          value: profileLineage.scout,
        });
      }
      body.attributes.push({
        trait_type: "Scout_Profile",
        value: profileLineage.scoutprofile,
      });
    }

    // get recruiter name
    if (profileLineage.recruiter.length > 0) {
      let recruiter: any = await getUsername(profileLineage.recruiter);
      if (recruiter != "") {
        body.attributes.push({
          trait_type: "Recruiter",
          value: recruiter,
        });
      } else {
        body.attributes.push({
          trait_type: "Recruiter",
          value: profileLineage.recruiter,
        });
      }
      body.attributes.push({
        trait_type: "Recruiter_Profile",
        value: profileLineage.recruiterprofile,
      });
    }

    // get originator name
    if (profileLineage.originator.length > 0) {
      let originator: any = await getUsername(profileLineage.originator);
      if (originator != "") {
        body.attributes.push({
          trait_type: "Originator",
          value: originator,
        });
      } else {
        body.attributes.push({
          trait_type: "Originator",
          value: profileLineage.originator,
        });
      }
      body.attributes.push({
        trait_type: "Originator_Profile",
        value: profileLineage.originatorprofile,
      });
    }

    if (image) {
      const imageUri = await pinImageToShadowDrive(image);
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

    const shadowHash: any = await pinFileToShadowDrive(body);

    if (shadowHash === "") {
      return {
        message:
          "We’re sorry, there was an error while trying to prepare meta url. please try again later.",
        type: "error",
      };
    }

    const res = await userConn.mintProfile({
      name: form.username.substring(0, 15),
      symbol: form.username.substring(0, 10),
      uriHash: shadowHash,
      parentProfile,
      genesisProfile,
      commonLut: web3Consts.commonLut,
      price
    });

    if (res.Ok) {
      const params = {
        username: form.username,
        symbol: form.username.substring(0, 10),
        bio: form.description,
        displayName: form.displayName,
        name: fullname,
        lastName: form.lastName,
        image: body.image,
        descriptor: form.descriptor,
        nouns: form.noun,
        link: form.link,
        seniority: seniority,
        banner,
      };


      await updateUserData(params);

        let date = new Date(); // Now
        if(membershipType === "monthly") {
          date.setDate(date.getDate() + 30);
        } else if (membershipType === "yearly") {
          date.setDate(date.getDate() + 365);
        }

      const membershipparams = {
        membership,
        membershiptype: membershipType,
        price,
        expirydate: date,
        wallet: wallet.publicKey.toString()
      };

      await axios.post("/api/membership/add", membershipparams);

      await updateTotalMints(seniority);

      return {
        type: "success",
        message:
          "Congrats! Your profile has been minted, granting you full membership in MMOSH DAO.",
        data: params,
      };
    } else {
      console.log("Response: ", res);
      return {
        type: "error",
        message:
          "We’re sorry, there was an error while trying to mint your profile. Check your wallet and try again.",
      };
    }
  } catch (err) {
    console.error("Got error: ", err);
    return {
      type: "error",
      message: "Something wrong happened, please contact support",
    };
  }
};

export const buyMembership = async ({
  wallet,
  image,
  form,
  preview,
  parentProfile,
  membership,
  membershipType,
  price
}: CreateProfileParams): Promise<MintResultMessage> => {
  try {
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_CLUSTER!, {
      confirmTransactionInitialTimeout: 120000,
    });
    const env = new anchor.AnchorProvider(connection, wallet, {
      preflightCommitment: "processed",
    });
    const userConn: UserConn = new UserConn(env, web3Consts.programID);
    const profileLineage = await userConn.getProfileLineage(parentProfile);
    if(profileLineage.promoter === "") {
      return {
        type: "error",
        message:
          "We’re sorry, there was an error while trying to find parent profile.",
      };
    }
    const genesisProfile = web3Consts.genesisProfile;

    const res = await userConn.buyMembership({
      name: form.username.substring(0, 15),
      symbol: form.username.substring(0, 10).toUpperCase(),
      uriHash: "",
      parentProfile,
      genesisProfile,
      commonLut: web3Consts.commonLut,
      price
    });

    if (res.Ok) {
        let date = new Date(); // Now
        if(membershipType === "monthly") {
          date.setDate(date.getDate() + 30);
        } else if (membershipType === "yearly") {
          date.setDate(date.getDate() + 365);
        }

      const membershipparams = {
        membership,
        membershiptype: membershipType,
        price,
        expirydate: date,
        wallet: wallet.publicKey.toString()
      };

      await axios.post("/api/membership/update", membershipparams);


      return {
        type: "success",
        message:
          "Congrats! Your profile has been minted, granting you full membership in MMOSH DAO.",
        data: {},
      };
    } else {
      console.log("Response: ", res);
      return {
        type: "error",
        message:
          "We’re sorry, there was an error while trying to mint your profile. Check your wallet and try again.",
      };
    }
  } catch (err) {
    console.error("Got error: ", err);
    return {
      type: "error",
      message: "Something wrong happened, please contact support",
    };
  }
};

export const trasferUsdCoin = async (wallet: any, receiver: string, amount: number) => {
  try {
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_CLUSTER!, {
      confirmTransactionInitialTimeout: 120000,
    });
    const env = new anchor.AnchorProvider(connection, wallet, {
      preflightCommitment: "processed",
    });
    const userConn: UserConn = new UserConn(env, web3Consts.programID);
    const res = await userConn.trasferUsdCoin({
      recipient: { receiver, amount },
      sender: wallet.publicKey
    });
    console.log("===== RES =====", res);
    if (res.Ok) {
      return {
        type: "success",
        message: "Congrats! The amount has been transferred successfully.",
        data: res.Ok,
      };
    } else {
      return {
        type: "error",
        message: "We’re sorry, there was an error while trying to transfer USDC. Check your wallet and try again.",
      };
    }
  } catch (error) {
    console.log("===== TRASFER USDC ERROR =====", error);
    return {
      type: "error",
      message: "Something wrong happened, please contact support",
    };
  }
};