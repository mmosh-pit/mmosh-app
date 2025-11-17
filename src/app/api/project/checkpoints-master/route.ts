import { NextRequest, NextResponse } from "next/server";
import { CheckpointMasterRequest, CheckpointMasterEntry } from "@/app/types/checkpoints-master";

import { db } from "@/app/lib/mongoClient";

export async function GET() {
  try {
    const collection = db.collection("checkpoints_master");

    // 1️⃣ Fetch all items
    const data = await collection.find({}).toArray();

    // group by type, include _id as string on each category item
    const grouped: Record<
      string,
      { _id: string; category: string; tags: string[] }[]
    > = {};

    data.forEach(item => {
      if (!grouped[item.type]) {
        grouped[item.type] = [];
      }
      
      grouped[item.type].push({
        _id: String(item._id), 
        category: item.category,
        tags: item.tags
      });
    });

    // 3️⃣ Convert into UI-friendly array
    const result = Object.keys(grouped).map(type => ({
      type,
      categories: grouped[type]
    }));

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body: CheckpointMasterRequest = await req.json();
    const collection = db.collection("checkpoints_master");

        // Handle ARRAY payload
    if (Array.isArray(body)) {
      for (const entry of body) {
        const { type, category, tags } = entry;

        if (!type || !category || !Array.isArray(tags)) {
          return NextResponse.json({ success: false, message: "Invalid entry format in array" }, { status: 400 });
        }

        // 🔥 Merge or insert
        await collection.updateOne(
          { type, category },
          { 
            $addToSet: { tags: { $each: tags } }, $setOnInsert: { created_at: new Date() },
            $set: { updated_at: new Date() }
          },
          { upsert: true }
        );
      }

      return NextResponse.json({ success: true, message: "Batch processed successfully" });
    }

    // Otherwise → Expect single object insertOne
    const { type, category, tags } = body;

    if (!type || !category || !Array.isArray(tags)) {
      return NextResponse.json(
        { success: false, message: "type, category, and tags[] are required" },
        { status: 400 }
      );
    }

    // 🔥 Merge or insert
    const result = await collection.updateOne(
      { type, category },
      { 
        $addToSet: { tags: { $each: tags } }, $setOnInsert: { created_at: new Date() },
        $set: { updated_at: new Date() },  
    },
      { upsert: true }
    );

    return NextResponse.json({ success: true, upserted: result.upsertedId ?? null });

  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ success: false, message: "Failed to insert data" }, { status: 500 });
  }
}
