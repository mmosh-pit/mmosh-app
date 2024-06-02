import * as anchor from "@coral-xyz/anchor";

import { Connectivity as CurveConn } from "@/anchor/curve/bonding";
import { web3Consts } from "@/anchor/web3Consts";
import { Coin } from "@/app/models/coin";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";

export const getSwapTokenInfo = async (
  token: Coin,
  wallet: AnchorWallet,
  switcher = false,
) => {
  const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_CLUSTER!);

  const env = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: "processed",
  });

  anchor.setProvider(env);
  const curveConn: CurveConn = new CurveConn(env, web3Consts.programID);

  const balances = await curveConn.getTokenBalance(
    token.token,
    web3Consts.oposToken.toBase58(),
  );

  const target = {
    name: token.name,
    symbol: token.symbol,
    token: token.token,
    image: token.image,
    balance: balances.base,
    bonding: token.bonding,
    value: 0,
  };

  const base = {
    name: "MMOSH: The Stoked Token",
    symbol: "MMOSH",
    token: web3Consts.oposToken.toBase58(),
    image:
      "https://shdw-drive.genesysgo.net/7nPP797RprCMJaSXsyoTiFvMZVQ6y1dUgobvczdWGd35/MMoshCoin.png",
    balance: balances.target,
    bonding: token.bonding,
    value: 0,
  };

  let targetToken = null;
  let baseToken = null;

  if (switcher) {
    targetToken = base;
    baseToken = target;
  } else {
    targetToken = target;
    baseToken = base;
  }

  const pricing = await curveConn.getPricing(
    new anchor.web3.PublicKey(token.bonding),
  );

  return { pricing, solBalance: balances.sol, targetToken, baseToken };
};
