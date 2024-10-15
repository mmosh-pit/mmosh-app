import { data, settings } from "@/app/store";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

const Tabs = () => {
  const router = useRouter();

  const [currentUser] = useAtom(data);
  const [isOnSettings, setIsOnSettings] = useAtom(settings);

  return (
    <div className="flex justify-center items-center">
      <a
        className="text-base text-white cursor-pointer"
        onClick={() => {
          router.push("/coins");
        }}
      >
        Coins
      </a>

      <div className="mx-2" />

      <a
        className="text-base text-white cursor-pointer"
        onClick={() => {
          router.push("/members");
        }}
      >
        Members
      </a>

      <div className="mx-2" />
      <a
        className="text-base text-white cursor-pointer"
        onClick={() => router.push("/projects")}
      >
        Projects
      </a>

      <div className="mx-2" />
      <a
        className="text-base text-white cursor-pointer"
        onClick={() => router.push("/communities")}
      >
        Communities
      </a>

      <div className="mx-2" />
      <a
        className="text-base text-white cursor-pointer"
        onClick={() => {
          router.push("/rewards");
        }}
      >
        Rewards
      </a>

      <div className="mx-2" />
      <a
        className="text-base text-white cursor-pointer"
        onClick={() => {
          router.push("/swap");
        }}
      >
        Swap
      </a>

      <div className="mx-2" />
      <a
        className="text-base text-white cursor-pointer"
        onClick={() => {
          router.push("/atm");
        }}
      >
        ATM
      </a>

      <div className="mx-2" />
      <div className="flex items-center cursor-pointer">
        <p className="text-base text-white font-semibold">Create</p>
      </div>

      {currentUser?.profilenft && (
        <>
          <div className="mx-2" />
          <a
            className="text-base text-white cursor-pointer"
            onClick={() => {
              if (isOnSettings) return setIsOnSettings(false);
              router.push(`/${currentUser?.profile.username}`);
            }}
          >
            My Profile
          </a>
        </>
      )}

      <div className="mx-2" />
      <a
        className="text-base text-white cursor-pointer"
        href="https://www.liquidhearts.club"
        target="_blank"
      >
        Training
      </a>
    </div>
  );
};

export default Tabs;
