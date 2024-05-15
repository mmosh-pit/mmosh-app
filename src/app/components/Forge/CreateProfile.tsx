import * as React from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

import { data, userWeb3Info } from "@/app/store";
import MessageBanner from "../common/MessageBanner";
import ImagePicker from "../ImagePicker";
import { createProfile } from "@/app/lib/forge/createProfile";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";

const PronounsSelectOptions = [
  {
    label: "They/Them",
    value: "they/them",
  },
  {
    label: "He/Him",
    value: "he/him",
  },
  {
    label: "She/Her",
    value: "she/her",
  },
];

const CreateProfile = () => {
  const wallet = useAnchorWallet();
  const navigate = useRouter();
  const [profileInfo] = useAtom(userWeb3Info);
  const [_, setCurrentUser] = useAtom(data);
  const [image, setImage] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    lastName: "",
    username: "",
    description: "",
    descriptor: "",
    noun: "",
    pronouns: "they/them",
  });

  const [message, setMessage] = React.useState({
    type: "",
    message: "",
  });

  const [error, setError] = React.useState({
    error: false,
    message: "",
  });

  const checkForUsername = React.useCallback(async () => {
    if (form.username.toLowerCase() === "create") {
      setError({
        error: true,
        message: "Username already exists!",
      });
      return;
    }

    const result = await axios.get(
      `/api/check-username?username=${form.username}`,
    );

    if (result.data) {
      setError({
        error: true,
        message: "Username already exists!",
      });
      return;
    }

    setError({
      error: false,
      message: "",
    });
  }, [form.username]);

  const createMessage = React.useCallback((text: string, type: string) => {
    setMessage({ message: text, type });
  }, []);

  const validateFields = () => {
    if (!profileInfo) return;

    if (profileInfo.activationToken == "") {
      createMessage("Invalid activation token", "error");
      return false;
    }

    if (profileInfo.genesisToken == "") {
      createMessage("Invalid gensis token", "error");
      return false;
    }

    if (profileInfo.solBalance < 0.04) {
      createMessage(
        "Hey! We checked your wallet and you don’t have enough SOL for the gas fees. Get some Solana and try again!",
        "warn",
      );
      return false;
    }

    if (profileInfo.mmoshBalance < 1000) {
      createMessage(
        "Hey! We checked your wallet and you don't have enough MMOSH to mint.\n[Get some MMOSH here](https://jup.ag/swap/SOL-MMOSH) and try again!",
        "warn",
      );
      return false;
    }

    if (!image) {
      createMessage("Image is required", "error");
      return false;
    }
    if (form.name.length == 0) {
      createMessage("First name is required", "error");
      return false;
    }

    if (form.username.length == 0) {
      createMessage("Username is required", "error");
      return false;
    }

    return true;
  };

  const submitForm = React.useCallback(async () => {
    if (
      !validateFields() ||
      !profileInfo ||
      !wallet ||
      !profileInfo?.activationToken
    ) {
      return;
    }

    createMessage("", "");

    setIsLoading(true);

    const result = await createProfile({
      wallet,
      profileInfo,
      image,
      form,
      preview,
    });

    createMessage(result.message, result.type);

    if (result.type === "success") {
      // TODO: implement navigation to User's profile or anywere needed

      setCurrentUser((prev) => {
        return { ...prev!, profile: result.data };
      });

      setTimeout(() => {
        navigate.replace(`/${result.data.profile.username}`);
      }, 5000);
    }
    setIsLoading(false);
  }, [wallet, profileInfo, image, form]);

  React.useEffect(() => {
    if (!image) return;
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
  }, [image]);

  React.useEffect(() => {
    if (!profileInfo?.activationToken) {
      setMessage({
        type: "info",
        message:
          "Hey! We checked your wallet and you don’t have any Invitations. You can find one in our [Telegram Group](https://t.me/mmoshpit)",
      });
      return;
    }
  }, [profileInfo]);

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col items-center justify-center w-full">
        <MessageBanner type={message.type} message={message.message} />
        <div className="flex flex-col md:w-[70%] w-[90%]">
          <div className="self-center md:w-[45%] w-[80%] pt-20">
            <h4 className="text-center text-white font-goudy font-normal mb-8">
              Create your Profile to join the DAO
            </h4>
            <p className="text-base text-center">
              MMOSH DAO members can create their own coins, build community and
              help allocate resources to support the growth and expansion of our
              ecosystem.
            </p>
          </div>
          <div className="w-full self-start mt-8">
            <p className="text-lg text-white">About You</p>
          </div>

          <div className="w-full flex-col lg:flex-row flex items-center lg:items-stretch justify-around mt-4">
            <div className="flex flex-col w-[100%] sm:w-[85%] lg:w-[25%] mb-4 md:mb-0">
              <p className="text-sm">
                Avatar<sup>*</sup>
                <ImagePicker changeImage={setImage} image={preview} />
              </p>
            </div>

            <div className="flex flex-col w-full lg:w-[35%] xs:w-[85%] md:px-[3vmax]">
              <div className="flex flex-col w-full">
                <p className="text-xs text-white">
                  First Name or Alias<sup>*</sup>
                </p>
                <Input
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <p className="text-tiny">
                  Up to 50 characters, can have spaces.
                </p>
              </div>

              <div className="flex flex-col w-full">
                <p className="text-xs text-white">Last Name</p>
                <Input
                  type="text"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                />
                <p className="text-tiny">Up to 15 characters</p>
              </div>

              <div className="flex flex-col">
                <p className="text-xs text-white">
                  Username<sup>*</sup>
                </p>
                <Input
                  type="text"
                  value={form.username}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      username: e.target.value.replace(/\s/g, ""),
                    })
                  }
                  onBlur={checkForUsername}
                  placeholder="Username"
                />
                {error.error ? (
                  <p className="text-xs text-red-600">{error.message}</p>
                ) : (
                  <p className="text-xs">15 characters</p>
                )}
              </div>

              <div className="flex flex-col">
                <p className="text-xs text-white">
                  Pronouns<sup>*</sup>
                </p>
                <Select
                  value={form.pronouns}
                  onChange={(e) =>
                    setForm({ ...form, pronouns: e.target.value })
                  }
                  options={PronounsSelectOptions}
                />
              </div>
            </div>

            <div className="flex flex-col mt-4 md:mt-4 w-[85%] lg:w-fit">
              <p className="text-xs text-white">Description</p>
              <Input
                type="text"
                placeholder="Tell us about yourself in up to 160 characters"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                textarea
              />

              <div className="flex flex-col mt-4 w-full md:w-fit">
                <p className="text-xs text-white">Superhero Identity</p>
                <label className="text-tiny">
                  Example: Frank the Amazing Elf
                </label>

                <div className="flex w-full items-center">
                  <p className="text-xs text-white mb-[0.5vmax] mr-4">The</p>
                  <div className="flex flex-col">
                    <Input
                      type="text"
                      value={form.descriptor}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          descriptor: e.target.value,
                        })
                      }
                      placeholder="Descriptor"
                    />
                    <label className="text-xs">Example: Amazing</label>
                  </div>

                  <div className="flex flex-col ml-4">
                    <Input
                      type="text"
                      value={form.noun}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          noun: e.target.value,
                        })
                      }
                      placeholder="Noun"
                    />
                    <label className="text-tiny">Example: Elf</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col justify-center items-center mt-20">
            <Button
              isLoading={isLoading}
              isPrimary
              title="Mint Your Profile"
              size="large"
              action={submitForm}
              disabled={isLoading || !profileInfo?.activationToken}
            />
            <div className="flex flex-col justify-center items-center">
              <p className="text-sm text-white">Price: 10.000 MMOSH</p>
              <p className="text-tiny text-white">
                plus a small amount of SOL for gas fees
              </p>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center">
                <p className="text-sm text-white">Current balance</p>
                <div className="bg-black bg-opacity-[0.2] px-1 py-2 min-w-[3vmax] mx-2 rounded-md">
                  {profileInfo?.mmoshBalance || 0}
                </div>
                <p className="text-sm text-white">MMOSH</p>
              </div>

              <div className="flex items-center mt-2">
                <p className="text-sm text-white">Current balance</p>
                <div className="bg-black bg-opacity-[0.2] px-1 py-2 min-w-[3vmax] mx-2 rounded-md">
                  {profileInfo?.solBalance || 0}
                </div>
                <p className="text-sm text-white">SOL</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
