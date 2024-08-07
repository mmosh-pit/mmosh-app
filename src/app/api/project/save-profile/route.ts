import { db } from "../../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-app-project-profiles");

  const { profilekey, role, projectkey, name  } = await req.json();

  const profileDetails = await collection.findOne({
    projectkey: projectkey,
    profilekey
  });

  if (!profileDetails) {
    await collection.insertOne({
        name,
        profilekey,
        role,
        projectkey
    });
    return NextResponse.json("", { status: 200 });
  } else {
    return NextResponse.json("", { status: 200 });
  }
}