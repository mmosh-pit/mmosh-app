import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

interface HasValidCodeBody {
    code: string;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const validation = validateRequestBody(body);
        if (!validation.isValid) {
            return NextResponse.json(
                {
                    status: false,
                    message: "Validation failed",
                    errors: validation.errors,
                    result: null,
                },
                { status: 200 }
            );
        }

        const { code } = validation.data!;

        const collection = db.collection("mmosh-app-visitor");

        const existingCode = await collection.findOne({
            kinshipCode: code,
        });

        return NextResponse.json(
            {
                status: true,
                result: {
                    exists: !!existingCode,
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

function validateRequestBody(body: any): {
    isValid: boolean;
    errors: string[];
    data?: HasValidCodeBody;
} {
    const errors: string[] = [];

    if (!body.code || typeof body.code !== "string") {
        errors.push("code is required and must be a string");
    } else if (body.code.trim().length !== 6) {
        errors.push("code must be a 6-character string");
    }

    if (errors.length) {
        return { isValid: false, errors };
    }

    return {
        isValid: true,
        errors: [],
        data: {
            code: body.code.trim(),
        },
    };
}
