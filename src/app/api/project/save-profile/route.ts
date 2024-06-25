import { db } from "../../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-app-project-profiles");

  const { profilekey, role, projectkey  } = await req.json();

  const profileDetails = await collection.findOne({
    projectkey: projectkey,
  });

  if (!profileDetails) {
    await collection.insertOne({
        profilekey,
        role,
        projectkey
    });
    return NextResponse.json("", { status: 200 });
  } else {
    return NextResponse.json("", { status: 200 });
  }
}