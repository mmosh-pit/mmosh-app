import axios from "axios";
import { db } from "../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const directoryCollection = db.collection("mmosh-app-directory");
  const params = await req.json();

  let usdcPrice;
  


  if(params.basesymbol === "PTVB") {
    let apiResponse  = await axios.get(
      `https://price.jup.ag/v6/price?ids=PTVB&vsToken=USDC`,
    );
    usdcPrice = apiResponse.data?.data?.MMOSH?.price || 0.3;
  } else if(params.basesymbol === "PTVR") {
    let apiResponse  = await axios.get(
      `https://price.jup.ag/v6/price?ids=PTVR&vsToken=USDC`,
    );
    usdcPrice = apiResponse.data?.data?.PTVR?.price || 0.003;
  } else {
    let apiResponse  = await axios.get(
      `https://price.jup.ag/v6/price?ids=MMOSH&vsToken=USDC`,
    );
    usdcPrice = apiResponse.data?.data?.MMOSH?.price || 0.3;
  }


  directoryCollection.insertOne({
    basekey: params.basekey,
    basename: params.basename,
    basesymbol: params.basesymbol,
    baseimg: params.baseimg,
    bonding: params.bonding,
    targetname: params.targetname,
    targetsymbol: params.targetsymbol,
    targetimg: params.targetimg,
    value: params.value,
    price: params.price,
    usdcPrice: params.value * usdcPrice,
    type: params.type,
    wallet: params.wallet,
    created_date: new Date(),
    updated_date: new Date(),
  });

  return NextResponse.json("", { status: 200 });
}
