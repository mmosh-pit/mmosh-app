import { NextRequest, NextResponse } from "next/server";

import { AtpAgent } from "@atproto/api";

import { db } from "@/app/lib/mongoClient";
import { cookies } from "next/headers";

const agent = new AtpAgent({
  service: "https://bsky.social",
});

export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-users");

  const data = await req.json();

  const handle = data.handle;
  const password = data.password;

  const res = await agent.login({ identifier: handle, password: password });

  const cookie = cookies().get("session")?.value;

  const user = await collection.findOne({
    sessions: cookie,
  });

  await agent.follow(process.env.KINSHIP_ACC_DID!);

  await agent.login({
    identifier: process.env.KINSHIP_ACC_HANDLE!,
    password: process.env.KINSHIP_ACC_PASSWORD!,
  });

  await agent.follow(res.data.did);

  await collection.updateOne(
    {
      _id: user?._id,
    },
    {
      $set: {
        bsky: {
          id: res.data.did,
          handle: handle,
          token: res.data.accessJwt,
          refreshToken: res.data.refreshJwt,
        },
      },
    },
  );

  return NextResponse.json("");
}
