"use client";

import * as React from "react";
import axios from "axios";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useAtom } from "jotai";

import { UserStatus, data, status } from "./store";
import NoConnectedWallet from "./components/NoConnectedWallet";
import ConnectedWOTelegram from "./components/ConnectedWOTelegram";
import WithTelegramNoAccount from "./components/WithTelegramNoAccount";
import ConnectedWOTwitter from "./components/ConnectedWOTwitter";
import CreateProfile from "./components/CreateProfile";
import HomePage from "./components/HomePage";
import { init } from "./lib/firebase";

export default function Home() {
  const rendered = React.useRef(false);
  const [userStatus, setUserStatus] = useAtom(status);
  const [_, setUserData] = useAtom(data);
  const wallet = useAnchorWallet();

  const getUserData = React.useCallback(async () => {
    const result = await axios.get(
      `/api/get-wallet-data?wallet=${wallet!.publicKey}`,
    );

    setUserData(result.data);

    const hasTwitter = !!result.data?.twitter;
    const hasTelegram = !!result.data?.telegram;
    const hasProfile = !!result.data?.profile;

    if (!hasTelegram) {
      setUserStatus(UserStatus.noTelegram);
      return;
    }

    if (!hasTwitter) {
      setUserStatus(UserStatus.noTwitter);
      return;
    }

    const hasBotAccount = await axios.get(
      `/api/check-bot-account?telegramId=${result.data.telegram.id}`,
    );

    if (!hasBotAccount) {
      setUserStatus(UserStatus.noAccount);
      return;
    }

    if (!hasProfile) {
      setUserStatus(UserStatus.noProfile);
      return;
    }

    setUserStatus(UserStatus.fullAccount);
  }, [wallet]);

  const renderComponent = () => {
    if (!wallet?.publicKey) {
      return <NoConnectedWallet />;
    }

    if (userStatus === UserStatus.noTelegram) {
      return <ConnectedWOTelegram />;
    }

    if (userStatus === UserStatus.noAccount) {
      return <WithTelegramNoAccount />;
    }

    if (userStatus === UserStatus.noTwitter) {
      return <ConnectedWOTwitter />;
    }

    if (userStatus === UserStatus.noProfile) {
      return <CreateProfile />;
    }

    return <HomePage />;
  };

  const saveWalletIfNotExists = React.useCallback(async () => {
    await axios.post("/api/save-wallet", {
      wallet: wallet?.publicKey.toString(),
    });
  }, [wallet]);

  React.useEffect(() => {
    if (wallet?.publicKey) {
      saveWalletIfNotExists();
      getUserData();
    }
  }, [wallet]);

  React.useEffect(() => {
    if (!rendered.current) {
      init();
      rendered.current = true;
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full h-full items-center justify-between">
        {renderComponent()}
      </div>
    </main>
  );
}
