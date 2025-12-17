import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      firstName,
      email,
      roles,
      mobilePreference,
      intent,
      contactPreference,
      currentStep,
      mobileNumber,
      telegramUsername,
      blueskyHandle,
      linkedinProfile,
      kinshipCode,
      likertAnswers,
      challenges,
      abilities,
      aspirations,
    } = body;

    const collection = db.collection("mmosh-app-visitor");

    const userDocument = {
      firstName,
      email,
      roles: roles || [],
      mobilePreference: mobilePreference || [],
      intent: intent || [],
      contactPreference: contactPreference || [],
      currentStep: currentStep || "catfawn/step15",
      mobileNumber: mobileNumber || null,
      telegramUsername: telegramUsername || "",
      blueskyHandle: blueskyHandle || "",
      linkedinProfile: linkedinProfile || "",
      referedKinshipCode: null,
      kinshipCode: kinshipCode || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      isVerified: true,
      verifiedAt: new Date(),
      likertAnswers: likertAnswers || {},
      challenges: challenges || [],
      abilities: abilities || [],
      aspirations: aspirations || [],
    };

    const result = await collection.insertOne(userDocument);

    return NextResponse.json(
      {
        status: true,
        message: "User created successfully",
        result: {
          userId: result.insertedId,
          email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);

    return NextResponse.json(
      { status: false, message: "Internal server error", result: null },
      { status: 500 }
    );
  }
}
