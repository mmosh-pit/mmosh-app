import { db } from "../../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const collection = db.collection("mmosh-users");

  const { value, wallet } = await req.json();

  const user = await collection.findOne({
    wallet,
  });

  if (user) {
    await collection.updateOne(
      {
        _id: user._id,
      },
      {
        $set: {
          profile: value,
        },
      },
    );
   
  }
  return NextResponse.json("", { status: 200 });
}