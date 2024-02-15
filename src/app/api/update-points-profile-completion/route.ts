import { db } from "../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const collection = db.collection("mmosh-app-profiles");
  const botCollection = db.collection("users");

  const { wallet } = await req.json();

  const user = await collection.findOne({
    wallet,
  });

  if (!user) {
    return NextResponse.json("User not found", { status: 400 });
  }

  let pointsToAdd = 50;

  if (user.telegram) {
    pointsToAdd += 200;
  }

  if (user.twitter?.uid) {
    pointsToAdd += 100;
  }

  await collection.updateOne(
    {
      _id: user._id,
    },
    {
      $inc: {
        "telegram.points": pointsToAdd,
      },
    },
  );

  await botCollection.updateOne(
    {
      telegramId: user.telegram.id,
    },
    {
      $inc: {
        "telegram.points": pointsToAdd,
      },
    },
  );

  return NextResponse.json("User not found", { status: 400 });
}
