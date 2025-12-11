import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

interface VerifyOTPBody {
    email: string;
    otp: string;
    currentStep: string;
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
                { status: 400 }
            );
        }

        const { email, otp, currentStep } = validation.data!;

        const collection = db.collection("mmosh-app-visitor");

        const user = await collection.findOne({ email });

        if (!user) {
            return NextResponse.json(
                {
                    status: false,
                    message: "User not found",
                    result: null,
                },
                { status: 404 }
            );
        }

        if (!user.otpHash || !user.expiresAt) {
            return NextResponse.json(
                {
                    status: false,
                    message: "No OTP found for this user",
                    result: null,
                },
                { status: 404 }
            );
        }

        const currentTime = new Date();
        const expirationTime = new Date(user.expiresAt);

        if (currentTime > expirationTime) {
            await collection.deleteOne({ email });

            return NextResponse.json(
                {
                    status: false,
                    message: "OTP has expired. Please request a new one.",
                    result: null,
                },
                { status: 410 }
            );
        }

        const isOTPValid = await bcrypt.compare(otp, user.otpHash);

        if (!isOTPValid) {
            return NextResponse.json(
                {
                    status: false,
                    message: "Invalid OTP",
                    result: null,
                },
                { status: 401 }
            );
        }

        await collection.updateOne(
            { email },
            {
                $set: {
                    status: "profile_incomplete",
                    isVerified: true,
                    currentStep: currentStep || "step3/roles",
                    verifiedAt: new Date(),
                    updatedAt: new Date(),
                },
                $unset: {
                    otpHash: "",
                    expiresAt: "",
                },
            }
        );

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
                { status: 400 }
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
            currentStep: body.currentStep
        },
    };
}