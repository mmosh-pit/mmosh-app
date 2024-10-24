import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";

import { db } from "@/app/lib/mongoClient";

export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-users");
  const emailCollection = db.collection("mmosh-users-email-verification");

  const data = await req.json();

  const { code, password } = data;

  const existingData = await emailCollection.findOne({
    code: Number(code.trim()),
  });

  if (!existingData) {
    return NextResponse.json("", { status: 400 });
  }

  const hashedPassword = await argon2.hash(password);

  await collection.updateOne(
    { email: existingData?.email },
    {
      $set: {
        password: hashedPassword,
      },
    },
  );

  await emailCollection.deleteOne({ _id: existingData._id });

  return NextResponse.json("");
}
