import { db } from "../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const usersCollection = db.collection("mmosh-users");

  const { wallet } = await req.json();

  const result = await usersCollection.updateOne(
    { wallet },
    { $set: { updated_date: new Date() } }
  );

  return NextResponse.json("", { status: 200 });
}
