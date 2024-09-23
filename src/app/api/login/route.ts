import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import argon2 from "argon2";

import { db } from "@/app/lib/mongoClient";
import { generateSession } from "@/utils/generateSession";

export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-users");

  const data = await req.json();

  const email = data.email;
  const password = data.password;

  const user = await collection.findOne({
    email,
  });

  if (user === null) {
    return NextResponse.json("", {
      status: 400,
    });
  }

  const isValid = argon2.verify(user!.password, password);

  if (!isValid) {
    return NextResponse.json("", {
      status: 400,
    });
  }

  const session = generateSession();

  await collection.updateOne(
    { _id: user!._id },
    {
      sessions: [...(user!.sessions ?? []), session],
    },
  );

  const cookieStore = cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
  });

  return NextResponse.json("");
}
