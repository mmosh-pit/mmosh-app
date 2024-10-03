"use client";

import * as React from "react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { data } from "@/app/store";
import MessageBanner from "@/app/components/common/MessageBanner";
import ImagePicker from "@/app/components/ImagePicker";
import Input from "@/app/components/common/Input";
import Button from "@/app/components/common/Button";
import Select from "@/app/components/common/Select";
import axios from "axios";
import { ProfileInfo } from "@/app/models/profileInfo";
import { Connectivity as UserConn } from "@/anchor/user";
import { web3Consts } from "@/anchor/web3Consts";
import { Connection } from "@solana/web3.js";
import { pinImageToShadowDrive } from "@/app/lib/uploadImageToShdwDrive";
import { pinFileToShadowDrive } from "@/app/lib/uploadFileToShdwDrive";

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
  

const EditProfile = () => {
    const wallet = useAnchorWallet();
    const navigate = useRouter();
    const [profileInfo, setProfileInfo] = React.useState<ProfileInfo | null>(null);
    const [tokenInfo, setTokenInfo] = React.useState<any>(null)
    const [currentUser, setCurrentUser] = useAtom(data);
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
      console.log("validateFields 1", profileInfo)
        if (!profileInfo) return;

        if (!profileInfo.profile.address) {
          createMessage(
            "Hey! We checked your wallet and you don’t have profile nft",
            "warn",
          );
          return false;
        }

        console.log("validateFields 2")
        if (profileInfo.solBalance < 0.04) {
          createMessage(
            "Hey! We checked your wallet and you don’t have enough SOL for the gas fees. Get some Solana and try again!",
            "warn",
          );
          return false;
        }

        console.log("validateFields 4")
        if (form.name.length == 0) {
          createMessage("First name is required", "error");
          return false;
        }
        console.log("validateFields 5")
        if (form.username.length == 0) {
          createMessage("Username is required", "error");
          return false;
        }
        console.log("validateFields 6")
        return true;
    };
    
    const submitForm = React.useCallback(async () => {
      console.log("submitForm 1", profileInfo?.profile.address)
      if (
        !validateFields() ||
        !profileInfo ||
        !wallet ||
        !currentUser || 
        !tokenInfo
      ) {
        return;
      }
      console.log("submitForm 2")
  
      createMessage("", "");
      console.log("submitForm 3")
      setIsLoading(true);
      let profile = currentUser.profile;
      let json = tokenInfo.json;

      let body = {
        name: json.image,
        symbol: json.symbol,
        description: json.description,
        image: json.image,
        enternal_url: json.enternal_url,
        family: "MMOSH",
        collection: "MMOSH Profile Collection",
        attributes: json.attributes
      };


      body.enternal_url =  process.env.NEXT_PUBLIC_APP_MAIN_URL + "/" + form.username;
      body.name = form.name + " " + form.lastName;
      body.description = form.description;
      for (let index = 0; index < body.attributes.length; index++) {
        const element = body.attributes[index];
        if(element.trait_type == "Full Name") {
          body.attributes[index].value = form.name + " " + form.lastName
        } else if(element.trait_type == "Username") {
          body.attributes[index].value = form.username
        } else if(element.trait_type == "Adjective") {
          body.attributes[index].value = form.descriptor
        } else if(element.trait_type == "Noun") {
          body.attributes[index].value = form.noun
        } else if(element.trait_type == "Pronoun") {
          body.attributes[index].value = form.pronouns
        }
      }

      if (image) {
        const imageUri = await pinImageToShadowDrive(image);
        body.image = imageUri;
        if (imageUri === "") {
          createMessage("We’re sorry, there was an error while trying to uploading image. please try again later.", "error");
          setIsLoading(false);
          return
        }
      }
      
      console.log("updated uri", tokenInfo.uri)

      let filenameArray = tokenInfo.uri.split("/")
      let filename = filenameArray.length > 0 ? filenameArray[filenameArray.length-1] : ""
      if(filename) {
        createMessage("Metadata filename is missing", "error");
        setIsLoading(false);
      }
  
      console.log("updated name",  filename)
      console.log("updated body", body)
      const shadowHash: any = await pinFileToShadowDrive(body);
      console.log("updated result",  shadowHash)

      profile.bio = form.description;
      profile.nouns = form.noun
      profile.name = form.name + " " + form.lastName
      profile.username = form.username
      profile.descriptor = form.descriptor
      profile.pronouns = form.pronouns
      console.log("submitForm 4")
      currentUser.profile = profile

      const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_CLUSTER!);
      const env = new anchor.AnchorProvider(connection, wallet!, {
        preflightCommitment: "processed",
      });
  
      let userConn: UserConn = new UserConn(env, web3Consts.programID);

      let res = await userConn.updateToken({
        mint: new anchor.web3.PublicKey(profileInfo.profile.address),
        authority: wallet.publicKey,
        payer: wallet.publicKey,
        name:  form.username.substring(0, 15),
        symbol: form.username.substring(0, 10).toUpperCase(),
        uri: shadowHash
      })

      console.log("update result", res)

      if(res.Err) {
        createMessage("Error on Blockchain call", "error");
        setIsLoading(false);
        return 
      }

      let updateProfile = currentUser.profile
      updateProfile.bio = form.description;
      updateProfile.nouns = form.noun
      updateProfile.name = form.name + " " + form.lastName
      updateProfile.username = form.username
      updateProfile.descriptor = form.descriptor
      updateProfile.pronouns = form.pronouns

      await axios.put("/api/connections/update-profile", {
        value: updateProfile,
        wallet: currentUser.wallet,
      });
      currentUser.profile = updateProfile
      
      setCurrentUser(currentUser)
      console.log("submitForm 5")
      navigate.replace(`/`+form.username);
      console.log("submitForm 6")
      setIsLoading(false);
    }, [wallet, profileInfo, image, form, tokenInfo]);
  
    React.useEffect(() => {
      if (!image) return;
      const objectUrl = URL.createObjectURL(image);
      setPreview(objectUrl);
    }, [image]);

    React.useEffect(() => {
      if (currentUser) {
          let nameArray:any = currentUser.profile.name.split(" ")
          setForm({
            name: nameArray.length > 0 ? nameArray[0] : "",
            lastName: nameArray.length > 1 ? nameArray[1] : "",
            username: currentUser.profile.username,
            description: currentUser.profile.bio,
            descriptor: currentUser.profile.descriptor,
            noun: currentUser.profile.nouns,
            pronouns: currentUser.profile.pronouns
          })
          setPreview(currentUser.profile.image)
      }
    }, [currentUser]);

    React.useEffect(() => {
      if(wallet) {
        getProfileInfo()
      }
 
    }, [wallet]);

    const getProfileInfo = async () => {
      const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_CLUSTER!);
      const env = new anchor.AnchorProvider(connection, wallet!, {
        preflightCommitment: "processed",
      });
  
      let userConn: UserConn = new UserConn(env, web3Consts.programID);
  
      const profileInfo = await userConn.getUserInfo();
  
      console.log("edit profile info: ", profileInfo);
  
      const genesis = profileInfo.activationTokens[0]?.genesis;
      const activation = profileInfo.activationTokens[0]?.activation;
  
      const totalMints = profileInfo.totalChild;
  
      let firstTime = true;
  
      if (profileInfo.activationTokens.length > 0) {
        if (profileInfo.activationTokens[0].activation != "") {
          firstTime = false;
        }
      }
      const totalChilds = totalMints;
  
      let quota = 0;
  
      if (totalChilds < 3) {
        quota = 10;
      } else if (totalChilds >= 3 && totalChilds < 7) {
        quota = 25;
      } else if (totalChilds >= 7 && totalChilds < 15) {
        quota = 50;
      } else if (totalChilds >= 15 && totalChilds < 35) {
        quota = 250;
      } else if (totalChilds >= 35 && totalChilds < 75) {
        quota = 500;
      } else {
        quota = 1000;
      }
  
      const profileNft = profileInfo.profiles[0];
      let username = "";
      if (profileNft?.address) {
        username = profileNft.userinfo.username;
      }
  
      setProfileInfo({
        generation: profileInfo.generation,
        genesisToken: genesis,
        profileLineage: profileInfo.profilelineage,
        activationToken: activation,
        solBalance: profileInfo.solBalance,
        mmoshBalance: profileInfo.oposTokenBalance,
        usdcBalance: profileInfo.usdcTokenBalance,
        firstTimeInvitation: firstTime,
        quota,
        activationTokenBalance:
          parseInt(profileInfo.activationTokenBalance) + profileInfo.totalChild ||
          0,
        profile: {
          name: username,
          address: profileNft?.address,
          image: profileNft?.userinfo.image,
        },
      });

      let nftInfo = await userConn.metaplex.nfts().findByMint({
        mintAddress: new anchor.web3.PublicKey(profileNft?.address),
      });

      setTokenInfo(nftInfo)
    };

    React.useEffect(()=>{
       console.log("tokenInfo ", tokenInfo)
    },[tokenInfo])

    return (
        <div className="background-content">
            <div className="w-full flex justify-center">
            <div className="flex flex-col items-center justify-center w-full">
                <MessageBanner type={message.type} message={message.message} />
                <div className="flex flex-col md:w-[70%] w-[90%]">
                <div className="self-center md:w-[45%] w-[80%] pt-20">
                    <h4 className="text-center text-white font-goudy font-normal mb-8">
                    Edit your Profile
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

                <div className="w-full flex flex-col lg:flex-row items-center lg:items-stretch justify-around mt-4">
                    <div className="flex flex-col w-[100%] sm:w-[85%] lg:w-[25%] mb-4 md:mb-0">
                    <p className="text-sm">
                        Avatar<sup>*</sup>
                        <ImagePicker changeImage={setImage} image={preview} />
                    </p>
                    </div>

                    <div className="flex flex-col w-full lg:w-[35%] xs:w-[85%] md:px-[3vmax]">
                    <Input
                        type="text"
                        title="First Name or Alias"
                        required
                        helperText="Up to 50 characters, can have spaces."
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />

                    <Input
                        type="text"
                        title="Last Name"
                        required={false}
                        helperText="Up to 15 characters"
                        placeholder="Last Name"
                        value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    />

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
                    <Input
                        type="text"
                        title="Description"
                        required={false}
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
                            title=""
                            helperText="Example: Amazing"
                            required={false}
                            value={form.descriptor}
                            onChange={(e) =>
                                setForm({
                                ...form,
                                descriptor: e.target.value,
                                })
                            }
                            placeholder="Descriptor"
                            />
                        </div>

                        <div className="flex flex-col ml-4">
                            <Input
                            type="text"
                            title=""
                            helperText="Example: Elf"
                            required={false}
                            value={form.noun}
                            onChange={(e) =>
                                setForm({
                                ...form,
                                noun: e.target.value,
                                })
                            }
                            placeholder="Noun"
                            />
                        </div>
                        </div>
                    </div>
                    </div>
                </div>

                <div className="w-full flex flex-col justify-center items-center mt-20 md:w-[45%] w-[80%] self-center">
                    <Button
                    isLoading={isLoading}
                    isPrimary
                    title="Mint Your Profile"
                    size="large"
                    action={submitForm}
                    disabled={isLoading}
                    />
                    <div className="flex flex-col justify-center items-center">
                    <p className="text-tiny text-white">
                        Small amount of SOL for gas fees
                    </p>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
    )
};

export default EditProfile;
