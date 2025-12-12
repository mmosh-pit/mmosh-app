import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface UserRegistrationBody {
    firstName: string;
    email: string;
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

        const { firstName, email } = validation.data!;

        const collection = db.collection("mmosh-app-visitor");
        const existingUser = await collection.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                {
                    status: false,
                    message: "User with this email already exists",
                    result: null,
                },
                { status: 409 }
            );
        }

        // Generate OTP
        const otp = generateSecureOTP();
        const hashedOTP = await bcrypt.hash(otp, 10);

        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        // Insert user
        const userDocument = {
            firstName,
            email,
            status: "pending_email_verification",
            otpHash: hashedOTP,
            roles: [],
            mobilePreference: [],
            intent: [],
            contactPreference: [],
            currentStep: "catfawn/step2",
            mobileNumber: null,
            telegramUsername: null,
            blueskyHandle: null,
            linkedinProfile: null,
            referedKinshipCode: null,
            kinshipCode: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            expiresAt,
        };

        const result = await collection.insertOne(userDocument);

        // Send OTP Email via Mailjet
        await sendCodeEmail(email, otp);

        return NextResponse.json(
            {
                status: true,
                message: "User registered successfully. OTP sent to email.",
                result: {
                    userId: result.insertedId,
                    email,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in registration:", error);

        return NextResponse.json(
            { status: false, message: "Internal server error", result: null },
            { status: 500 }
        );
    }
}

async function sendCodeEmail(email: string, code: string) {
    const msg = {
        to: email,
        from: {
            email: "security@kinshipbots.com",
            name: "CatFawn Connection",
        },
        subject: "Your Verification Code",
        html: `
      Hey there,<br /><br />
      Here is your verification code to complete your early access registration:<br /><br />
      <strong style="font-size: 22px; letter-spacing: 3px;">${code}</strong><br /><br />
      This code is valid for the next 15 minutes.<br /><br />
      Thank you for joining the CatFawn Connection Early Access Circle!<br /><br />
      Warm regards,<br />
      <strong>CatFawn Team</strong>
    `,
    };

    await sgMail.send(msg);
}

function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function generateSecureOTP(): string {
    const buffer = crypto.randomBytes(6);
    const randomNumber = buffer.readUInt32BE(0);
    return ((randomNumber % 900000) + 100000).toString();
}

function validateRequestBody(body: any): {
    isValid: boolean;
    errors: string[];
    data?: UserRegistrationBody;
} {
    const errors: string[] = [];

    if (!body.firstName || typeof body.firstName !== "string") {
        errors.push("firstName is required and must be a string");
    } else if (body.firstName.trim().length < 2) {
        errors.push("firstName must be at least 2 characters long");
    }

    if (!body.email || typeof body.email !== "string") {
        errors.push("email is required and must be a string");
    } else if (!isValidEmail(body.email)) {
        errors.push("email must be valid");
    }

    if (errors.length) return { isValid: false, errors };

    return {
        isValid: true,
        errors: [],
        data: {
            firstName: body.firstName.trim(),
            email: body.email.trim().toLowerCase(),
        },
    };
}
