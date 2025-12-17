"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import React, { useEffect, useState } from "react";
import MessageBanner from "@/app/(main)/components/common/MessageBanner";
import Spinner from "../components/Spinner";
import { uploadFile } from "@/app/lib/firebase";


const Step15VC = () => {
  const router = useRouter();

  const [cachedData, setCachedData] = useState({
    email: "",
    currentStep: "",
  });

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
    setMsgText(message);
    setMsgClass(type);
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 4000);
  };

  useEffect(() => {
    const stored = localStorage.getItem("catfawn-data");
    if (!stored) {
      router.replace("/");
      return;
    }

    try {
      const result = JSON.parse(stored);
      setCachedData(result);

      if (result.currentStep !== "catfawn/step15") {
        router.replace(`/${result.currentStep}`);
      }
    } catch {
      router.replace("/");
    }
  }, [router]);

  const isValidUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return ["http:", "https:"].includes(parsed.protocol);
    } catch {
      return false;
    }
  };


  const handleNext = async () => {
    const missingFields: string[] = [];

    if (!avatar) missingFields.push("Avatar");
    if (!lastName.trim()) missingFields.push("Last Name");
    if (!bio.trim()) missingFields.push("Bio");
    if (!webLink.trim()) missingFields.push("Web Link");

    if (missingFields.length > 0) {
      createMessage(`${missingFields.join(", ")} is required`, "error");
      return;
    }

    if (!isValidUrl(webLink.trim())) {
      createMessage("Please enter a valid web link (http or https).", "error");
      return;
    }

    try {
      setIsLoading(true);
      const avatarUrl = await uploadFile(
        avatar as File,
        cachedData.email || "user",
        "avatars"
      ); const res = await axios.patch(
        "/api/visitors/update-visitors",
        {
          email: cachedData.email,
          currentStep: "catfawn/step16",

          avatar: avatarUrl,
          lastName: lastName,
          bio: bio,
          web: webLink,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );

      if (res.data.status) {
        localStorage.setItem(
          "catfawn-data",
          JSON.stringify({
            ...cachedData,
            currentStep: "catfawn/step16",
          })
        );

        // final step → redirect
        router.replace("/success");
      } else {
        createMessage(res.data.message, "error");
      }
    } catch (err: any) {
      createMessage(
        err?.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };


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

              // ✅ Create preview
              const previewUrl = URL.createObjectURL(file);
              setAvatarPreview(previewUrl);
            }}
          />


          {/* Last Name */}
          <div className="mt-3">
            <span className="text-sm text-white/80">Last Name *</span>
            <input
              type="text"
              value={lastName}
              placeholder="Last Name"
              className="w-full h-[2.813rem] px-4 rounded-lg bg-[#402A2A] border border-white/20 text-white"
              onChange={(e) => setLastName(e.target.value.trim())}
            />
          </div>

          {/* Bio */}
          <div className="mt-3">
            <span className="text-sm text-white/80">Bio *</span>
            <input
              type="text"
              value={bio}
              placeholder="Bio"
              className="w-full h-[2.813rem] px-4 rounded-lg bg-[#402A2A] border border-white/20 text-white"
              onChange={(e) => setBio(e.target.value.trim())}
            />
          </div>

          {/* Web link */}
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
            className="w-full h-[3.125rem] mt-5 bg-[#FF710F] text-[#2C1316] font-bold rounded-lg"
            onClick={handleNext}
          >
            {isLoading && <Spinner size="sm" />}
            Next
          </button>
        </form>
      </div>
    </>
  );
};

export default Step15VC;
