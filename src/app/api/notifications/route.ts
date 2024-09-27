import { NextRequest, NextResponse } from "next/server";
import { db } from "../../lib/mongoClient";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get("wallet");

  const unreadNotification = await db
  .collection("mmosh-app-notifications")
  .find(
    {
      receiver: wallet,
      unread: 1
    }
  )
  .toArray();
  let match = {$match: {receiver: wallet}};
  const notifications = await db
    .collection("mmosh-app-notifications")
    .aggregate([
     match,
      {
        $lookup: {
          from: "mmosh-app-profiles",
          localField: "receiver",
          foreignField: "wallet",
          as: "receiver",
        },
      },
      {
        $lookup: {
          from: "mmosh-app-profiles",
          localField: "sender",
          foreignField: "wallet",
          as: "sender",
        },
      },
      {
        $project: {
          type: 1,
          message: 1,
          unread: 1,
          created_date: 1,
          receiver: "$receiver",
          sender: "$sender",
        },
      },
      {$sort: {created_date: -1}},
    ])
    .limit(unreadNotification.length > 100 ? unreadNotification.length : 100)
    .toArray();
    return NextResponse.json({
       unread: unreadNotification.length,
       data: notifications
    }, {
       status: 200,
    });
}
