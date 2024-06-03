import { db } from "../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const tokenCollection = db.collection("mmosh-app-tokens");
  const { name, symbol, desc, image, tokenAddress, bondingAddress } =
    await req.json();

  const token = await tokenCollection.findOne({
    token: tokenAddress,
  });

  if (token) {
    return NextResponse.json("", { status: 200 });
  } else {
    tokenCollection.insertOne({
      name,
      symbol: symbol.toLowerCase(),
      image,
      desc,
      token: tokenAddress,
      bonding: bondingAddress,
      created_date: new Date(),
      updated_date: new Date(),
    });
    return NextResponse.json("", { status: 200 });
  }
}
