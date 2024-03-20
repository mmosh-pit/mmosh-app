import { decryptData } from "@/app/lib/decryptData";
import { db } from "../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const collection = db.collection("users");

  const { searchParams } = new URL(req.url);
  const param = searchParams.get("id");

  if (!param) {
    return NextResponse.json("Invalid Request", { status: 400 });
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
