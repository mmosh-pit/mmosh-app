import { db } from "@/app/lib/mongoClient";
import { AtpAgent } from "@atproto/api";
import { NextRequest, NextResponse } from "next/server";

const agent = new AtpAgent({
  service: "https://bsky.social/xrpc/com.atproto.server.createSession",
});

export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-app-project-tools");

  const data = await req.json();

  if (data.type === "bsky") {
    const existing = await collection.findOne({
      "data.handle": data.data.handle,
    });

    if (existing !== null) {
      return NextResponse.json("bsky-exists", { status: 400 });
    }

    try {
      const res = await agent.login({
        identifier: data.data.handle,
        password: data.data.password,
      });

      if (!res.success) {
        return NextResponse.json("invalid-bsky", { status: 400 });
      }
    } catch (err) {
      console.log("Got err bsky: ", err);
      return NextResponse.json("invalid-bsky", { status: 400 });
    }
  }

  await collection.insertOne(data);

  return NextResponse.json("", { status: 202 });
}
