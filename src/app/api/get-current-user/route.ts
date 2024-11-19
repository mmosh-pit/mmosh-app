import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { db } from "@/app/lib/mongoClient";

export async function GET(req: NextRequest) {
  const collection = db.collection("mmosh-users");

  const cookieStore = cookies();

  const session = cookieStore.get("session");

  if (session === null) {
    return NextResponse.json(false);
  }

  const user = await collection.findOne({
    sessions: session?.value,
  });

  return NextResponse.json(user);
}
