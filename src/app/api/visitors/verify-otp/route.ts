import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

interface VerifyOTPBody {
    email: string;
    otp: string;
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

        const { email, otp } = validation.data!;

        const collection = db.collection("mmosh-users-email-verification");

        const record = await collection.findOne({ email });

        if (!record) {
            return NextResponse.json(
                {
                    status: false,
                    message: "OTP not found",
                    result: null,
                },
                { status: 200 }
            );
        }

        if (!record.otpHash || !record.expiresAt) {
            await collection.deleteOne({ email });

            return NextResponse.json(
                {
                    status: false,
                    message: "OTP data is invalid or missing",
                    result: null,
                },
                { status: 200 }
            );
        }

        const now = new Date();
        const expiresAt = new Date(record.expiresAt);

        if (now > expiresAt) {
            await collection.deleteOne({ email });

            return NextResponse.json(
                {
                    status: false,
                    message: "OTP has expired. Please request a new one.",
                    result: null,
                },
                { status: 200 }
            );
        }

        const isOTPValid = await bcrypt.compare(otp, record.otpHash);

        if (!isOTPValid) {
            return NextResponse.json(
                {
                    status: false,
                    message: "Invalid OTP",
                    result: null,
                },
                { status: 200 }
            );
        }
        await collection.deleteOne({ email });

        return NextResponse.json(
            {
                status: true,
                message: "OTP verified successfully",
                result: {
                    email,
                    isVerified: true,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof SyntaxError) {
            return NextResponse.json(
                {
                    status: false,
                    message: "Invalid JSON format",
                    result: null,
                },
                { status: 200 }
            );
        }
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

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateRequestBody(body: any): {
    isValid: boolean;
    errors: string[];
    data?: VerifyOTPBody;
} {
    const errors: string[] = [];

    if (!body.email || typeof body.email !== "string") {
        errors.push("email is required and must be a string");
    } else if (!isValidEmail(body.email)) {
        errors.push("email must be valid");
    }

    if (!body.otp || typeof body.otp !== "string") {
        errors.push("otp is required and must be a string");
    } else if (!/^\d{6}$/.test(body.otp)) {
        errors.push("otp must be a 6-digit number");
    }

    if (errors.length) return { isValid: false, errors };

    return {
        isValid: true,
        errors: [],
        data: {
            email: body.email.trim().toLowerCase(),
            otp: body.otp.trim(),
        },
    };
}
