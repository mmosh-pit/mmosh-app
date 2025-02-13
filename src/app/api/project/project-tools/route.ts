import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const collection = db.collection("mmosh-app-project-tools");

  const { searchParams } = new URL(req.url);

  const project = searchParams.get("project");
  const type = searchParams.get("type");

  if (!project || !type) {
    return NextResponse.json("", { status: 400 });
  }

  const result = await collection
    .find(
      {
        project,
        type,
      },
      {
        projection: {
          "data.handle": 1,
          "data.privacy": 1,
        },
      },
    )
    .toArray();

  return NextResponse.json(result, { status: 200 });
}
