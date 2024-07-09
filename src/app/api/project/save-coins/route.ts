import { db } from "../../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-app-project-coins");

  const { name, symbol, image, key, desc, supply, creator, listingprice, projectkey  } = await req.json();

  const communityCoins = await collection.findOne({
    key: key,
  });

  if (!communityCoins) {
    await collection.insertOne({
        name,
        symbol,
        image,
        key,
        desc,
        supply,
        creator, 
        listingprice,
        projectkey
    });
    return NextResponse.json("", { status: 200 });
  } else {
    return NextResponse.json("", { status: 200 });
  }
}