import { db } from "../../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const collection = db.collection("mmosh-app-ptv");

    const { searchParams } = new URL(req.url);
    const pass = searchParams.get("pass");
  
    const ptvAccount = await collection.findOne(
      {
        pass,
      },
    );
  
    return NextResponse.json(!!ptvAccount, {
      status: 200,
    });
  }
  