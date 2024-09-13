import { db } from "../../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { type, address, method, value, wallet } = await req.json();
    const collection = db.collection("mmosh-app-ptv");

    const ptvData = await collection.findOne(
        {
          wallet
        },
    );

    if(ptvData) {
        if(method === "buy") {
            let swapped = 0;
            let available = 0;
            if(type === "Blue" ) {
                if((ptvData.bluereward - ptvData.blueswapped) > value) {
                    swapped = ptvData.blueswapped + value
                    available = ptvData.blueavailable
                } else {
                    let remainswapped = (value - (ptvData.bluereward - ptvData.blueswapped))
                    swapped =  ptvData.blueswapped + remainswapped
                    available = ptvData.blueavailable - (value - remainswapped)
                }
                await collection.updateOne(
                    {
                      _id: ptvData._id,
                    },
                    {
                      $set: {
                        blueavailable: available,
                        blueswapped: swapped,
                      },
                    },
                );
            } else {
                if((ptvData.redreward - ptvData.redswapped) > value) {
                    available = ptvData.redavailable
                    swapped = ptvData.redswapped + value
                } else {
                    let remainswapped = (value - (ptvData.redreward - ptvData.redswapped))
                    swapped =  ptvData.redswapped + remainswapped
                    available = ptvData.redavailable - (value - remainswapped)
                }
                await collection.updateOne(
                    {
                      _id: ptvData._id,
                    },
                    {
                      $set: {
                        redavailable: available,
                        redswapped: swapped,
                      },
                    },
                );
            }

        } else {
            let available = 0;
            if(type === "Blue" ) {
                available = ptvData.blueavailable + value
                await collection.updateOne(
                    {
                      _id: ptvData._id,
                    },
                    {
                      $set: {
                        blueavailable: available,
                      },
                    },
                );
            } else {
                available = ptvData.redavailable + value
                await collection.updateOne(
                    {
                      _id: ptvData._id,
                    },
                    {
                      $set: {
                        redavailable: available,
                      },
                    },
                );
            }
        }
    }
    return NextResponse.json("", { status: 200 });
}