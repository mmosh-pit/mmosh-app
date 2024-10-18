import { db } from "../../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";
import { Connectivity as UserConn } from "@/anchor/user";
import * as anchor from "@coral-xyz/anchor";
import { web3Consts } from "@/anchor/web3Consts";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { Connection, Keypair } from "@solana/web3.js";
import axios from "axios";

export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-app-donation-profile");
  const historyCollection = db.collection("mmosh-app-donation-history");
  const { address, firstname, lastname, middlename, addressone, addresstwo, city, state, zip, amount, token } = await req.json();
  const donationProfile = await collection.findOne({
    wallet: address,
  });


  if (!donationProfile) {
    await collection.insertOne({
      wallet: address,
      firstname,
      middlename,
      lastname,
      addressone,
      addresstwo,
      city,
      state,
      zip,
      created_date: new Date(),
      updated_date: new Date(),
    });
  } else {
      await collection.updateOne(
        {
          _id: donationProfile._id,
        },
        {
          $set: {
            firstname,
            middlename,
            lastname,
            addressone,
            addresstwo,
            city,
            state,
            zip,
          },
        },
      );
  }

  await historyCollection.insertOne({
    wallet: address,
    amount,
    token,
    created_date: new Date(),
    updated_date: new Date(),
  });
  return NextResponse.json("", { status: 200 });
}
