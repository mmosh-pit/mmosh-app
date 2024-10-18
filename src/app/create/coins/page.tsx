"use client";
import * as React from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

import ImagePicker from "@/app/components/ImagePicker";
import MessageBanner from "@/app/components/common/MessageBanner";
import Input from "@/app/components/common/Input";
import Button from "@/app/components/common/Button";
import SimpleInput from "@/app/components/common/SimpleInput";
import { data, isDrawerOpen, userWeb3Info } from "@/app/store";
import CoinsCandidatesSelect from "@/app/components/Project/Candidates/CoinsCandidatesSelect";
import { CandidateCoinForm } from "@/app/models/candidateCoinForm";
import FilePicker from "@/app/components/Project/PTV/FilePicker";
import { createProjectCoin } from "@/app/lib/forge/createProjectCoin";
import { uploadFile } from "@/app/lib/firebase";
import { Coin } from "@/app/models/coin";
import CoinSelector from "@/app/components/CreateCoins/CoinSelector";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import Select from "@/app/components/common/Select";
import { getCoinPrice } from "@/app/lib/forge/setupCoinPrice";
import { createCoin } from "@/app/lib/forge/createCoin";
import { web3Consts } from "@/anchor/web3Consts";
import { Connectivity as UserConn } from "../../../anchor/user";

