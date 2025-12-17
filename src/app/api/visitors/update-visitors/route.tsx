import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER!;

const client = twilio(accountSid, authToken);

interface UpdateVisitorBody {
  email: string;
  currentStep: string;
  roles?: string[];
  mobilePreference?: string[];
  intent?: string[];
  contactPreference?: string[];
  mobileNumber?: string;
  telegramUsername?: string;
  blueskyHandle?: string;
  linkedinProfile?: string;

  likertAnswers?: Record<string, string>;

  challenges?: string[];

  abilities?: string[];

  aspirations?: string[];

  // Step 5
  referedKinshipCode?: string;

  // Step 6
  kinshipCode?: string;

  avatar?: string;
  lastName?: string;
  bio?: string;
  web?: string;
}

export async function PATCH(req: NextRequest) {
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

    const {
      email,
      currentStep,
      roles,
      mobilePreference,
      intent,
      contactPreference,
      mobileNumber,
      telegramUsername,
      blueskyHandle,
      linkedinProfile,
      likertAnswers,
      challenges,
      abilities,
      aspirations,
      referedKinshipCode,
      kinshipCode,
      avatar,
      lastName,
      bio,
      web
    } = validation.data!;

    const collection = db.collection("mmosh-app-visitor");
    const existingUser = await collection.findOne({ email });

    if (!existingUser) {
      return NextResponse.json(
        { status: false, message: "User not found", result: null },
        { status: 404 }
      );
    }

    // Step 6 — Ensure user-created Kinship Code is unique
    if (kinshipCode) {
      const existingCode = await collection.findOne({
        kinshipCode,
      });

      if (existingCode) {
        return NextResponse.json(
          {
            status: false,
            message:
              "This Kinship Code is already taken. Please choose another.",
            result: null,
          },
          { status: 409 }
        );
      }
    }

    const updateFields: any = {
      currentStep,
      updatedAt: new Date(),
    };

    // Step 3 updates
    if (roles !== undefined) updateFields.roles = roles;
    if (mobilePreference !== undefined)
      updateFields.mobilePreference = mobilePreference;
    if (intent !== undefined) updateFields.intent = intent;
    if (contactPreference !== undefined)
      updateFields.contactPreference = contactPreference;

    // Step 4 updates
    if (mobileNumber !== undefined) updateFields.mobileNumber = mobileNumber;
    if (telegramUsername !== undefined)
      updateFields.telegramUsername = telegramUsername;
    if (blueskyHandle !== undefined) updateFields.blueskyHandle = blueskyHandle;
    if (linkedinProfile !== undefined)
      updateFields.linkedinProfile = linkedinProfile;

    // Step 5 updates
    if (likertAnswers !== undefined) {
      updateFields.likertAnswers = {
        ...(existingUser.likertAnswers || {}),
        ...likertAnswers,
      };
    }

    // Step 6 updates
    if (challenges !== undefined) {
      updateFields.challenges = challenges;
    }

    // Step 7 updates
    if (abilities !== undefined) {
      updateFields.abilities = abilities;
    }

    // Step 7 updates
    if (aspirations !== undefined) {
      updateFields.aspirations = aspirations;
    }

    if (referedKinshipCode !== undefined) {
      updateFields.referedKinshipCode = referedKinshipCode;
    }

    // Step 6 updates
    if (kinshipCode !== undefined) {
      updateFields.kinshipCode = kinshipCode;
    }

    // Step 16 updates – Contact Details
    if (typeof body.avatar === "string") {
      updateFields.avatar = body.avatar;
    }


    if (body.lastName !== undefined) {
      updateFields.lastName = body.lastName.trim();
    }

    if (body.bio !== undefined) {
      updateFields.bio = body.bio.trim();
    }

    if (body.web !== undefined) {
      updateFields.web = body.web.trim();
    }


    // Step 4 mobile verification logic — Generate OTP + Send SMS via Twilio
    let otp: string | null = null;

    if (currentStep === "catfawn/step12") {
      otp = generateSecureOTP();
      const hashedOTP = await bcrypt.hash(otp, 10);
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      updateFields.otpHash = hashedOTP;
      updateFields.expiresAt = expiresAt;
      updateFields.status = "pending_mobile_verification";

      console.log(mobileNumber, "###################")
      await sendSMS(mobileNumber!, otp);
    }

    // await collection.updateOne({ email }, { $set: updateFields });

    return NextResponse.json(
      {
        status: true,
        message: "User updated successfully",
        result: { email, updatedFields: updateFields, otp },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating visitor:", error);
    return NextResponse.json(
      { status: false, message: "Internal server error", result: null },
      { status: 500 }
    );
  }
}

/* ------------------ VALIDATION ------------------ */

function validateRequestBody(body: any) {
  const errors: string[] = [];

  if (!body.email || typeof body.email !== "string") {
    errors.push("email is required and must be a string");
  }

  if (!body.currentStep || typeof body.currentStep !== "string") {
    errors.push("currentStep is required and must be a string");
  }

  const validateArray = (field: string) => {
    if (body[field] !== undefined) {
      if (!Array.isArray(body[field])) {
        errors.push(`${field} must be an array`);
      } else if (body[field].some((item: any) => typeof item !== "string")) {
        errors.push(`${field} must contain only strings`);
      }
    }
  };

  validateArray("roles");
  validateArray("mobilePreference");
  validateArray("intent");
  validateArray("contactPreference");

  if (body.mobileNumber !== undefined) {
    if (
      typeof body.mobileNumber !== "string" ||
      body.mobileNumber.trim().length < 8
    ) {
      errors.push("mobileNumber must be a valid string of at least 8 digits");
    }
  }

  const ALLOWED_LIKERT_VALUES = [
    "very rarely",
    "rarely",
    "sometimes",
    "very",
    "very often",
  ];

  if (body.likertAnswers !== undefined) {
    if (
      typeof body.likertAnswers !== "object" ||
      Array.isArray(body.likertAnswers)
    ) {
      errors.push("likertAnswers must be an object");
    } else {
      for (const [question, answer] of Object.entries(body.likertAnswers)) {
        if (
          typeof question !== "string" ||
          !question.trim() ||
          typeof answer !== "string" ||
          !ALLOWED_LIKERT_VALUES.includes(answer.toLowerCase())
        ) {
          errors.push(
            "Each Likert answer must be a valid label (very rarely → very often)"
          );
          break;
        }
      }
    }
  }

  if (body.referedKinshipCode !== undefined) {
    if (!/^[A-Za-z0-9]{6}$/.test(body.referedKinshipCode)) {
      errors.push(
        "Refered Kinship Code must be exactly 6 alphanumeric characters"
      );
    }
  }

  if (body.kinshipCode !== undefined) {
    if (!/^[A-Za-z0-9]{3,20}$/.test(body.kinshipCode)) {
      errors.push("Kinship Code must be between 3 to 20 alphanumeric characters.");
    }
  }

  // Step 16 – Contact details validation
  if (body.currentStep === "catfawn/step15") {
    // Avatar
    // Avatar (Firebase URL)
    if (!body.avatar || typeof body.avatar !== "string") {
      errors.push("Avatar URL is required");
    } else {
      try {
        new URL(body.avatar);
      } catch {
        errors.push("Avatar must be a valid URL");
      }
    }


    // Last name
    if (!body.lastName || typeof body.lastName !== "string" || !body.lastName.trim()) {
      errors.push("Last name is required");
    }

    // Bio
    if (!body.bio || typeof body.bio !== "string" || !body.bio.trim()) {
      errors.push("Bio is required");
    }

    // Web link
    if (!body.web || typeof body.web !== "string") {
      errors.push("Web link is required");
    } else {
      try {
        const url = new URL(body.web);
        if (!["http:", "https:"].includes(url.protocol)) {
          errors.push("Web link must start with http or https");
        }
      } catch {
        errors.push("Web link must be a valid URL");
      }
    }

  }


  return errors.length
    ? { isValid: false, errors }
    : { isValid: true, data: body as UpdateVisitorBody };
}


function generateSecureOTP(): string {
  const buffer = crypto.randomBytes(4);
  const num = buffer.readUInt32BE(0);
  return ((num % 900000) + 100000).toString();
}

const sendSMS = async (to: string, otp: string) => {
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
};
