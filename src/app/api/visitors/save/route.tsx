import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { decryptData } from "@/utils/decryptData";

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

    const errors: string[] = [];

    if (!isNonEmptyString(body.firstName)) {
      errors.push("First name is required");
    }

    if (!isNonEmptyString(body.email) || !isValidEmail(body.email)) {
      errors.push("Valid email is required");
    }

    if (!isNonEmptyString(body.password)) {
      errors.push("Password is required");
    }

    if (!isNonEmptyString(body.password) || body.password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }

    if (!isNonEmptyString(body.currentStep)) {
      errors.push("Current step is required");
    }

    if (!body.roles){
      errors.push("Roles is required")
    }

    if (body.roles && !isArray(body.roles)) {
      errors.push("Roles must be an array");
    }

    if (!body.intent){
      errors.push("Intent is required")
    }

    if (body.intent && !isArray(body.intent)) {
      errors.push("Intent must be an array");
    }

    if (!body.likertAnswers ||  Object.keys(body.likertAnswers).length < 48){
      errors.push("Please rate all the questions in step5")
    }

    if (!body.challenges){
      errors.push("Challenges is required")
    }

    if (body.challenges.length < 3){
      errors.push("Please select atleast 3 challenges")
    }

    if (!body.abilities){
      errors.push("Abilities is required")
    }

    if (body.abilities.length < 3){
      errors.push("Please select atleast 3 abilities")
    }

    if (!body.aspirations){
      errors.push("Aspirations is required")
    }

    if (body.aspirations.length < 3){
      errors.push("Please select atleast 3 aspirations")
    }

    if (!body.mobilePreference){
      errors.push("Mobile preference is required")
    }

    if (!body.contactPreference){
      errors.push("Contact preference is required")
    }

    if (body.mobileNumber && !isString(body.mobileNumber)) {
      errors.push("Mobile number must be a string");
    }

    if (body.countryCode && !isString(body.countryCode)) {
      errors.push("Country code must be a string");
    }

    if (!body.avatarUrl){
      errors.push("Avater must be required")
    }

    if (body.avatarUrl && !isValidUrl(body.avatarUrl)) {
      errors.push("Avatar URL must be valid");
    }

    if (!isNonEmptyString(body.lastName)) {
      errors.push("Last name is required");
    }

    if (!isNonEmptyString(body.firstName)) {
      errors.push("Bio is required");
    }

    if (!body.web){
      errors.push("Website URL is required")
    }
    if (body.web && !isValidUrl(body.web)) {
      errors.push("Website URL must be valid");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          status: false,
          message: errors[0],
          errors,
        },
        { status: 200 }
      );
    }

    const visitorCollection = db.collection("mmosh-app-visitor");
    const otpCollection = db.collection("mmosh-users-email-verification");

    const hasVerified = await otpCollection.findOne({
      email: body.email.toLowerCase().trim(),
      hasVerifiedEmail: true,
      isMobileNumberVerified: true,
    });

    if (!hasVerified) {
      return NextResponse.json(
        {
          status: false,
          message: "Email or Mobile number not verified",
        },
        { status: 200 }
      );
    }

    const existingUser = await visitorCollection.findOne({
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
    const decryptedPassword = decryptData(body.password);
    const passwordHash = await bcrypt.hash(decryptedPassword, 10);

    const doc = {
      ...body,
      email: body.email.toLowerCase().trim(),
      firstName: body.firstName.trim(),
      lastName: isString(body.lastName) ? body.lastName.trim() : "",
      password: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // const result = await visitorCollection.insertOne(doc);

    // let filter: any = { email: body.email.toLowerCase().trim() };
    // if (body.mobileNumber && body.countryCode) {
    //   filter = { mobile: body.mobileNumber, countryCode: body.countryCode };
    // }

    // await otpCollection.deleteMany({ email: body.email.toLowerCase().trim() });

    return NextResponse.json(
      {
        status: true,
        message: "Visitor saved successfully",
        result: {
          id: "result",
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.log("Eroorrrsssss",err)
    return NextResponse.json(
      {
        status: false,
        message: "Failed to save visitor",
      },
      { status: 500 }
    );
  }
}
