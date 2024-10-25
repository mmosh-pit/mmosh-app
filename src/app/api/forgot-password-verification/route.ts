import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

import { db } from "@/app/lib/mongoClient";
import { generateCode } from "@/utils/generateCode";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-users-email-verification");

  const userCollection = db.collection("mmosh-users");

  const data = await req.json();
  const code = generateCode();

  const existingUser = await userCollection.findOne({
    email: data.email,
  });

  if (!existingUser) return NextResponse.json("");

  const link = `${process.env.NEXT_PUBLIC_APP_MAIN_URL}/reset-password?code=${code}`;

  const msg = {
    to: data.email,
    from: "support@liquidhearts.club",
    subject: "Forgot Password",
    html: `Hey there!<br /> Click the following link to reset your password!<br /> <a href="${link}" target="_blank">${link}</a>`,
  };

  try {
    await sgMail.send(msg);

    const existingData = await collection.findOne({
      email: data.email,
    });

    if (existingData) {
      await collection.deleteOne({ _id: existingData._id });
    }

    await collection.insertOne({
      ...data,
      code,
    });

    return NextResponse.json("");
  } catch (_) {
    return NextResponse.json("", { status: 500 });
  }
}
