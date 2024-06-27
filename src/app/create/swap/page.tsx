"use client";
import * as React from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

import WalletIcon from "@/assets/icons/WalletIcon";
import CompareArrows from "@/assets/icons/CompareArrows";
import { swapTokens } from "@/app/lib/forge/swapTokens";
import { BondingPricing } from "@/anchor/curve/curves";
import { web3Consts } from "@/anchor/web3Consts";
import Button from "@/app/components/common/Button";
import CoinSelect from "@/app/components/Swap/CoinSelect";
import { SwapCoin } from "@/app/models/swapCoin";
import { getSwapPrices } from "@/app/lib/forge/getSwapPrices";

const defaultBaseToken = {
  name: "",
  symbol: "Select",
  token: "",
  image:
    "https://shdw-drive.genesysgo.net/7nPP797RprCMJaSXsyoTiFvMZVQ6y1dUgobvczdWGd35/MMoshCoin.png",
  balance: 0,
  bonding: "",
  value: 0,
  desc: "",
  creatorUsername: "",
};

const defaultMMOSHToken = {
  name: "MMOSH: The Stoked Token",
  symbol: "MMOSH",
  token: web3Consts.oposToken.toBase58(),
  image:
    "https://shdw-drive.genesysgo.net/7nPP797RprCMJaSXsyoTiFvMZVQ6y1dUgobvczdWGd35/MMoshCoin.png",
  balance: 0,
  bonding: "",
  value: 0,
  desc: "",
  creatorUsername: "",
};

const Swap = () => {
  const wallet = useAnchorWallet();

  const [swapLoading, setSwapLoading] = React.useState(false);
  const [result, setResult] = React.useState({ res: "", message: "" });

  const [baseToken, setBaseToken] = React.useState<SwapCoin>(defaultBaseToken);
  const [targetToken, setTargetToken] =
    React.useState<SwapCoin>(defaultMMOSHToken);

  const [curve, setCurve] = React.useState<BondingPricing>();

  const onTokenSelect = React.useCallback(
    async (token: SwapCoin, isBase: boolean) => {
      console.log("Wallet: ", wallet);
      setSwapLoading(true);
      const result = await getSwapPrices(token, wallet!, isBase);

      setBaseToken(result.baseToken);
      setTargetToken(result.targetToken);
      setCurve(result.curve);
      setSwapLoading(false);
    },
    [wallet],
  );

  const executeSwap = React.useCallback(async () => {
    setSwapLoading(true);
    const response = await swapTokens(targetToken, baseToken, wallet!);

    setResult({ res: response.type, message: response.message });
    setSwapLoading(false);

    setTimeout(() => {
      setResult({ res: "", message: "" });
    }, 4000);
  }, [baseToken, targetToken, wallet]);

  const switchCoins = React.useCallback(() => {
    if (!baseToken.token) return;

    if (targetToken!.value > targetToken!.balance) {
      const isMMOSHBase =
        targetToken?.token === web3Consts.oposToken.toBase58();

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
    (value: number) => {
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

      const isMMOSHBase = baseToken?.token === web3Consts.oposToken.toBase58();

      setBaseToken({ ...baseToken!, value });

      const buyValue = isMMOSHBase
        ? curve!.buyWithBaseAmount(value - value * 0.06)
        : curve!.sellTargetAmount(value - value * 0.06);

      setTargetToken({ ...targetToken!, value: buyValue });
    },
    [baseToken, targetToken],
  );

  return (
    <div className="relative background-content flex flex-col items-center">
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
                <p className="font-normal text-sm text-white">
                  {baseToken.symbol}
                </p>
              </div>
            </div>

            <div className="w-full flex justify-between px-1 py-2 bg-[#00000021] rounded-md border-white border-opacity-[0.05] border-[1px]">
              <CoinSelect
                selectedCoin={baseToken}
                onTokenSelect={onTokenSelect}
                isBase
                readonly={baseToken?.symbol.toLowerCase() === "mmosh"}
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
                selectedCoin={targetToken}
                onTokenSelect={onTokenSelect}
                isBase={false}
                readonly={targetToken?.symbol.toLowerCase() === "mmosh"}
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
            {result.res === "err" && (
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
