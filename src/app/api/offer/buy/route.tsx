import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/mongoClient";
import bs58 from "bs58";
import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import * as anchor from "@coral-xyz/anchor";
import { Connectivity as CommunityConn } from "@/anchor/community";
import { web3Consts } from "@/anchor/web3Consts";
import axios from "axios";
import { pinFileToShadowDriveBackend } from "@/app/lib/uploadFileToShdwDrive";

export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-app-project-offer");
  const { receiver, symbol, type, supply } = await req.json();

  const offerCollection = db.collection("mmosh-app-project-offer");
  const projectCollection = db.collection("mmosh-app-project");
  const projectCoinCollection = db.collection("mmosh-app-project-coins");
  const tokenCollection = db.collection("mmosh-app-tokens");
  const usercollection = db.collection("mmosh-users");

  let userData = await usercollection.findOne({ wallet: receiver });
  if (!userData) {
    console.log("User not found");
    return NextResponse.json(
      { status: false, message: "User not found" },
      {
        status: 200,
      },
    );
  }

  if (!userData.profilenft) {
    console.log("Profile not found");
    return NextResponse.json(
      { status: false, message: "Profile not found" },
      {
        status: 200,
      },
    );
  }

  let offerData: any = await offerCollection.findOne({
    symbol: symbol?.toUpperCase(),
  });
  if (!offerData) {
    offerData = await offerCollection.findOne({ symbol: symbol });
    if (!offerData) {
      console.log("offer not available");
      return NextResponse.json(
        { status: false, message: "Offer not available" },
        {
          status: 200,
        },
      );
    }
  }

  if (offerData.supply > 0) {
    if (offerData.supply < offerData.sold + supply) {
      console.log("insufficent supply");
      return NextResponse.json(
        { status: false, message: "Insufficent supply" },
        {
          status: 200,
        },
      );
    }
  }

  try {
    let projectData: any = await projectCollection.findOne({
      key: offerData.project,
    });
    const projectCoins = await projectCoinCollection
      .find({ projectkey: projectData.key })
      .toArray();

    let coinData: any = await tokenCollection.findOne({
      symbol: projectCoins[0].symbol?.toUpperCase(),
    });
    if (!coinData) {
      coinData = await tokenCollection.findOne({
        symbol: projectCoins[0].symbol,
      });
      if (!coinData) {
        console.log("coin not available");
        return NextResponse.json(
          { status: false, message: "Coin not available" },
          {
            status: 200,
          },
        );
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
      confirmTransactionInitialTimeout: 120000,
    });
    let wallet = new NodeWallet(ptvOwner);

    console.log("wallet.publicKey.toBase58() ", wallet.publicKey.toBase58());
    const env = new anchor.AnchorProvider(connection, wallet, {
      preflightCommitment: "processed",
    });

    console.log("test 1");

    let projectConn: CommunityConn = new CommunityConn(
      env,
      web3Consts.programID,
      new anchor.web3.PublicKey(offerData.key),
    );

    console.log("test 2");

    let priceInUsd = 0;
    if (coinData.status === "completed") {
      priceInUsd = await axios.get(
        process.env.NEXT_PUBLIC_JUPITER_PRICE_API +
        `?ids=${coinData.target.token},EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`,
      );
    } else {
      let lastPriceResult = await axios.get(
        process.env.NEXT_PUBLIC_APP_MAIN_URL +
        "/api/token/lastprice?key=" +
        coinData.bonding,
      );
      const lookupUsdPrice = await axios.get(
        process.env.NEXT_PUBLIC_JUPITER_PRICE_API +
        `?ids=${coinData.base.token},EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`,
      );
      console.log(
        "lookup price ",
        Number(
          lookupUsdPrice.data?.data[
            "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
          ].price || 0.003,
        ),
      );
      console.log("last price ", lastPriceResult.data.price);
      priceInUsd =
        lastPriceResult.data.price *
        Number(
          lookupUsdPrice.data?.data[
            "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
          ].price || 0.003,
        );
      console.log("price in usd ", priceInUsd);
    }

    console.log("test 3 priceInUsd", priceInUsd);

    let price: any = 0;
    if (type === "onetime") {
      price = offerData.priceonetime;
    } else if (type === "month") {
      price = offerData.pricemonthly;
    } else {
      price = offerData.priceyearly;
    }

    console.log("test 4");

    let hasInivtation: any = false;

    if (offerData.discount > 0) {
      hasInivtation = await projectConn.isCreatorInvitation(
        new anchor.web3.PublicKey(offerData.badge),
        receiver,
      );
      if (hasInivtation > 0) {
        let discount = Number(price) * (Number(offerData.discount) / 100);
        price = (Number(price - discount) / priceInUsd).toFixed(2);
      } else {
        price = (Number(price) / priceInUsd).toFixed(2);
      }
    } else {
      price = (Number(price) / priceInUsd).toFixed(2);
    }

    if (offerData.invitationype === "required" && !hasInivtation) {
      console.log("Invitation required to mint offer");
      return NextResponse.json(null, { status: 200 });
    }

    console.log("token price", price);

    let tokenBalance: any = await projectConn.getUserBalance({
      address: new anchor.web3.PublicKey(receiver),
      token: coinData.target.token,
      decimals: 10 ** coinData.target.decimals,
    });

    console.log("balance", tokenBalance);

    if (tokenBalance < price * supply) {
      return NextResponse.json(
        { status: false, message: "Insufficent fund" },
        { status: 200 },
      );
    }

    let offerBody = {
      name: offerData.name,
      symbol: offerData.symbol,
      description: offerData.desc,
      image: offerData.image,
      enternal_url:
        "https://www.kinshipbots.codes/" + symbol + "/" + offerData.symbol,
      family: "Kinship Bots",
      collection: "Kinship Offers",
      attributes: [
        {
          trait_type: "Primitive",
          value: "Offer",
        },
        {
          trait_type: "Ecosystem",
          value: "Kinship Bots",
        },
        {
          trait_type: "Agent Name",
          value: projectData.name,
        },
        {
          trait_type: "Agent Symbol",
          value: projectData.symbol.toUpperCase(),
        },
        {
          trait_type: "Seniority",
          value: offerData.seniority ? offerData.seniority : 1,
        },
        {
          trait_type: "Payments",
          value: offerData.pricetype === "onetime" ? "Single" : "Subscription",
        },
        {
          trait_type: "Denomination",
          value: coinData.symbol.toUpperCase(),
        },
        {
          trait_type: "Upfront Price",
          value: 0,
        },
        {
          trait_type: "Offer",
          value: offerData.key,
        },
      ],
    };

    if (offerData.pricetype === "onetime") {
      offerBody.attributes.push({
        trait_type: "Initial Price",
        value: offerData.priceonetime,
      });
    } else {
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
      if (type === "month") {
        date.setDate(date.getDate() + 30);
        offerBody.attributes.push({
          trait_type: "Valid up to",
          value: date,
        });
      } else if (type === "year") {
        date.setDate(date.getDate() + 365);
        offerBody.attributes.push({
          trait_type: "Valid up to",
          value: date,
        });
      }
    }

    offerBody.attributes.push({
      trait_type: "Purchase Type",
      value: type,
    });

    if (offerData.discount > 0) {
      offerBody.attributes.push({
        trait_type: "Discount",
        value: offerData.discount + "%",
      });
    }

    offerBody.attributes.push({
      trait_type: "Buyer",
      value: receiver,
    });

    offerBody.attributes.push({
      trait_type: "Supply",
      value: supply,
    });

    offerBody.attributes.push({
      trait_type: "Price",
      value: price * supply,
    });

    console.log("offer body", offerBody);

    const passMetaURI: any = await pinFileToShadowDriveBackend(
      offerBody,
      receiver,
    );
    if (passMetaURI == "") {
      console.log("error on creating meta uri");
      return NextResponse.json(
        { status: false, message: "Error on creating meta uri" },
        {
          status: 200,
        },
      );
    }

    let result;
    if (!hasInivtation) {
      result = await projectConn.mintGuestPassTx(
        {
          name: offerData.name,
          symbol: offerData.symbol,
          uriHash: passMetaURI,
          genesisProfile: offerData.key,
          commonLut: offerData.lut,
        },
        receiver,
        receiver,
        userData.profilenft,
        price * 10 ** coinData.target.decimals * supply,
        supply,
      );
    } else {
      result = await projectConn.mintPassTx(
        {
          name: offerData.name,
          symbol: offerData.symbol,
          uriHash: passMetaURI,
          activationToken: offerData.badge,
          genesisProfile: offerData.key,
          commonLut: offerData.lut,
        },
        receiver,
        receiver,
        userData.profilenft,
        price * 10 ** coinData.target.decimals * supply,
        supply,
      );
    }

    if (result.Ok?.info?.profile) {
      let transaction: VersionedTransaction = result.Ok?.info?.profile;
      const serialized = Buffer.from(transaction.serialize()).toString(
        "base64",
      );
      const payload = {
        status: true,
        transaction: serialized,
        message: "Congratulations on minting offer",
      };
      return NextResponse.json(payload, {
        status: 200,
      });
    }

    return NextResponse.json(
      { status: false, message: "Something went wrong" },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log("error ", error);
    return NextResponse.json(
      { status: false, message: "Something went wrong" },
      {
        status: 200,
      },
    );
  }
}
