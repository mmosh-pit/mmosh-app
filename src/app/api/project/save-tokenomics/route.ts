import { db } from "../../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-app-project-tokenomics");

  const { type, value, cliff, vesting, projectkey} = await req.json();

  const tokenomics = await collection.findOne({
    projectkey: projectkey,
  });

  if (!tokenomics) {
    await collection.insertOne({
        type,
        value,
        cliff,
        vesting,
        projectkey
    });
    return NextResponse.json("", { status: 200 });
  } else {
    return NextResponse.json("", { status: 200 });
  }
}