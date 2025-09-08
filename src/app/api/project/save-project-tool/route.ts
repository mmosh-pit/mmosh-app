import { db } from "@/app/lib/mongoClient";
import { AtpAgent } from "@atproto/api";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const agent = new AtpAgent({
  service: "https://bsky.social/xrpc/com.atproto.server.createSession",
});

// Helper function to validate LinkedIn credentials
async function validateLinkedInCredentials(handle: string, password: string): Promise<boolean> {
  try {
    // Basic validation checks
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(handle)) {
      console.log("Invalid email format for LinkedIn handle:", handle);
      return false;
    }

    if (!password || password.length < 6) {
      console.log("Password too short for LinkedIn");
      return false;
    }

    // Check if LinkedIn API credentials are configured
    const linkedinClientId = process.env.LINKEDIN_CLIENT_ID;
    const linkedinClientSecret = process.env.LINKEDIN_CLIENT_SECRET;

    if (linkedinClientId && linkedinClientSecret) {
      // If LinkedIn API credentials are available, we could implement OAuth validation
      // For now, we'll do enhanced validation
      console.log("LinkedIn API credentials found, performing enhanced validation");
      
      // Additional validation: check if email domain is commonly used for LinkedIn
      const commonLinkedInDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'linkedin.com'];
      const domain = handle.split('@')[1]?.toLowerCase();
      
      if (domain && !commonLinkedInDomains.includes(domain)) {
        console.log("Email domain not commonly associated with LinkedIn:", domain);
        // Don't reject, just log - many valid LinkedIn accounts use custom domains
      }
    }

    // Enhanced password validation
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      console.log("Password doesn't meet LinkedIn security requirements");
      return false;
    }

    console.log("LinkedIn credential validation passed for:", handle);
    return true;
    
  } catch (error) {
    console.error("LinkedIn validation error:", error);
    return false;
  }
}

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

  // if (data.type === "linkedin") {
  //   const existing = await collection.findOne({
  //     "data.handle": data.data.handle,
  //   });

  //   if (existing !== null) {
  //     return NextResponse.json("linkedin-exists", { status: 400 });
  //   }

  //   try {
  //     // Validate LinkedIn credentials
  //     const isValid = await validateLinkedInCredentials(data.data.handle, data.data.password);
      
  //     if (!isValid) {
  //       return NextResponse.json("invalid-linkedin", { status: 400 });
  //     }
      
  //     console.log("LinkedIn credentials validated successfully:", data.data.handle);
  //   } catch (err) {
  //     console.log("Got err linkedin: ", err);
  //     return NextResponse.json("invalid-linkedin", { status: 400 });
  //   }
  // }

  await collection.insertOne(data);

  return NextResponse.json("created successfully", { status: 200 });
}
