import { walletAddressShortener } from "../lib/walletAddressShortener";
import useWallet from "@/utils/wallet";

const NoConnectedWallet = () => {
  const wallet = useWallet();

  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center mt-4">
      <div className="md:max-w-[45%] max-w-[90%]">
        <h3 className="text-center text-white font-goudy font-normal mb-12">
          Connect to Solana
        </h3>

        <p className="text-center">
          {`Welcome to the Genesis MMOSH, a decentralized, permissionless and
          composable world that plays out across many different access devices
          and software platforms.`}
        </p>

        <p className="text-center mt-4">
          {`Connect your Solana Wallet to enter our realm and mint a free Treasure Chest to stash all your loot.`}
        </p>
      </div>

    </div>
  );
};

export default NoConnectedWallet;
