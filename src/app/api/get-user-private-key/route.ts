import { decryptData } from "@/app/lib/decryptData";
import { db } from "../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookie = cookies().get("session")?.value;

  if (!cookie) {
    return NextResponse.json("", { status: 401 });
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_MAIN_URL}/api/is-auth`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        // Forward cookie to Route Handler
        cookie: `session=${cookie}`,
      },
    },
  );

  const data = await response.json();

  if (!data) {
    return NextResponse.json("", { status: 401 });
  }

  const collection = db.collection("users");

  const usersCollection = db.collection("mmosh-users");

  const { searchParams } = new URL(req.url);
  const param = searchParams.get("id");

  if (!param || param === "undefined") {
    const user = await usersCollection.findOne({
      sessions: cookie,
    });

    if (!user) return NextResponse.json(null, { status: 200 });

    const pKey = user.privateKey;

    const pKeyDecrypted = btoa(decryptData(pKey));

    return NextResponse.json(pKeyDecrypted, { status: 200 });
  }

  const user = await collection.findOne({
    telegramId: Number(param.trim()),
  });

  if (!user) return NextResponse.json(null, { status: 200 });

  const pKey = user.addressPrivateKey;

  const pKeyDecrypted = btoa(decryptData(pKey));

  return NextResponse.json(pKeyDecrypted, {
    status: 200,
  });
}
