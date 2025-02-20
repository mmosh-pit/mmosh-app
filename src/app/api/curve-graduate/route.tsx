import { db } from "../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";
import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { Connectivity as CurveConn } from "@/anchor/curve/bonding";
import { web3Consts } from "@/anchor/web3Consts";

import AmmImpl, { MAINNET_POOL } from '@mercurial-finance/dynamic-amm-sdk';

export async function GET(req: NextRequest) {
  const collection = db.collection("mmosh-app-tokens");
  const { searchParams } = new URL(req.url);
  const bonding = searchParams.get("bonding");
  if(!bonding) {
    return NextResponse.json({status: false, message:"bonding key param missing"}, {
      status: 200,
    });
  }

  const result = await collection.findOne({bonding, status:"active"});
  if(!result) {
    return NextResponse.json({status: false, message:"coin not exist"}, {
      status: 200,
    });
  }


  try {
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
  
    anchor.setProvider(env);

    const constantProductPool = await AmmImpl.create(connection, new anchor.web3.PublicKey("4YeotScQfAYc68RJ4VxruxgxX4BkJLygNFAWM3KyzEix"));

    const lpSupply = await constantProductPool.getLpSupply();

    console.log("lpSupply ", lpSupply.toNumber());

const inAmountALamport = new anchor.BN(1 * 10 ** constantProductPool.tokenAMint.decimals); 

// Get deposit quote for constant product
const { poolTokenAmountOut, tokenAInAmount, tokenBInAmount } = constantProductPool.getDepositQuote(
  inAmountALamport,
  new anchor.BN(0),
  true,
  0.5
);

console.log("poolTokenAmountOut ", poolTokenAmountOut.toNumber());
console.log("tokenAInAmount ", tokenAInAmount.toNumber());
console.log("tokenBInAmount ", tokenBInAmount.toNumber());


    return NextResponse.json({status: false, message:"coin not exist"}, {
      status: 200,
    });

    const curveConn = new CurveConn(env, web3Consts.programID);
  
    // const bondingResult = await curveConn.getTokenBonding(
    //   new anchor.web3.PublicKey(bonding),
    // );
  
    // if (!bondingResult) {
    //   return NextResponse.json({status: false, message:"bonding curve not exist"}, {
    //     status: 200,
    //   });
    // }
   
    let marketCap = 1000;
    console.log("market cap ", marketCap * web3Consts.LAMPORTS_PER_OPOS)
    let curve = await curveConn.getPricing(
      new anchor.web3.PublicKey(bonding),
    )
  
    // const price = await curve!.buyTargetAmount(1)
    // console.log("price ", price)

    const supply = Math.ceil(1000 / 0.001) * web3Consts.LAMPORTS_PER_OPOS;

    console.log("supply to be minted ", supply)

    // // transfer reserve
    // const reserveRes = await curveConn.transferReserves({
    //   tokenBonding:  new anchor.web3.PublicKey(bonding),
    //   amount: bondingResult.reserveBalanceFromBonding,
    // })
  
    // console.log("reserveRes", reserveRes)
    // await delay(15000)

    // // transfer reserve and change authority
    // const closeRes = await curveConn.close({
    //   tokenBonding:  new anchor.web3.PublicKey(bonding),
    // })
  
    // console.log("closeRes", closeRes)
    // await delay(15000)

    // add required supply
    // const mintRes = await curveConn.addAddtionalToken(new anchor.web3.PublicKey(result.token), supply)
    // console.log("mintRes ", mintRes)
    // await delay(15000)

    let allocations = [
      {
        address: new anchor.web3.PublicKey(process.env.NEXT_PUBLIC_OPOS_TOKEN!),
        percentage: 80,
      },
      {
        address: new anchor.web3.PublicKey(result.token),
        percentage: 20,
      },
    ];

    const poolAddress = await curveConn.createPoolAndLockLiquidity(
      new anchor.web3.PublicKey(process.env.NEXT_PUBLIC_OPOS_TOKEN!),
      new anchor.web3.PublicKey(result.token),
      new anchor.BN(1000 * web3Consts.LAMPORTS_PER_OPOS),
      new anchor.BN(supply),
      new anchor.web3.PublicKey('21PjsfQVgrn56jSypUT5qXwwSjwKWvuoBCKbVZrgTLz4'),
      allocations
    )

    console.log("poolRes", poolAddress)

    // update coin status and pool
    await collection.updateOne(
      {
        _id: result._id,
      },
      {
        $set: {
            status: "completed",
            pool: poolAddress
        },
      },
    );

    return NextResponse.json({status: true}, {
      status: 200,
  });
  } catch (error) {
    console.log("error ", error)
    return NextResponse.json({status: false, message:"something went wrong"}, {
      status: 200,
    });
  }

}

const delay = (ms:any) => new Promise(res => setTimeout(res, ms));
