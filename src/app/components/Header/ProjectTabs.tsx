import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useAtom } from "jotai";
import { settings } from "@/app/store";

const ProjectTabs = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOnSettings] = useAtom(settings);

  const getHeaderBackground = React.useCallback(() => {
    let defaultClass =
      "w-full flex justify-center items-center py-6 px-8 relative z-0 ";

    if (pathname.includes("create")) {
      defaultClass += "bg-black bg-opacity-[0.56] backdrop-blur-[10px]";
    } else if (pathname !== "/" || isOnSettings) {
      defaultClass += "bg-white bg-opacity-[0.07] backdrop-blur-[2px]";
    } else if (pathname === "/" && !isOnSettings) {
      defaultClass += "bg-black bg-opacity-[0.56] backdrop-blur-[2px]";
    }

    return defaultClass;
  }, [pathname]);

  return (
    <div className={getHeaderBackground()}>
      <div className="w-[50%] flex justify-between">
        <div
          className="relative w-[1.5vmax] h-[1.5vmax] cursor-pointer"
          onClick={() => router.replace("/create/projects/ptv")}
        >
          <Image
            src="https://storage.googleapis.com/mmosh-assets/ptv_logo.png"
            alt="logo"
            layout="fill"
          />
        </div>

        <a
          className="text-base text-white cursor-pointer self-center"
          onClick={() => router.replace("/create/projects/ptv")}
        >
          Leaderboard
        </a>

        <a
          target="_blank"
          onClick={() => router.replace("/create/projects/ptv/candidates")}
          className="text-base text-white cursor-pointer self-center"
        >
          Candidates
        </a>

        <a
          className="text-base text-white cursor-pointer self-center"
          onClick={() => {
            router.push("/create/create_coins");
          }}
        >
          Coins
        </a>

        <a
          className="text-base text-white cursor-pointer self-center"
          onClick={() => {
            router.push("/create/create_community");
          }}
        >
          Communities
        </a>

        <a
          className="text-base text-white cursor-pointer self-center"
          onClick={() => {
            // router.push("/create/communities");
          }}
        >
          Rewards
        </a>

        <a
          className="text-base text-white cursor-pointer self-center"
          onClick={() => {
            // router.push("/create/coins");
          }}
        >
          Join
        </a>

        <a
          className="text-base text-white cursor-pointer self-center"
          onClick={() => {
            router.push("/atm");
          }}
        >
          PTV Training
        </a>
      </div>
    </div>
  );
};

export default ProjectTabs;