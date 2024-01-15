import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { walletAddressShortener } from "../lib/walletAddressShortener";

const NoConnectedWallet = () => {
  const wallet = useAnchorWallet();

  return (
    <div className="w-full h-full flex flex-col justify-center items-center mt-4">
      <div className="md:max-w-[45%] max-w-[90%] my-12">
        <p className="text-center">
          A MMOSH is a decentralized, permissionless and composable virtual
          world accessible through many different access devices and software
          platforms.
        </p>
      </div>

      <div className="mt-8">
        <WalletMultiButton
          startIcon={undefined}
          style={{
            backgroundColor: "#CD068E",
            padding: "1em 4em",
            borderRadius: 15,
          }}
        >
          <p className="text-white text-lg">
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
