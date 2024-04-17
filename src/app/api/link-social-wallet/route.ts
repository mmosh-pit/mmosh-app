import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token, wallet } = await req.json();

  const linksCollection = db.collection("temporal-links");
  const mmoshCollection = db.collection("mmosh-app-profiles");
  const usersCollection = db.collection("users");

  const linkData = await linksCollection.findOne({ token });

  if (!linkData) {
    return NextResponse.json("", { status: 200 });
  }

  const userData = await usersCollection.findOne({
    addressPublicKey: linkData.addressPublicKey,
  });

  if (!userData) {
    return NextResponse.json("", { status: 200 });
  }

  const existingData = await mmoshCollection.findOne({
    wallet,
  });

  if (existingData) {
    return NextResponse.json(existingData, { status: 200 });
  }

  const data = {
    telegram: {
      id: userData.telegramId,
      username: userData.username,
      firstName: userData.firstName,
      points: userData.points + 250,
    },
    wallet,
  };

  const newData = await mmoshCollection.insertOne(data);

  await linksCollection.deleteOne({ _id: linkData._id });

  await usersCollection.updateOne(
    { _id: userData._id },
    { $inc: { points: 250 } },
  );

  return NextResponse.json(
    { ...data, id: newData.insertedId },
    { status: 200 },
  );
}
