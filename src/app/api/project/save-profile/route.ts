import { db } from "../../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-app-project-profiles");

  const { profilekey, role, projectkey, key } = await req.json();

  const profileDetails = await collection.findOne({
    projectkey: projectkey,
    profilekey
  });

  if (!profileDetails) {
    await collection.insertOne({
        profilekey,
        role,
        projectkey,
        key
    });
    return NextResponse.json("", { status: 200 });
  } else {
    await collection.updateOne(
      {
        _id: profileDetails._id,
      },
      {
        $set: {
          role,
          key
        },
      },
    );
    return NextResponse.json("", { status: 200 });
  }
}