import { db } from "../../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const collection = db.collection("mmosh-app-project-media");

  const { file, projectkey } = await req.json();

  await collection.updateOne(
    {
      projectkey,
      "media.name": file.name,
    },
    {
      $set: {
        "media.isPrivate": file.isPrivate,
      },
    },
  );

  return NextResponse.json("", { status: 200 });
}
