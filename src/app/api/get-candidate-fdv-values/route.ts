import { db } from "@/app/lib/mongoClient";
import { Sort } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const collection = db.collection("mmosh-app-project-tokens");
  const directoryCollection = db.collection("mmosh-app-project-directory");

  const { searchParams } = new URL(req.url);

  const candidateId = searchParams.get("candidate") as string;

  const tokenForResults = await collection
    .find({
      "candidate.CANDIDATE_ID": candidateId,
      position: "for",
    })
    .toArray();

  const tokenAgainstResults = await collection
    .find({
      "candidate.CANDIDATE_ID": candidateId,
      position: "against",
    })
    .toArray();

  const d = new Date();
  const filterDate = new Date(d.setDate(d.getDate() - 1));

  let forResult = 0;
  let againstResult = 0;

  const highestForCoin = {
    address: "---",
    amount: 0,
    name: "---",
    symbol: "---",
  };

  for (let index = 0; index < tokenForResults.length; index++) {
    const element = tokenForResults[index];

    // total volume calculation
    const volumeresult = await directoryCollection
      .aggregate([
        {
          $match: {
            bonding: element.bonding,
            created_date: { $gte: filterDate },
          },
        },
        {
          $group: {
            _id: {},
            totalAmount: { $sum: "$value" },
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();
    let totalVolume = 0;
    for (let index = 0; index < volumeresult.length; index++) {
      const volumeelement = volumeresult[index];
      totalVolume = volumeelement.totalAmount;
    }

    const priceSortFilter: Sort = {
      created_date: 1,
    };

    const onehourResult2 = await directoryCollection
      .find({
        bonding: element.bonding,
      })
      .sort(priceSortFilter)
      .limit(1)
      .toArray();

    let oneHourPriceEnd = 0;
    for (let index = 0; index < onehourResult2.length; index++) {
      const volumeelement = onehourResult2[index];
      oneHourPriceEnd = volumeelement.price;
    }

    const result = totalVolume * oneHourPriceEnd;

    if (result > highestForCoin.amount) {
      highestForCoin.amount = result;
      highestForCoin.name = element.name;
      highestForCoin.symbol = element.symbol;
      highestForCoin.address = element.address;
    }

    forResult += result;
  }

  for (let index = 0; index < tokenAgainstResults.length; index++) {
    const element = tokenAgainstResults[index];

    // total volume calculation
    const volumeresult = await directoryCollection
      .aggregate([
        {
          $match: {
            bonding: element.bonding,
            created_date: { $gte: filterDate },
          },
        },
        {
          $group: {
            _id: {},
            totalAmount: { $sum: "$value" },
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();
    let totalVolume = 0;
    for (let index = 0; index < volumeresult.length; index++) {
      const volumeelement = volumeresult[index];
      totalVolume = volumeelement.totalAmount;
    }

    const priceSortFilter: Sort = {
      created_date: 1,
    };

    const onehourResult2 = await directoryCollection
      .find({
        bonding: element.bonding,
      })
      .sort(priceSortFilter)
      .limit(1)
      .toArray();

    let oneHourPriceEnd = 0;
    for (let index = 0; index < onehourResult2.length; index++) {
      const volumeelement = onehourResult2[index];
      oneHourPriceEnd = volumeelement.price;
    }

    againstResult += totalVolume * oneHourPriceEnd;
  }

  return NextResponse.json({
    againstResult,
    forResult,
    total: againstResult + forResult,
    coin: highestForCoin,
  });
}
