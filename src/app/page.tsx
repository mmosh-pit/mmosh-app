// import axios from "axios";
// import { useAnchorWallet } from "@solana/wallet-adapter-react";

export default function Home() {
  // const searchParams = useSearchParams();
  // const router = useRouter();
  // const rendered = React.useRef(false);
  // const [___, setIncomingWalletToken] = useAtom(incomingWallet);
  // const [__, setUserStatus] = useAtom(status);
  // const [_, setUserData] = useAtom(data);
  // const [isOnSettings] = useAtom(settings);
  // const wallet = useAnchorWallet();

  // const getUserData = React.useCallback(async () => {
  //   const result = await fetchUserData(wallet!);
  //
  //   setUserData(result.data);
  //
  //   const hasTelegram = !!result.data?.telegram;
  //
  //   if (!hasTelegram) {
  //     setUserStatus(UserStatus.noAccount);
  //     return;
  //   }
  //
  //   const hasBotAccount = await axios.get(
  //     `/api/check-bot-account?telegramId=${result.data.telegram.id}`,
  //   );
  //
  //   if (!hasBotAccount) {
  //     setUserStatus(UserStatus.noAccount);
  //     return;
  //   }
  //
  //   setUserStatus(UserStatus.fullAccount);
  // }, [wallet]);

  // const renderComponent = () => {
  //   if (isOnSettings) {
  //     return <Settings />;
  //   }
  //
  //   return <></>;
  // };

  // React.useEffect(() => {
  //   if (wallet?.publicKey) {
  //     getUserData();
  //   }
  // }, [wallet]);

  // React.useEffect(() => {
  //   if (!rendered.current) {
  //     init();
  //     const param = searchParams.get("socialwallet");
  //
  //     if (param) {
  //       setIncomingWalletToken(param);
  //     }
  //     rendered.current = true;
  //   }
  // }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between">
    </div>
  );
}
