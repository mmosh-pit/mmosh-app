import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const collection = db.collection("mmosh-app-transaction-history");
        const { searchParams } = new URL(req.url);

        const wallet = searchParams.get("wallet");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        const skip = (page - 1) * limit;
        const total = await collection.countDocuments({ wallet: wallet });
        const transactions = await collection.find({ wallet: wallet }).sort({ updated_date: -1 }).skip(skip).limit(limit).toArray();

        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return NextResponse.json(
            {
                status: true,
                message: "Transaction history retrieved successfully",
                result: {
                    transactions,
                    pagination: {
                        current: page,
                        total: totalPages,
                        hasNext: hasNextPage,
                        hasPrev: hasPrevPage,
                        count: transactions.length,
                        totalRecords: total
                    }
                },
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                status: false,
                message: "Internal server error",
                result: null,
            },
            { status: 500 }
        );
    }
}