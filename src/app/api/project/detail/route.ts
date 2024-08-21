import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/mongoClient";
import axios from "axios";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const { searchParams } = new URL(req.url);
  const project = searchParams.get("project");

  const projectCoinCollection = db.collection("mmosh-app-project-coins");
  const coins = await projectCoinCollection.findOne({ projectkey: project });

  const updated_date = new Date();
  const communityCoinAccount = await projectCoinCollection.findOne({
    projectkey: project,
    updated_date: {$lt: updated_date},
  });

  if (communityCoinAccount) {
    let prices:any = [];
    if(communityCoinAccount.coingeckoid) {
      prices = await getMarketPrice(communityCoinAccount.coingeckoid);
    }
    let pricepercentage = await getTokenData(communityCoinAccount.key);
    await projectCoinCollection.updateOne(
      {
        _id: communityCoinAccount._id,
      },
      {
        $set: {
            pricepercentage: pricepercentage,
            prices: prices,
            updated_date: updated_date.setDate(updated_date.getDate() + 1),
        },
      },
    );
  }

  const projectCommunityCollection = db.collection(
    "mmosh-app-project-community",
  );
  const community = await projectCommunityCollection
    .find({ projectkey: project })
    .toArray();

  const projectProfileCollection = db.collection("mmosh-app-project-profiles");
  const profiles = await projectProfileCollection
    .find({ projectkey: project })
    .toArray();

  const projectTokenomicsCollection = db.collection(
    "mmosh-app-project-tokenomics",
  );
  const tokenomics = await projectTokenomicsCollection
    .find({ projectkey: project })
    .toArray();

  const projectCollection = db.collection("mmosh-app-project");
  const projectData = await projectCollection.findOne({ key: project });

  const passCollection = db.collection("mmosh-app-project-pass");
  const passes = await passCollection.find({ projectkey: project }).toArray();

  const result = {
    coins,
    community,
    profiles,
    tokenomics,
    project: projectData,
    passes,
  };

  return NextResponse.json(result, {
    status: 200,
  });
}


const getMarketPrice = async (coingeckoid:string) => {
  try {
    const priceData = await axios.get(process.env.COINGECKO_PUBLIC_URL + "coins/"+coingeckoid+"/market_chart?vs_currency=usd&days=7",{
      headers: { 
        "accept": "application/json",
        "x-cg-pro-api-key": process.env.COINGECKO_API_KEY
      },
    })
    let prices = []
    if(priceData.data.prices) {
      for (let index = 0; index < priceData.data.prices.length; index++) {
        const element = priceData.data.prices[index];
        prices.push(element[1])
      }
    }
    return []
  } catch (error) {
    return []
  }

}

const getTokenData = async (tokenaddress:string) => {
  try {
    const tokenData = await axios.get(process.env.COINGECKO_PUBLIC_URL + "onchain/networks/solana/tokens/"+tokenaddress+"?include=top_pools",{
      headers: { 
        "accept": "application/json",
        "x-cg-pro-api-key": process.env.COINGECKO_API_KEY
      },
    })
    if(tokenData.status == 200) {
      if(tokenData.data.included) {
        return tokenData.data.included[0].price_change_percentage.h24
      }
    }
    return 0
  } catch (error) {
    return 0
  }
}
  