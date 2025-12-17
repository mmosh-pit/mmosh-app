import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const collection = db.collection("mmosh-app-visitor");

    const doc = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(doc);

    return NextResponse.json(
      {
        status: true,
        message: "User created successfully",
        result: { id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { status: false, message: "Failed to create user" },
      { status: 500 }
    );
  }
}
