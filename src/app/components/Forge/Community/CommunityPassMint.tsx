import * as React from "react";
import Image from "next/image";
import { useAtom } from "jotai";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

import { Coin } from "@/app/models/coin";
import Input from "../../common/Input";
import Button from "../../common/Button";
import { mintCommunityPass } from "@/app/lib/forge/mintCommunityPass";
import { pageCommunity, targetTokenBalance } from "@/app/store/community";
import { userWeb3Info } from "@/app/store";

type Props = {
  image: string;
  price: number;
  coin: Coin;
  projectInfo: any;
  solBalance: number;
};

const CommunityPassMint = ({
  image,
  price,
  coin,
  projectInfo,
  solBalance,
}: Props) => {
  const [community] = useAtom(pageCommunity);
  const [userInfo] = useAtom(userWeb3Info);

  const wallet = useAnchorWallet();
  const [isLoading, setIsLoading] = React.useState(false);
  const [amountToMint, setAmountToMint] = React.useState(0);
  const [mintStatus, setMintStatus] = React.useState("Mint");

  const [result, setResult] = React.useState({
    type: "",
    message: "",
  });

  const [balance] = useAtom(targetTokenBalance);

  const mintPass = async () => {
    setIsLoading(true);
    const res = await mintCommunityPass({
      projectInfo,
      community: community!,
      wallet: wallet!,
      setMintStatus,
      profile: userInfo?.profile.address!,
    });

    setResult({ type: res.type, message: res.message });

    setIsLoading(false);
  };

  return (
    <div className="community-page-container-card px-6 py-4 rounded-xl">
      <h6>Community Passes</h6>

      <div className="self-center w-[10vmax] h-[10vmax] relative mt-4">
        <Image src={image} alt="Invitation" layout="fill" />
      </div>

      <div className="w-[75%] self-center flex flex-col my-4">
        <Input
          type="text"
          title="Project Passes"
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
        <Button
          title={mintStatus}
          size="large"
          action={mintPass}
          isPrimary
          isLoading={isLoading}
          disabled={isLoading}
        />

        <p className="text-white text-sm self-center text-center">
          Price {price} {coin.symbol.toUpperCase()}
        </p>
        <label className="text-[0.5vmax]">
          Plus you will be charged a small amount of SOL in transaction fees.
        </label>
      </div>

      <div className="flex flex-col mt-2">
        <p>
          Current balance: <span className="mx-2">{balance}</span>{" "}
          {coin.symbol.toUpperCase()}
        </p>
        <p>
          Current balance: <span className="mx-2">{solBalance}</span> SOL
        </p>
      </div>
    </div>
  );
};

export default CommunityPassMint;
