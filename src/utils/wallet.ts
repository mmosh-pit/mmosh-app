import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { appPrivateKey } from "@/app/store";
import { AnchorWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { useAtom } from "jotai";
import * as React from "react";

const useWallet = () => {
  const externalWallet = useAnchorWallet();
  const [privateKey] = useAtom(appPrivateKey);

  const [wallet, setWallet] = React.useState<AnchorWallet>();

  React.useEffect(() => {
    if (!privateKey) return;
    try {
      const keypair = Keypair.fromSecretKey(bs58.decode(privateKey));
      const wallet = new MyWallet(keypair);

      setWallet(wallet);
    } catch (err) {
      console.error(err);
    }
  }, [privateKey]);

  return externalWallet ?? wallet;
};

export default useWallet;

class MyWallet extends NodeWallet {}
