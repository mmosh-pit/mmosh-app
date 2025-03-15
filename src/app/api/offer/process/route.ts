import { db } from "../../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";
import { Connectivity as UserConn } from "@/anchor/user";
import * as anchor from "@coral-xyz/anchor";
import { web3Consts } from "@/anchor/web3Consts";
import axios from "axios";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { Connection, Keypair } from "@solana/web3.js";
export async function GET(req: NextRequest) {
    const offerCollection = db.collection("mmosh-app-project-offer");
    const receiptCollection = db.collection("mmosh-app-offer-receipt");
    const subscriptionCollection = db.collection("mmosh-app-offer-subscription");
    const { searchParams } = new URL(req.url);
    const offer = searchParams.get("offer");
    const signature = searchParams.get("signature");
    if(!offer) {
      console.log("offer param not found");
      return NextResponse.json(
        false,
        {
          status: 200,
        },
      );
    }

    let rpcUrl:any = process.env.NEXT_PUBLIC_SOLANA_CLUSTER;
    let connection = new Connection(rpcUrl, {
      confirmTransactionInitialTimeout: 120000
    })
    let wallet = new NodeWallet(new Keypair());
    const env = new anchor.AnchorProvider(connection, wallet, {
      preflightCommitment: "processed",
    });
    let userConn: UserConn = new UserConn(env, web3Consts.programID);

    console.log("offer ", offer)

    let offerInfo = await userConn.metaplex.nfts().findByMint({
      mintAddress: new anchor.web3.PublicKey(offer)
    })

    let gensisOffer:any = "";
    let type:any = ""
    let receiver:any = ""
    let price:any = 0
    let supply:any = 0
    let startDate:any = ""
    let endDate :any= ""

    console.log("attributes ", offerInfo.json?.attributes)

    if(offerInfo.json?.attributes) {
      for (let index = 0; index < offerInfo.json?.attributes.length; index++) {
          const element = offerInfo.json?.attributes[index];
          if(element.trait_type === "Offer") {
            gensisOffer = element.value;
          } else if(element.trait_type === "Purchase Type") {
            type = element.value;
          } else if(element.trait_type === "Buyer") {
            receiver = element.value;
          } else if(element.trait_type === "Supply") {
            supply = element.value;
          } else if(element.trait_type === "Price") {
            price = element.value;
          } else if(element.trait_type === "Valid from") {
            startDate = new Date(element.value!);
          } else if(element.trait_type === "Valid up to") {
            endDate = new Date(element.value!);
          }
      }
    }

    if(gensisOffer === "" && receiver === "") {
      console.log("gensis and receiver not found");
      return NextResponse.json(
        false,
        {
          status: 200,
        },
      );
    }

    let offerData:any  = await offerCollection.findOne({ key: gensisOffer });
    if(!offerData) {
      console.log("offer not available")
      return NextResponse.json(false, {
          status: 200,
      });
    }

    const receipt = await receiptCollection
    .findOne({key: offer});
    if(receipt) {
      console.log("receipt already exist")
      return NextResponse.json(false, {
        status: 200,
    });
    }
    if(startDate != "" && endDate != "") {
      const data = await subscriptionCollection
      .findOne({offer: gensisOffer, wallet: receiver});
      if(!data) {
        await subscriptionCollection.insertOne({
          offer: gensisOffer, 
          start: startDate, 
          end: endDate,
          wallet: receiver,
          status: "active", // active, cancel, expired
          type,
          created_date: new Date(),
          updated_date: new Date(),
        });
      } else {
        await subscriptionCollection.updateOne(
          {
            _id: data._id,
          },
          {
            $set: {
              start: startDate, 
              end: endDate,
              type,
              status: "active",
            },
          },
        );
      }
    }

    await receiptCollection.insertOne({
      offer: gensisOffer, 
      key: offer,
      price,
      supply,
      buyer: receiver,
      signature,
      type,
      created_date: new Date(),
      updated_date: new Date(),
    });

    await offerCollection.updateOne(
      {
        _id: offerData._id,
      },
      {
        $set: {
          seniority: offerData.seniority ? offerData.seniority + 1 : 1, 
          sold: offerData.sold + supply,
        },
      },
    );
    



    return NextResponse.json(true, {
      status: 200,
    });

}