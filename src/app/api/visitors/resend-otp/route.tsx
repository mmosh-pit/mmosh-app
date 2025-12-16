import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

import twilio from "twilio";
const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER!;
const client = twilio(accountSid, authToken);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, type } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { status: false, message: "Email is required" },
        { status: 400 }
      );
    }

    if (!["email", "sms"].includes(type)) {
      return NextResponse.json(
        { status: false, message: "Invalid type. Must be 'email' or 'sms'." },
        { status: 400 }
      );
    }

    const collection = db.collection("mmosh-app-visitor");
    const user = await collection.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { status: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (type === "sms" && !user.mobileNumber) {
      return NextResponse.json(
        { status: false, message: "Mobile number not found for this user." },
        { status: 400 }
      );
    }

    const otp = generateSecureOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await collection.updateOne(
      { email },
      {
        $set: {
          otpHash: hashedOTP,
          expiresAt,
          updatedAt: new Date(),
        },
      }
    );

    let sent = false;
    if (type === "email") {
      sent = await sendEmailOTP(email, otp);
    } else if (type === "sms") {
      sent = await sendSMS(user.mobileNumber, otp);
    }

    if (!sent) {
      return NextResponse.json(
        {
          status: false,
          message: `Failed to send OTP via ${type}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        status: true,
        message: `OTP sent successfully via ${type}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend OTP Error:", error);
    return NextResponse.json(
      { status: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateSecureOTP(): string {
  const buffer = crypto.randomBytes(4);
  const num = buffer.readUInt32BE(0);
  return ((num % 900000) + 100000).toString();
}

async function sendEmailOTP(email: string, otp: string) {
  try {
    const msg = {
      to: email,
      from: {
        email: "security@kinshipbots.com",
        name: "CatFawn Connection",
      },
      subject: "Your Verification Code",
      html: `
        Hey there,<br /><br />
        Here is your verification code:<br /><br />
        <strong style="font-size: 22px; letter-spacing: 3px;">${otp}</strong><br /><br />
        This code is valid for the next 15 minutes.<br /><br />
        Warm regards,<br />
        <strong>CatFawn Team</strong>
      `,
    };

    await sgMail.send(msg);
    return true;
  } catch (err) {
    console.error("SendGrid error:", err);
    return false;
  }
}

async function sendSMS(to: string, otp: string) {
  try {
    const message = await client.messages.create({
      body: `Your CatFawn Connection verification code is: ${otp}. It expires in 15 minutes.`,
      from: twilioNumber,
      to: `+91${to}`,
    });

    console.log("SMS sent:", message.sid);
    return true;
  } catch (error) {
    console.error("Twilio SMS Error:", error);
    return false;
  }
}
