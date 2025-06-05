import * as React from "react";
import { createProfile } from "@/app/lib/forge/createProfile";
import axios from "axios";
import { data, userWeb3Info } from "@/app/store";
import { useAtom } from "jotai";
import useWallet from "@/utils/wallet";
import { PublicKey } from "@solana/web3.js";
import Input from "../common/Input";
import Button from "../common/Button";
import Select from "../common/Select";
import MessageBanner from "../common/MessageBanner";
import ArrowBack from "@/assets/icons/ArrowBack";
import ImagePicker from "../ImagePicker";
import {
  onboardingForm,
  onboardingStep,
  referredUser,
} from "@/app/store/account";
import client from "@/app/lib/httpClient";
import { useRouter } from "next/navigation";
import ImageAccountPicker from "./ImageAccountPicker";
import { uploadFile } from "@/app/lib/firebase";
import useCheckMobileScreen from "@/app/lib/useCheckMobileScreen";

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

const Step4 = () => {
  const router = useRouter();
  const isMobileScreen = useCheckMobileScreen();

  const [onboarding] = useAtom(onboardingForm);
  const wallet = useWallet();
  const [profileInfo] = useAtom(userWeb3Info);
  const [user, setCurrentUser] = useAtom(data);
  const [__, setSelectedStep] = useAtom(onboardingStep);
  const [referrer] = useAtom(referredUser);

  const [image, setImage] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState(
    "https://storage.googleapis.com/mmosh-assets/default.jpg",
  );
  const [referer, setReferer] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [bannerImage, setBannerImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState("");

  const [message, setMessage] = React.useState({
    type: "",
    message: "",
  });

  const [error, setError] = React.useState({
    error: false,
    message: "",
  });

  const [symbolError, setSymbolError] = React.useState({
    error: false,
    message: "",
  });

  const [form, setForm] = React.useState({
    displayName: "",
    name: "",
    lastName: "",
    username: "",
    host: "",
    symbol: "",
    description: "",
    descriptor: "",
    noun: "",
    link: "",
    pronouns: "they/them",
  });

  React.useEffect(() => {
    if (referrer) {
      lookupReferer(referrer);
    } else if (user) {
      lookupReferer(user.referred_by);
    }
  }, [referrer, user]);

  React.useEffect(() => {
    setForm({
      ...form,
      name: onboarding.name,
      username: onboarding.username,
      description: onboarding.bio,
      pronouns: onboarding.pronouns,
      link: onboarding.website,
      host: referrer,
    });
    if (onboarding.image) {
      setPreview(onboarding.image);
    } else if (user) {
      const guestData = user!.guest_data;
      setPreview(guestData.picture ?? "");
      if (!onboarding.name) {
        setForm({
          ...form,
          name: guestData.name,
          username: guestData.username,
          link: guestData.website,
          pronouns: guestData.pronouns,
          description: guestData.bio,
        });
      }
    }
  }, [onboarding, user]);

  const lookupReferer = async (username: string) => {
    if (!username) return;

    try {
      const res = await axios.get(`/api/get-user-data?username=${username}`);
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

  const checkForSymbol = React.useCallback(async () => {
    if (["create"].includes(form.username.toLowerCase())) {
      setSymbolError({
        error: true,
        message: "Symbol already exists!",
      });
      return;
    }

    const result = await axios.get(`/api/check-symbol?username=${form.symbol}`);

    if (result.data) {
      setSymbolError({
        error: true,
        message: "Symbol already exists!",
      });
      return;
    }

    setSymbolError({
      error: false,
      message: "",
    });
  }, [form.symbol]);

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

    if (referrer === "" && form.host !== "") {
      lookupReferer(form.host);
    }

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

    if (!image && !preview) {
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

    if (form.symbol.length === 0) {
      createMessage("Symbol is required", "error");
      return false;
    }

    if (form.symbol.length > 10) {
      createMessage("Symbol must be up to 10 characters long", "error");
      return false;
    }

    if (form.username.length > 20 || form.username.length < 3) {
      createMessage("Username must be between 3 and 20 characters", "error");
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

    let resultingImage = image;

    if (!resultingImage && preview) {
      const response = await fetch(preview);

      const blob = await response.blob();

      resultingImage = new File([blob], new Date().toTimeString());
    }

    let resultingBanner = imagePreview;

    if (bannerImage) {
      resultingBanner = await uploadFile(
        bannerImage!,
        `${form.username}-banner-${new Date().getMilliseconds()}`,
        "banners",
      );
    }

    const result = await createProfile({
      wallet,
      profileInfo,
      image: resultingImage,
      form,
      preview,
      parentProfile: new PublicKey(referer),
      banner: resultingBanner,
    });

    createMessage(result.message, result.type);

    if (result.type === "success") {
      setCurrentUser((prev) => {
        return { ...prev!, profile: result.data };
      });

      setTimeout(() => {
        router.replace(`/chat`);
      }, 5000);
    }
    setIsLoading(false);
  }, [wallet, profileInfo, image, form]);

  const saveUserData = React.useCallback(async () => {
    setIsLoading(true);

    if (form.description.length < 25) return;
    if (!form.name) return;
    if (!form.username) return;
    if (form.username.length < 3) return;
    if (form.username.length > 20) return;
    if (form.name.length > 50) return;

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
      setPreview(imageResult);
    } catch (err) {
      // TODO add logic to remove image
      if (bannerResult) {
      }
      if (imageResult) {
      }
    }

    setSelectedStep(1);
    setIsLoading(false);
  }, [form, image, bannerImage]);

  React.useEffect(() => {
    if (!image) return;
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
  }, [image]);

  const goBack = React.useCallback(() => {
    setSelectedStep(2);
  }, []);

  const skipStep = React.useCallback(() => {
    router.replace("/chat");
    client.put("/onboarding-step", {
      step: 5,
    });
  }, []);

  React.useEffect(() => {
    if (!bannerImage) return;
    const objectUrl = URL.createObjectURL(bannerImage);
    setImagePreview(objectUrl);
  }, [bannerImage]);

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col items-center justify-center w-full">
        <MessageBanner type={message.type} message={message.message} />
        <div className="backdrop-container rounded-xl border border-white border-opacity-20 my-10 container mx-auto">
          <div className="p-5">
            <div className="text-center relative">
              <h4 className="text-white font-goudy font-normal mb-8">
                Mint Your Free <br />
                Membership Profile!
              </h4>
              <p className="text-base max-w-2xl mx-auto light-gray-color">
                Membership has it's privileges! With a lifetime Membership
                Profile, you can create own personal and community bots, connect
                with other members, earn royalties, referral rewards and income
                from the goods and services you offer to other members
              </p>
              <p className="text-base max-w-2xl mx-auto light-gray-color mt-2.5">
                you'll only be paying 8 USDC and about 21 cents in network fees
                for Lifetime membership
              </p>
              <div
                className="absolute left-0 top-0 cursor-pointer"
                onClick={goBack}
              >
                <ArrowBack />
              </div>

              <p className="text-base light-gray-color absolute right-0 top-0">
                Step 4 of 4
              </p>
            </div>
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
                  helperText={
                    error.error
                      ? error.message
                      : "Usernames must have between 3 and 20 characters"
                  }
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

                <div className="my-2" />

                <Input
                  type="text"
                  title="Symbol"
                  required
                  helperText={
                    symbolError.error
                      ? symbolError.message
                      : "Symbol can only be letters and numbers up to 10 characters"
                  }
                  error={error.error}
                  value={form.symbol}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      symbol: e.target.value.replace(/\s/g, ""),
                    })
                  }
                  onBlur={checkForSymbol}
                  placeholder="Symbol"
                />
              </div>

              <div>
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

                <div className="my-2" />

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

            {referer === "" && (
              <div className="w-full self-start mt-10">
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

            <div className="mt-10 flex flex-col">
              <div className="flex justify-evenly items-start space-x-4">
                {!isMobileScreen && (
                  <div className="w-[25%]">
                    <button
                      className="btn btn-outline text-white border-white hover:bg-white hover:text-black w-full"
                      onClick={skipStep}
                    >
                      Skip
                    </button>
                  </div>
                )}

                <div className="flex flex-col justify-center items-center w-[25%]">
                  <Button
                    isLoading={isLoading}
                    isPrimary
                    title="Mint Your Profile"
                    size="large"
                    action={submitForm}
                    disabled={isLoading}
                  />

                  <div className="flex flex-col justify-center items-center mt-5">
                    <p className="text-sm text-white">Price: 8 USDC</p>
                    <p className="text-tiny text-white">
                      plus a small amount of SOL for gas fees
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center justify-center">
                      <p className="text-sm text-white">Current balance</p>
                      <div className="bg-black bg-opacity-[0.2] px-1 py-2 min-w-[3vmax] mx-2 rounded-md">
                        {profileInfo?.usdcBalance || 0}
                      </div>
                      <p className="text-sm text-white">USDC</p>
                    </div>

                    <div className="flex items-center mt-2 justify-center">
                      <p className="text-sm text-white">Current balance</p>
                      <div className="bg-black bg-opacity-[0.2] px-1 py-2 min-w-[3vmax] mx-2 rounded-md">
                        {profileInfo?.solBalance || 0}
                      </div>
                      <p className="text-sm text-white">SOL</p>
                    </div>
                  </div>
                </div>

                <div className="w-[25%]">
                  <button
                    className="btn btn-outline text-white border-white hover:bg-white hover:text-black w-full"
                    onClick={saveUserData}
                  >
                    Save as Guest
                  </button>
                </div>
              </div>

              {isMobileScreen && (
                <div className="w-[25%]">
                  <button
                    className="btn btn-outline text-white border-white hover:bg-white hover:text-black w-full"
                    onClick={skipStep}
                  >
                    Skip
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4;
