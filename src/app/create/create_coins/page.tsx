"use client";
import * as React from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

import ImagePicker from "@/app/components/ImagePicker";
import MessageBanner from "@/app/components/common/MessageBanner";
import Input from "@/app/components/common/Input";
import Select from "@/app/components/common/Select";
import Button from "@/app/components/common/Button";
import SimpleInput from "@/app/components/common/SimpleInput";
import BalanceBox from "@/app/components/common/BalanceBox";
import { getCoinPrice } from "@/app/lib/forge/setupCoinPrice";
import { createCoin } from "@/app/lib/forge/createCoin";
import { data, userWeb3Info } from "@/app/store";

/* TEMPORAL CONSOLE FIX, HIDING A CONSOLE ERROR TRIGGERED BY RECHARTS */
/* THE LIBRARY STILL WORKS WELL, SO IT IS NOT A BREAKING ERROR. RECHART DEV TEAM IS WORKING ON IT */
const error = console.error;
console.error = (...args: any) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};

const bondingSelectOptions = [
  {
    label: "Exponential",
    value: "exponential",
  },
  {
    label: "Linear",
    value: "linear",
  },
];

const defaultFormState = {
  name: "",
  symbol: "",
  description: "",
  bonding: "exponential",
  multiplier: 1,
  initialPrice: 1,
  supply: 1000,
};

