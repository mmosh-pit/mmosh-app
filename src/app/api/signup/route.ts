import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import argon2 from "argon2";

import { db } from "@/app/lib/mongoClient";
import { generateSession } from "@/utils/generateSession";

export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-users");
  const emailCollection = db.collection("mmosh-users-email-verification");

  const cookieStore = cookies();

  const data = await req.json();

  const session = generateSession();

  const { code, ...filteredData } = data;

  const existingData = await emailCollection.findOne({
    email: filteredData.email.trim(),
    code: Number(code.trim()),
  });

  if (!existingData) {
    return NextResponse.json("", { status: 400 });
  }

  const password = await argon2.hash(data.password);

  await collection.insertOne({
    ...filteredData,
    password,
    sessions: [session],
  });

  cookieStore.set("session", session, {
    httpOnly: true,
  });

  await emailCollection.deleteOne({ _id: existingData._id });

  return NextResponse.json("");
}
