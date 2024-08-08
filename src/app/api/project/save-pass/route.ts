import { db } from "../../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-app-project-pass");

  const { name, symbol, image, inviteimage, desc, price, supply, discount, promoterroyality, scoutroyalty, redemptiondate, key, projectkey, creator} = await req.json();

  const launchpass = await collection.findOne({
    key: key,
  });

  if (!launchpass) {
    await collection.insertOne({
        name,
        symbol,
        image,
        inviteimage,
        key,
        desc,
        price,
        supply,
        discount,
        promoterroyality,
        scoutroyalty,
        creator, 
        redemptiondate,
        projectkey
    });
    return NextResponse.json("", { status: 200 });
  } else {
    return NextResponse.json("", { status: 200 });
  }
}