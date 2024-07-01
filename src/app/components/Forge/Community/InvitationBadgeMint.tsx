import * as React from "react";
import Image from "next/image";
import { useAtom } from "jotai";

import { Coin } from "@/app/models/coin";
import Input from "../../common/Input";
import Button from "../../common/Button";
import { mintInvitation } from "@/app/lib/forge/mintInvitation";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { pageCommunity, targetTokenBalance } from "@/app/store/community";
import { data } from "@/app/store";

type Props = {
  image: string;
  price: number;
  coin: Coin;
  projectInfo: any;
  solBalance: number;
};

const InvitationBadgeMint = ({
  image,
  price,
  coin,
  projectInfo,
  solBalance,
}: Props) => {
  const [community] = useAtom(pageCommunity);
  const [currentUser] = useAtom(data);

  const wallet = useAnchorWallet();
  const [isLoading, setIsLoading] = React.useState(false);
  const [amountToMint, setAmountToMint] = React.useState(0);

  const [invitationStatus, setInvitationStatus] = React.useState("Mint");

  const [balance] = useAtom(targetTokenBalance);

  const [result, setResult] = React.useState({
    type: "",
    message: "",
  });

  const mintInvitations = async () => {
    if (amountToMint <= 0) return;

    if (solBalance === 0) {
      setResult({
        type: "warn",
        message: `Hey! We checked your wallet and you don't have enough SOL to mint.`,
      });
      return;
    }

    if (balance < Number(amountToMint) * (price / 1000_000_000)) {
      setResult({
        type: "warn",
        message: `Hey! We checked your wallet and you don't have enough ${coin.symbol} to mint.`,
      });
      return;
    }

    setResult({ type: "", message: "" });

    setIsLoading(true);
    const res = await mintInvitation({
      projectInfo,
      community: community!,
      wallet: wallet!,
      amount: amountToMint,
      setInvitationStatus,
      pronouns: currentUser?.profile?.pronouns,
      userName: currentUser?.profile?.name,
    });

    setResult({ type: res.type, message: res.message });

    setIsLoading(false);
  };

  const getTextResultColor = React.useCallback(() => {
    if (result.type === "success") return "text-green-500";

    if (result.type === "error") return "text-red-400";

    if (result.type === "warn") return "text-orange-500";

    return "text-white";
  }, [result]);

  return (
    <div className="community-page-container-card px-6 py-4 rounded-xl">
      <h6>Invitation Badges</h6>

      <div className="self-center w-[10vmax] h-[10vmax] relative mt-4">
        <Image src={image} alt="Invitation" layout="fill" />
      </div>

      <div className="w-[75%] self-center flex flex-col my-4">
        <Input
          type="text"
          title="Invitations to Mint"
          value={amountToMint.toString()}
          required={false}
          onChange={(e) => {
            const value = Number(e.target.value);

            if (Number.isNaN(value)) return;

            if (value < 0) return;

            setAmountToMint(value);
          }}
          placeholder="0"
        />
      </div>

      <div className="flex flex-col justify-center">
        {result.message && (
          <p className={`text-base ${getTextResultColor()} mb-4 max-w-[80%]`}>
            {result.message}
          </p>
        )}
        <Button
          title={invitationStatus}
          size="large"
          action={mintInvitations}
          isPrimary
          isLoading={false}
          disabled={isLoading || amountToMint <= 0}
        />

        <p className="text-white text-sm self-center text-center">
          Price {price} {coin.symbol.toUpperCase()}
        </p>
        <label className="text-[0.5vmax] self-center text-center">
          Plus you will be charged a small amount of SOL in transaction fees.
        </label>
      </div>

      <div className="flex flex-col justify-center mt-2">
        <p className="text-sm self-center text-center">
          Current balance: <span className="mx-2">{balance}</span>{" "}
          {coin.symbol.toUpperCase()}
        </p>
        <p className="text-sm self-center text-center">
          Current balance: <span className="mx-2">{solBalance}</span> SOL
        </p>
      </div>
    </div>
  );
};

export default InvitationBadgeMint;
