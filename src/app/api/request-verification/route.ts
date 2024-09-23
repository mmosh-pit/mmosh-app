import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

import { db } from "@/app/lib/mongoClient";
import { generateCode } from "@/utils/generateCode";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-users-email-verification");

  const data = await req.json();
  const code = generateCode();

  const msg = {
    to: data.email,
    from: "admin@liquidhearts.app",
    subject: "Email Verification",
    html: `Hey there!<br /> Here's your code to verify your Email and finish your registration into Liquid Hearts Club!<br /> <strong>${code}</strong>`,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });

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
}
