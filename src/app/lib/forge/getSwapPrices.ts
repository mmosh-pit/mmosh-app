import * as anchor from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";

import { Connectivity as CurveConn } from "@/anchor/curve/bonding";
import { SwapCoin } from "@/app/models/swapCoin";
import { web3Consts } from "@/anchor/web3Consts";

export const getSwapPrices = async (
  token: SwapCoin,
  wallet: AnchorWallet,
  isBase: boolean,
) => {
  const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_CLUSTER!);

  const env = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: "processed",
  });

  anchor.setProvider(env);
  const curveConn = new CurveConn(env, web3Consts.programID);
  const bondingResult = await curveConn.getTokenBonding(
    new anchor.web3.PublicKey(token.bonding),
  );

  if(!bondingResult) {
    return null
  }

  const mintDetail = await curveConn.metaplex
  .nfts()
  .findByMint({ mintAddress: bondingResult?.baseMint });


  const balances = await curveConn.getTokenBalance(
    token.token,
    bondingResult?.baseMint.toBase58(),
  );



  const base = {
    name: mintDetail.name,
    symbol: mintDetail.symbol,
    token: bondingResult?.baseMint.toBase58(),
    image: mintDetail.json?.image,
    balance: balances.target,
    bonding: token.bonding,
    desc: "",
    creatorUsername: "",
    value: 0,
  };




  console.log("bondingResult ", bondingResult)
  console.log("basemint ", bondingResult?.baseMint.toBase58())

  const target = {
    name: token.name,
    symbol: token.symbol,
    token: token.token,
    image: token.image,
    balance: balances.base,
    bonding: token.bonding,
    desc: token.desc,
    creatorUsername: token.creatorUsername,
    value: 0,
  };





  const curve = await curveConn.getPricing(
    new anchor.web3.PublicKey(token.bonding),
  );

  return {
    curve,
    targetToken: isBase ? base : target,
    baseToken: isBase ? target : base,
  };
};
