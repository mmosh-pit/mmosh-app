import axios from "axios";
import { db } from "../../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";
import { web3Consts } from "@/anchor/web3Consts";

export async function GET(req: NextRequest) {
    const collection = db.collection("mmosh-app-token-price");

    const { searchParams } = new URL(req.url);
    let price = 0;
    try {
        const key = searchParams.get("key")
        console.log("key", key)
        let priceresult = await collection.find({key: key}).limit(1).sort({ created_date: -1 }).toArray()
        console.log("key", priceresult)
        if(priceresult.length > 0) {
            price = priceresult[0].price
        }
        return NextResponse.json({
            price: price,
        },
            {
              status: 200,
            },
        );
    } catch (error) {
        console.log("error ", error)
        return NextResponse.json({
            price: price,
        },
            {
              status: 200,
            },
        );
    }

}
