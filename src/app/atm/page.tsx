"use client";
import * as React from "react";
import { loadStripeOnramp } from "@stripe/crypto";
import {
  CryptoElements,
  OnrampElement,
} from "../components/atm/StripeCryptoElements";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

const stripeOnrampPromise = loadStripeOnramp(
  process.env.NEXT_PUBLIC_STRIPE_KEY!,
);

const Page = () => {
  const wallet = useAnchorWallet();
  const [clientSecret, setClientSecret] = React.useState("");

  React.useEffect(() => {
    // Fetches an onramp session and captures the client secret
    fetch("/api/create-onramp-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transaction_details: {
          wallet_address: wallet?.publicKey.toString(),
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const onChange = React.useCallback(() => {}, []);

  return (
    <div className="w-full h-screen flex justify-center mt-16">
      <CryptoElements stripeOnramp={stripeOnrampPromise}>
        {clientSecret && (
          <OnrampElement
            id="onramp-element"
            clientSecret={clientSecret}
            appearance={{ theme: "dark" }}
            onChange={onChange}
          />
        )}
      </CryptoElements>
    </div>
  );
};

export default Page;
