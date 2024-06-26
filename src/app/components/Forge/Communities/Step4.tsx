import * as React from "react";
import { useAtom } from "jotai";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

import SimpleInput from "../../common/SimpleInput";
import Card from "../common/Card";
import StepsTitle from "../common/StepsTitle";
import Image from "next/image";
import Button from "../../common/Button";
import BalanceBox from "../../common/BalanceBox";
import MessageBanner from "../../common/MessageBanner";
import { createCommunity } from "@/app/lib/forge/createCommunity";
import {
  defaultFirstFormState,
  defaultThirdFormState,
  step,
  step1Form,
  step2Form,
  step3Form,
} from "@/app/store/community";
import { data, userWeb3Info } from "@/app/store";
import ArrowBack from "@/assets/icons/ArrowBack";
import { useRouter } from "next/navigation";
import { generateCommunityGenesisImage } from "@/app/lib/forge/generateCommunityGenesisImage";
import { fetchImage } from "@/app/lib/forge/fetchImage";
import { generateCommunityInvitationImage } from "@/app/lib/forge/generateCommunityInvitationImage";

const Step4 = () => {
  const navigate = useRouter();
  const wallet = useAnchorWallet();

  const [currentUser] = useAtom(data);
  const [_, setCurrentStep] = useAtom(step);
  const [profileInfo] = useAtom(userWeb3Info);
  const [firstForm, setFirstForm] = useAtom(step1Form);
  const [secForm, setSecForm] = useAtom(step2Form);
  const [thirdForm, setThirdForm] = useAtom(step3Form);

  const [telegramLink, setTelegramLink] = React.useState("");
  const genesisPassRef = React.useRef<HTMLDivElement>(null);
  const invitationBadgeRef = React.useRef<HTMLDivElement>(null);

  const [mintingStatus, setMintingStatus] = React.useState("");
  const [message, setMessage] = React.useState({
    message: "",
    type: "",
  });

  const [communityGenesisCard, setCommunityGenesisCard] =
    React.useState<Blob | null>(null);
  const [invitationCard, setInvitationCard] = React.useState<Blob | null>(null);

  const generateImages = React.useCallback(async () => {
    const coinImage = await fetchImage(thirdForm.coin!.image);

    const mainImage = await fetchImage(firstForm.preview);

    const genesisImage = await generateCommunityGenesisImage(
      mainImage,
      coinImage,
    );

    if (thirdForm.invitation !== "none") {
      const invitationImage = await generateCommunityInvitationImage(
        mainImage,
        coinImage,
      );
      setInvitationCard(invitationImage);
    }

    setCommunityGenesisCard(genesisImage);
  }, [firstForm, thirdForm]);

  React.useEffect(() => {
    if (!firstForm.preview || !thirdForm.coin) return;
    generateImages();
  }, [thirdForm, firstForm]);

  const mintCommunity = React.useCallback(async () => {
    setMessage({ type: "", message: "" });
    if (!wallet || !profileInfo || !currentUser) return;

    const res = await createCommunity({
      wallet,
      genesisImage: communityGenesisCard!,
      invitationImage: invitationCard,
      setMintingStatus,
      name: firstForm.name,
      symbol: firstForm.symbol,
      description: firstForm.description,
      priceDistribution: {
        promoter: Number(thirdForm.promoterRoyalties.replace("%", "")),
        scout: Number(thirdForm.scoutRoyalties.replace("%", "")),
        creator: Number(thirdForm.creatorRoyalties.replace("%", "")),
        curator: 2,
        ecosystem: 3,
      },
      userProfile: profileInfo.profile.address,
      minterName: currentUser.profile.name,
      minterUsername: currentUser.profile.username,
      invitationPrice: Number(thirdForm.invitationPrice),
      topics: secForm,
      profileCost: Number(thirdForm.passPrice),
      pronouns: currentUser.profile.pronouns,
      coin: thirdForm.coin!,
      passImage: firstForm.preview,
      telegram: `https://t.me/${telegramLink}`,
      discount: "",
    });

    if (res.type === "success") {
      setTimeout(() => {
        navigate.replace("/create/communities");

        setTimeout(() => {
          setFirstForm(defaultFirstFormState);
          setSecForm([]);
          setThirdForm(defaultThirdFormState);
          setCurrentStep(0);
        }, 3000);
      }, 5000);
    }

    setMessage({ type: res.type, message: res.message });
    setMintingStatus("");
  }, [
    invitationCard,
    communityGenesisCard,
    firstForm,
    thirdForm,
    currentUser,
    secForm,
    telegramLink,
  ]);

  const goBack = React.useCallback(() => {
    setCurrentStep(2);
  }, []);

  return (
    <div className="w-full flex flex-col">
      <MessageBanner message={message.message} type={message.type} />
      <div className="w-full flex flex-col items-center mt-20">
        <div className="w-full flex justify-between px-12">
          <div
            className="w-[33%] flex items-center cursor-pointer"
            onClick={goBack}
          >
            <ArrowBack />
            <p className="text-white text-sm ml-2">Back</p>
          </div>

          <StepsTitle
            name="Step 4"
            title="Mint and Deploy"
            subtitle={`Deploy your community to the Solana blockchain and mint your Genesis Pass ${thirdForm.invitation !== "none" ? ", a Community Pass and 100 Invitations Badges" : "and a Community Pass"}. You can mint more Badges on the project page any time.`}
          />

          <div className="w-[33%]" />
        </div>

        <div className="w-full justify-center items-center flex flex-col mt-8">
          <div className="w-[50%] flex flex-col items-center">
            <Card
              name={firstForm.name}
              image={firstForm.preview}
              username={firstForm.symbol}
              description={firstForm.description}
              coinImage={thirdForm.coin?.image}
            />
            <p className="text-xs mt-2">
              Please note: the wallet that holds the Genesis Pass will receive
              all of your royalties as the Community Founder, so please keep it
              safe.
            </p>

            <div className="flex flex-col mt-4">
              <p className="text-sm">
                Link to your Official Community Group on Telegram
              </p>

              <div className="w-full flex items-center">
                <p className="text-sm text-white font-thin">https://t.me/</p>
                <SimpleInput
                  onChange={(e) => setTelegramLink(e.target.value)}
                  value={telegramLink}
                  placeholder="Link"
                />
              </div>
            </div>
          </div>

          <div className="flex md:flex-row flex-col w-full md:justify-around justify-center md:w-[75%] mt-12">
            {communityGenesisCard && (
              <div className="flex flex-col items-center">
                <p className="text-lg text-white">Genesis Pass</p>

                <div
                  className="w-[12vmax] h-[12vmax] rounded-2xl"
                  ref={genesisPassRef}
                >
                  <img
                    alt="Genesis Pass"
                    src={URL.createObjectURL(communityGenesisCard!)}
                    className="rounded-xl w-full h-full"
                  />
                </div>
              </div>
            )}

            {thirdForm.invitation !== "none" && invitationCard && (
              <div className="flex flex-col items-center md:my-0 my-4">
                <p className="text-lg text-white">Invitation Badge</p>

                <div
                  className="w-[12vmax] h-[12vmax] relative rounded-2xl"
                  ref={invitationBadgeRef}
                >
                  <img
                    alt="Invitation Badge"
                    src={URL.createObjectURL(invitationCard!)}
                    className="rounded-2xl w-full h-full"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col items-center">
              <p className="text-white text-lg">Community Pass</p>

              <div className="w-[12vmax] h-[12vmax] community-pass-card rounded-2xl">
                <Image
                  alt="Community Image"
                  src={firstForm.preview}
                  layout="fill"
                  className="rounded-2xl"
                />
              </div>
            </div>
          </div>

          <div className="md:w-[45%] lg:w-[30%] w-[80%] flex flex-col items-center mt-12">
            <Button
              title={mintingStatus || "Mint"}
              action={mintCommunity}
              isPrimary
              size="large"
              disabled={
                !!mintingStatus || !wallet || !currentUser || !profileInfo
              }
              isLoading={false}
            />

            <p className="text-xs">Pay 45,000 MMOSH</p>
            <p className="text-tiny mb-4">
              Plus you will be charged a small amount of SOL in transaction
              fees.
            </p>

            <BalanceBox />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4;
