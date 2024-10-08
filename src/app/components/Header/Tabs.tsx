import { data, settings } from "@/app/store";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

const Tabs = () => {
  const router = useRouter();

  const [currentUser] = useAtom(data);
  const [isOnSettings, setIsOnSettings] = useAtom(settings);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex w-[75%] justify-between items-center">
        <a
          className="text-base text-white cursor-pointer"
          onClick={() => {
            router.push("/");
          }}
        >
          Coins
        </a>

        <a
          className="text-base text-white cursor-pointer"
          onClick={() => {
            router.push("/create");
          }}
        >
          Members
        </a>

        <a
          className="text-base text-white cursor-pointer"
          onClick={() => router.push("/create/projects")}
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
            router.push("/");
          }}
        >
          Rewards
        </a>

        <a
          className="text-base text-white cursor-pointer"
          onClick={() => {
            router.push("/atm");
          }}
        >
          ATM
        </a>

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
          onClick={() => {
            router.push("/");
          }}
        >
          Training
        </a>
      </div>
    </div>
  );
};

export default Tabs;
