import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

const isString = (v: any) => typeof v === "string";
const isNonEmptyString = (v: any) => isString(v) && v.trim().length > 0;
const isArray = (v: any) => Array.isArray(v);
const isObject = (v: any) =>
  v !== null && typeof v === "object" && !Array.isArray(v);

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.com$/i.test(email);

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const errors: Record<string, string> = {};

    if (!isNonEmptyString(body.email) || !isValidEmail(body.email)) {
      errors.email = "Valid email is required";
    }

    if (!isNonEmptyString(body.firstName)) {
      errors.firstName = "First name is required";
    }

    if (!isNonEmptyString(body.password) || body.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!isNonEmptyString(body.currentStep)) {
      errors.currentStep = "Current step is required";
    }

    if (body.roles && !isArray(body.roles)) {
      errors.roles = "Roles must be an array";
    }

    if (body.intent && !isArray(body.intent)) {
      errors.intent = "Intent must be an array";
    }

    if (body.likertAnswers && !isObject(body.likertAnswers)) {
      errors.likertAnswers = "Likert answers must be an object";
    }

    if (body.avatarUrl && !isValidUrl(body.avatarUrl)) {
      errors.avatarUrl = "Avatar URL must be valid";
    }

    if (body.web && !isValidUrl(body.web)) {
      errors.web = "Website URL must be valid";
    }

    if (body.mobileNumber && !isString(body.mobileNumber)) {
      errors.mobileNumber = "Mobile number must be a string";
    }

    if (body.countryCode && !isString(body.countryCode)) {
      errors.countryCode = "Country code must be a string";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          status: false,
          message: "Validation failed",
          errors,
        },
        { status: 200 }
      );
    }

    const collection = db.collection("mmosh-app-visitor");

    const existingUser = await collection.findOne({
      email: body.email.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        {
          status: false,
          message: "User with this email already exists",
        },
        { status: 200 }
      );
    }

    const doc = {
      ...body,
      email: body.email.toLowerCase().trim(),
      firstName: body.firstName.trim(),
      lastName: isString(body.lastName) ? body.lastName.trim() : "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(doc);

    return NextResponse.json(
      {
        status: true,
        message: "Visitor saved successfully",
        result: {
          id: result.insertedId,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        status: false,
        message: "Failed to save visitor",
      },
      { status: 500 }
    );
  }
}
