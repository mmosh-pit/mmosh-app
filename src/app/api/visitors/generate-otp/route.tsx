import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";
import twilio from "twilio";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

type OTPType = "email" | "sms";

interface GenerateOTPBody {
  type: OTPType;
  email?: string;
  mobile?: string;
  countryCode?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = validateRequestBody(body);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          status: false,
          message: validation.errors[0],
          errors: validation.errors,
          result: null,
        },
        { status: 200 }
      );
    }

    const { type, email, mobile, countryCode } = validation.data!;

    const visitorCollection = db.collection("mmosh-app-visitor");

    if (type === "email") {
      const existingEmail = await visitorCollection.findOne({ email });
      if (existingEmail) {
        return NextResponse.json(
          {
            status: false,
            message: "Email already exists",
            result: null,
          },
          { status: 200 }
        );
      }
    }

    if (type === "sms") {
      const existingMobile = await visitorCollection.findOne({
        mobileNumber: mobile,
      });
      if (existingMobile) {
        return NextResponse.json(
          {
            status: false,
            message: "Mobile number already exists",
            result: null,
          },
          { status: 200 }
        );
      }
    }

    const otp = generateSecureOTP();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const otpCollection = db.collection("mmosh-users-email-verification");

    const existingOTP = await otpCollection.findOne({ email });

    if (existingOTP?.expiresAt) {
      const now = new Date();
      const expiresAt = new Date(existingOTP.expiresAt);

      if (now < expiresAt) {
        return NextResponse.json(
          {
            status: true,
            message:
              type === "email"
                ? "OTP already sent. Please check your email."
                : "OTP already sent. Please check your phone message.",
            result: {
              destination: type === "email" ? email : mobile,
              expiresInMinutes: Math.ceil(
                (expiresAt.getTime() - now.getTime()) / (60 * 1000)
              ),
            },
          },
          { status: 200 }
        );
      }
    }

    if (type === "email") {
      await sendOTPEmail(email!, otp);

      await otpCollection.updateOne(
        { email },
        {
          $set: {
            otpHash,
            expiresAt,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            email,
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
    }

    if (type === "sms") {
      const sent = await sendOTPSMS(mobile!, otp, countryCode!);
      if (!sent) {
        return NextResponse.json(
          {
            status: false,
            message: "Failed to send OTP via SMS",
            result: null,
          },
          { status: 200 }
        );
      }

      await otpCollection.updateOne(
        { email },
        {
          $set: {
            otpHash,
            expiresAt,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            email,
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
    }

    return NextResponse.json(
      {
        status: true,
        message: `OTP sent successfully via ${type}`,
        result: {
          destination: type === "email" ? email : mobile,
          expiresInMinutes: 15,
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

async function sendOTPEmail(email: string, otp: string) {
  await sgMail.send({
    to: email,
    from: {
      email: "security@kinshipbots.com",
      name: "CatFawn Connection",
    },
    subject: "Your Verification Code",
    html: `
      Hello,<br /><br />
      Your verification code is:<br /><br />
      <strong style="font-size:22px;letter-spacing:3px;">${otp}</strong><br /><br />
      This code is valid for 15 minutes.<br /><br />
      — CatFawn Team
    `,
  });
}

async function sendOTPSMS(mobile: string, otp: string, countryCode: string) {
  try {
    await twilioClient.messages.create({
      body: `Your CatFawn Connection verification code is ${otp}. It expires in 15 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: `+${countryCode}${mobile}`,
    });
    return true;
  } catch (error) {
    console.error("Twilio SMS Error:", error);
    return false;
  }
}

function generateSecureOTP(): string {
  const buffer = crypto.randomBytes(6);
  const randomNumber = buffer.readUInt32BE(0);
  return ((randomNumber % 900000) + 100000).toString();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.com$/i.test(email);
}

function isValidCountryCode(code: string): boolean {
  return /^[1-9][0-9]{0,3}$/.test(code);
}

function isValidMobile(mobile: string): boolean {
  return /^[1-9][0-9]{5,14}$/.test(mobile);
}

function validateRequestBody(body: any): {
  isValid: boolean;
  errors: string[];
  data?: GenerateOTPBody;
} {
  const errors: string[] = [];

  if (!body.type || !["email", "sms"].includes(body.type)) {
    errors.push("type must be either 'email' or 'sms'");
  }

  if (body.type === "email") {
    if (!body.email || typeof body.email !== "string") {
      errors.push("email is required and must be a string");
    } else if (!isValidEmail(body.email)) {
      errors.push("email must be valid");
    }
  }

  if (body.type === "sms") {
    if (!body.countryCode || typeof body.countryCode !== "string") {
      errors.push("CountryCode is required and must be a string");
    } else if (!isValidCountryCode(body.countryCode.trim())) {
      errors.push("Country code must be valid");
    }

    if (!body.mobile || typeof body.mobile !== "string") {
      errors.push("Mobile is required and must be a string");
    } else if (!isValidMobile(body.mobile.trim())) {
      errors.push("Mobile number must be valid");
    }
  }

  if (errors.length) return { isValid: false, errors };

  return {
    isValid: true,
    errors: [],
    data: {
      type: body.type,
      email: body.email?.trim().toLowerCase(),
      mobile: body.mobile?.trim(),
      countryCode: body.countryCode?.trim(),
    },
  };
}
