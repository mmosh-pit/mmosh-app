import * as React from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { useRouter, useSearchParams } from "next/navigation";

import { data, userWeb3Info } from "@/app/store";
import MessageBanner from "../common/MessageBanner";
import ImagePicker from "../ImagePicker";
import { createProfile } from "@/app/lib/forge/createProfile";
import Input from "../common/Input";
import Button from "../common/Button";
import useWallet from "@/utils/wallet";
import { PublicKey } from "@solana/web3.js";
import ImageAccountPicker from "../Account/ImageAccountPicker";
import { uploadFile } from "@/app/lib/firebase";
import client from "@/app/lib/httpClient";

const ProfileForm = () => {
  const wallet = useWallet();
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const [profileInfo] = useAtom(userWeb3Info);
  const [userData, setCurrentUser] = useAtom(data);
  const [image, setImage] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState(
    "https://storage.googleapis.com/mmosh-assets/default.jpg",
  );
  const [referer, setReferer] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [bannerImage, setBannerImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState("");

  const [hasProfile, setHasProfile] = React.useState(false);

  const [form, setForm] = React.useState({
    name: "",
    lastName: "",
    displayName: "",
    username: "",
    host: "",
    description: "",
    descriptor: "",
    noun: "",
    link: "",
  });

  React.useEffect(() => {
    if (userData) {
      const guestData = userData!.guest_data;
      const profileData = userData!.profile;

      setForm({
        name: profileData?.name || guestData?.name,
        username: profileData?.username || guestData?.username,
        description: profileData?.bio || guestData?.bio,
        link: profileData?.link || guestData?.website,
        descriptor: profileData?.descriptor,
        lastName: profileData?.lastName,
        displayName: profileData?.displayName,
        noun: profileData?.nouns,
        host: "",
      });

      setHasProfile(profileData !== null);
    }
  }, [userData]);

  const [message, setMessage] = React.useState({
    type: "",
    message: "",
  });

  const [error, setError] = React.useState({
    error: false,
    message: "",
  });

  React.useEffect(() => {
    const referer = searchParams.get("referer");
    if (referer) {
      lookupReferer(referer);
    } else if (userData) {
      setReferer(userData!.referred_by);
    }
  }, []);

  const lookupReferer = async (username: any) => {
    try {
      const res = await axios.get(`/api/get-user-data?username=${username}`);
      console.log("lookupReferer ", res.data);
      if (res.data) {
        setReferer(res.data.profilenft);
      } else {
        setError({
          error: true,
          message: "Username added as referer is invalid",
        });
        setReferer("");
      }
    } catch (error) {
      setError({
        error: true,
        message: "Username added as referer is invalid",
      });
      setReferer("");
    }
  };

  const checkForUsername = React.useCallback(async () => {
    if (["create"].includes(form.username.toLowerCase())) {
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

    if (referer == "") {
      createMessage("Invalid activation token", "error");
      return false;
    }

    if (profileInfo.profile.address !== undefined) {
      createMessage("User already have profile address", "error");
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

    if (profileInfo.usdcBalance < 8) {
      createMessage(
        "Hey! We checked your wallet and you don't have enough USDC to mint.\n[Get some USDC here](https://jup.ag/swap/SOL-USDC) and try again!",
        "warn",
      );
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

    if (referer == "") {
      if (form.host.length == 0) {
        createMessage("Host is required", "error");
        return false;
      }
    }

    return true;
  };

  const submitForm = React.useCallback(async () => {
    if (!validateFields() || !profileInfo || !wallet) {
      return;
    }

    createMessage("", "");

    setIsLoading(true);

    let parentProfile;
    if (referer == "") {
      const res = await axios.get(`/api/get-user-data?username=${form.host}`);
      console.log("lookupHost ", res.data);
      if (res.data) {
        parentProfile = res.data.profilenft;
      } else {
        createMessage("Host is invalid", "error");
        return;
      }
    } else {
      parentProfile = referer;
    }

    let resultingBanner = imagePreview;

    if (bannerImage) {
      resultingBanner = await uploadFile(
        bannerImage!,
        `${form.username}-banner-${new Date().getMilliseconds()}`,
        "banners",
      );
    }

    let finalPreview = preview;

    if (!preview) {
      finalPreview = "https://storage.googleapis.com/mmosh-assets/default.jpg";
    }

    const result = await createProfile({
      wallet,
      profileInfo,
      image,
      form,
      preview: finalPreview,
      parentProfile: new PublicKey(referer),
      banner: resultingBanner,
    });

    createMessage(result.message, result.type);

    if (result.type === "success") {
      setCurrentUser((prev) => {
        return { ...prev!, profile: result.data };
      });

      setTimeout(() => {
        navigate.replace(`/create`);
      }, 5000);
    }
    setIsLoading(false);
  }, [wallet, profileInfo, image, form]);

  React.useEffect(() => {
    if (!bannerImage) return;
    const objectUrl = URL.createObjectURL(bannerImage);
    setImagePreview(objectUrl);
  }, [bannerImage]);

  React.useEffect(() => {
    if (!image) return;
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
  }, [image]);

  const saveUserData = React.useCallback(async () => {
    if (form.name.length == 0) {
      createMessage("First name is required", "error");
      return;
    }

    if (form.username.length == 0) {
      createMessage("Username is required", "error");
      return;
    }

    if (form.username.length > 20 || form.username.length < 3) {
      createMessage("Username must be between 3 and 20 characters", "error");
      return;
    }
    setIsLoading(true);

    let bannerResult = "";
    let imageResult = "https://storage.googleapis.com/mmosh-assets/default.jpg";

    try {
      const date = new Date().getMilliseconds();

      if (bannerImage) {
        bannerResult = await uploadFile(
          bannerImage,
          `${form.username}-banner-${date}`,
          "banners",
        );
      }

      if (image) {
        imageResult = await uploadFile(
          image,
          `${form.username}-guest_profile-${date}`,
          "images",
        );
      }

      await client.put("/guest-data", {
        ...form,
        banner: bannerResult,
        picture: imageResult,
      });
      createMessage("Your guest data has been successfully saved!", "success");
      setImagePreview(imageResult);
    } catch (err) {
      // TODO add logic to remove image
      if (bannerResult) {
      }
      if (imageResult) {
      }
    }

    setIsLoading(false);
  }, [form, image]);

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col items-center justify-center w-full">
        <MessageBanner type={message.type} message={message.message} />

        <div className="w-full flex justify-center my-6">
          {!hasProfile && (
            <h2 className="font-bold text-white">
              Update your Guest Profile or Mint your Membership Profile
            </h2>
          )}

          {hasProfile && (
            <h2 className="font-bold text-white">
              Update your Membership Profile
            </h2>
          )}
        </div>

        <div className="bg-[#03000754] rounded-2xl px-24 py-4">
          <div className="w-full h-full flex flex-col p-5">
            <div className="mb-4">
              <p className="text-lg text-white font-bold">About You</p>
            </div>

            <div className="flex flex-col mb-4">
              <p className="text-sm">Banner Image</p>
              <div className="h-[200px]">
                <ImageAccountPicker
                  changeImage={setBannerImage}
                  image={imagePreview}
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 mt-4">
              <div>
                <p className="text-sm">
                  Avatar<sup>*</sup>
                  <ImagePicker changeImage={setImage} image={preview} />
                </p>
              </div>

              <div>
                <Input
                  type="text"
                  title="Display Name"
                  required
                  helperText="Up to 50 characters, can have spaces."
                  placeholder="Display Name"
                  value={form.displayName}
                  onChange={(e) =>
                    setForm({ ...form, displayName: e.target.value })
                  }
                />

                <div className="my-2" />

                <Input
                  type="text"
                  title="First Name or Alias"
                  required
                  helperText="Up to 50 characters, can have spaces."
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <div className="my-2" />

                <Input
                  type="text"
                  title="Last Name"
                  required={false}
                  helperText="Up to 15 characters"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                />

                <div className="my-2" />

                <Input
                  type="text"
                  title="Username"
                  required
                  helperText={error.error ? error.message : "15 characters"}
                  error={error.error}
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
              </div>

              <div className="flex flex-col">
                <Input
                  type="text"
                  title="Bio"
                  required={false}
                  placeholder="Tell us about yourself in one paragraph or less"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  textarea
                />

                <div className="my-2" />

                <Input
                  type="text"
                  title="Web Link"
                  required={false}
                  placeholder="https://your.domain"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                />
              </div>
            </div>

            {referer == "" && (
              <div className="w-full self-start mt-4">
                <p className="text-lg text-white">Your Host</p>
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
                  <Input
                    type="text"
                    title="Username"
                    required
                    error={error.error}
                    value={form.host}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        host: e.target.value.replace(/\s/g, ""),
                      })
                    }
                    placeholder="Host Username"
                  />
                </div>
              </div>
            )}

            {!hasProfile && (
              <div className="flex mt-6 items-start justify-evenly">
                <div className="w-[25%]">
                  <Button
                    isLoading={isLoading}
                    isPrimary
                    title="Save as guest"
                    size="large"
                    disabled={isLoading}
                    action={saveUserData}
                  />
                </div>

                <div className="flex flex-col w-[25%]">
                  <Button
                    isLoading={isLoading}
                    isPrimary
                    title="Mint a Membership"
                    size="large"
                    action={submitForm}
                    disabled={isLoading}
                  />

                  <div className="flex flex-col justify-center items-center mt-3">
                    <p className="text-sm text-white">Price: 8 USDC</p>
                    <p className="text-tiny text-white">
                      plus a small amount of SOL for gas fees
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center justify-center">
                      <p className="text-sm text-white">Current balance</p>
                      <div className="bg-black bg-opacity-[0.2] p-1 min-w-[2vmax] mx-2 rounded-md">
                        <p className="text-sm text-white text-center">
                          {profileInfo?.usdcBalance || 0}
                        </p>
                      </div>
                      <p className="text-sm text-white">USDC</p>
                    </div>

                    <div className="flex items-center mt-2 justify-center">
                      <p className="text-sm text-white">Current balance</p>
                      <div className="bg-black bg-opacity-[0.2] p-1 min-w-[2vmax] mx-2 rounded-md">
                        <p className="text-sm text-white text-center">
                          {profileInfo?.solBalance || 0}
                        </p>
                      </div>
                      <p className="text-sm text-white">SOL</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {hasProfile && (
              <div className="w-[25%]">
                <Button
                  isLoading={isLoading}
                  isPrimary
                  title="Save your changes"
                  size="large"
                  disabled={isLoading}
                  action={() => { }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
