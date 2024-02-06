import * as React from "react";
import { useAtom } from "jotai";
import axios from "axios";

import ImagePicker from "./ImagePicker";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { uploadFile } from "../lib/firebase";
import { UserStatus, status } from "../store";
import { useRouter } from "next/navigation";

const CreateProfile = () => {
  const wallet = useAnchorWallet();
  const router = useRouter();
  const [_, setUserStatus] = useAtom(status);

  const [image, setImage] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState("");
  const [form, setForm] = React.useState({
    name: "",
    username: "",
    bio: "",
    pronouns: "they/them",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [userData, setUserData] = React.useState({
    addressPublicKey: "",
    telegramId: "",
    points: "",
  });
  const [parentData, setParentData] = React.useState({
    addressPublicKey: "",
    telegramId: "",
  });

  const disabledButton =
    !wallet?.publicKey || !image || !form.name || !form.username;

  const createAccount = React.useCallback(async () => {
    if (!wallet?.publicKey) return;
    if (!image) return;
    if (!form.name || !form.username) return;
    setIsLoading(true);

    const imageUrl = await uploadFile(image!, form.name);

    grecaptcha.enterprise.ready(async () => {
      const token = await grecaptcha.enterprise.execute(
        "6Le3O1QpAAAAABxXfBkbNNFgyYbgOQYR43Ia8zcN",
        { action: "LOGIN" }
      );

      await axios.post("/api/validate-captcha", {
        token,
        wallet: wallet.publicKey.toString(),
      });
    });

    await axios.put("/api/update-wallet-data", {
      field: "profile",
      value: {
        ...form,
        username: form.username.trim(),
        image: imageUrl,
      },
      wallet: wallet!.publicKey.toString(),
    });

    await processTokenTransfers();

    setUserStatus(UserStatus.fullAccount);
    router.push(`/${form.username}`);
    setIsLoading(false);
  }, [form, image]);

  const processTokenTransfers = async () => {
    // Mint tokens to user wallet for registering
    await axios.post("/api/mint-tokens", {
      publicKey: userData.addressPublicKey,
      points: Number(userData.points),
    });

    await axios.put("/api/update-bot-account", {
      telegramId: userData.telegramId,
      field: "tokenPoints",
      value: Number(userData.points),
    });

    if (parentData.addressPublicKey !== "") {
      const result = await axios.get(
        `/api/get-wallet-by-telegram?telegramId=${parentData.telegramId}`
      );
      const hasProfile = !!result.data?.profile;

      // Proceed only if parent is registered
      if (hasProfile) {
        // Mint 100 tokens to parent for referral registration
        await axios.post("/api/mint-tokens", {
          publicKey: parentData.addressPublicKey,
          points: 100,
        });
        await axios.put("/api/update-bot-account", {
          telegramId: parentData.telegramId,
          field: "tokenPoints",
          value: 100,
        });
      }
    }
  };

  React.useEffect(() => {
    if (!image) return;
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
  }, [image]);

  const initUserData = async (publicKey: string | undefined) => {
    const walletData = await axios.get(
      `/api/get-wallet-data?wallet=${publicKey}`
    );

    const userInfo = await axios.get(
      `/api/get-bot-user?id=${walletData.data.telegram.id}`
    );

    setUserData({
      addressPublicKey: userInfo.data.addressPublicKey,
      telegramId: userInfo.data.telegramId,
      points: userInfo.data.points,
    });

    const referralData = await axios.get(
      `/api/get-referral-data?id=${userInfo.data._id}`
    );

    if (referralData.data) {
      const parentInfo = await axios.get(
        `/api/get-bot-account-by-id?id=${referralData.data.parent}`
      );
      setParentData({
        addressPublicKey: parentInfo.data.addressPublicKey,
        telegramId: parentInfo.data.telegramId,
      });
    }
  };

  React.useEffect(() => {
    initUserData(wallet?.publicKey.toString());
  }, [wallet]);

  return (
    <div className="relative w-full flex justify-center items-center">
      <div className="flex flex-col md:w-[70%] xs:w-[90%]">
        <div className="self-center md:w-[45%] xs:w-[80%]">
          <h3 className="text-center text-white font-goudy font-normal mb-12">
            Create Your MMOSH Account
          </h3>
          <p className="text-base text-center">
            Join our community of Creators, Scouts, Curators and Enjoyers in the
            one and only Massively Multiplayer On-chain Shared{" "}
            <span id="hallucination">Hallucination!</span>
          </p>
        </div>
        <div className="w-full self-start mt-12">
          <p className="text-lg text-white">About You</p>
        </div>

        <div className="w-full xs:flex-col md:flex-row flex justify-around mt-4">
          <div className="flex flex-col xs:w-[85%] md:w-[25%]">
            <p className="text-sm">
              Avatar<sup>*</sup>
              <ImagePicker changeImage={setImage} image={preview} />
            </p>
          </div>

          <div className="flex flex-col md:w-[35%] xs:w-[85%]">
            <div className="flex flex-col w-full">
              <p className="text-base text-white">
                Name<sup>*</sup>
              </p>
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input input-bordered bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3]"
              />
              <p className="text-sm">Up to 50 characters, can have spaces.</p>
            </div>

            <div className="flex flex-col my-6">
              <p className="text-base text-white">
                Username<sup>*</sup>
              </p>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Username"
                className="input input-bordered bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3]"
              />
              <p className="text-sm">15 characters</p>
            </div>

            <div className="flex flex-col">
              <p className="text-base text-white">
                Pronouns<sup>*</sup>
              </p>
              <select
                className="select select-bordered bg-black bg-opacity-[0.07]"
                value={form.pronouns}
                onChange={(e) => setForm({ ...form, pronouns: e.target.value })}
              >
                <option className="bg-black" value="they/them">
                  They/Them
                </option>
                <option className="bg-black" value="she/her">
                  She/Her
                </option>
                <option className="bg-black" value="he/him">
                  He/Him
                </option>
              </select>
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-base text-white">Bio</p>
            <textarea
              placeholder="Tell us about yourself in up to 160 characters"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="textarea textarea-bordered textarea-lg w-full max-w-xs bg-black bg-opacity-[0.07] text-base placeholder-white placeholder-opacity-[0.3] h-full"
            ></textarea>
          </div>
        </div>

        <div className="w-full flex justify-center items-center mt-20">
          <button
            className="bg-[#CD068E] py-4 px-4 rounded-md flex items-center"
            onClick={createAccount}
            disabled={disabledButton}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-lg bg-[#BEEF00]"></span>
            ) : (
              <p className="text-white font-bold text-lg ml-2">
                Create your MMOSH Account
              </p>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
