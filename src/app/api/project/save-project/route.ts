import { db } from "../../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-app-project");

  const { name, symbol, desc, image, key, lut, seniority, telegram, twitter, website, presalesupply, minpresalesupply, presalestartdate, presaleenddate, dexlistingdate} = await req.json();

  const project = await collection.findOne({
    key: key,
  });

  if (!project) {
    await collection.insertOne({ name, symbol, desc, image, key, lut, seniority, telegram, twitter, website, presalesupply, minpresalesupply, presalestartdate, presaleenddate, dexlistingdate});
    return NextResponse.json("", { status: 200 });
  } else {
    return NextResponse.json("", { status: 200 });
  }
}