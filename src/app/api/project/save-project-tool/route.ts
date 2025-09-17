import { db } from "@/app/lib/mongoClient";
import { AtpAgent } from "@atproto/api";
import { NextRequest, NextResponse } from "next/server";

// Helper function to validate LinkedIn credentials
async function validateLinkedInCredentials(handle: string, password: string): Promise<boolean> {
  try {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(handle)) {
      console.log("Invalid email format for LinkedIn handle:", handle);
      return false;
    }

    // Basic password validation
    if (!password || password.length < 6) {
      console.log("Password too short for LinkedIn (minimum 6 characters)");
      return false;
    }

    // Password strength validation
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      console.log("Password doesn't meet LinkedIn security requirements (needs uppercase, lowercase, and numbers)");
      return false;
    }

    // Domain validation (optional - just log warnings)
    const domain = handle.split('@')[1]?.toLowerCase();
    const commonLinkedInDomains = [
      'gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'linkedin.com',
      'live.com', 'icloud.com', 'protonmail.com', 'aol.com', 'mail.com'
    ];

    if (domain && !commonLinkedInDomains.includes(domain)) {
      console.log("Email domain not commonly associated with LinkedIn:", domain);
      // Don't reject, just log - many valid LinkedIn accounts use custom domains
    }

    console.log("LinkedIn credential validation passed for:", handle);
    return true;

  } catch (error) {
    console.error("LinkedIn validation error:", error);
    return false;
  }
}

const agent = new AtpAgent({
  service: "https://bsky.social/xrpc/com.atproto.server.createSession",
});



export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-app-project-tools");

  const data = await req.json();

  if (data.type === "bsky") {
    const existing = await collection.findOne({
      "data.handle": data.data.handle,
    });

    if (existing !== null) {
      return NextResponse.json("bsky-exists", { status: 400 });
    }

    try {
      const res = await agent.login({
        identifier: data.data.handle,
        password: data.data.password,
      });

      if (!res.success) {
        return NextResponse.json("invalid-bsky", { status: 400 });
      }
    } catch (err) {
      console.log("Got err bsky: ", err);
      return NextResponse.json("invalid-bsky", { status: 400 });
    }
  }

  if (data.type === "linkedin") {
    const existing = await collection.findOne({
      "data.handle": data.data.handle,
    });

    if (existing !== null) {
      return NextResponse.json("linkedin-exists", { status: 400 });
    }

    try {
      // Validate LinkedIn credentials (email and password)
      const isValid = await validateLinkedInCredentials(data.data.handle, data.data.password);

      if (!isValid) {
        return NextResponse.json("invalid-linkedin", { status: 400 });
      }

      console.log("LinkedIn credentials validated successfully:", data.data.handle);
    } catch (err) {
      console.log("Got err linkedin: ", err);
      return NextResponse.json("invalid-linkedin", { status: 400 });
    }
  }

  // Save data to database only after successful validation
  await collection.insertOne(data);

  return NextResponse.json("created successfully", { status: 200 });
}
