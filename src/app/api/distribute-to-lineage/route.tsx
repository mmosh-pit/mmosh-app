import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";
import { getLineage } from "@/app/lib/forge/createProfile";

export async function POST(req: NextRequest) {
  // const authHeader = req.headers.get("authorization");
  const collection = db.collection("mmosh-app-staked-history");
  const userCollection = db.collection("mmosh-users");
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
  const user = await userCollection.findOne({
    wallet: userAddeess,
  });
  if (!user) {
    return NextResponse.json(
      {
        status: false,
        message: "User not found.",
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
    // {
    //   receiver: process.env.NEXT_PUBLIC_PTV_WALLET_KEY,
    //   amount: cost * (25 / 100),
    //   isClaimed: false,
    // },
    {
      receiver: lineage.parent,
      amount: cost * (20 / 100),
      isClaimed: false,
      isUnstaked: false,
    },
    {
      receiver: lineage.gparent,
      amount: cost * (10 / 100),
      isClaimed: false,
      isUnstaked: false,
    },
    {
      receiver: lineage.ggparent,
      amount: cost * (3 / 100),
      isClaimed: false,
      isUnstaked: false,
    },
    {
      receiver: lineage.gggparent,
      amount: cost * (2 / 100),
      isClaimed: false,
      isUnstaked: false,
    },
  ];
  const ninetyDaysInMs = 90 * 24 * 60 * 60 * 1000;
  await collection.insertOne({
    category: "royalties",
    stakedAmount: stakedAmount,
    unStakedAmount: 0,
    purchaseId: purchaseId,
    wallet: userAddeess,
    royalty: royalty,
    created_date: Date.now() + ninetyDaysInMs,
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
