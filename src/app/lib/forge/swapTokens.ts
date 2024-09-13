import * as anchor from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";

import { Connectivity as UserConn } from "@/anchor/user";
import { Connectivity as CurveConn } from "@/anchor/curve/bonding";
import { web3Consts } from "@/anchor/web3Consts";
import { MintResultMessage } from "@/app/models/mintResultMessage";
import axios from "axios";
import { CoinDirectoryItem } from "@/app/models/coinDirectoryItem";
import { SwapCoin } from "@/app/models/swapCoin";
import { list } from "firebase/storage";

export const swapTokens = async (
  baseToken: SwapCoin,
  targetToken: SwapCoin,
  wallet: AnchorWallet,
): Promise<MintResultMessage> => {
  const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_CLUSTER!);

  const env = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: "processed",
  });

  anchor.setProvider(env);
  const curveConn: CurveConn = new CurveConn(env, web3Consts.programID);
  const userConn: UserConn = new UserConn(env, web3Consts.programID);
  const tokenBondingAcct = await curveConn.getTokenBonding(
    new anchor.web3.PublicKey(targetToken.bonding),
  );
  const genesisUser = await userConn.getGensisProfileOwner();
  const ownerUser = await userConn.getNftProfileOwner(
    tokenBondingAcct!.targetMint,
  );

  const creatorInfo = await axios.get(
    `/api/get-wallet-data?wallet=${ownerUser.profileHolder.toBase58()}`,
  );

  console.log("creatorInfo ", creatorInfo)
  let hasProfile = false;
  if(creatorInfo.data) {
    if(creatorInfo.data.profilenft) {
      hasProfile = true
    }
  }

  let listResult = await axios.get(`/api/project/detail?symbol=PTV`);
  const genesisPassUser = await userConn.getNftProfileOwner(
   new anchor.web3.PublicKey(listResult.data.project.key),
  );

  if(hasProfile) {
    const creatorShare = await userConn.baseSpl.transfer_token_modified({
      mint: new anchor.web3.PublicKey(targetToken.token),
      sender: wallet.publicKey,
      receiver: ownerUser.profileHolder,
      init_if_needed: true,
      amount: Math.ceil(targetToken.value * 0.03 * web3Consts.LAMPORTS_PER_OPOS),
    });

    const gensisPassShare = await userConn.baseSpl.transfer_token_modified({
      mint: new anchor.web3.PublicKey(targetToken.token),
      sender: wallet.publicKey,
      receiver: genesisPassUser.profileHolder,
      init_if_needed: true,
      amount: Math.ceil(targetToken.value * 0.02 * web3Consts.LAMPORTS_PER_OPOS),
    });

    for (let index = 0; index < creatorShare.length; index++) {
      curveConn.txis.push(creatorShare[index]);
    }

    for (let index = 0; index < gensisPassShare.length; index++) {
      curveConn.txis.push(gensisPassShare[index]);
    }
  } else {
    const creatorShare = await userConn.baseSpl.transfer_token_modified({
      mint: new anchor.web3.PublicKey(targetToken.token),
      sender: wallet.publicKey,
      receiver: ownerUser.profileHolder,
      init_if_needed: true,
      amount: Math.ceil(targetToken.value * 0.02 * web3Consts.LAMPORTS_PER_OPOS),
    });

    const gensisPassShare = await userConn.baseSpl.transfer_token_modified({
      mint: new anchor.web3.PublicKey(targetToken.token),
      sender: wallet.publicKey,
      receiver: genesisPassUser.profileHolder,
      init_if_needed: true,
      amount: Math.ceil(targetToken.value * 0.03 * web3Consts.LAMPORTS_PER_OPOS),
    });

    for (let index = 0; index < gensisPassShare.length; index++) {
      curveConn.txis.push(gensisPassShare[index]);
    }

    for (let index = 0; index < creatorShare.length; index++) {
      curveConn.txis.push(creatorShare[index]);
    }
  }

  const genesisShare = await userConn.baseSpl.transfer_token_modified({
    mint: new anchor.web3.PublicKey(targetToken.token),
    sender: wallet.publicKey,
    receiver: genesisUser.profileHolder,
    init_if_needed: true,
    amount: Math.ceil(targetToken.value * 0.01 * web3Consts.LAMPORTS_PER_OPOS),
  });


  for (let index = 0; index < genesisShare.length; index++) {
    curveConn.txis.push(genesisShare[index]);
  }

  try {
  
    if (targetToken.token == web3Consts.oposToken.toBase58() || targetToken.token == process.env.NEXT_PUBLIC_PTVB_TOKEN || targetToken.token == process.env.NEXT_PUBLIC_PTVR_TOKEN) {
      let buyres;
      if(targetToken.token == web3Consts.oposToken.toBase58()) {
        buyres = await curveConn.buy({
          tokenBonding: new anchor.web3.PublicKey(targetToken.bonding),
          desiredTargetAmount: new anchor.BN(
            baseToken.value * web3Consts.LAMPORTS_PER_OPOS,
          ),
          slippage: 0.5,
        });
      } else {
        const buytx = await axios.post("/api/ptv/swap",{
          bonding: targetToken.bonding,
          supply:  baseToken.value,
          address: wallet.publicKey.toBase58()
        })
        if(buytx.data.status) {
          const tx = anchor.web3.VersionedTransaction.deserialize(Buffer.from(buytx.data.transaction,"base64"))
          buyres = await curveConn.provider.sendAndConfirm(tx)
          if(buyres) {
              let tokenType = "Blue"
              if(targetToken.token === process.env.NEXT_PUBLIC_PTVR_TOKEN) {
                tokenType = "Red"
              }
              await axios.post("/api/ptv/update-rewards",{
                type: tokenType,
                wallet: wallet.publicKey.toBase58(),
                method: "buy",
                value: targetToken.value
              })
          }
        } else {
          return {
            message:
              "We’re sorry, there was an error while trying to mint. Check your wallet and try again.",
            type: "error",
          };
        }
      }
      console.log("buyres ", buyres);
    } else {
      let supply = Math.ceil((targetToken.value - targetToken.value * 0.06))
      let sellres
      console.log("baseToken.token ", baseToken.token)
      if(baseToken.token == process.env.NEXT_PUBLIC_PTVB_TOKEN || baseToken.token == process.env.NEXT_PUBLIC_PTVR_TOKEN) {
        let stakePublicKey:any = process.env.NEXT_PUBLIC_PTV_WALLET_KEY;

        userConn.txis = []
        let txis = [];
        const { ata: destination } =
        await userConn.baseSpl.__getOrCreateTokenAccountInstruction(
          { mint: new anchor.web3.PublicKey(baseToken.token), owner: new anchor.web3.PublicKey(stakePublicKey) },
          (userConn.ixCallBack),
        );

        for (let index = 0; index < userConn.txis.length; index++) {
          const element = userConn.txis[index];
          txis.push(element)
        }
        userConn.txis = []

        let tokenObj = await curveConn.sellInstructions({
          tokenBonding: new anchor.web3.PublicKey(targetToken.bonding),
          targetAmount: new anchor.BN(
            supply * web3Consts.LAMPORTS_PER_OPOS,
          ),
          slippage: 0.5,
          destination: destination
        });

        for (let index = 0; index < tokenObj.instructions.length; index++) {
          const element = tokenObj.instructions[index];
          txis.push(element)
        }

        const tx = new anchor.web3.Transaction().add(...txis);
        tx.recentBlockhash = (
          await curveConn.connection.getLatestBlockhash()
        ).blockhash;
        tx.feePayer = curveConn.provider.publicKey;
        
        const feeEstimate = await curveConn.getPriorityFeeEstimate(tx);
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
        sellres = await curveConn.provider.sendAndConfirm(
          tx,
          tokenObj.signers,
        );
      } else {
        sellres = await curveConn.sell({
          tokenBonding: new anchor.web3.PublicKey(targetToken.bonding),
          targetAmount: new anchor.BN(
            supply * web3Consts.LAMPORTS_PER_OPOS,
          ),
          slippage: 0.5
        });
      }
      if(sellres) {
        if(baseToken.token == process.env.NEXT_PUBLIC_PTVB_TOKEN || baseToken.token == process.env.NEXT_PUBLIC_PTVR_TOKEN) {
          let tokenType = "Blue"
          if(baseToken.token === process.env.NEXT_PUBLIC_PTVR_TOKEN) {
            tokenType = "Red"
          }
          const curve = await curveConn.getPricing(
            new anchor.web3.PublicKey(targetToken.bonding),
          );
          const value = targetToken.value;
          await axios.post("/api/ptv/update-rewards",{
            type: tokenType,
            wallet: wallet.publicKey.toBase58(),
            method: "sell",
            value: curve!.sellTargetAmount(value - value * 0.06)
          })
        }
      }
      console.log("sellres ", sellres);
    }

    let params;
    if (targetToken.token == web3Consts.oposToken.toBase58()) {
      params = {
        basekey: targetToken.token,
        basename: targetToken.name,
        basesymbol: targetToken.symbol,
        baseimg: targetToken.image,
        bonding: targetToken.bonding,
        targetkey: baseToken.token,
        targetname: baseToken.name,
        targetsymbol: baseToken.symbol,
        targetimg: baseToken.image,
        value: targetToken.value - targetToken.value * 0.06,
        price: baseToken.value / (targetToken.value - targetToken.value * 0.06),
        type: "sell",
        wallet: wallet.publicKey.toBase58(),
      };
    } else {
      params = {
        basekey: baseToken.token,
        basename: baseToken.name,
        basesymbol: baseToken.symbol,
        baseimg: baseToken.image,
        bonding: baseToken.bonding,
        targetkey: targetToken.token,
        targetname: targetToken.name,
        targetsymbol: targetToken.symbol,
        targetimg: targetToken.image,
        value: baseToken.value,
        price: (targetToken.value - targetToken.value * 0.06) / baseToken.value,
        type: "buy",
        wallet: wallet.publicKey.toBase58(),
      };
    }
    await saveDirectory(params);

    await userConn.storeRoyalty(
      wallet.publicKey.toBase58(),
      [
        {
          receiver: ownerUser.profileHolder.toBase58(),
          amount: targetToken.value * 0.03,
        },
        {
          receiver: genesisUser.profileHolder.toBase58(),
          amount: targetToken.value * 0.03,
        },
      ],
      targetToken.token,
    );

    const returningToken =
      targetToken.token !== web3Consts.oposToken.toBase58()
        ? targetToken
        : baseToken;

    return {
      message: "Congrats! Your token have been swapped successfully",
      type: "success",
      data: {
        token: returningToken,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      message:
        "There was an error while swapping your tokens. Please, try again.",
      type: "error",
    };
  }
};

const saveDirectory = async (params: CoinDirectoryItem) => {
  await axios.post("/api/save-directory", params);
};
