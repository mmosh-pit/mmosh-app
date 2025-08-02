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
        const { amount, address, parentAddress } = await req.json();
        console.log("----- CHECK 1 -----");
        const adminPrivateKey = process.env.PTV_WALLET!;
        console.log("----- CHECK 2 -----");
        const private_buffer = bs58.decode(adminPrivateKey);
        console.log("----- CHECK 3 -----");
        const private_arrray = new Uint8Array(
            private_buffer.buffer,
            private_buffer.byteOffset,
            private_buffer.byteLength / Uint8Array.BYTES_PER_ELEMENT,
        );
        console.log("----- CHECK 4 -----");
        let ptvOwner = Keypair.fromSecretKey(private_arrray);
        console.log("----- CHECK 5 -----");

        let rpcUrl: any = process.env.NEXT_PUBLIC_SOLANA_CLUSTER;
        console.log("----- CHECK 6 -----", rpcUrl);
        let connection = new Connection(rpcUrl, {
            confirmTransactionInitialTimeout: 120000
        });
        console.log("----- CHECK 7 -----");
        let wallet = new NodeWallet(ptvOwner);
        console.log("----- CHECK 8 -----");
        const env = new anchor.AnchorProvider(connection, wallet, {
            preflightCommitment: "processed",
        });
        console.log("----- CHECK 9 -----");
        let userConn: UserConn = new UserConn(env, web3Consts.programID);
        console.log("----- CHECK 10 -----");
        console.log("----- WALLET PUBLIC KEY -----", wallet.publicKey.toString());
        console.log("----- USDC TOKEN KEY -----", web3Consts.usdcToken);
        console.log("----- USDC LAMPORTS_PER_OPOS -----", web3Consts.LAMPORTS_PER_OPOS);
        let balance: any = await userConn.getUserBalance({
            address: wallet.publicKey,
            token: web3Consts.usdcToken.toBase58(),
            decimals: 1000000
        })
        console.log("----- CHECK 11 -----", balance);
        if (balance * 10 ** 6 < amount * 10 ** 6) {
            return NextResponse.json(
                {
                    status: false,
                    message: "Not enough fund to distribute claim"
                },
                { status: 200 });
        }
        console.log("----- CHECK 12 -----");

        let txis = []
        console.log("----- CHECK 13 -----");
        console.log("----- AMOUNT -----", amount);
        console.log("----- AMOUNT PREFIX -----", amount * 10 ** 6);
        let clamInstructions: any = await userConn.baseSpl.transfer_token_modified({ mint: new anchor.web3.PublicKey(web3Consts.usdcToken), sender: wallet.publicKey, receiver: new anchor.web3.PublicKey(address), init_if_needed: true, amount: Math.ceil((amount * 10 ** 6) * 90 / 100) });
        let clamInstructions2: any = await userConn.baseSpl.transfer_token_modified({
            mint: new anchor.web3.PublicKey(web3Consts.usdcToken),
            sender: wallet.publicKey,
            receiver: new anchor.web3.PublicKey(parentAddress),
            init_if_needed: true,
            amount: Math.ceil((amount * 10 ** 6) * 10 / 100),
        });
        console.log("----- CHECK 14 -----");
        for (let i = 0; i < clamInstructions.length; i++) {
            txis.push(clamInstructions[i]);
        }
        for (let i = 0; i < clamInstructions2.length; i++) {
            txis.push(clamInstructions2[i]);
        }
        console.log("----- CHECK 15 -----");

        const freezeInstructions = await calculatePriorityFee(
            txis,
            ptvOwner,
            userConn
        );
        console.log("----- CHECK 16 -----");
        for (let j = 0; j < freezeInstructions.length; j++) {
            const element = freezeInstructions[j];
            txis.push(element);
        }
        console.log("----- CHECK 17 -----");

        const blockhash = (await connection.getLatestBlockhash()).blockhash;
        console.log("----- CHECK 18 -----");
        const message = new anchor.web3.TransactionMessage({
            payerKey: new anchor.web3.PublicKey(address),
            recentBlockhash: blockhash,
            instructions: [...txis],
        }).compileToV0Message([]);
        console.log("----- CHECK 19 -----");

        const tx = new anchor.web3.VersionedTransaction(message);
        console.log("----- CHECK 20 -----");
        tx.sign([ptvOwner])
        console.log("----- CHECK 21 -----");
        const serialized = Buffer.from(tx.serialize()).toString('base64');
        console.log("----- CHECK 22 -----");

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

const calculatePriorityFee = async (ixs: any, mintKp: any, userConn: UserConn) => {
    let rpcUrl: any = process.env.NEXT_PUBLIC_SOLANA_CLUSTER;
    let connection = new Connection(rpcUrl, {
        confirmTransactionInitialTimeout: 120000
    });
    const blockhash = (await connection.getLatestBlockhash()).blockhash;
    const message = new anchor.web3.TransactionMessage({
        payerKey: userConn.provider.publicKey,
        recentBlockhash: blockhash,
        instructions: [...ixs],
    }).compileToV0Message([]);

    const tx = new anchor.web3.VersionedTransaction(message);
    tx.sign([mintKp]);

    const feeEstimate = await userConn.getPriorityFeeEstimate(tx);
    let feeIns: any = [];
    if (feeEstimate > 0) {
        feeIns.push(
            anchor.web3.ComputeBudgetProgram.setComputeUnitPrice({
                microLamports: feeEstimate,
            }),
        );
        feeIns.push(
            anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
                units: 1_400_000,
            }),
        );
    } else {
        feeIns.push(
            anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
                units: 1_400_000,
            }),
        );
    }

    return feeIns;
}