const CreateCoin = () => {
  const wallet = useAnchorWallet();
  const [profileInfo] = useAtom(userWeb3Info);
  const [currentUser] = useAtom(data);

  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState({
    message: "",
    type: "",
  });
  const [form, setForm] = React.useState({ ...defaultFormState });
  const [image, setImage] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState("");

  const [datasets, setDatasets] = React.useState<{ data: number }[]>([]);
  const [maxChartValue, setMaxChartValue] = React.useState(0);
  const [coinPrice, setCoinPrice] = React.useState(0);
  const [mintingStatus, setMintingStatus] = React.useState("Mint and Swap");

  const [error, setError] = React.useState<string | null>(null);

  const tickYFormat = React.useCallback(
    (value: number) => {
      if (value >= maxChartValue) return "Price = Y";

      return "";
    },
    [maxChartValue],
  );

  const tickXFormat = React.useCallback(
    (value: number) => {
      if (value === datasets.length - 1) return "Supply = x";

      return "";
    },
    [datasets],
  );

  const validateFields = () => {
    if (profileInfo!.solBalance <= 0) {
      setMessage({
        type: "warn",
        message:
          "Hey! We checked your wallet and you don’t have enough SOL for the gas fees. Get some Solana and try again!",
      });
      return false;
    }

    if (profileInfo!.mmoshBalance < form.supply) {
      setMessage({
        type: "warn",
        message:
          "Hey! We checked your wallet and you don’t have enough MMOSH to mint. [Get some MMOSH here](https://jup.ag/swap/SOL-MMOSH)",
      });
      return false;
    }

    if (!form.name) {
      setMessage({
        type: "error",
        message: "Coin name is required!",
      });
      return false;
    }

    if (!form.symbol) {
      setMessage({
        type: "error",
        message: "Coin symbol is required!",
      });
      return false;
    }

    if (form.supply < 1000) {
      setMessage({
        type: "error",
        message: "Minimum required is 1000 $MMOSH for the Coin Supply",
      });
      return false;
    }

    return true;
  };

  const startCreatingCoin = async () => {
    if (!validateFields()) return;

    setMessage({ type: "", message: "" });

    const multiplier = form.bonding === "linear" ? 0 : form.multiplier;
    const initialPrice = form.bonding === "linear" ? form.initialPrice : 0;

    setIsLoading(true);

    const params = {
      type: form.bonding,
      multiplier,
      supply: coinPrice,
      name: form.name,
      description: form.description,
      symbol: form.symbol,
      initialPrice,
      preview,
      imageFile: image,
      wallet: wallet!,
      setMintingStatus,
      username: currentUser!.profile.username,
    };

    const res = await createCoin(params);
    setIsLoading(false);
    setMessage({ type: res.type, message: res.message });
    setMintingStatus("Mint and Swap");

    if (res.type === "success") {
      setForm({ ...defaultFormState });
      setImage(null);
      setPreview("");
    }
  };

  const checkSymbolExists = React.useCallback(async () => {
    setError(null);
    const result = await axios.get(
      `/api/check-token-symbol?symbol=${form.symbol}`,
    );

    if (result.data) {
      setError(
        "Symbol already exist. please choose different symbol and try again",
      );
    }
  }, [form.symbol]);

  React.useEffect(() => {
    if (!image) return;
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
  }, [image]);

  React.useEffect(() => {
    const isLinear = form.bonding === "linear";
    const isExponential = form.bonding === "exponential";

    if (
      form.supply <= 0 ||
      (isLinear && form.initialPrice === 0) ||
      (isExponential && form.multiplier === 0)
    ) {
      setDatasets([]);
      setMaxChartValue(0);
      return;
    }

    const multiplier = isLinear ? 0 : form.multiplier;

    const initialPrice = isLinear ? form.initialPrice : 0;

    const res = getCoinPrice(
      form.supply,
      initialPrice.toString(),
      form.bonding,
      multiplier,
    );

    let maxDataValue = 0;

    res.data.forEach((val) => {
      if (val > maxDataValue) {
        maxDataValue = val;
      }
    });

    const datasetsValue = res.data.map((value) => ({
      data: value,
    }));

    const datasetsResult = isLinear
      ? [{ data: 0 }, ...datasetsValue]
      : datasetsValue;

    setDatasets(datasetsResult);
    setMaxChartValue(maxDataValue);
    setCoinPrice(res.coinPrice);
  }, [form.multiplier, form.initialPrice, form.supply, form.bonding]);

  return (
    <div className="w-full relative background-content flex flex-col items-center">
      <MessageBanner message={message.message} type={message.type} />
      <div className="w-full flex flex-col justify-center items-center mt-20">
        <h3 className="text-center text-white font-goudy font-normal">
          Create your own Coin!
        </h3>
        <p className="text-center text-sm mt-1">
          With your own Coin, you can build community to launch and scale your
          own projects. Get started now!
        </p>
      </div>

      <div className="flex md:flex-row flex-col justify-center w-[90%] sm:w-[80%] md:w-[75%] lg:w-[60%] mt-12">
        <div className="w-[100%] sm:w-[85%] lg:w-[50%]">
          <ImagePicker changeImage={setImage} image={preview} />
        </div>

        <div className="w-full flex flex-col md:ml-8">
          <Input
            title="Name your coin"
            required
            value={form.name}
            placeholder="Name"
            helperText="Up to 32 characters, can have spaces."
            type="text"
            onChange={(e) => {
              const value = e.target.value;

              if (value.length > 32) return;

              setForm({ ...form, name: value });
            }}
          />

          <Input
            title="Symbol"
            required
            value={form.symbol}
            placeholder="Name"
            helperText={error || "Up to 10 characters"}
            error={!!error}
            onBlur={checkSymbolExists}
            type="text"
            onChange={(e) => {
              const value = e.target.value.replace(/\s/g, "");

              if (value.length > 10) return;

              setForm({ ...form, symbol: value });
            }}
          />

          <Input
            title="Description"
            required={false}
            value={form.description}
            placeholder="Description"
            type="text"
            textarea
            onChange={(e) => {
              setForm({ ...form, description: e.target.value });
            }}
          />
        </div>

        <div className="w-full flex flex-col md:ml-8">
          <div className="flex flex-col">
            <p className="text-xs text-white">
              Choose a Bonding Curve for your Coin
            </p>
            <Select
              value={form.bonding}
              onChange={(e) => {
                setForm({ ...form, bonding: e.target.value });
              }}
              options={bondingSelectOptions}
            />
          </div>

          {form.bonding === "linear" ? (
            <div className="lg:mt-8 md:mt-4 sm:mt-2">
              <Input
                title="Enter MMOSH Price"
                value={form.initialPrice.toString()}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  if (Number.isNaN(value)) return;

                  if (value < 0) return;

                  setForm({
                    ...form,
                    initialPrice: value,
                  });
                }}
                type="text"
                required={false}
                placeholder="0"
              />
            </div>
          ) : (
            <div className="flex flex-col lg:mt-8 md:mt-4 sm:mt-2">
              <p className="text-white text-tiny">
                Adjust the slope for your Bonding Curve by changing the
                multiplier
              </p>
              <div className="max-w-[50%]">
                <Input
                  title=""
                  value={form.multiplier.toString()}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    if (Number.isNaN(value)) return;

                    if (value < 0) return;

                    setForm({ ...form, multiplier: value });
                  }}
                  type="text"
                  required={false}
                  placeholder="0"
                />
              </div>
            </div>
          )}

          <div className="w-full h-full mt-4">
            <ResponsiveContainer width="100%" height={200} className="pt-2">
              <AreaChart
                width={300}
                height={160}
                data={datasets}
                className="overflow-visible"
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="gradient" x1="1" y1="1" x2="2" y2="2">
                    <stop offset="100%" stopColor="#0765FF" stopOpacity={0.6} />
                    <stop offset="30%" stopColor="#09073A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis tickFormatter={tickXFormat} tickLine={false} />
                <YAxis
                  width={80}
                  tickFormatter={tickYFormat}
                  tickLine={false}
                  offset={-50}
                />
                <Area
                  type="monotone"
                  dataKey="data"
                  stroke="#0047FF"
                  fill="url(#gradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col justify-around items-center mt-12">
        <div className="flex flex-col mb-1">
          <Button
            title={mintingStatus}
            size="large"
            action={startCreatingCoin}
            isLoading={false}
            isPrimary
            disabled={
              isLoading ||
              form.supply < 1000 ||
              !form.name ||
              !form.symbol ||
              !!error ||
              !wallet
            }
          />

          <p className="text-xs text-gray-300">
            Minimum 1,000 initial purchase
          </p>
        </div>

        <div className="flex items-center mt-4">
          <p className="text-xs text-white">Exchange</p>
          <div className="mx-2 max-w-[5vmax]">
            <SimpleInput
              value={form.supply.toString()}
              onChange={(e) => {
                const value = Number(e.target.value);

                if (Number.isNaN(value)) return;

                if (value < 0) return;

                setForm({ ...form, supply: value });
              }}
            />
          </div>

          <p className="text-xs text-gray-300">
            $MMOSH for{" "}
            <span className="text-xs text-gray-500">{coinPrice}</span> $
            {form.symbol}
          </p>
        </div>

        <p className="text-xs text-gray-300 text-center max-w-[80%]">
          Enter the amount of your initial Swap. You will swap{" "}
          <span className="font-bold text-white">{form.supply}</span> MMOSH for{" "}
          <span className="font-bold text-white">{coinPrice}</span>{" "}
          {form.symbol} and you will be charged a small amount of SOL in
          transaction fees.
        </p>

        <div className="mt-2">
          <BalanceBox />
        </div>
      </div>
    </div>
  );
};

export default CreateCoin;
