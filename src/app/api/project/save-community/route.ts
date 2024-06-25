import { db } from "../../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-app-project-community");

  const { communitykey, projectkey  } = await req.json();

  const communityDetails = await collection.findOne({
    projectkey: projectkey,
  });

  if (!communityDetails) {
    await collection.insertOne({
        communitykey,
        projectkey
    });
    return NextResponse.json("", { status: 200 });
  } else {
    return NextResponse.json("", { status: 200 });
  }
}