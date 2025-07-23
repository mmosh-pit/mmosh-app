import * as React from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

import { data, userWeb3Info } from "@/app/store";
import MessageBanner from "../common/MessageBanner";
import ImagePicker from "../ImagePicker";
import { buyMembership, createProfile } from "@/app/lib/forge/createProfile";
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
import Radio from "../common/Radio";

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
  const [hasMonthly, setHasMonthly] = React.useState<boolean>(true);
  const [membershipStatus, setMembershipStatus] = React.useState("na");
  const [membershipInfo, setMembershipInfo] = React.useState<any>({});
  const [tab, setTab] = React.useState("guest");

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


  React.useEffect(() => {
    if (wallet) {
      checkMembershipStatus();
    }
  }, [wallet])

  const checkMembershipStatus = async () => {
    let membershipInfo = await axios.get("/api/membership/has-membership?wallet=" + wallet!.publicKey.toBase58());
    setMembershipStatus(membershipInfo.data);
    let result = await axios.get("/api/membership/get-membership-info?wallet=" + wallet!.publicKey.toBase58());
    if (membershipInfo.data === "active") {
      setTab(result.data.membership);
      setMembershipInfo(result.data);
      setHasMonthly(result.data.membershiptype === "monthly");
    }
  }

  const mintMembership = React.useCallback(async (membership: any, membershipType: any, price: any) => {
    if (!wallet || !profileInfo || !validateFields()) {
      return;
    }


    console.log("----- membershipStatus -----", membershipStatus);
    if (membershipStatus == "active") {
      createMessage("You already have membership", "error");
      return
    }

    if (membershipStatus == "expired") {
      await buyMembership({
        wallet,
        profileInfo,
        image,
        form,
        preview,
        parentProfile: new PublicKey(referer),
        membership,
        membershipType,
        price,
        banner: ""
      });
      createMessage("Your membership is updated", "success");
      return
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

    const result = await createProfile({
      wallet,
      profileInfo,
      image,
      form,
      preview,
      parentProfile: new PublicKey(parentProfile),
      banner: "",
      membership,
      membershipType,
      price
    });
    console.log("----- BUY MEMBERSHIP RESULT -----", result);

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
          <div className="flex flex-col items-center text-white font-sans text-sm leading-[1.875rem]">
            <div className="bg-gradient-to-r from-[#e93d87] via-[#a06cd5] to-[#512d6d] p-[1px] rounded-full inline-block mb-6">
              <ul className="flex bg-[#1b1937] rounded-full py-1 px-1 space-x-2">
                <li className={`px-7 py-2 rounded-full text-sm font-extrabold ${tab === "guest" && 'bg-gradient-to-r from-[#d660a1] to-[#6356d5]'} text-white text-white/70 hover:text-white hover:bg-gradient-to-r hover:from-[#d660a1] hover:to-[#6356d5] shadow cursor-pointer`} onClick={() => setTab("guest")}>
                  Guest
                </li>
                <li className={`px-7 py-2 rounded-full text-sm font-medium text-white/70 hover:text-white hover:bg-gradient-to-r hover:from-[#d660a1] hover:to-[#6356d5] transition cursor-pointer  ${tab === "enjoyer" && 'bg-gradient-to-r from-[#d660a1] to-[#6356d5]'}`} onClick={() => setTab("enjoyer")}>
                  Enjoyer
                </li>
                <li className={`px-7 py-2 rounded-full text-sm font-medium text-white/70 hover:text-white hover:bg-gradient-to-r hover:from-[#d660a1] hover:to-[#6356d5] transition cursor-pointer  ${tab === "creator" && 'bg-gradient-to-r from-[#d660a1] to-[#6356d5]'}`} onClick={() => setTab("creator")}>
                  Creator
                </li>
              </ul>
            </div>
            {tab === "guest" &&
              <>
                <div className="flex flex-col text-[#e2d7ff] mb-2 space-y-1">
                  <div className="flex items-start">
                    <div className="text-[#b59be4] font-extrabold mr-2">•</div>
                    <div>Can only interact with Public Bots</div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-[#b59be4] font-extrabold mr-2">•</div>
                    <div>No access to Bot Studio, Offers or Bot Subscriptions</div>
                  </div>
                </div>
                <div className="flex items-center mb-0 space-x-4">
                  <span className="font-bold text-2xl">Free</span>
                  {membershipStatus === "na" &&
                    <>
                      <span className="text-[#b59be4] text-lg">•</span>
                      <span className="relative rounded-full px-6 py-2 text-lg font-semibold text-white border border-transparent bg-gradient-to-r from-[#e93d87] to-[#6356d5]">
                        <span className="relative z-10">✔ Current plan</span>
                        <span className="absolute inset-0 rounded-full bg-[#1b1937] z-0 m-[1px]"></span>
                      </span>
                    </>
                  }
                </div>
              </>
            }
            {tab === "enjoyer" &&
              <>
                <div className="flex flex-col text-[#e2d7ff] mb-2 space-y-1">
                  <div className="flex items-start">
                    <div className="text-[#b59be4] font-extrabold mr-2">•</div>
                    <div>Revenue Distribution</div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-[#b59be4] font-extrabold mr-2">•</div>
                    <div>Up to 3 Personal Bots</div>
                  </div>
                </div>
                <div className="flex flex-row items-center">
                  <Radio
                    title="Monthly USDC 15/mo"
                    checked={hasMonthly}
                    onChoose={() => setHasMonthly(!hasMonthly)}
                    name="device_verification"
                  />
                  <Radio
                    title="Annual USDC 90/yr"
                    checked={!hasMonthly}
                    onChoose={() => setHasMonthly(!hasMonthly)}
                    name="device_verification"
                  />
                </div>
                {membershipInfo.membership === "enjoyer" &&
                  <div className="flex items-center mb-0 space-x-4">
                    <span className="relative rounded-full px-6 py-2 text-lg font-semibold text-white border border-transparent bg-gradient-to-r from-[#e93d87] to-[#6356d5]">
                      <span className="relative z-10">✔ Current plan</span>
                      <span className="absolute inset-0 rounded-full bg-[#1b1937] z-0 m-[1px]"></span>
                    </span>
                  </div>
                }
              </>
            }
            {tab === "creator" &&
              <>
                <div className="flex flex-col text-[#e2d7ff] mb-2 space-y-1">
                  <div className="flex items-start">
                    <div className="text-[#b59be4] font-extrabold mr-2">•</div>
                    <div>Revenue Distribution</div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-[#b59be4] font-extrabold mr-2">•</div>
                    <div>Up to 3 Personal Bots</div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-[#b59be4] font-extrabold mr-2">•</div>
                    <div>Up to 3 Community Bots</div>
                  </div>
                </div>
                <div className="flex flex-row items-center">
                  <Radio
                    title="Monthly USDC 24/mo"
                    checked={hasMonthly}
                    onChoose={() => setHasMonthly(!hasMonthly)}
                    name="device_verification"
                  />
                  <Radio
                    title="Annual USDC 180/yr"
                    checked={!hasMonthly}
                    onChoose={() => setHasMonthly(!hasMonthly)}
                    name="device_verification"
                  />
                </div>
                {membershipInfo.membership === "creator" &&
                  <div className="flex items-center mb-0 space-x-4">
                    <span className="relative rounded-full px-6 py-2 text-lg font-semibold text-white border border-transparent bg-gradient-to-r from-[#e93d87] to-[#6356d5]">
                      <span className="relative z-10">✔ Current plan</span>
                      <span className="absolute inset-0 rounded-full bg-[#1b1937] z-0 m-[1px]"></span>
                    </span>
                  </div>
                }
              </>
            }
          </div>
          <div className="w-full h-full flex flex-col p-5">
            <div className="mb-4">
              <p className="text-lg text-white text-center font-bold">About You</p>
            </div>
            <div className="flex flex-col mb-4">
              <p className="text-sm mb-2">Banner Image</p>
              <div className="relative h-[200px] w-full rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center z-0" />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Uploaded Banner"
                    className="absolute inset-0 w-full h-full object-cover z-10"
                  />
                )}{!imagePreview && (
                  <img
                    src={"/images/profile-settings-bg.png"}
                    alt="Uploaded Banner"
                    className="absolute inset-0 w-full h-full object-cover z-10"
                  />
                )}
                <div className="relative z-20 h-full">
                  <ImageAccountPicker changeImage={setBannerImage} image={imagePreview} />
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
                  title="Description"
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

            {!hasProfile && tab === "guest" && (
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

                {/* <div className="flex flex-col w-[25%]">
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
                </div> */}
              </div>
            )}

            {hasProfile && (
              <div className="w-[50%] self-center pt-[30px]">
                {tab === "guest" &&
                  <Button
                    isLoading={isLoading}
                    isPrimary
                    title={"Save your changes"}
                    size="large"
                    disabled={isLoading}
                    action={updateProfile}
                  />
                }
              </div>
            )}
            <div className="w-[50%] self-center pt-[30px]">
              {tab === "enjoyer" &&
                <Button
                  isLoading={isLoading}
                  isPrimary
                  title={`Mint Your Enjoyer Membership`}
                  size="large"
                  disabled={isLoading}
                  action={() => mintMembership(tab, hasMonthly ? "monthly" : "yearly", hasMonthly ? 15 : 90)}
                />
              }
              {tab === "creator" &&
                <Button
                  isLoading={isLoading}
                  isPrimary
                  title={`Mint Your Creator Membership`}
                  size="large"
                  disabled={isLoading}
                  action={() => mintMembership(tab, hasMonthly ? "monthly" : "yearly", hasMonthly ? 24 : 180)}
                />
              }
              {tab !== "guest" &&
                <>
                  <div className="flex flex-col justify-center items-center mt-3">
                    {hasMonthly &&
                      <p className="text-sm text-white">Price: {tab === "enjoyer" ? 15 : 24} USDC</p>
                    }
                    {!hasMonthly &&
                      <p className="text-sm text-white">Price: {tab === "enjoyer" ? 90 : 180} USDC</p>
                    }
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
                </>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
