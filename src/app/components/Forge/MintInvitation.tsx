import * as React from "react";
import Image from "next/image";
import { useAtom } from "jotai";
import Button from "../common/Button";
import { data, userWeb3Info } from "@/app/store";
import { createSubscriptionInvitation } from "@/app/lib/forge/createSubscriptionInvitation";
import MessageBanner from "../common/MessageBanner";
import { createGenesisInvitation } from "@/app/lib/forge/createGenesisInvitation";
import { web3Consts } from "@/anchor/web3Consts";
import { getPronouns } from "@/app/lib/getPronouns";
import useWallet from "@/utils/wallet";

const MintInvitation = () => {
  const wallet = useWallet();
  const [currentUser] = useAtom(data);
  const [profileInfo] = useAtom(userWeb3Info);
  const [amountSelected, setAmountSelected] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const [message, setMessage] = React.useState({
    type: "",
    message: "",
  });

  const mintInvitation = React.useCallback(async () => {
    setMessage({ type: "", message: "" });
    setIsLoading(true);

    if (profileInfo?.profile.address == web3Consts.genesisProfile.toBase58()) {
      const res = await createGenesisInvitation({
        wallet: wallet!,
        profileInfo: profileInfo!,
        amount: amountSelected,
        seniority: currentUser!.profile.seniority,
        pronouns: currentUser!.profile.pronouns,
        name: currentUser!.profile.name,
      });

      setMessage(res);
    } else {
      const res = await createSubscriptionInvitation({
        wallet: wallet!,
        profileInfo: profileInfo!,
        amount: amountSelected,
        seniority: currentUser!.profile.seniority,
        pronouns: currentUser!.profile.pronouns,
        name: currentUser!.profile.name,
      });

      setMessage(res);
    }

    setTimeout(() => {
      setMessage({ type: "", message: "" });
    }, 5000);

    setIsLoading(false);
  }, [amountSelected]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <MessageBanner type={message.type} message={message.message} />
      <div className="relative w-full flex flex-col justify-center items-center pt-20">
        <h4 className="text-center text-white font-goudy font-normal mb-4">
          Invite your Friends to the DAO
        </h4>
        <p className="text-base text-center">
          Build up your guild and earn royalties when new members join MMOSH
          DAO.
        </p>
        <div className="flex items-center px-2 py-4 bg-[#030007] bg-opacity-40 rounded-lg mt-12 lg:max-w-[40%] md:max-w-[50%]">
          <div className="relative w-[12vmax] h-[10vmax] ml-2 mr-4">
            <Image
              src="https://storage.googleapis.com/mmosh-assets/invitation.png"
              alt="Invitation"
              layout="fill"
            />
          </div>

          <div className="w-full flex flex-col">
            <div className="w-full flex flex-col mt-2 mb-4">
              <p className="text-lg text-white">
                Invitation from {currentUser?.profile.username}
              </p>
              <p className="text-sm mt-2">
                {currentUser?.profile.username} cordially invites you to join{" "}
                {getPronouns(currentUser?.profile.pronouns || "")} on the MMOSH,
                the Genesis Ecosystem on the Social Crypto Syndication protocol
                from Liquid Hearts Club. The favor of a reply is requested.
              </p>
            </div>

            <div className="w-full flex justify-between">
              <div className="flex flex-col">
                <div className="flex">
                  <p className="text-sm text-white">Minted:</p>

                  <input
                    className="bg-[#C7C7C7] bg-opacity-[0.17] px-2 ml-2 rounded-md md:max-w-[12%] max-w-[25%] text-center"
                    value={amountSelected}
                    onChange={(e) => {
                      const value = Number(e.target.value);

                      if (Number.isNaN(value)) return;

                      if (!value) return setAmountSelected(0);

                      if (value > (profileInfo?.quota || 0)) return;

                      setAmountSelected(value);
                    }}
                  />
                </div>

                <p className="text-sm text-white">
                  Quota:{" "}
                  <span className="text-gray-300 ml-2">
                    {profileInfo?.quota || 0}
                  </span>
                </p>
                <p className="text-sm text-white">
                  Unit Cost:{" "}
                  <span className="text-gray-300 ml-2">1 $MMOSH</span>
                </p>
              </div>

              <div className="flex flex-col mr-4">
                <Button
                  isLoading={isLoading}
                  title="Mint"
                  isPrimary
                  size="small"
                  action={mintInvitation}
                  disabled={isLoading || amountSelected <= 0}
                />

                <label className="text-white text-sm">
                  Price: {amountSelected} $MMOSH
                </label>
                <label className="text-tiny text-white">
                  Plus a small SOL transaction fee
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintInvitation;
