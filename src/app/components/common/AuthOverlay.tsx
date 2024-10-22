"use client";

import { useAtom } from "jotai";
import { usePathname, useRouter } from "next/navigation";

import { isAuthOverlayOpen } from "@/app/store";
import CloseIcon from "@/assets/icons/CloseIcon";

const AuthOverlay = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [showAuthOverlay, setShowAuthOverlay] = useAtom(isAuthOverlayOpen);

  if (
    !showAuthOverlay ||
    pathname.includes("login") ||
    pathname.includes("sign-up") ||
    pathname.includes("password")
  )
    return <></>;

  return (
    <div className="sticky w-full bottom-0 flex flex-col bg-[#FFFFFF40] rounded-t-md px-6 py-4">
      <div className="w-full flex justify-end">
        <button
          className="cursor-pointer"
          onClick={() => setShowAuthOverlay(false)}
        >
          <CloseIcon />
        </button>
      </div>

      <div className="w-full flex justify-center">
        <p className="text-base text-white">
          Join Liquid Hearts Club, the privacy superdapp.
        </p>
      </div>

      <div className="self-center flex mt-4">
        <button
          className="bg-[#CD068E] w-full px-12 rounded-md flex items-center justify-center text-center"
          onClick={() => {
            router.push("/login");
          }}
        >
          <p className="text-white text-base text-center">Log In</p>
        </button>

        <div className="mx-4" />

        <button
          className="bg-white w-full px-12 rounded-md flex items-center justify-center text-center"
          onClick={() => {
            router.push("/sign-up");
          }}
        >
          <p className="text-black text-base text-center">Sign Up</p>
        </button>
      </div>
    </div>
  );
};

export default AuthOverlay;
