import { createCalenderWithMeet } from "@/app/lib/google";
import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { summary, description, startTime, endTime, attendees, isMeetRequired } = await req.json();

        const tokens: any = await db.collection("googleTokens").findOne({});

        const event = await createCalenderWithMeet({tokens, summary, description, startTime, endTime, attendees, isMeetRequired});

        console.log("Created Event:", JSON.stringify(event, null, 2));

        return NextResponse.json({
            status: "success",
            event
        }, { status: 200 });
    } catch (error) {
        console.log(error, "Error creating calendar event");
        return NextResponse.json({
            status: "error",
            message: (error as Error).message
        }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ message: "Google Calendar API Endpoint" });
}