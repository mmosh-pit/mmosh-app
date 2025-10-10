import * as React from "react";
import { BagsCoin, BagsNFT } from "@/app/store/bags";
import ArrowBack from "@/assets/icons/ArrowBack";
import Image from "next/image";
import Input from "../common/Input";
import Button from "../common/Button";
import { transferAsset } from "@/utils/transferAsset";
import useWallet from "@/utils/wallet";
import { walletAddressShortener } from "@/app/lib/walletAddressShortener";
import internalClient from "@/app/lib/internalHttpClient";

type Props = {
  selectedCoin: BagsCoin | BagsNFT;
  goBack: () => void;
};

const SendAsset = ({ selectedCoin, goBack }: Props) => {
  const wallet = useWallet();
  const [destination, setDestination] = React.useState("");
  const [amount, setAmount] = React.useState("0");

  const [isSending, setIsSending] = React.useState(false);
  const [ismax, setIsmax] = React.useState(false);

  const [result, setResult] = React.useState("");

  const sendTokens = async () => {
    if (!wallet) return;

    setIsSending(true);

    const decimals = "decimals" in selectedCoin ? selectedCoin.decimals : 0;

    const res = await transferAsset(
      wallet!,
      selectedCoin.tokenAddress,
      destination,
      amount,
      decimals,
      ismax
    );

    const historyParams = {
      transactionType: "transfer",
      transfer: {
        wallet: wallet.publicKey.toBase58(),
        fromCurrency: selectedCoin.symbol,
        amount: Number(amount),
        receiver: destination,
      },
    };
    const result = await internalClient.post(
      `/api/history/save`,
      historyParams,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setIsSending(false);
    setResult(res);
  };

  if (isSending && !result) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-start mt-8">
        <div className="bags-background-card lg:w-[40%] md:w-[60%] w-[85%]">
          <div className="flex flex-col items-center">
            <span className="loading loading-spinner w-[8vmax] h-[8vmax] loading-lg bg-[#7B30DB]"></span>

            <p className="mt-2 text-base font-bold">Sending</p>

            <p className="text-sm">{walletAddressShortener(destination)}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isSending && !!result) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-start mt-8">
        <div className="bags-background-card lg:w-[40%] md:w-[60%] w-[85%]">
          <div className="flex flex-col items-center">
            <p className="mt-2 text-base font-bold">Sent</p>

            <p className="text-sm text-white">
              {amount} {selectedCoin.symbol.toUpperCase()} was successfully sent
              into ({walletAddressShortener(destination)})
            </p>

            <a
              className="text-sm font-bold text-white cursor-pointer my-4"
              href={result}
              target="_blank"
            >
              View Transaction
            </a>

            <div className="mt-4">
              <Button
                title="Close"
                action={goBack}
                isPrimary
                isLoading={false}
                size="large"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-start mt-8">
      <div className="bags-background-card lg:w-[60%] md:w-[60%] w-[85%]">
        <div className="flex w-full justify-between px-8 py-4">
          <button className="cursor-pointer w-[33%]" onClick={goBack}>
            <ArrowBack />
          </button>

          <h6>Send {selectedCoin!.symbol.toUpperCase()}</h6>

          <div className="w-[33%]" />
        </div>

        <div
          className="flex flex-col self-center lg:w-[40%] md:w-[60%] w-[85%]"
          id="balance-card"
        >
          <div className="w-full flex justify-center">
            <div className="relative w-[3vmax] h-[3vmax]">
              <Image
                src={selectedCoin!.image}
                alt={`${selectedCoin!.symbol} image`}
                layout="fill"
              />
            </div>
          </div>

          <div className="w-full flex flex-col px-8 mt-4">
            <Input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              type="text"
              placeholder="Wallet Address"
              title=""
              required={false}
            />

            <div className="mt-4">
              <Input
                value={amount}
                onChange={(e) => {
                  if (Number.isNaN(Number(e.target.value))) return;

                  if (Number(e.target.value) > selectedCoin.balance) return;

                  if (Number(e.target.value) < 0) return;

                  setAmount(e.target.value);
                }}
                onFocus={() => {
                  setIsmax(false);
                }}
                type="text"
                placeholder="Amount"
                title=""
                required={false}
                trailing={
                  <div className="flex items-center">
                    <p className="text-xs mr-2">
                      {selectedCoin.symbol.toUpperCase()}
                    </p>
                    <button
                      className={
                        (ismax ? "bg-primary" : "send-max-button") +
                        " rounded-xl px-2 py-1"
                      }
                      onClick={() => {
                        if ("decimals" in selectedCoin) {
                          const decimals = "1".padEnd(
                            selectedCoin.decimals + 1,
                            "0"
                          );

                          const coinBalance =
                            selectedCoin.balance / Number(decimals);
                          setAmount(coinBalance.toString());
                        } else {
                          const max = selectedCoin.balance;

                          setAmount(max <= 0 ? "0" : max.toString());
                        }
                        setIsmax(ismax ? false : true);
                      }}
                    >
                      Max
                    </button>
                  </div>
                }
              />
            </div>
          </div>

          <div className="mt-8">
            <Button
              title="Send"
              size="large"
              action={sendTokens}
              isLoading={false}
              isPrimary
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendAsset;
