import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { walletAddressShortener } from "../lib/walletAddressShortener";

const NoConnectedWallet = () => {
  const wallet = useAnchorWallet();

  return (
    <div className="w-full h-full flex flex-col justify-center items-center mt-12">
      <div className="md::max-w-[45%] max-w-[90%] my-12">
        <p className="text-center">
          Welcome to the MMOSH Airdrop App! Complete the tasks to earn points,
          win Airdrop Keys and claim your Airdrops.
        </p>
        <p className="mt-4 text-center">
          Connect a Solana wallet to begin. To be safe, use a fresh wallet that
          does not contain valuable tokens.
        </p>
      </div>

      <div className="mt-8">
        <WalletMultiButton
          startIcon={undefined}
          style={{
            backgroundColor: "#FCAE0E",
            padding: "1em 4em",
            borderRadius: 15,
          }}
        >
          <p className="text-black text-lg">
            {wallet?.publicKey
              ? walletAddressShortener(wallet.publicKey.toString())
              : "Connect your Wallet"}
          </p>
        </WalletMultiButton>
      </div>
    </div>
  );
};

export default NoConnectedWallet;
