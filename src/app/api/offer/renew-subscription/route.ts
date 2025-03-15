import { db } from "../../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";
import bs58 from "bs58";
import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import * as anchor from "@coral-xyz/anchor";
import { Connectivity as CommunityConn } from "@/anchor/community";
import { web3Consts } from "@/anchor/web3Consts";
import axios from "axios";
import { pinFileToShadowDriveBackend } from "@/app/lib/uploadFileToShdwDrive"

export async function GET(req: NextRequest) {
    const collection = db.collection("mmosh-app-offer-subscription");
    const offerCollection = db.collection("mmosh-app-project-offer");
    const projectCollection = db.collection("mmosh-app-project");
    const projectCoinCollection = db.collection("mmosh-app-project-coins");
    const tokenCollection = db.collection("mmosh-app-tokens");
    const usercollection = db.collection("mmosh-app-profiles");

    const data = await collection
    .findOne({end: { $lt: new Date() }, status: "active"})

    if(!data) {
        console.log("no new subscription available")
        return NextResponse.json(
            data,
            {
            status: 200,
            },
        );
    }

    let userData = await usercollection.findOne({wallet: data.receiver})
    if (!userData) {
      console.log("User not found")
      return NextResponse.json(null, {
        status: 200,
       });
    }

    let offerData:any  = await offerCollection.findOne({ key: data.offer });
    if(!offerData) {
        console.log("offer not available")
        return NextResponse.json(null, {
            status: 200,
        });
    }

    try {

        let projectData:any = await projectCollection.findOne({ key: offerData.project });
        const projectCoins = await projectCoinCollection.find({ projectkey: projectData.key }).toArray();
    
        let coinData:any  = await tokenCollection.findOne({ symbol: projectCoins[0].symbol?.toUpperCase() });
        if(!coinData) {
            coinData = await tokenCollection.findOne({ symbol: projectCoins[0].symbol });
            if (!coinData) {
                console.log("coin not available")
                return NextResponse.json(null, {
                    status: 200,
                });
            }
        }

        const privateKey = process.env.PTV_WALLET!;
        const private_buffer = bs58.decode(privateKey);
        const private_arrray = new Uint8Array(
          private_buffer.buffer,
          private_buffer.byteOffset,
          private_buffer.byteLength / Uint8Array.BYTES_PER_ELEMENT,
        );
        let ptvOwner = Keypair.fromSecretKey(private_arrray);
    
        let rpcUrl: any = process.env.NEXT_PUBLIC_SOLANA_CLUSTER;
        let connection = new Connection(rpcUrl, {
          confirmTransactionInitialTimeout: 120000
        });
        let wallet = new NodeWallet(ptvOwner);
    
        console.log("wallet.publicKey.toBase58() ", wallet.publicKey.toBase58());
        const env = new anchor.AnchorProvider(connection, wallet, {
          preflightCommitment: "processed",
        });
  
        console.log("test 1")
    
        let projectConn: CommunityConn = new CommunityConn(
          env,
          web3Consts.programID,
          new anchor.web3.PublicKey(offerData.key),
        );
  
        console.log("test 2")
  
        let priceInUsd = 0;
        if(coinData.status === "completed") {
            priceInUsd = await axios.get(
                process.env.NEXT_PUBLIC_JUPITER_PRICE_API + `?ids=${coinData.target.token},EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`,
            );
        } else {
            let lastPriceResult = await axios.get(
                process.env.NEXT_PUBLIC_APP_MAIN_URL + "/api/token/lastprice?key=" + coinData.bonding,
            );
            const lookupUsdPrice = await axios.get(
                process.env.NEXT_PUBLIC_JUPITER_PRICE_API + `?ids=${coinData.base.token},EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`,
            );
            console.log("lookup price ", Number(lookupUsdPrice.data?.data["EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"].price || 0.003));
            console.log("last price ", lastPriceResult.data.price);
            priceInUsd = lastPriceResult.data.price * Number(lookupUsdPrice.data?.data["EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"].price || 0.003)
            console.log("price in usd ", priceInUsd);
        }

        console.log("test 3 priceInUsd", priceInUsd)

        let price:any = 0;
        if (data.type === "month") {
        price = offerData.pricemonthly
        } else {
        price = offerData.priceyearly
        }

        console.log("test 4")

        price = (Number(price) / priceInUsd).toFixed(2)

        let tokenBalance = await projectConn.getStakeBalance(
            new anchor.web3.PublicKey(projectData.coins[0].key)
        )

        if(tokenBalance < price) {
            console.log("Insufficent fund")
            return NextResponse.json(null, 
            { status: 200 });
        }

        const unstakeres = await projectConn.unStakeCoin({
            stakeKey: new anchor.web3.PublicKey(data.receiver),
            mint: new anchor.web3.PublicKey(projectData.coins[0].key),
            amount: Math.ceil(price * (10 ** coinData?.target.decimals)),
            },
        );


      let offerBody = {
        name: offerData.name,
        symbol: offerData.symbol,
        description: offerData.desc,
        image: offerData.image,
        enternal_url: "https://www.kinship.codes/" + projectData.symbol + "/" + offerData.symbol,
        family: "Kinship Codes",
        collection: "Kinship Offers",
        attributes: [
          {
            trait_type: "Primitive",
            value: "Offer",
          },
          {
            trait_type: "Ecosystem",
            value: "Kinship Codes",
          },
          {
            trait_type: "Agent Name",
            value: projectData.name
          },
          {
            trait_type: "Agent Symbol",
            value: projectData.symbol.toUpperCase()
          },
          {
            trait_type: "Seniority",
            value: offerData.seniority ? offerData.seniority : 1
          },
          {
            trait_type: "Payments",
            value: offerData.pricetype === "onetime" ? "Single" : "Subscription"
          },
          {
            trait_type: "Denomination",
            value: coinData.symbol.toUpperCase()
          },
          {
            trait_type: "Upfront Price",
            value: 0
          },
          {
            trait_type: "Offer",
            value: offerData.key,
          }
        ],
      };


        offerBody.attributes.push({
          trait_type: "Monthly Subscription Price",
          value: offerData.pricemonthly,
        });
        offerBody.attributes.push({
          trait_type: "Annual Subscription Price",
          value: offerData.priceyearly,
        });

       
        offerBody.attributes.push({
          trait_type: "Valid from",
          value: new Date(),
        });

        let date = new Date(); // Now
        if(data.type === "month") {
          date.setDate(date.getDate() + 30);
          offerBody.attributes.push({
            trait_type: "Valid up to",
            value: date,
          });
        } else if (data.type === "year") {
          date.setDate(date.getDate() + 365);
          offerBody.attributes.push({
            trait_type: "Valid up to",
            value: date,
          });
        }


      offerBody.attributes.push({
        trait_type: "Purchase Type",
        value: data.type,
      });


      offerBody.attributes.push({
        trait_type: "Buyer",
        value: data.receiver,
      });

      offerBody.attributes.push({
        trait_type: "Supply",
        value: 1,
      });

      offerBody.attributes.push({
        trait_type: "Price",
        value: price,
      });

      console.log("offer body", offerBody)

      const passMetaURI: any = await pinFileToShadowDriveBackend(offerBody, data.receiver);
      if(passMetaURI == "") {
        console.log("error on creating meta uri")
        return NextResponse.json(null, {
          status: 200,
        });
      }

      let result = await projectConn.mintGuestPassTx({
        name: offerData.name,
        symbol: offerData.symbol,
        uriHash: passMetaURI,
        genesisProfile: offerData.key,
        commonLut: offerData.lut
      },data.receiver, wallet.publicKey.toBase58(), userData.profilenft, (price * (10 ** coinData.target.decimals) * 1), 1);

      let transaction: VersionedTransaction = result.Ok?.info?.profile!;
      const signature = await projectConn.provider.sendAndConfirm(transaction);
      console.log("signature is ", signature)
    } catch (error) {
        
    }

    return NextResponse.json(
        data,
        {
        status: 200,
        },
    );
}

const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));
