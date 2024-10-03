import * as React from "react";
import ArrowBack from "@/assets/icons/ArrowBack";
import StepsTitle from "../common/StepsTitle";
import { useRouter } from "next/navigation";
import Button from "../../common/Button";
import Input from "../../common/Input";
import SimpleInput from "../../common/SimpleInput";
import Radio from "../../common/Radio";
import AddIcon from "@/assets/icons/AddIcon";
import MinusIcon from "@/assets/icons/MinusIcon";
import { SwapCoin } from "@/app/models/swapCoin";
import CoinSelect from "./CoinSelect";
import axios from "axios";
import { generateGroupCommunityPass } from "@/app/lib/forge/generateGroupCommunityPass";
import { uploadImageFromBlob } from "@/app/lib/uploadImageFromBlob";
import { deleteShdwDriveFile } from "@/app/lib/deleteShdwDriveFile";

const CreateCommunity = () => {
  const router = useRouter();

  const [selectedCoin, setSelectedCoin] = React.useState<SwapCoin | null>(null);

  const [isLoading, setIsLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    description: "",
    asset: "",
    groups: [
      {
        handle: "",
        privacy: "open",
        assetPrice: 0,
      },
    ],
  });

  const createCommunity = async () => {
    setIsLoading(true);

    if (!selectedCoin) return;

    const communityPassImage = await generateGroupCommunityPass(
      selectedCoin!.image,
    );

    const imageUri = await uploadImageFromBlob(communityPassImage);

    try {
      await axios.post("/api/create-group-community", {
        ...form,
        passImage: imageUri,
      });
    } catch (_) {
      await deleteShdwDriveFile(imageUri);
    }

    setIsLoading(false);
  };

  const goBack = React.useCallback(() => {
    router.back();
  }, []);

  const shouldShowRoyalties = !!form.groups.find((e) => e.privacy === "pass");

  return (
    <div className="w-full flex justify-evenly">
      <div className="w-full flex flex-col">
        <div className="w-full h-[80%] flex flex-col justify-between items-center pt-20">
          <div className="w-full flex flex-col items-center">
            <div className="w-full flex justify-between px-12">
              <div
                className="w-[33%] flex items-center cursor-pointer"
                onClick={goBack}
              >
                <ArrowBack />
                <p className="text-white text-sm ml-2">Back</p>
              </div>

              <StepsTitle
                name="Create A Token-Gated Community"
                subtitle="Create a public group on Telegram to pump your coin!
The group will only available to your coin holders, and you can set the level. First, create the Telegram group, make it public and add MMOSHbot as an admin."
                title=""
              />

              <div className="w-[33%]" />
            </div>

            <div className="w-[40%] flex flex-col mt-8">
              <Input
                title="Name of Community"
                placeholder="Name of Community"
                required
                helperText="Use the name of your Telegram Public Group"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <div className="my-4" />

              <Input
                title="Community Description"
                placeholder="Community Description"
                required={false}
                type="text"
                textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <div className="w-[50%] md:w-[40%] lg:w-[30%] my-4">
                <CoinSelect
                  selectedCoin={selectedCoin}
                  onTokenSelect={setSelectedCoin}
                />
              </div>

              <div className="my-4" />

              {form.groups.map((group, index) => (
                <div className="flex flex-col">
                  <p className="text-xs text-white">
                    Public Telegram Group <sup>*</sup>
                  </p>

                  <div className="flex items-center">
                    <p className="text-white text-xs mr-2">https://t.me/</p>
                    <SimpleInput
                      value={group.handle}
                      onChange={(e) => {
                        setForm((prev) => {
                          const newValue = { ...prev };
                          newValue.groups[index].handle = e.target.value;

                          return newValue;
                        });
                      }}
                    />

                    {index > 0 && (
                      <button
                        className="ml-4"
                        onClick={() => {
                          setForm((prev) => {
                            const newValue = { ...prev };

                            newValue.groups.splice(index, 1);

                            return newValue;
                          });
                        }}
                      >
                        <MinusIcon />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center my-4">
                    <Radio
                      title="Open"
                      checked={group.privacy === "open"}
                      onChoose={() => {
                        setForm((prev) => {
                          const newValue = { ...prev };
                          newValue.groups[index].privacy = "open";

                          return newValue;
                        });
                      }}
                      name={`radio-open-${index}`}
                    />

                    <Radio
                      title="Pass"
                      checked={group.privacy === "pass"}
                      onChoose={() => {
                        setForm((prev) => {
                          const newValue = { ...prev };
                          newValue.groups[index].privacy = "pass";

                          return newValue;
                        });
                      }}
                      name={`radio-pass-${index}`}
                    />

                    <Radio
                      title="Coin"
                      checked={group.privacy === "coin"}
                      onChoose={() => {
                        setForm((prev) => {
                          const newValue = { ...prev };
                          newValue.groups[index].privacy = "coin";

                          return newValue;
                        });
                      }}
                      name={`radio-coin-${index}`}
                    />

                    {form.groups[index].privacy !== "open" && (
                      <div className="flex">
                        <Input
                          value={form.groups[index].assetPrice.toString()}
                          title={
                            form.groups[index].privacy === "pass"
                              ? "Community Pass Price"
                              : "Amount of coins to join Telegram Group"
                          }
                          onChange={(e) => {
                            if (!Number(e.target.value)) return;
                            if (Number(e.target.value) < 0) return;

                            setForm((prev) => {
                              const newValue = { ...prev };

                              newValue.groups[index].assetPrice = Number(
                                e.target.value,
                              );

                              return newValue;
                            });
                          }}
                          required={false}
                          placeholder="0"
                          type="text"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="my-4" />

              {form.groups.length < 5 && (
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      if (form.groups.length >= 5) return;
                      setForm({
                        ...form,
                        groups: [
                          ...form.groups,
                          {
                            handle: "",
                            privacy: "open",
                            assetPrice: 0,
                          },
                        ],
                      });
                    }}
                  >
                    <AddIcon />
                  </button>
                  <p className="text-sm text-white ml-1">Add Group</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex w-[50%] md:w-[40%] lg:w-[30%] flex-col">
            <Button
              title="Create"
              size="large"
              isPrimary
              isLoading={isLoading}
              action={createCommunity}
            />
          </div>
        </div>
        {shouldShowRoyalties && (
          <div className="flex flex-col">
            <p className="text-base text-white">
              Community Pass Royalties will be distributed as follows
            </p>
            <p className="text-sm text-white my-1">
              Creator{" "}
              <span className="text-sm text-gray-500">
                70% of your royalties as the Community Founder
              </span>
            </p>
            <p className="text-sm text-white my-1">
              Operative{" "}
              <span className="text-sm text-gray-500">
                20% promotes your Community to their referrals
              </span>
            </p>
            <p className="text-sm text-white my-1">
              Organizer{" "}
              <span className="text-sm text-gray-500">
                5% Organizes, encourages, trains and motivates
              </span>
            </p>
            <p className="text-sm text-white my-1">
              Ecosystem{" "}
              <span className="text-sm text-gray-500">3% MMOSH DAO</span>
            </p>
            <p className="text-sm text-white my-1">
              Project{" "}
              <span className="text-sm text-gray-500">2% Pump the Vote</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCommunity;
