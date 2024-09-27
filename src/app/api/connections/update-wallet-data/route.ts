import { db } from "../../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const collection = db.collection("mmosh-app-profiles");

  const { value, wallet } = await req.json();

  const user = await collection.findOne({
    wallet,
  });

  if (user) {
    user.profile.connectionnft = value.connectionnft
    user.profile.connectionbadge = value.connectionbadge
    await collection.updateOne(
      {
        _id: user._id,
      },
      {
        $set: {
          profile: user.profile,
        },
      },
    );
   
  }
  return NextResponse.json("", { status: 200 });
}