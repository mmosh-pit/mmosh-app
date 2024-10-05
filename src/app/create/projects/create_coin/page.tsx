"use client";
import * as React from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

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

const defaultFormState = {
  name: "",
  symbol: "",
  candidate: null,
  position: "for",
  bonding: "PTVB",
  description: "",
  supply: 1000,
};

const CreateCoin = () => {
  const wallet = useAnchorWallet();
  const [profileInfo] = useAtom(userWeb3Info);
  const [currentUser] = useAtom(data);
  const [isDrawerShown] = useAtom(isDrawerOpen);

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
      position: form.position,
      candidate: form.candidate!,
    };

    const res = await createProjectCoin(params);
    setIsLoading(false);
    setMessage({ type: res.type, message: res.message });
    setMintingStatus("Mint and Swap");

    const fileUrls = [];

    for (const file of files) {
      const fileUrl = await uploadFile(file, file.name, "political_memecoins");
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
            Create a Political Memecoin!
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

          <div className="w-full grid gap-6 md:ml-8">
            <CoinsCandidatesSelect
              value={form.candidate}
              onChangeValue={(val) => setForm({ ...form, candidate: val })}
            />

            {form.candidate !== null && (
              <div className="w-full flex-col mt-8">
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
                    <p className="text-white text-base md:ml-2">Against</p>
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

            <div className="w-full flex flex-col">
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
        </div>

        <p className="text-sm text-gray-300 mt-12">
          Set the amount of {form.bonding.toUpperCase()} you want to swap for{" "}
          {form.symbol}
        </p>

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
                !form.candidate ||
                !form.bonding ||
                !!error ||
                !wallet
              }
            />
          </div>

          <div className="flex items-center mt-4 mb-2">
            <p className="text-xs text-white">Swap</p>
            <div className="mx-2 max-w-[4vmax]">
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

            <p className="text-xs">
              for <span className="text-xs">{form.supply} </span>
              {form.symbol !== "" ? "$" + form.symbol : ""}
            </p>
          </div>

          <p className="text-xs text-center max-w-[60%] md:max-w-[30%] lg:max-w-[15%] xl:max-w-[10%]">
            You will be swapping {form.supply} {form.bonding.toUpperCase()}
            for {form.supply} {form.symbol} and you will pay a small amount of
            SOL in network fees
          </p>
        </div>
      </div>
    </>
  );
};

export default CreateCoin;
