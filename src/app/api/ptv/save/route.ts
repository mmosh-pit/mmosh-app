import { db } from "../../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";
import { Connectivity as UserConn } from "@/anchor/user";
import * as anchor from "@coral-xyz/anchor";
import { web3Consts } from "@/anchor/web3Consts";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { Connection, Keypair } from "@solana/web3.js";
import axios from "axios";

export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-app-ptv");
  const projectCollection = db.collection("mmosh-app-project");
  const project = await projectCollection.findOne({
    symbol: "PTVG",
  });

  const { pass } = await req.json();

  let nftData = await getNFTDetails(new anchor.web3.PublicKey(pass), "root");
  if (project) {
    if (project.key !== nftData.project || project.key === pass) {
      return NextResponse.json("", { status: 400 });
    }
  }

  const ptv = await collection.findOne({
    wallet: nftData.nftOwner,
  });

  if (!ptv) {
    await collection.insertOne({
      wallet: nftData.nftOwner,
      pass,
      project: nftData.project,
      redreward: nftData.type === "Red" ? 20000 : 0,
      bluereward: nftData.type === "Blue" ? 20000 : 0,
      redclaimed: 0,
      blueclaimed: 0,
      type: nftData.type,
      name: nftData.name,
      email: nftData.email,
      twitter: nftData.twitter,
      telegram: nftData.telegram,
      created_date: new Date(),
      updated_date: new Date(),
    });
    await sendKartaNotification(nftData);
    await increaseSeniority(nftData.project);
  } else {
    if (nftData.type === "Red") {
      await collection.updateOne(
        {
          _id: ptv._id,
        },
        {
          $set: {
            redreward: ptv.redreward + 20000,
          },
        },
      );
    } else {
      await collection.updateOne(
        {
          _id: ptv._id,
        },
        {
          $set: {
            bluereward: ptv.bluereward + 20000,
          },
        },
      );
    }
  }

  console.log("lineageData ", nftData.lineageData);

  for (let index = 0; index < nftData.lineageData.length; index++) {
    const element: any = nftData.lineageData[index];
    let reward = rewardByType(element.type);
    let lineageNftDetails = await getNFTDetails(
      new anchor.web3.PublicKey(element.value),
      "",
    );

    if (project) {
      if (project.key === element.value) {
        continue;
      }
    }

    const lineageptv = await collection.findOne({
      wallet: lineageNftDetails.nftOwner,
    });

    if (!lineageptv) {
      await collection.insertOne({
        wallet: lineageNftDetails.nftOwner,
        pass: element.value,
        project: nftData.project,
        redreward: nftData.type === "Red" ? reward : 0,
        bluereward: nftData.type === "Blue" ? reward : 0,
        redclaimed: 0,
        blueclaimed: 0,
        type: nftData.type,
        name: lineageNftDetails.name,
        email: lineageNftDetails.email,
        twitter: lineageNftDetails.twitter,
        telegram: lineageNftDetails.telegram,
        created_date: new Date(),
        updated_date: new Date(),
      });
    } else {
      if (nftData.type === "Red") {
        await collection.updateOne(
          {
            _id: lineageptv._id,
          },
          {
            $set: {
              redreward: lineageptv.redreward + reward,
            },
          },
        );
      } else {
        await collection.updateOne(
          {
            _id: lineageptv._id,
          },
          {
            $set: {
              bluereward: lineageptv.bluereward + reward,
            },
          },
        );
      }
    }
  }
  return NextResponse.json("", { status: 200 });
}

const rewardByType = (lineage: String) => {
  if (lineage === "USER.Parent") {
    return 8000; // 40%
  } else if (lineage === "USER.GrandParent") {
    return 4000; // 20%
  } else if (lineage === "USER.GreatGrandParent") {
    return 2000; // 10%
  } else {
    return 1000; // 10%
  }
};

const getNFTDetails = async (pass: anchor.web3.PublicKey, lineage: string) => {
  let rpcUrl: any = process.env.NEXT_PUBLIC_SOLANA_CLUSTER;
  let connection = new Connection(rpcUrl);

  let wallet = new NodeWallet(new Keypair());
  const env = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: "processed",
  });
  let userConn: UserConn = new UserConn(env, web3Consts.programID);

  let nftOwner = await userConn.getNftProfileOwner(pass);
  let tokenInfo = await userConn.metaplex.nfts().findByMint({
    mintAddress: new anchor.web3.PublicKey(pass),
  });

  let type: any = "";
  let name: any = "";
  let email: any = "";
  let twitter: any = "";
  let telegram: any = "";
  let project: any = "";
  let lineageData = [];
  if (tokenInfo.json?.attributes) {
    for (let index = 0; index < tokenInfo.json?.attributes.length; index++) {
      const element = tokenInfo.json?.attributes[index];
      if (element.trait_type === "Party") {
        type = element.value;
      }
      if (element.trait_type === "Project") {
        project = element.value;
      }
      if (element.trait_type === "USER.Name") {
        name = element.value;
      }
      if (element.trait_type === "USER.Email") {
        email = element.value;
      }
      if (element.trait_type === "USER.Twitter") {
        twitter = element.value;
      }
      if (element.trait_type === "USER.Telegram") {
        telegram = element.value;
      }
      if (lineage === "root") {
        if (
          element.trait_type === "USER.Parent" ||
          element.trait_type === "USER.GrandParent" ||
          element.trait_type === "USER.GreatGrandParent" ||
          element.trait_type === "USER.GGreatGrandParent"
        ) {
          lineageData.push({
            type: element.trait_type,
            value: element.value,
          });
        }
      }
    }
  }

  return {
    name,
    email,
    twitter,
    telegram,
    nftOwner: nftOwner.profileHolder.toBase58(),
    lineageData,
    type,
    project,
  };
};

const increaseSeniority = async (key: any) => {
  const collection = db.collection("mmosh-app-project");

  const project = await collection.findOne({
    key,
  });

  if (project) {
    await collection.updateOne(
      {
        _id: project._id,
      },
      {
        $set: {
          seniority: project.seniority + 1,
        },
      },
    );
  }
};

const sendKartaNotification = async (nftDetails: any) => {
  const data = {
    app_id: process.env.KARTA_APP_ID,
    api_key: process.env.KARTA_API_KEY,
    api_password: process.env.KARTA_API_PASSWORD,
    lead: {
      email: nftDetails.email,
      first_name: nftDetails.name,
    },
    actions: [
      {
        cmd: "create_lead",
      },
      {
        cmd: "assign_tag",
        tag_name: "BIB Blink In Bio API",
      },
    ],
  };
  const result = await axios({
    method: "post",
    url: process.env.KARTA_API_BASE,
    headers: {
      "Content-Type": `application/x-www-form-urlencoded`,
    },
    data,
  });
  console.log("sendKartaNotification ", result.data);
};
