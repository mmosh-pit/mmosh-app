"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import MessageBanner from "@/app/(main)/components/common/MessageBanner";
import Spinner from "../components/Spinner";

const Step16VC = () => {
  const router = useRouter();

  const [cachedData, setCachedData] = useState({
    email: "",
    currentStep: "",
  });

  const [avatar, setAvatar] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [msgClass, setMsgClass] = useState<"success" | "error">("success");

  const createMessage = (text: string, type: "success" | "error") => {
    setMsgText(text);
    setMsgClass(type);
    setShowMsg(true);
  };

  // useEffect(() => {
  //   const stored = localStorage.getItem("catfawn-data");
  //   if (!stored) {
  //     router.replace("/");
  //     return;
  //   }

  //   try {
  //     const result = JSON.parse(stored);
  //     setCachedData(result);

  //     if (result.currentStep !== "catfawn/step16") {
  //       router.replace(`/${result.currentStep}`);
  //     }
  //   } catch {
  //     router.replace("/");
  //   }
  // }, [router]);

  return (
    <>
      {showMsg && (
        <div className="w-full absolute top-0 left-1/2 -translate-x-1/2">
          <MessageBanner type={msgClass} message={msgText} />
        </div>
      )}
      <div className="min-h-[29.875rem] xl:w-[36.188rem] bg-[#271114] rounded-[1.25rem] pt-[1.563rem] pb-[1.25rem] px-[3.125rem] max-md:px-5 max-md:py-8">

        <h2 className="text-center text-[1.563rem] font-bold text-white">
          Request Early Access
        </h2>

        <p className="text-white/80 mt-1">
          Step 16 of 16: Your Contact Details
        </p>

        <form className="mt-4">
          {/* Avatar */}
          <label className="text-sm text-white/80">Avatar selection *</label>

          <label
            htmlFor="avatar-input"
            className="w-[7.5rem] h-[5.938rem] rounded-xl bg-[#402A2A] border border-white/20 flex items-center justify-center cursor-pointer mt-2"
          >
            Select
          </label>

          <input
            id="avatar-input"
            type="file"
            accept=".jpeg,.jpg,.png"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const allowedTypes = ["image/jpeg", "image/png"];
              if (!allowedTypes.includes(file.type)) {
                createMessage("Only JPEG, JPG, or PNG images are allowed.", "error");
                e.target.value = "";
                return;
              }

              const maxSize = 500 * 1024; // 500 KB
              if (file.size > maxSize) {
                createMessage("Image size must be less than 500 KB.", "error");
                e.target.value = "";
                return;
              }

              setAvatar(file);
            }}
          />

          {/* Last Name */}
          <div className="mt-3">
            <label className="text-sm text-white/80">Last Name *</label>
            <input
              type="text"
              placeholder="Last Name"
              className="w-full h-[2.813rem] px-4 rounded-lg bg-[#402A2A] border border-white/20 text-white"
            />
          </div>

          {/* Bio */}
          <div className="mt-3">
            <label className="text-sm text-white/80">Bio</label>
            <input
              type="text"
              placeholder="Bio"
              className="w-full h-[2.813rem] px-4 rounded-lg bg-[#402A2A] border border-white/20 text-white"
            />
          </div>

          {/* Web link */}
          <div className="mt-3">
            <label className="text-sm text-white/80">Web Link</label>
            <input
              type="text"
              placeholder="http://myweb.com"
              className="w-full h-[2.813rem] px-4 rounded-lg bg-[#402A2A] border border-white/20 text-white"
            />
          </div>

          <button
            type="button"
            className="w-full h-[3.125rem] mt-5 bg-[#FF710F] text-[#2C1316] font-bold rounded-lg"
          >
            Next
          </button>
        </form>
      </div>
    </>
  );
};

export default Step16VC;
