import { db } from "../../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const collection = db.collection("mmosh-app-project");

  const { id, presalediscount } = await req.json();
  const result = await collection.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        presalediscount,
      },
    },
  );
  console.log("===== API RESULT =====", result);
  return NextResponse.json("", { status: 200 });
  return NextResponse.json("Stake account not found", { status: 400 });
}