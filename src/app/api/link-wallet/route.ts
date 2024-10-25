import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { wallet, appWallet } = await req.json();

  const collection = db.collection("linked-wallets");

  const existingOne = await collection.findOne({ wallet, appWallet });

  if (!existingOne) {
    await collection.insertOne({
      wallet,
      appWallet,
    });
  }

  return NextResponse.json("", { status: 200 });
}
