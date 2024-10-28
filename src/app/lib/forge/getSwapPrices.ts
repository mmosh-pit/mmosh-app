import * as anchor from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";

import { Connectivity as CurveConn } from "@/anchor/curve/bonding";
import { SwapCoin } from "@/app/models/swapCoin";
import { web3Consts } from "@/anchor/web3Consts";
import axios from "axios";

export const getSwapPrices = async (
  token: SwapCoin,
  wallet: AnchorWallet,
  isBase: boolean,
) => {
  const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_CLUSTER!, {
    confirmTransactionInitialTimeout: 120000
  });

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
    9,
    bondingResult?.baseMint.toBase58(),
    9
  );
  let baseBalance = 0
  // if(bondingResult?.baseMint.toBase58() === web3Consts.oposToken.toBase58()) {
    baseBalance = balances.target
  // } else {
  //   let type = "Red"
  //   if(bondingResult?.baseMint.toBase58() === process.env.NEXT_PUBLIC_PTVB_TOKEN) {
  //     type = "Blue"
  //   }
  //   let coinData = await axios("/api/ptv/rewards?type="+type+"&&wallet="+wallet?.publicKey.toBase58())
  //   baseBalance = coinData.data ? (coinData.data.claimable + coinData.data.unstakable) : 0
  // }

  const base = {
    name: mintDetail.name,
    symbol: mintDetail.symbol,
    token: bondingResult?.baseMint.toBase58(),
    image: mintDetail.json?.image,
    balance: baseBalance,
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


export const getSwapPricesForJup = async (
  baseToken: SwapCoin,
  targetToken: SwapCoin,
  wallet: AnchorWallet,
) => {
  const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_CLUSTER!, {
    confirmTransactionInitialTimeout: 120000
  });

  const env = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: "processed",
  });

  anchor.setProvider(env);
  const curveConn = new CurveConn(env, web3Consts.programID);



  const balances = await curveConn.getTokenBalance(
    baseToken.token,
    baseToken.decimals ? baseToken.decimals : 9,
    targetToken.token,
    targetToken.decimals ? targetToken.decimals : 9,
  );
  let baseBalance = 0
  // let basetype = ""
  // if(baseToken.token == process.env.NEXT_PUBLIC_PTVB_TOKEN) {
  //   basetype = "Blue"
  // }
  // if(baseToken.token == process.env.NEXT_PUBLIC_PTVR_TOKEN) {
  //   basetype = "Red"
  // }
  // if(basetype !== "") {
  //   let coinData = await axios("/api/ptv/rewards?type="+basetype+"&&wallet="+wallet?.publicKey.toBase58())
  //   baseBalance = coinData.data ? (coinData.data.claimable + coinData.data.unstakable) : 0
  // }

  let targetBalance = 0
  // let targettype = ""
  // if(targetToken.token == process.env.NEXT_PUBLIC_PTVB_TOKEN) {
  //   targettype = "Blue"
  // }
  // if(targetToken.token == process.env.NEXT_PUBLIC_PTVR_TOKEN) {
  //   targettype = "Red"
  // }
  // if(targettype !== "") {
  //   let coinData = await axios("/api/ptv/rewards?type="+targettype+"&&wallet="+wallet?.publicKey.toBase58())
  //   targetBalance = coinData.data ? (coinData.data.claimable + coinData.data.unstakable) : 0
  // }

  console.log("base token ", baseToken.token)
  console.log("target token ", targetToken.token)
  console.log("all balances ", balances)

  const base = {
    name: baseToken.name,
    symbol: baseToken.symbol,
    token: baseToken.token,
    image: baseToken.image,
    balance: baseToken.symbol.toLowerCase() === "wsol" ? balances.sol :  balances.base + baseBalance,
    bonding: "",
    desc: "",
    creatorUsername: "",
    value: 0,
    iscoin: baseToken.iscoin,
    decimals: baseToken.decimals
  };

  const target = {
    name: targetToken.name,
    symbol: targetToken.symbol,
    token: targetToken.token,
    image: targetToken.image,
    balance: targetToken.symbol.toLowerCase() === "wsol" ? balances.sol : balances.target + targetBalance,
    bonding: "",
    desc: "",
    creatorUsername: "",
    value: 0,
    iscoin: targetToken.iscoin,
    decimals: targetToken.decimals
  };

  return {
    targetToken: target ,
    baseToken: base
  };
};
