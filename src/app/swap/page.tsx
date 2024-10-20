"use client";
import * as React from "react";
import { useAtom } from "jotai";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

import WalletIcon from "@/assets/icons/WalletIcon";
import CompareArrows from "@/assets/icons/CompareArrows";
import { swapTokens } from "@/app/lib/forge/swapTokens";
import { BondingPricing } from "@/anchor/curve/curves";
import { web3Consts } from "@/anchor/web3Consts";
import Button from "@/app/components/common/Button";
import CoinSelect from "@/app/components/Swap/CoinSelect";
import { SwapCoin } from "@/app/models/swapCoin";
import {
  getSwapPrices,
  getSwapPricesForJup,
} from "@/app/lib/forge/getSwapPrices";
import { isDrawerOpen } from "@/app/store";
import {
  getquote,
  getSwapTransaction,
  networkCoins,
} from "@/app/lib/forge/jupiter";

import { Connection } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { Connectivity as UserConn } from "@/anchor/user";

const defaultBaseToken = {
  name: "",
  symbol: "Select",
  token: "",
  image: "",
  balance: 0,
  bonding: "",
  value: 0,
  desc: "",
  creatorUsername: "",
  decimals: 9,
  iscoin: false,
};

const Swap = () => {
  const wallet = useAnchorWallet();

  const [isDrawerShown] = useAtom(isDrawerOpen);

  const [swapLoading, setSwapLoading] = React.useState(false);
  const [result, setResult] = React.useState({ res: "", message: "" });

  const [baseToken, setBaseToken] = React.useState<SwapCoin>(defaultBaseToken);
  const [targetToken, setTargetToken] = React.useState<SwapCoin>(
    networkCoins[0],
  );

  const [curve, setCurve] = React.useState<BondingPricing>();
  const [isJupiter, setIsJupiter] = React.useState(false);

  const onTokenSelect = async (token: SwapCoin, isBase: boolean) => {
    if (isBase) {
      setBaseToken(token);
    } else {
      setTargetToken(token);
    }
    if (token.iscoin) {
      if (isBase) {
        if (targetToken.token == "") {
          return;
        }
        if (!targetToken.iscoin) {
          console.log("onTokenSelect targetToken.iscoin", targetToken);
          setTargetToken(defaultBaseToken);
          return;
        }
      } else {
        if (baseToken.token == "") {
          return;
        }
        if (!baseToken.iscoin) {
          console.log("onTokenSelect baseToken.iscoin", baseToken);
          setBaseToken(defaultBaseToken);
          return;
        }
      }
    } else {
      await loadMemecoin(token, isBase);
    }

    let isCurve = true;
    if (isBase) {
      setBaseToken(token);
      if (targetToken?.iscoin && token.iscoin) {
        isCurve = false;
      }
    } else {
      setTargetToken(token);
      if (baseToken?.iscoin && token.iscoin) {
        isCurve = false;
      }
    }

    if (isCurve) {
      await loadMemecoin(token, isBase);
    } else {
      let base;
      let target;
      if (isBase) {
        base = token;
        target = targetToken;
      } else {
        base = baseToken;
        target = token;
      }
      const result: any = await getSwapPricesForJup(base, target, wallet!);
      console.log("jup result ", result);
      setIsJupiter(true);
      setBaseToken(result.baseToken);
      setTargetToken(result.targetToken);
    }
  };

  const loadMemecoin = async (token: SwapCoin, isBase: boolean) => {
    setSwapLoading(true);
    const result: any = await getSwapPrices(token, wallet!, isBase);
    if (result) {
      setIsJupiter(false);
      setBaseToken(result.baseToken);
      setTargetToken(result.targetToken);
      setCurve(result.curve);
    }
    setSwapLoading(false);
  };

  const executeSwap = React.useCallback(async () => {
    if (!wallet) {
      setResult({ res: "error", message: "wallet is not connected" });
      return;
    }
    try {
      setSwapLoading(true);
      if (baseToken.iscoin && targetToken.iscoin) {
        const result = await getquote({
          inputMint: baseToken.token,
          outputMint: targetToken.token,
          lamportValue:
            baseToken.value *
            (baseToken.decimals == 9 ? web3Consts.LAMPORTS_PER_OPOS : 1000_000),
        });
        if (result.status) {
          const swapResult = await getSwapTransaction({
            quote: result.data,
            wallet: wallet?.publicKey.toBase58(),
          });
          let txHex = swapResult.data;

          const connection = new Connection(
            process.env.NEXT_PUBLIC_SOLANA_CLUSTER!,
          );
          const env = new anchor.AnchorProvider(connection, wallet, {
            preflightCommitment: "processed",
          });

          anchor.setProvider(env);

          const userConn: UserConn = new UserConn(env, web3Consts.programID);
          const tx = anchor.web3.VersionedTransaction.deserialize(
            Buffer.from(txHex, "base64"),
          );
          const signature = await userConn.provider.sendAndConfirm(tx);

          console.log("signature", signature);
          setResult({
            res: "success",
            message: "Congrats! Your token have been swapped successfully",
          });
          setBaseToken(defaultBaseToken);
          setTargetToken(networkCoins[0]);
          setSwapLoading(false);
        } else {
          setResult({ res: "error", message: "error on jupiter swap" });
          setSwapLoading(false);
        }
      } else {
        const response = await swapTokens(targetToken, baseToken, wallet!);
        setResult({ res: response.type, message: response.message });
        setSwapLoading(false);
      }
      setTimeout(() => {
        setResult({ res: "", message: "" });
      }, 4000);
    } catch (error) {
      setSwapLoading(false);
      console.log("swap error ", error);
    }
  }, [baseToken, targetToken, wallet]);

  const switchCoins = React.useCallback(() => {
    if (!baseToken.token) return;

    if (targetToken!.value > targetToken!.balance) {
      const isMMOSHBase =
        targetToken?.token === web3Consts.oposToken.toBase58() ||
        targetToken?.token === process.env.NEXT_PUBLIC_PTVR_TOKEN ||
        targetToken?.token === process.env.NEXT_PUBLIC_PTVB_TOKEN;

      const value = targetToken!.balance;

      const buyValue = isMMOSHBase
        ? curve!.buyWithBaseAmount(value - value * 0.06)
        : curve!.sellTargetAmount(value - value * 0.06);

      setBaseToken({ ...targetToken!, value });
      setTargetToken({ ...baseToken!, value: buyValue });
      return;
    }

    setTargetToken(baseToken);
    setBaseToken(targetToken);
  }, [baseToken, targetToken]);

  const onChangeValue = React.useCallback(
    async (value: number) => {
      if (value === 0) {
        setBaseToken({ ...baseToken!, value });
        setTargetToken({ ...targetToken!, value });
        return;
      }

      if (value < 0) {
        setBaseToken({ ...baseToken!, value: 0 });
        setTargetToken({ ...targetToken!, value });
        return;
      }

      if (value > baseToken!.balance) return;

      if (baseToken.token == "" || targetToken.token == "") return;

      if (baseToken.iscoin || targetToken.iscoin) {
        console.log("baseToken.decimals", baseToken.decimals);
        setBaseToken({ ...baseToken!, value });
        const result = await getquote({
          inputMint: baseToken.token,
          outputMint: targetToken.token,
          lamportValue:
            value *
            (baseToken.decimals == 9 ? web3Consts.LAMPORTS_PER_OPOS : 1000_000),
        });
        if (result.status) {
          console.log(targetToken.decimals);

          setTargetToken({
            ...targetToken!,
            value:
              result.data.outAmount /
              (targetToken.decimals == 9
                ? web3Consts.LAMPORTS_PER_OPOS
                : 1000_000),
          });
        }
      } else {
        const isMMOSHBase =
          baseToken?.token === web3Consts.oposToken.toBase58() ||
          baseToken?.token === process.env.NEXT_PUBLIC_PTVR_TOKEN ||
          baseToken?.token === process.env.NEXT_PUBLIC_PTVB_TOKEN;

        setBaseToken({ ...baseToken!, value });

        const buyValue = isMMOSHBase
          ? curve!.buyWithBaseAmount(value - value * 0.06)
          : curve!.sellTargetAmount(value - value * 0.06);

        setTargetToken({ ...targetToken!, value: buyValue });
      }
    },
    [baseToken, targetToken],
  );

  return (
    <div
      className={`background-content flex flex-col items-center ${isDrawerShown ? "z-[-1]" : ""}`}
    >
      <h3 className="mt-20">Swap</h3>
      <div className="swap-container-card mt-8 max-h-[550px] md:p-4 lg:p-6 rounded-xl">
        <div className="swap-container-inner mx-12 p-8">
          <div className="flex w-full flex-col justify-between">
            <div className="w-full flex justify-between">
              <p className="font-bold text-white text-sm mr-2">You're Paying</p>
              <div className="flex items-center">
                <WalletIcon />
                <p className="font-normal text-sm text-white mx-1">
                  {baseToken.balance}
                </p>
                {baseToken.symbol !== "Select" && (
                  <p className="font-normal text-sm text-white">
                    {baseToken.symbol}
                  </p>
                )}
              </div>
            </div>

            <div className="w-full flex justify-between px-1 py-2 bg-[#00000021] rounded-md border-white border-opacity-[0.05] border-[1px]">
              <CoinSelect
                key={"base"}
                selectedCoin={baseToken}
                onTokenSelect={onTokenSelect}
                otherToken={targetToken}
                isBase={true}
                readonly={false}
              />

              <div className="w-[25%] flex justify-end">
                <input
                  value={baseToken.value}
                  readOnly={!baseToken.token}
                  type="number"
                  onChange={(e) => {
                    const number = Number(e.target.value);

                    if (Number.isNaN(number)) return;

                    onChangeValue(number);
                  }}
                  placeholder="0.00"
                  className="input max-w-[100%] text-center text-xs bg-transparent placeholder-white placeholder-opacity-[0.3]"
                />
              </div>
            </div>
          </div>

          <button
            onClick={switchCoins}
            className="swap-arrows-button rounded-full mt-8 mb-4"
          >
            <CompareArrows />
          </button>

          <div className="flex w-full flex-col justify-between">
            <div className="w-full flex justify-between">
              <p className="font-bold text-white text-sm mr-2">To receive</p>
              <div className="flex items-center">
                <WalletIcon />
                <p className="font-normal text-sm text-white ml-1">
                  {targetToken.balance}
                </p>
                <p className="font-normal text-sm text-white ml-1">
                  {targetToken.symbol}
                </p>
              </div>
            </div>

            <div className="w-full flex justify-between px-1 py-2 bg-[#DEDDFC12] rounded-md border-white border-opacity-[0.05] border-[1px]">
              <CoinSelect
                key={"target"}
                selectedCoin={targetToken}
                onTokenSelect={onTokenSelect}
                isBase={false}
                otherToken={baseToken}
                readonly={false}
              />

              <div className="w-[25%] flex justify-end">
                <input
                  readOnly={true}
                  value={targetToken.value}
                  onChange={() => {}}
                  className="input max-w-[100%] text-center text-xs bg-transparent placeholder-white placeholder-opacity-[0.3]"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col mt-4">
            {result.res === "error" && (
              <p className="text-red-600 text-center mb-2 text-sm">
                There was an error while swapping your tokens. Please, try again
              </p>
            )}
            {result.res === "success" && (
              <p className="text-green-500 text-center mb-2 text-sm">
                Congrats! Your tokens have been swapped successfully
              </p>
            )}
            <Button
              disabled={baseToken.value === 0 || swapLoading}
              isLoading={swapLoading}
              title="Swap"
              size="large"
              action={executeSwap}
              isPrimary
            />
            <div className="w-full flex justify-between items-center">
              <p className="text-tiny mr-4">
                The price will automatically update after a period of time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;
