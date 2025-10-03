import { db } from "../../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const collection = db.collection("mmosh-app-project");

  const chatsCollection = db.collection("chats");

  const {
    key,
    name,
    symbol,
    image,
    desc,
    price,
    website,
    telegram,
    twitter,
    code,
    privacy,
  } = await req.json();

  const project = await collection.findOne({
    key,
  });

  if (project) {
    await chatsCollection.updateMany(
      {
        "chatAgent.symbol": project.symbol,
      },
      {
        $set: {
          "chatAgent.symbol": symbol,
          "chatAgent.name": name,
          "chatAgent.desc": desc,
        },
      },
    );

    await collection.updateOne(
      {
        _id: project._id,
      },
      {
        $set: {
          name,
          symbol,
          desc,
          image,
          price,
          website,
          telegram,
          twitter,
          code,
          privacy,
        },
      },
    );

    return NextResponse.json("", { status: 200 });
  }
  return NextResponse.json("Stake account not found", { status: 400 });
}
