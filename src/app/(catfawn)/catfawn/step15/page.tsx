"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import React, { useEffect, useState } from "react";
import MessageBanner from "@/app/(main)/components/common/MessageBanner";
import Spinner from "../components/Spinner";
import { init, uploadFile } from "@/app/lib/firebase";

const Step15VC = () => {
  const router = useRouter();
  const [cachedData, setCachedData] = useState<any>({});

  const [avatar, setAvatar] = useState<File | null>(null);
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [webLink, setWebLink] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [msgClass, setMsgClass] = useState<"success" | "error">("success");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const createMessage = (message: string, type: "success" | "error") => {
    window.scrollTo(0, 0);
    setMsgText(message);
    setMsgClass(type);
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 4000);
  };

  useEffect(() => {
    const stored = localStorage.getItem("catfawn-data");
    if (!stored) {
      return router.replace("/catfawn");
    }

    try {
      init();
      const result = JSON.parse(stored);
      setCachedData(result);
      if (result?.completedSteps !== undefined && result?.completedSteps < 26) {
        router.replace(`/${result.currentStep}`);
      }
    } catch {
      router.replace("/catfawn");
    }
  }, []);

  const isValidUrl = (url: string) => {
    if (!url || typeof url !== "string") return false;

    const trimmed = url.trim();
    if (!/^https?:\/\/.+/i.test(trimmed)) return false;

    try {
      const parsed = new URL(trimmed);
      if (!["http:", "https:"].includes(parsed.protocol)) return false;
      const hostnameRegex = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z]{2,})+$/;
      return hostnameRegex.test(parsed.hostname);
    } catch {
      return false;
    }
  };

  const handleNext = async () => {
    if (!avatar && !lastName && !bio && !webLink) {
      createMessage("All fields are required.", "error");
      return;
    }
    if (!avatar) {
      createMessage("Avatar is required.", "error");
      return;
    }

    if (!lastName.trim()) {
      createMessage("Last Name is required.", "error");
      return;
    }

    if(lastName.length < 2 || lastName.length > 16){
      createMessage("Last name must be between 2 and 16 characters.","error")
      return;
    }

    if (!bio.trim()) {
      createMessage("Bio is required.", "error");
      return;
    }

    if (bio.trim().length < 10 || bio.trim().length > 255) {
      createMessage("Bio must be between 10 and 255 characters.", "error");
      return;
    }

    if (!webLink.trim()) {
      createMessage("Web link is required.", "error");
      return;
    }

    if (!isValidUrl(webLink.trim())) {
      createMessage("Please enter a valid web link (http or https).", "error");
      return;
    }

    try {
      setIsLoading(true);

      const avatarUrl = await uploadFile(
        avatar,
        cachedData.email || "user",
        "avatars"
      );

      if (!avatarUrl) {
        createMessage("Avatar upload failed. Please try again.", "error");
        setIsLoading(false);
        return;
      }

      const updatedData = {
        ...cachedData,
        avatarUrl,
        lastName,
        bio: bio.trim(),
        web: webLink,
        completedSteps: 27,
      };

      const res = await axios.post("/api/visitors/save", updatedData);

      if (!res.data?.status) {
        createMessage(
          res.data?.message || "Unable to save user information",
          "error"
        );
        setIsLoading(false);
        return;
      }

      createMessage("Successfully register the user information.", "success");
      localStorage.removeItem("catfawn-data");

      router.replace("/join");
    } catch (err: any) {
      createMessage(
        err?.response?.data?.message || "Something went wrong",
        "error"
      );
      setIsLoading(false);
    }
  };

  const saveImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      createMessage("Only JPEG, JPG, or PNG images are allowed.", "error");
      e.target.value = "";
      return;
    }

    const maxSize = 500 * 1024;
    if (file.size > maxSize) {
      createMessage("Image size must be less than 500 KB.", "error");
      e.target.value = "";
      return;
    }

    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  return (
    <>
      {showMsg && (
        <div className="w-full absolute top-0 left-1/2 -translate-x-1/2">
          <MessageBanner type={msgClass} message={msgText} />
        </div>
      )}
      <div className="min-h-[29.875rem] xl:w-[36.188rem] bg-[#271114] rounded-[1.25rem] pt-[1.563rem] pb-[1.25rem] px-[3.125rem] max-md:px-5 max-md:py-8">
        <h2 className="relative text-center font-poppinsNew text-[1.563rem] max-md:text-lg leading-[100%] font-bold bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
          <div
            className="absolute top-1/2 -translate-y-1/2 left-0 cursor-pointer"
            onClick={() => {
              router.replace("/catfawn/step14");
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 12L4 12M4 12L10 6M4 12L10 18"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          Request Early Access
        </h2>

        <p className="max-sm:text-base font-avenirNext max-md:text-sm font-bold leading-[88%] mt-[0.313rem] -tracking-[0.04em]">
          Step 15 of 15: Your Contact Details
        </p>

        <form className="mt-4">
          <span className="text-sm text-white/80">Avatar selection *</span>

          <label
            htmlFor="avatar-input"
            className="w-[7.5rem] h-[5.938rem] rounded-xl bg-[#402A2A] border border-white/20 flex items-center justify-center cursor-pointer mt-2 overflow-hidden"
          >
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-white/70">Select</span>
            )}
          </label>

          <input
            id="avatar-input"
            type="file"
            accept=".jpeg,.jpg,.png"
            className="hidden"
            onChange={(e) => saveImage(e)}
          />

          <div className="mt-3">
            <span className="text-sm text-white/80">Last Name *</span>
            <input
              type="text"
              value={lastName}
              placeholder="Last Name"
              className="w-full h-[2.813rem] px-4 rounded-lg bg-[#402A2A] border border-white/20 text-white"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="mt-3">
            <span className="text-sm text-white/80">Bio *</span>
            <input
              type="text"
              value={bio}
              placeholder="Bio"
              className="w-full h-[2.813rem] px-4 rounded-lg bg-[#402A2A] border border-white/20 text-white"
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="mt-3">
            <span className="text-sm text-white/80">Web Link *</span>
            <input
              type="text"
              value={webLink}
              placeholder="http://myweb.com"
              className="w-full h-[2.813rem] px-4 rounded-lg bg-[#402A2A] border border-white/20 text-white"
              onChange={(e) => setWebLink(e.target.value.trim())}
            />
          </div>

          <button
            type="button"
            className="steps_btn_submit mt-5"
            onClick={handleNext}
          >
            {isLoading ? <Spinner size="sm" /> : "Next"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Step15VC;
