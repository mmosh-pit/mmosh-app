import { db } from "../../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";
import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { Connectivity as UserConn } from "@/anchor/user";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { web3Consts } from "@/anchor/web3Consts";

export async function POST(req: NextRequest) {
    try {
        
        const collection = db.collection("mmosh-app-ptv");
        const { address, type } = await req.json();

        let claimDate = convertUTCDateToLocalDate(new Date("2024-11-05"))
        let dateDiff = new Date().getTime() - claimDate.getTime();
        if(dateDiff > 0) {
            return NextResponse.json({status: false, message: "Pls try cliam after Nov 5th 2024"}, { status: 200 });
        }

        const ptvData = await collection.findOne({
            wallet: address,
        });

        if(!ptvData) {
            return NextResponse.json(
                {
                    status: false, 
                    message: "Claim not available"
                }, 
            { status: 200 });
        }
        
        let amount = 0
        let tokenAddress:any = process.env.NEXT_PUBLIC_PTVR_TOKEN
        if(type === "Blue") {
            tokenAddress = process.env.NEXT_PUBLIC_PTVB_TOKEN
            if(ptvData.blueavailable) {
                amount = ptvData.blueavailable
            }
        } else {
            if(ptvData.redavailable) {
                amount = ptvData.redavailable
            }
        }

        if(amount === 0) {
            return NextResponse.json(
                {
                    status: false, 
                    message: "Claim not available"
                }, 
            { status: 200 });
        }
        const privateKey = process.env.PTV_WALLET!;

        
        const private_buffer = bs58.decode(privateKey);
        const private_arrray = new Uint8Array(
        private_buffer.buffer,
        private_buffer.byteOffset,
        private_buffer.byteLength / Uint8Array.BYTES_PER_ELEMENT,
        );
        let ptvOwner = Keypair.fromSecretKey(private_arrray)

        let rpcUrl: any = process.env.NEXT_PUBLIC_SOLANA_CLUSTER;
        let connection = new Connection(rpcUrl);
        let wallet = new NodeWallet(ptvOwner);
        const env = new anchor.AnchorProvider(connection, wallet, {
        preflightCommitment: "processed",
        });
        let userConn: UserConn = new UserConn(env, web3Consts.programID);

        let balance = await userConn.getUserBalance({
            address: tokenAddress,
            decimals: web3Consts.LAMPORTS_PER_OPOS
        })

        if(balance < amount) {
            return NextResponse.json(
                {
                    status: false, 
                    message: "Not enough fund to distribute claim"
                }, 
            { status: 200 });
        }

        let txis = []
        let clamInstructions:any =  await userConn.baseSpl.transfer_token_modified({ mint: new anchor.web3.PublicKey(tokenAddress), sender: wallet.publicKey, receiver: new anchor.web3.PublicKey(address), init_if_needed: true, amount: Math.ceil(amount)});
        for (let index = 0; index < clamInstructions.length; index++) {
            txis.push(clamInstructions[index]);
        }
        const tx = new anchor.web3.Transaction().add(...txis);
    
        tx.recentBlockhash = (
            await userConn.connection.getLatestBlockhash()
        ).blockhash;
        tx.feePayer = new anchor.web3.PublicKey(address);

        const feeEstimate = await userConn.getPriorityFeeEstimate(tx);
        let feeIns;
        if (feeEstimate > 0) {
            feeIns = anchor.web3.ComputeBudgetProgram.setComputeUnitPrice({
                microLamports: feeEstimate,
            });
        } else {
            feeIns = anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
                units: 1_400_000,
            });
        }
        tx.add(feeIns);

        const signeTx = await wallet.signTransaction(tx)

        const serialized = Buffer.from(signeTx.serialize()).toString('base64');

        return NextResponse.json(
            {
                status: true, 
                transaction: serialized,
                message: "Ready to claim"
            }, 
        { status: 200 });

    } catch (error) {
        console.log("error ", error)
        return NextResponse.json(
            {
                status: false, 
                message: "Something went wrong"
            }, 
        { status: 200 }); 
    }
}

const convertUTCDateToLocalDate = (date: any) => {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();
    newDate.setHours(hours - offset);
    return newDate;   
}