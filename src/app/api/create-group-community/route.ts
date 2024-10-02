import { db } from "@/app/lib/mongoClient";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-app-group-community");

  const data = await req.json();

  await collection.insertOne(data);
}
