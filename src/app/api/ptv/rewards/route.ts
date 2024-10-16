import { db } from "../../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const collection = db.collection("mmosh-app-ptv");

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const wallet = searchParams.get("wallet");

  const ptvData = await collection.findOne({
    wallet,
  });

  let claimable = 0;
  let unstakable = 0;
  let unstaked = 0;
  let total = 0;
  let swapped = 0;
  if (ptvData) {
    if (type?.toLocaleLowerCase() === "blue") {
      claimable = ptvData.bluereward - ptvData.blueswapped;
      unstakable = ptvData.blueavailable;
      unstaked = ptvData.blueclaimed;
      total = ptvData.bluereward - ptvData.blueswapped + ptvData.blueavailable;
      swapped = ptvData.blueswapped;
    } else {
      claimable = ptvData.redreward - ptvData.redswapped;
      unstakable = ptvData.redavailable;
      total = ptvData.redreward - ptvData.redswapped + ptvData.redavailable;
      unstaked = ptvData.redclaimed;
      swapped = ptvData.redswapped;
    }
  }

  let claimField = "$redclaimed";
  let availableField = "$redavailable";
  let rewardField = "$redreward";

  if (type?.toLocaleLowerCase() === "blue") {
    claimField = "$blueclaimed";
    availableField = "$blueavailable";
    rewardField = "$bluereward";
  }

  const claimTotal = await collection
    .aggregate([{ $group: { _id: null, sum: { $sum: claimField } } }])
    .toArray();

  const rewardTotal = await collection
    .aggregate([{ $group: { _id: null, sum: { $sum: rewardField } } }])
    .toArray();

  const availableTotal = await collection
    .aggregate([{ $group: { _id: null, sum: { $sum: availableField } } }])
    .toArray();

  return NextResponse.json(
    {
      totalclaim: claimTotal[0]?.sum || 0,
      totalunclaimed:
        (rewardTotal[0]?.sum || 0) - (availableTotal[0]?.sum || 0),
      totalavailable: rewardTotal[0]?.sum || 0,
      claimable: claimable,
      unstakable: unstakable,
      total: total,
      unstaked: unstaked,
      swapped,
    },
    {
      status: 200,
    },
  );
}
