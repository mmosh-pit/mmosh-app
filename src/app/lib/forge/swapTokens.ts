import * as anchor from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";

import { Connectivity as UserConn } from "@/anchor/user";
import { Connectivity as CurveConn } from "@/anchor/curve/bonding";
import { web3Consts } from "@/anchor/web3Consts";
import { Coin } from "@/app/models/coin";
import { MintResultMessage } from "@/app/models/mintResultMessage";
import axios from "axios";
import { CoinDirectoryItem } from "@/app/models/coinDirectoryItem";

export const swapTokens = async (
  baseToken: Coin & { balance: number; value: number },
  targetToken: Coin & { balance: number; value: number },
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

  const createShare = await userConn.baseSpl.transfer_token_modified({
    mint: new anchor.web3.PublicKey(targetToken.token),
    sender: wallet.publicKey,
    receiver: ownerUser.profileHolder,
    init_if_needed: true,
    amount: targetToken.value * 0.03 * web3Consts.LAMPORTS_PER_OPOS,
  });

  const genesisShare = await userConn.baseSpl.transfer_token_modified({
    mint: new anchor.web3.PublicKey(targetToken.token),
    sender: wallet.publicKey,
    receiver: genesisUser.profileHolder,
    init_if_needed: true,
    amount: targetToken.value * 0.03 * web3Consts.LAMPORTS_PER_OPOS,
  });

  for (let index = 0; index < createShare.length; index++) {
    curveConn.txis.push(createShare[index]);
  }

  for (let index = 0; index < genesisShare.length; index++) {
    curveConn.txis.push(genesisShare[index]);
  }

  try {
    if (targetToken.token == web3Consts.oposToken.toBase58()) {
      const buyres = await curveConn.buy({
        tokenBonding: new anchor.web3.PublicKey(targetToken.bonding),
        desiredTargetAmount: new anchor.BN(
          baseToken.value * web3Consts.LAMPORTS_PER_OPOS,
        ),
        slippage: 0.5,
      });
      console.log("buyres ", buyres);
    } else {
      const sellres = await curveConn.sell({
        tokenBonding: new anchor.web3.PublicKey(targetToken.bonding),
        targetAmount: new anchor.BN(
          (targetToken.value - targetToken.value * 0.06) *
            web3Consts.LAMPORTS_PER_OPOS,
        ),
        slippage: 0.5,
      });
      console.log("sellres ", sellres);
    }

    let params;
    if (targetToken.token == web3Consts.oposToken.toBase58()) {
      // sell
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
