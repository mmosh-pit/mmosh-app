import { db } from "../../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-app-project");

  const {
    name,
    symbol,
    desc,
    image,
    key,
    lut,
    seniority,
    telegram,
    twitter,
    website,
    presalesupply,
    minpresalesupply,
    presalestartdate,
    presaleenddate,
    dexlistingdate,
    price,
    distribution,
    invitationprice,
    discount,
    creator,
    creatorUsername,
  } = await req.json();

  const project = await collection.findOne({
    key: key,
  });

  if (!project) {
    await collection.insertOne({
      name,
      symbol,
      desc,
      image,
      key,
      lut,
      seniority,
      price,
      distribution,
      invitationprice,
      discount,
      telegram,
      twitter,
      website,
      presalesupply,
      minpresalesupply,
      presalestartdate,
      presaleenddate,
      dexlistingdate,
      creator,
      creatorUsername,
      created_date: new Date(),
      updated_date: new Date(),
    });
    return NextResponse.json("", { status: 200 });
  } else {
    return NextResponse.json("", { status: 200 });
  }
}
