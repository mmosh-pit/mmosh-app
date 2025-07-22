import * as React from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

import { data, userWeb3Info } from "@/app/store";
import MessageBanner from "../common/MessageBanner";
import ImagePicker from "../ImagePicker";
import { createProfile } from "@/app/lib/forge/createProfile";
import Input from "../common/Input";
import Button from "../common/Button";
import useWallet from "@/utils/wallet";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import ImageAccountPicker from "../Account/ImageAccountPicker";
import { uploadFile } from "@/app/lib/firebase";
import client from "@/app/lib/httpClient";
import { getAccount, getAssociatedTokenAddress } from "forge-spl-token";
import { Connectivity as UserConn } from "@/anchor/user";
import { web3Consts } from "@/anchor/web3Consts";
import { pinImageToShadowDrive } from "@/app/lib/uploadImageToShdwDrive";
import { pinFileToShadowDrive } from "@/app/lib/uploadFileToShdwDrive";
import * as anchor from "@coral-xyz/anchor";
import { updateUserData } from "@/app/lib/forge/updateUserData";

const ProfileForm = () => {
  const wallet = useWallet();
  const navigate = useRouter();
  const [profileInfo] = useAtom(userWeb3Info);
  const [currentUser, setCurrentUser] = useAtom(data);
  const [image, setImage] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState(
    "https://storage.googleapis.com/mmosh-assets/default.png",
  );
  const [hasReferer, setHasReferer] = React.useState(false);
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

  const [balance, setBalance] = React.useState({
    sol: 0,
    usdc: 0,
  });

  const [tokenInfo, setTokenInfo] = React.useState<any>(null);

  React.useEffect(() => {
    if (currentUser) {
      const guestData = currentUser!.guest_data;
      const profileData = currentUser!.profile;

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

      let previewPictureImage = preview;

      if (!!profileData?.image) {
        previewPictureImage = profileData!.image;
      } else if (!!guestData?.picture) {
        previewPictureImage = guestData!.picture;
      }

      let previewBannerImage = "";

      if (!!profileData?.banner) {
        previewBannerImage = profileData!.banner;
      } else if (!!guestData?.banner) {
        previewBannerImage = guestData!.banner;
      }

      setPreview(previewPictureImage);
      setImagePreview(previewBannerImage);
      setHasProfile(currentUser!.profilenft !== "");
      setHasReferer(!!currentUser!.referred_by);
    }
  }, [currentUser]);

  React.useEffect(() => {
    if (profileInfo) {
      setHasProfile(profileInfo?.profile.address !== undefined);
    }
  }, [profileInfo]);

  const [message, setMessage] = React.useState({
    type: "",
    message: "",
  });

  const [error, setError] = React.useState({
    error: false,
    message: "",
  });

  React.useEffect(() => {
    if (currentUser) {
      lookupReferer(currentUser!.referred_by);
    }
  }, [currentUser]);

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
    if (form.username === currentUser?.profile.username) return;

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
  }, [form.username, currentUser]);

  const createMessage = React.useCallback((text: string, type: string) => {
    setMessage({ message: text, type });
  }, []);

  const validateFields = () => {
    if (!profileInfo) return;

    if (referer === "") {
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
      finalPreview = "https://storage.googleapis.com/mmosh-assets/default.png";
    }

    const result = await createProfile({
      wallet,
      profileInfo,
      image,
      form,
      preview: finalPreview,
      parentProfile: new PublicKey(referer),
      banner: resultingBanner,
      membership: "enjoyer",
      membershipType: "monthly",
      price: 15,
    });

    createMessage(result.message, result.type);

    if (result.type === "success") {
      setCurrentUser((prev) => {
        return { ...prev!, profile: result.data };
      });

      setTimeout(() => {
        navigate.replace(`/${form.username}`);
      }, 5000);
    }
    setIsLoading(false);
  }, [wallet, profileInfo, image, form]);

  const initiateBalanceChecking = React.useCallback(async () => {
    if (!wallet) return;

    const connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_CLUSTER!,
      "confirmed",
    );
    const address = new PublicKey(
      "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    );
    const solBalance = await connection.getBalance(address);

    const usdcMint = new PublicKey(process.env.NEXT_PUBLIC_USDC_TOKEN!); //new
    const usdcAddress = await getAssociatedTokenAddress(
      usdcMint,
      wallet!.publicKey,
    );

    let usdcBalance = 0;

    try {
      const usdcDetails = await getAccount(connection, usdcAddress); //new
      const usdcDecimals = 6; //new
      usdcBalance = Number(usdcDetails.amount) / Math.pow(10, usdcDecimals); //new
    } catch (_) { }

    setBalance({
      sol: solBalance / LAMPORTS_PER_SOL,
      usdc: usdcBalance,
    });
  }, [wallet]);

  React.useEffect(() => {
    let interval: any = null;

    if (wallet) {
      interval = setInterval(() => {
        initiateBalanceChecking();
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [wallet]);

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
    let imageResult = "https://storage.googleapis.com/mmosh-assets/default.png";

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

  const updateProfile = React.useCallback(async () => {
    if (
      !validateFields() ||
      !profileInfo ||
      !wallet ||
      !currentUser ||
      !tokenInfo
    ) {
      return;
    }

    createMessage("", "");
    setIsLoading(true);
    const profile = currentUser.profile;
    const json = tokenInfo.json;

    const body = {
      name: json.image,
      symbol: json.symbol,
      description: json.description,
      image: json.image,
      enternal_url: json.enternal_url,
      family: "MMOSH",
      collection: "MMOSH Profile Collection",
      attributes: json.attributes,
    };

    body.enternal_url =
      process.env.NEXT_PUBLIC_APP_MAIN_URL + "/" + form.username;
    body.name = form.name + " " + form.lastName;
    body.description = form.description;
    for (let index = 0; index < body.attributes.length; index++) {
      const element = body.attributes[index];
      if (element.trait_type == "Full Name") {
        body.attributes[index].value = form.name + " " + form.lastName;
      } else if (element.trait_type == "Username") {
        body.attributes[index].value = form.username;
      } else if (element.trait_type == "Adjective") {
        body.attributes[index].value = form.descriptor;
      } else if (element.trait_type == "Noun") {
        body.attributes[index].value = form.noun;
      }
    }

    if (image) {
      const imageUri = await pinImageToShadowDrive(image);
      body.image = imageUri;
      if (imageUri === "") {
        createMessage(
          "We’re sorry, there was an error while trying to uploading image. please try again later.",
          "error",
        );
        setIsLoading(false);
        return;
      }
    }

    const filenameArray = tokenInfo.uri.split("/");
    const filename =
      filenameArray.length > 0 ? filenameArray[filenameArray.length - 1] : "";
    if (filename) {
      createMessage("Metadata filename is missing", "error");
      setIsLoading(false);
    }

    const shadowHash: any = await pinFileToShadowDrive(body);

    profile.bio = form.description;
    profile.nouns = form.noun;
    profile.name = form.name + " " + form.lastName;
    profile.username = form.username;
    profile.descriptor = form.descriptor;
    currentUser.profile = profile;

    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_CLUSTER!, {
      confirmTransactionInitialTimeout: 120000,
    });
    const env = new anchor.AnchorProvider(connection, wallet!, {
      preflightCommitment: "processed",
    });

    const userConn: UserConn = new UserConn(env, web3Consts.programID);

    const res = await userConn.updateToken({
      mint: new anchor.web3.PublicKey(profileInfo.profile.address),
      authority: wallet.publicKey,
      payer: wallet.publicKey,
      name: form.username.substring(0, 15),
      symbol: form.username.substring(0, 10).toUpperCase(),
      uri: shadowHash,
    });

    if (res.Err) {
      createMessage("Error on Blockchain call", "error");
      setIsLoading(false);
      return;
    }

    const updateProfile = currentUser.profile;
    updateProfile.symbol = form.username.substring(0, 10);
    updateProfile.bio = form.description;
    updateProfile.displayName = form.displayName;
    updateProfile.username = form.username;
    updateProfile.name = form.name + " " + form.lastName;
    updateProfile.lastName = form.lastName;
    updateProfile.nouns = form.noun;
    updateProfile.descriptor = form.descriptor;
    updateProfile.image = body.image;
    updateProfile.link = form.link;
    updateProfile.banner = imagePreview;

    await updateUserData(updateProfile);

    currentUser.profile = updateProfile;

    setCurrentUser(currentUser);
    navigate.replace(`/` + form.username);
    setIsLoading(false);
  }, [wallet, profileInfo, image, form, tokenInfo]);

  const getTokenInfo = React.useCallback(async () => {
    if (profileInfo!.profile.address == undefined) return;

    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_CLUSTER!, {
      confirmTransactionInitialTimeout: 120000,
    });
    const env = new anchor.AnchorProvider(connection, wallet!, {
      preflightCommitment: "processed",
    });

    const userConn: UserConn = new UserConn(env, web3Consts.programID);

    const nftInfo = await userConn.metaplex.nfts().findByMint({
      mintAddress: new anchor.web3.PublicKey(profileInfo!.profile.address),
    });

    setTokenInfo(nftInfo);
  }, [profileInfo]);

  React.useEffect(() => {
    if (profileInfo) {
      getTokenInfo();
    }
  }, [profileInfo]);

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
        <div className="bg-[#03000754] rounded-2xl px-24 py-4 md:min-w-[85%] min-w-[90%]">
          <div className="w-full flex flex-col items-center gap-4 text-white my-6">
            <div className="w-[308px] h-[44px] relative rounded-full backdrop-blur-[19.5px] bg-white/10 flex items-center justify-between px-2 text-white border border-white/20">
              <a
                className="w-[98px] h-[38px] flex items-center justify-center rounded-[28px] text-sm font-medium
                 bg-gradient-to-r from-[rgba(74,8,249,0.62)] to-[rgba(216,88,188,0.62)]
                 border border-white/20 backdrop-blur-[39px]"
              >
                Guest
              </a>
              <a className="px-6 text-sm font-medium opacity-70 hover:opacity-100">Enjoyer</a>
              <a className="px-6 text-sm font-medium opacity-70 hover:opacity-100">Explorer</a>
            </div>
            <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4">
              <ul className="list-disc list-inside text-sm">
                <li>Can only interact with Public Bots</li>
                <li>No access to Bot Studio, Offers or Bot Subscriptions</li>
              </ul>
              <div className="text-sm font-semibold flex items-center gap-2">
                Free
                <span className="badge badge-success badge-outline">Current plan</span>
              </div>
            </div>
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

            {!hasReferer && (
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
                <div className="w-[25%] flex flex-col justify-center items-center">
                  <Button
                    isLoading={isLoading}
                    isPrimary={false}
                    title="Save as guest"
                    size="large"
                    disabled={isLoading}
                    action={saveUserData}
                  />

                  <p className="text-base text-white mt-4">Free</p>
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
                          {balance.usdc || 0}
                        </p>
                      </div>
                      <p className="text-sm text-white">USDC</p>
                    </div>

                    <div className="flex items-center mt-2 justify-center">
                      <p className="text-sm text-white">Current balance</p>
                      <div className="bg-black bg-opacity-[0.2] p-1 min-w-[2vmax] mx-2 rounded-md">
                        <p className="text-sm text-white text-center">
                          {balance.sol || 0}
                        </p>
                      </div>
                      <p className="text-sm text-white">SOL</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {hasProfile && (
              <div className="w-[25%] self-center">
                <Button
                  isLoading={isLoading}
                  isPrimary
                  title="Save your changes"
                  size="large"
                  disabled={isLoading}
                  action={updateProfile}
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