const defaultFormState = {
  name: "",
  symbol: "",
  candidate: null,
  position: "for",
  bonding: "MMOSH",
  description: "",
  supply: 1000,
  multiplier: 0,
  initialPrice: 0,
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

const CreateCoin = () => {
  const wallet = useAnchorWallet();
  const [profileInfo] = useAtom(userWeb3Info);
  const [currentUser] = useAtom(data);
  const [isDrawerShown] = useAtom(isDrawerOpen);

  const [selectedCoin, setSelectedCoin] = React.useState<Coin>({
    name: "MMOSH: The Stoked Token",
    desc: "",
    image:
      "https://shdw-drive.genesysgo.net/7nPP797RprCMJaSXsyoTiFvMZVQ6y1dUgobvczdWGd35/MMoshCoin.png",
    token: process.env.NEXT_PUBLIC_OPOS_TOKEN!,
    symbol: "MMOSH",
    bonding: "",
    creatorUsername: "",
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState({
    message: "",
    type: "",
  });
  const [form, setForm] = React.useState<CandidateCoinForm>({
    ...defaultFormState,
  });
  const [image, setImage] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState("");

  const [mintingStatus, setMintingStatus] = React.useState("Mint and Swap");

  const [error, setError] = React.useState<string | null>(null);

  const [files, setFiles] = React.useState<File[]>([]);

  const [datasets, setDatasets] = React.useState<{ data: number }[]>([]);
  const [coinPrice, setCoinPrice] = React.useState(0);

  const [selectedCoinBalance, setSelectedCoinBalance] = React.useState(0);

  const validateFields = () => {
    if (profileInfo!.solBalance <= 0) {
      setMessage({
        type: "warn",
        message:
          "Hey! We checked your wallet and you don’t have enough SOL for the gas fees. Get some Solana and try again!",
      });
      return false;
    }

    if (
      selectedCoin.token === web3Consts.oposToken.toBase58() &&
      profileInfo!.mmoshBalance < form.supply
    ) {
      setMessage({
        type: "warn",
        message:
          "Hey! We checked your wallet and you don’t have enough MMOSH to mint. [Get some MMOSH here](https://jup.ag/swap/SOL-MMOSH)",
      });
      return false;
    }

    if (
      selectedCoin.token === web3Consts.oposToken.toBase58() &&
      selectedCoinBalance < form.supply
    ) {
      setMessage({
        type: "warn",
        message:
          "Hey! We checked your wallet and you don’t have enough Community coin to mint",
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

  const addFiles = React.useCallback(
    (newFiles: FileList) => {
      const listOfFiles: File[] = [];

      for (const file of newFiles) {
        listOfFiles.push(file);
      }

      setFiles([...files, ...listOfFiles]);
    },
    [files],
  );

  const deleteFile = React.useCallback(
    (index: number) => {
      setFiles((prev) => {
        prev.splice(index, 1);

        return prev;
      });
    },
    [files],
  );

  const startCreatingCoin = async () => {
    if (!validateFields()) return;

    setMessage({ type: "", message: "" });

    setIsLoading(true);

    if (selectedCoin.symbol !== "MMOSH") {
      let position = "";

      if (
        (selectedCoin.symbol === "PTVB" && form.candidate!.PARTY === "DEM") ||
        (selectedCoin.symbol === "PTVR" && form.candidate!.PARTY === "REP")
      ) {
        position = "for";
      } else if (
        (selectedCoin.symbol === "PTVB" && form.candidate!.PARTY === "REP") ||
        (selectedCoin.symbol === "PTVR" && form.candidate!.PARTY === "DEM")
      ) {
        position = "against";
      } else {
        position = form.position;
      }

      const params = {
        name: form.name,
        description: form.description,
        symbol: form.symbol,
        preview,
        imageFile: image,
        wallet: wallet!,
        setMintingStatus,
        username: currentUser!.profile.username,
        multiplier: 1,
        initialPrice: 0,
        supply: form.supply,
        type: "exponential",
        baseToken: form.bonding,
        position,
        candidate: form.candidate!,
      };

      const res = await createProjectCoin(params);
      setIsLoading(false);
      setMessage({ type: res.type, message: res.message });
      setMintingStatus("Mint and Swap");

      const fileUrls = [];

      for (const file of files) {
        const fileUrl = await uploadFile(
          file,
          file.name,
          "political_memecoins",
        );
        fileUrls.push(fileUrl);
      }

      const formData = new FormData();
      formData.append("name", form.candidate!.CANDIDATE_NAME);
      formData.append(
        "metadata",
        JSON.stringify({
          ...form.candidate,
          name: form.name,
          symbol: form.symbol,
        }),
      );

      fileUrls.forEach((val) => formData.append("urls", val));

      await axios.post(
        "https://mmoshapi-uodcouqmia-uc.a.run.app/upload",
        formData,
      );

      if (res.type === "success") {
        setForm({ ...defaultFormState });
        setImage(null);
        setPreview("");
        setFiles([]);
      }
    } else {
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
        username: currentUser ? currentUser!.profile.username : "",
        baseToken: selectedCoin,
      };

      const res = await createCoin(params);
      setIsLoading(false);
      setMessage({ type: res.type, message: res.message });
      setMintingStatus("Mint and Swap");

      if (res.type === "success") {
        setForm({ ...defaultFormState });
        setImage(null);
        setPreview("");
        setFiles([]);
      }
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

  const tickXFormat = React.useCallback(
    (value: number) => {
      if (value === datasets.length - 1) return "Supply = x";

      return "";
    },
    [datasets],
  );

  React.useEffect(() => {
    if (wallet) {
      getTokenBalance();
    }
  }, [selectedCoin, wallet]);

  const getTokenBalance = async () => {
    if (selectedCoin.token === web3Consts.oposToken.toBase58()) {
      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_CLUSTER!,
      );
      const env = new anchor.AnchorProvider(connection, wallet!, {
        preflightCommitment: "processed",
      });
      let userConn: UserConn = new UserConn(env, web3Consts.programID);

      const balance = await userConn.getUserBalance({
        address: wallet?.publicKey,
        token: selectedCoin.token,
        decimals: selectedCoin.decimals,
      });
      setSelectedCoinBalance(balance ? balance : 0);
    } else {
      let type = "Red";
      if (selectedCoin.token === process.env.NEXT_PUBLIC_PTVB_TOKEN) {
        type = "Blue";
      }
      let coinData = await axios(
        "/api/ptv/rewards?type=" +
          type +
          "&&wallet=" +
          wallet?.publicKey.toBase58(),
      );
      setSelectedCoinBalance(
        coinData.data ? coinData.data.claimable + coinData.data.unstakable : 0,
      );
    }
  };

  React.useEffect(() => {
    const isLinear = form.bonding === "linear";
    const isExponential = form.bonding === "exponential";

    if (
      form.supply <= 0 ||
      (isLinear && form.initialPrice === 0) ||
      (isExponential && form.multiplier === 0)
    ) {
      setDatasets([]);
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

    const datasetsValue = res.data.map((value) => ({
      data: value,
    }));

    const datasetsResult = isLinear
      ? [{ data: 0 }, ...datasetsValue]
      : datasetsValue;

    setDatasets(datasetsResult);
    setCoinPrice(res.coinPrice);
  }, [form.multiplier, form.initialPrice, form.supply, form.bonding]);

  React.useEffect(() => {
    if (!image) return;
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
  }, [image]);

  React.useEffect(() => {
    if (form.candidate?.PARTY === "DEM") {
      setForm({ ...form, bonding: "ptvb" });
    } else if (form.candidate?.PARTY === "REP") {
      setForm({ ...form, bonding: "ptvb" });
    } else {
      setForm({ ...form, bonding: "" });
    }
  }, [form.candidate]);

  return (
    <>
      <div
        className={`w-full relative flex flex-col items-center ${
          isDrawerShown ? "z-[-1]" : ""
        }`}
      >
        <MessageBanner message={message.message} type={message.type} />
        <div className="w-full flex flex-col justify-center items-center mt-20">
          <h4 className="text-center text-white font-goudy font-normal">
            Create a {selectedCoin.symbol !== "MMOSH" ? "Political " : ""}
            Memecoin!
          </h4>
        </div>

        <div className="flex md:flex-row flex-col justify-center w-[90%] sm:w-[80%] md:w-[75%] lg:w-[60%] mt-12">
          <div className="w-[100%] sm:w-[85%] lg:w-[50%]">
            <ImagePicker changeImage={setImage} image={preview} rounded />
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

            <div className="my-2">
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
            </div>

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
            <div className="mb-4">
              <CoinSelector
                selectedCoin={selectedCoin}
                onTokenSelect={(coin: Coin) => {
                  setSelectedCoin(coin);
                  setForm({ ...form, bonding: coin.symbol });
                }}
              />
            </div>

            {selectedCoin.symbol !== "MMOSH" ? (
              <div className="w-full grid gap-6">
                <CoinsCandidatesSelect
                  value={form.candidate}
                  onChangeValue={(val) => setForm({ ...form, candidate: val })}
                />

                {form.candidate !== null &&
                  !["DEM", "REP"].includes(form.candidate.PARTY) && (
                    <div className="w-full flex-col mt-16">
                      <p className="text-sm text-white">
                        Are you For or Against this Candidate?
                      </p>

                      <div className="w-full flex">
                        <div
                          className="flex items-center justify-center cursor-pointer"
                          onClick={(_) => {
                            setForm({ ...form, position: "for" });
                          }}
                        >
                          <input
                            id="radio1"
                            type="radio"
                            className="radio radio-secondary candidates-checkboxes"
                            checked={form.position === "for"}
                            onChange={() => {}}
                          />
                          <p className="text-white text-base md:ml-2">For</p>
                        </div>

                        <div
                          className="flex items-center justify-center ml-6 cursor-pointer"
                          onClick={(_) => {
                            setForm({ ...form, position: "against" });
                          }}
                        >
                          <input
                            id="radio1"
                            type="radio"
                            className="radio radio-secondary candidates-checkboxes"
                            checked={form.position === "against"}
                            onChange={() => {}}
                          />
                          <p className="text-white text-base md:ml-2">
                            Against
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                {!["DEM", "REP"].includes(form.candidate?.PARTY ?? "") &&
                  form.candidate !== null && (
                    <div className="w-full flex-col">
                      <p className="text-sm text-white">
                        Which coin will you use as the trading pair?
                      </p>

                      <div className="w-full flex">
                        <div
                          className="flex items-center justify-center cursor-pointer"
                          onClick={(_) => {
                            setForm({ ...form, bonding: "ptvr" });
                          }}
                        >
                          <input
                            id="radio1"
                            type="radio"
                            className="radio radio-secondary candidates-checkboxes"
                            checked={form.bonding === "ptvr"}
                            onChange={() => {}}
                          />
                          <p className="text-white text-base md:ml-2">PTVR</p>
                        </div>

                        <div
                          className="flex items-center justify-center ml-6 cursor-pointer"
                          onClick={(_) => {
                            setForm({ ...form, bonding: "ptvb" });
                          }}
                        >
                          <input
                            id="radio1"
                            type="radio"
                            className="radio radio-secondary candidates-checkboxes"
                            checked={form.bonding === "ptvb"}
                            onChange={() => {}}
                          />
                          <p className="text-white text-base md:ml-2">PTVB</p>
                        </div>
                      </div>
                    </div>
                  )}

                <div
                  className={`w-full flex flex-col ${!["DEM", "REP"].includes(form.candidate?.PARTY ?? "") ? "mt-8" : "mt-12"}`}
                >
                  <p className="text-base text-white">
                    Inform the AI bot about this candidate
                  </p>

                  <FilePicker
                    addFiles={addFiles}
                    files={files}
                    deleteFile={deleteFile}
                  />
                </div>
              </div>
            ) : (
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

                        if (value > 9000) return;

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

                          if (value >= 3 && form.supply > 15850) return;

                          if (value >= 4 && form.supply > 1450) return;

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
                  <ResponsiveContainer
                    width="85%"
                    height={200}
                    className="pt-2"
                  >
                    <AreaChart
                      width={150}
                      height={200}
                      data={datasets}
                      margin={{
                        top: 30,
                      }}
                    >
                      <defs>
                        <linearGradient
                          id="gradient"
                          x1="1"
                          y1="1"
                          x2="2"
                          y2="2"
                        >
                          <stop
                            offset="100%"
                            stopColor="#0765FF"
                            stopOpacity={0.6}
                          />
                          <stop
                            offset="30%"
                            stopColor="#09073A"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis tickFormatter={tickXFormat} tickLine={false} />
                      <YAxis
                        width={5}
                        tick={false}
                        tickLine={false}
                        label={{
                          value: "Price = Y",
                          position: "top",
                          offset: 5,
                          dx: 30,
                        }}
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
            )}
          </div>
        </div>

        <div className="w-full flex flex-col justify-around items-center mt-4">
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
                (!form.candidate && selectedCoin.symbol !== "MMOSH") ||
                // !form.bonding ||
                !!error ||
                !wallet
              }
            />
            <p className="text-sm text-white text-center">
              Minimum 1,000 initial purchase
            </p>
          </div>

          <div className="flex items-center mt-4 mb-2">
            <p className="text-xs text-white">Exchange</p>
            <div className="ml-2 mr-1 max-w-[4vmax]">
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
            <div className="mr-2">
              <p className="text-xs text-white">
                {selectedCoin.symbol.toUpperCase()}
              </p>
            </div>

            <p className="text-xs ml-2">
              for <span className="text-xs">{form.supply} </span>
              {form.symbol !== "" ? "$" + form.symbol : ""}
            </p>
          </div>

          <p className="text-xs text-center max-w-[75%] md:max-w-[50%] lg:max-w-[25%] xl:max-w-[10%]">
            Enter the amount of your initial Swap. You will swap {form.supply}{" "}
            {form.bonding.toUpperCase()}
            for {form.supply} {form.symbol} and you will be charged a small
            amount of SOL in transaction fees
          </p>
        </div>
      </div>
    </>
  );
};

export default CreateCoin;
