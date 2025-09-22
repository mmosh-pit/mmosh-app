import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";
import { getLineage } from "@/app/lib/forge/createProfile";

export async function POST(req: NextRequest) {
  // const authHeader = req.headers.get("authorization");
  const collection = db.collection("mmosh-app-staked-history");
  const { stakedAmount, userAddeess, purchaseId } = await req.json();
  if (!stakedAmount || !userAddeess || !purchaseId) {
    return NextResponse.json(
      {
        status: false,
        message: "All params are required.",
        result: null,
      },
      { status: 400 }
    );
  }
  const stakedHistory = await collection.findOne({ purchaseId: purchaseId });

  if (stakedHistory !== null) {
    return NextResponse.json(
      {
        status: false,
        message: "Purchase ID already exists.",
        result: null,
      },
      { status: 400 }
    );
  }

  let cost = (stakedAmount * 10 ** 6 * 85) / 100;
  let lineage = await getLineage(userAddeess);
  const royalty = [
    {
      receiver: process.env.NEXT_PUBLIC_PTV_WALLET_KEY,
      amount: cost * (25 / 100),
    },
    {
      receiver: lineage.parent,
      amount: cost * (20 / 100),
    },
    {
      receiver: lineage.gparent,
      amount: cost * (10 / 100),
    },
    {
      receiver: lineage.ggparent,
      amount: cost * (3 / 100),
    },
    {
      receiver: lineage.gggparent,
      amount: cost * (2 / 100),
    },
  ];
  await collection.insertOne({
    category: "royalties",
    stakedAmount: stakedAmount,
    unStakedAmount: 0,
    purchaseId: purchaseId,
    wallet: userAddeess,
    royalty: royalty,
    created_date: Date.now(),
  });
  return NextResponse.json(
    {
      status: true,
      message: "Funds successfully disbursed to lineage",
      result: "",
    },
    { status: 200 }
  );
}
