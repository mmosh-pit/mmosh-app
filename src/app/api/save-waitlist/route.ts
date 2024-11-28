import { db } from "@/app/lib/mongoClient";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const collection = db.collection("waitlist");

  const { name, email } = await req.json();

  const existingData = await collection.findOne({ email });

  if (!existingData) {
    await collection.insertOne({
      name,
      email,
    });

    sendKartaNotification(name, email);
  }

  return NextResponse.json("");
}

const sendKartaNotification = async (name: string, email: string) => {
  const data = {
    app_id: process.env.KARTA_APP_ID,
    api_key: process.env.KARTA_API_KEY,
    api_password: process.env.KARTA_API_PASSWORD,
    lead: {
      email: email,
      name: name,
    },
    actions: [
      {
        cmd: "assign_tag",
        tag_name: "KS CODE WAITLIST",
      },
    ],
  };

  try {
    const result = await axios({
      method: "post",
      url: process.env.KARTA_API_BASE,
      headers: {
        "Content-Type": `application/x-www-form-urlencoded`,
      },
      data,
    });
    console.log("sendKartaNotification ", JSON.stringify(result.data, null, 4));
  } catch (err) {
    console.error(err);
  }
};
