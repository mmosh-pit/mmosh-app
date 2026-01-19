import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { decryptData } from "@/utils/decryptData";

const isString = (v: any) => typeof v === "string";
const isNonEmptyString = (v: any) => isString(v) && v.trim().length > 0;

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(email);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!isNonEmptyString(body.firstName)) {
      return NextResponse.json(
        { status: false, message: "First name is required" },
        { status: 200 }
      );
    }

    if (!isNonEmptyString(body.email) || !isValidEmail(body.email)) {
      return NextResponse.json(
        { status: false, message: "Valid email is required" },
        { status: 200 }
      );
    }

    if (!isNonEmptyString(body.password)) {
      return NextResponse.json(
        { status: false, message: "Password is required" },
        { status: 200 }
      );
    }

    if (!isNonEmptyString(body.currentStep)) {
      return NextResponse.json(
        { status: false, message: "Current step is required" },
        { status: 200 }
      );
    }

    const visitorCollection = db.collection("mmosh-app-early-access");

    const existing = await visitorCollection.findOne({
      email: body.email.toLowerCase().trim(),
    });

    if (existing) {
      return NextResponse.json(
        {
          status: false,
          message: "User with this email already exists",
        },
        { status: 200 }
      );
    }

    const decryptedPassword = decryptData(body.password);
    const passwordHash = await bcrypt.hash(decryptedPassword, 10);

    const doc = {
      firstName: body.firstName.trim(),
      email: body.email.toLowerCase().trim(),
      password: passwordHash,

      hasChecked: body.hasChecked ?? false,
      hasVerifiedEmail: body.hasVerifiedEmail ?? false,
      isMobileNumberVerified: body.isMobileNumberVerified ?? false,

      mobileNumber: body.mobileNumber ?? null,
      countryCode: body.countryCode ?? null,
      country: body.country ?? null,

      mobilePreferences: Array.isArray(body.mobilePreferences)
        ? body.mobilePreferences
        : [],

      referedKinshipCode: body.referedKinshipCode ?? "",
      noCodeChecked: body.noCodeChecked ?? false,
      about: body.about ?? null,

      currentStep: body.currentStep,

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await visitorCollection.insertOne(doc);

    return NextResponse.json(
      {
        status: true,
        message: "Visitor saved successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Visitor save error:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Failed to save visitor",
      },
      { status: 500 }
    );
  }
}
