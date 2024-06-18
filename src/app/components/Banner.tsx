import * as React from "react";
import { useAtom } from "jotai";
import Image from "next/image";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { data, status, userWeb3Info, web3InfoLoading } from "../store";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Banner = () => {
  const [userStatus] = useAtom(status);
  const [currentUser] = useAtom(data);
  const [profileInfo] = useAtom(userWeb3Info);
  const [isLoading] = useAtom(web3InfoLoading);

  const wallet = useAnchorWallet();

  const hasProfile = !!profileInfo?.profile.address;
  const hasInvitation = !!profileInfo?.activationToken;

  const renderComponent = React.useCallback(() => {
    if (isLoading) return <></>;

    if (!wallet?.publicKey) {
      return (
        <div className="max-w-[95%] md:max-w-[60%] grid grid-cols-2 justify-items-center">
          <div className="flex flex-col justify-around items-center max-w-[75%]">
            <div className="flex flex-col items-center mb-8">
              <p className="text-2xl font-bold text-white font-goudy text-center">
                Connect to Solana
              </p>
              <p className="text-sm text-white text-center mt-4">
                Welcome to the MMOSH! An epic adventure beyond time, space and
                the death-grip of global civilization.
              </p>
              <p className="text-sm text-white text-center mt-4">
                Connect your Solana wallet.
              </p>
            </div>

            <WalletMultiButton
              startIcon={undefined}
              style={{
                position: "relative",
                background: "#CD068E",
                padding: "0 2em",
                borderRadius: 15,
              }}
            >
              <p className="text-sm text-white">Connect Wallet</p>
            </WalletMultiButton>
          </div>

          <div
            className="w-full flex justify-center items-center py-4"
            id="banner-image-container"
          >
            <div className="relative w-[8vmax] h-[8vmax] rounded-full">
              <Image
                src="https://storage.googleapis.com/mmosh-assets/solana.png"
                alt="invitation"
                layout="fill"
              />
            </div>
          </div>
        </div>
      );
    }

    if (hasProfile) {
      return (
        <div className="max-w-[95%] md:max-w-[60%] grid grid-cols-2 justify-items-center">
          <div className="flex flex-col justify-around items-center max-w-[75%]">
            <p className="text-sm text-white text-center">
              Hey{" "}
              {currentUser?.profile?.name}, mint and send out more invitations
              to grow you Guild and earn more royalties.
            </p>

            <a href={`${process.env.NEXT_PUBLIC_APP_MAIN_URL}/create`}>
              <button className="bg-[#CD068E] relative rounded-md px-6 py-4">
                <p className="text-sm text-white">Enter the Forge</p>
              </button>
            </a>
          </div>

          <div
            className="w-full flex justify-center items-center py-4"
            id="banner-image-container"
          >
            <div className="relative w-[8vmax] h-[8vmax]">
              <Image
                src="https://storage.googleapis.com/mmosh-assets/invitation.png"
                alt="invitation"
                layout="fill"
              />
            </div>
          </div>
        </div>
      );
    }

    if (hasInvitation) {
      return (
        <div className="max-w-[95%] md:max-w-[60%] grid grid-cols-2 justify-items-center">
          <div className="flex flex-col justify-around items-center max-w-[75%]">
            <p className="text-sm text-white text-center">
              Hey{" "}
              {currentUser?.profile?.name}, now it’s time to mint your Profile
              to join MMOSH DAO as a lifetime member.
            </p>
            <a href={`${process.env.NEXT_PUBLIC_APP_MAIN_URL}/create`}>
              <button className="bg-[#CD068E] relative rounded-md px-6 py-4">
                <p className="text-sm text-white">Enter the Forge</p>
              </button>
            </a>
          </div>

          <div
            className="w-full flex justify-center items-center py-4"
            id="banner-image-container"
          >
            <div className="relative w-[8vmax] h-[8vmax]">
              <Image
                src={currentUser?.profile?.image || ""}
                alt="Profile Image"
                layout="fill"
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-[95%] md:max-w-[60%] grid grid-cols-2 justify-items-center">
        <div className="flex flex-col justify-around items-center">
          <div className="max-w-[75%]">
            <p className="text-sm text-white text-center">
              Hey{" "}
              {currentUser?.profile?.name}, you’ll need an invitation to mint
              your Profile and become a MMOSH DAO member.
            </p>
            <p className="text-sm text-white text-center">
              You can get an invitation from a current member. Find one in the
              Membership Directory, or ask around in our main Telegram group.
            </p>
          </div>

          <a href="https://t.me/mmoshpit" target="_blank">
            <button className="relative bg-[#CD068E] rounded-md px-6 py-4">
              <p className="text-sm text-white">Go to Telegram Group</p>
            </button>
          </a>
        </div>

        <div
          className="w-full flex justify-center items-center py-4"
          id="banner-image-container"
        >
          <div className="relative w-[8vmax] h-[8vmax]">
            <Image
              src="https://storage.googleapis.com/mmosh-assets/invitation.png"
              alt="invitation"
              layout="fill"
            />
          </div>
        </div>
      </div>
    );
  }, [
    currentUser,
    userStatus,
    wallet?.publicKey,
    hasProfile,
    hasInvitation,
    isLoading,
  ]);

  return (
    <div className="w-full flex justify-center py-12 bg-[#080536]">
      {renderComponent()}
    </div>
  );
};

export default Banner;
