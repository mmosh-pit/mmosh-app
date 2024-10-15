import { data, settings } from "@/app/store";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

const Tabs = () => {
  const router = useRouter();

  const [currentUser] = useAtom(data);
  const [isOnSettings, setIsOnSettings] = useAtom(settings);

  return (
      <div className="w-full flex justify-between items-center">
        <a
          className="text-base text-white cursor-pointer"
          onClick={() => {
            router.push("/coins");
          }}
        >
          Coins
        </a>

        <a
          className="text-base text-white cursor-pointer"
          onClick={() => {
            router.push("/members");
          }}
        >
          Members
        </a>

        <a
          className="text-base text-white cursor-pointer"
          onClick={() => router.push("/projects")}
        >
          Projects
        </a>

        <a
          className="text-base text-white cursor-pointer"
          onClick={() => router.push("/communities")}
        >
          Communities
        </a>

        <a
          className="text-base text-white cursor-pointer"
          onClick={() => {
            router.push("/rewards");
          }}
        >
          Rewards
        </a>

        <a
          className="text-base text-white cursor-pointer"
          onClick={() => {
            router.push("/swap");
          }}
        >
          Swap
        </a>

        <a
          className="text-base text-white cursor-pointer"
          onClick={() => {
            router.push("/atm");
          }}
        >
          ATM
        </a>

        <div className="flex items-center cursor-pointer">
          <p className="text-base text-white font-semibold">
            Create
          </p>
        </div>

        {currentUser?.profilenft && (
          <a
            className="text-base text-white cursor-pointer"
            onClick={() => {
              if (isOnSettings) return setIsOnSettings(false);
              router.push(`/${currentUser?.profile.username}`);
            }}
          >
            My Profile
          </a>
        )}

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
