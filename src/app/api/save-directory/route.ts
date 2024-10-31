import axios from "axios";
import { db } from "../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";
import { getPriceForPTV } from "@/app/lib/forge/jupiter";

export async function POST(req: NextRequest) {
  const directoryCollection = db.collection("mmosh-app-directory");
  const params = await req.json();


  let usdcPrice;
  


  if(params.basesymbol === "PTVB") {
    let result = await getPriceForPTV(process.env.NEXT_PUBLIC_PTVB_TOKEN);
    usdcPrice = result > 0 ? result : 0.0003;
  } else if(params.basesymbol === "PTVR") {
    let result = await getPriceForPTV(process.env.NEXT_PUBLIC_PTVR_TOKEN);
    usdcPrice = result > 0 ? result : 0.0003;
  } else {
    let apiResponse  = await axios.get(
      `https://price.jup.ag/v6/price?ids=MMOSH`,
    );
    usdcPrice = apiResponse.data?.data?.MMOSH?.price || 0;
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
    tx: params.tx,
    created_date: new Date(),
    updated_date: new Date(),
  });

  return NextResponse.json("", { status: 200 });
}
