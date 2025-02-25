import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const collection = db.collection("mmosh-app-project");

  const data = await req.json();

  await collection.updateOne(
    {
      key: data.project,
    },
    {
      $set: {
        system_prompt: data.systemPrompt,
      },
    },
  );

  return NextResponse.json("", { status: 200 });
}
