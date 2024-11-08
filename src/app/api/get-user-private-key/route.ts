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

  const usersCollection = db.collection("mmosh-users");

  const user = await usersCollection.findOne({
    sessions: cookie,
  });

  if (!user) return NextResponse.json(null, { status: 200 });

  const pKey = user.privateKey;

  const pKeyDecrypted = btoa(decryptData(pKey));

  return NextResponse.json(
    {
      privateKey: pKeyDecrypted,
      publicKey: user.address,
    },
    { status: 200 },
  );
}
