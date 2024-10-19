import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import argon2 from "argon2";

import { db } from "@/app/lib/mongoClient";
import { generateSession } from "@/utils/generateSession";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { encryptData } from "@/utils/encryptData";
import axios from "axios";

export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-users");
  const emailCollection = db.collection("mmosh-users-email-verification");

  const cookieStore = cookies();

  const data = await req.json();

  const session = generateSession();

  const { code, ...filteredData } = data;

  const existingData = await emailCollection.findOne({
    email: filteredData.email.trim().toLowerCase(),
    code: Number(code.trim()),
  });

  if (!existingData) {
    return NextResponse.json("", { status: 400 });
  }

  const password = await argon2.hash(data.password);

  const address = Keypair.generate();
  const privateKey = bs58.encode(address.secretKey);

  const encryptedKey = encryptData(privateKey);

  await collection.insertOne({
    ...filteredData,
    password,
    address: address.publicKey.toBase58(),
    email: filteredData.email.trim().toLowerCase(),
    privateKey: encryptedKey,
    sessions: [session],
  });

  cookieStore.set("session", session, {
    httpOnly: true,
  });

  await emailCollection.deleteOne({ _id: existingData._id });

  await sendKartaNotification(filteredData.name, filteredData.email);

  return NextResponse.json(address.publicKey.toBase58());
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
        cmd: "create_lead",
      },
      {
        cmd: "assign_tag",
        tag_name: "New User Sign Up",
      },
    ],
  };
  const result = await axios({
    method: "post",
    url: process.env.KARTA_API_BASE,
    headers: {
      "Content-Type": `application/x-www-form-urlencoded`,
    },
    data,
  });
  console.log("sendKartaNotification ", result.data);
};
