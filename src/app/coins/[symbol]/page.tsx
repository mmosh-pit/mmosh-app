"use client";
import * as React from "react";
import axios from "axios";

import ArrowBack from "@/assets/icons/ArrowBack";
import { useRouter } from "next/navigation";
import { Coin } from "@/app/models/coin";
import Graphics from "@/app/components/Forge/CoinPage/Graphics";
import Stats from "@/app/components/Forge/CoinPage/Stats";
import TransactionsTable from "@/app/components/Forge/CoinPage/TransactionsTable";
import * as anchor from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";
import { Connectivity as CurveConn } from "@/anchor/curve/bonding";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { web3Consts } from "@/anchor/web3Consts";

const Page = ({ params }: { params: { symbol: string } }) => {
  const navigate = useRouter();
  const wallet = useAnchorWallet();
  const rendered = React.useRef(false);

  const [baseCoin, setBaseCoin] = React.useState<Coin | null>(null);
  const [coin, setCoin] = React.useState<Coin | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const goBack = React.useCallback(() => {
    navigate.back();
  }, []);

  const getBaseToken = async (bondingKey: string) => {
    if (!wallet) {
      return;
    }
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_CLUSTER!);

    const env = new anchor.AnchorProvider(connection, wallet, {
      preflightCommitment: "processed",
    });

    anchor.setProvider(env);
    const curveConn = new CurveConn(env, web3Consts.programID);
    const bondingResult = await curveConn.getTokenBonding(
      new anchor.web3.PublicKey(bondingKey),
    );

    if (!bondingResult) {
      return null;
    }

    const mintDetail = await curveConn.metaplex
      .nfts()
      .findByMint({ mintAddress: bondingResult?.baseMint });

    setBaseCoin({
      name: mintDetail.name,
      symbol: mintDetail.symbol,
      desc: mintDetail.json?.description ? mintDetail.json?.description : "",
      token: mintDetail.address.toBase58(),
      image: mintDetail.json?.image ? mintDetail.json?.image : "",
      bonding: coin?.bonding ? coin.bonding : "",
      creatorUsername: coin?.creatorUsername ? coin.creatorUsername : "",
    });
  };

  const fetchCoinData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await axios.get<Coin>(
        `/api/get-token-by-symbol?symbol=${params.symbol}`,
      );
      setIsLoading(false);
      setCoin(result.data);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [params]);

  React.useEffect(() => {
    if (!rendered.current) {
      fetchCoinData();
      rendered.current = true;
    }
  }, [params]);

  React.useEffect(() => {
    if (wallet && coin) {
      getBaseToken(coin?.bonding);
    }
  }, [wallet, coin]);

  if (isLoading) {
    return (
      <div className="background-content flex w-full justify-center items-center">
        <span className="loading loading-spinner w-[8vmax] h-[8vmax] loading-lg bg-[#BEEF00]"></span>
      </div>
    );
  }

  if (!coin && !baseCoin) {
    return (
      <div className="background-content flex flex-col max-h-full pt-20 px-12" />
    );
  }

  return (
    <>
      {coin && baseCoin && (
        <div className="background-content relative flex flex-col max-h-full pt-20 px-12">
          <div className="w-full flex justify-between">
            <div className="flex items-center mb-4 ml-4">
              <div
                className="flex items-center mr-4 cursor-pointer"
                onClick={goBack}
              >
                <ArrowBack />
                <p className="text-white text-sm">Back</p>
              </div>

              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={coin.image}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>

                <h6 className="mx-2">{coin.name}</h6>
                <p className="text-tiny">{coin.symbol}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12">
            <div className="col-span-7">
              <Graphics coin={coin} base={baseCoin} />
            </div>

            <div className="col-span-5 mt-5 md:mt-0">
              <Stats coin={coin} base={baseCoin} />
            </div>
          </div>

          <div className="w-full py-10 overflow-x-auto">
            <TransactionsTable coin={coin} base={baseCoin} />
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
