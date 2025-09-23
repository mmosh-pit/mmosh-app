import { db } from "../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const collection = db.collection("mmosh-app-staked-history");

    const { wallet, purchaseId } = await req.json();

    const result = await collection.updateMany(
      { purchaseId: purchaseId },
      { $set: { "royalty.$[elem].isUnstaked": true } },
      { arrayFilters: [{ "elem.receiver": wallet }] }
    );
    console.log("----- UPDATE STAKED TOKENS RESULT -----", result);

    return NextResponse.json({
      status: true,
      message: "The amount has been successfully unstaked. Please go ahead and claim the amount.",
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      status: false,
      message: "Something went wrong; please try again later.",
    }, { status: 200 });
  }
}
