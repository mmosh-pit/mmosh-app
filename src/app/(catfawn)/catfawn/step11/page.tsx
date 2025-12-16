// step4a
"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import MessageBanner from "@/app/(main)/components/common/MessageBanner";
import Spinner from "../components/Spinner";
import { headers } from "next/headers";
// import toast from "react-hot-toast";

interface ContactDetails {
  mobileNumber: string;
  telegramUsername: string;
  blueskyHandle: string;
  linkedinProfile: string;
}

export default function Step11VC() {
  const router = useRouter();

  const [cachedData, setCachedData] = React.useState({
    email: "",
    currentStep: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [msgClass, setMsgClass] = useState<"success" | "error">("success");

  const [contactDetails, setContactDetails] = React.useState<ContactDetails>({
    mobileNumber: "",
    telegramUsername: "",
    blueskyHandle: "",
    linkedinProfile: "",
  });

  React.useEffect(() => {
    const stored = localStorage.getItem("catfawn-data");

    if (!stored) {
      router.replace("/");
      return;
    }

    try {
      const result = JSON.parse(stored);
      setCachedData(result);

      if (result?.currentStep !== "catfawn/step11") {
        router.replace(`/${result.currentStep}`);
      }
    } catch {
      router.replace("/");
    }
  }, []);

  const handleChange = (field: keyof ContactDetails, value: string) => {
    setContactDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateContactDetails = async () => {
    if (!contactDetails.mobileNumber.trim()) {
      createMessage("Mobile number is required.", "error");
      return;
    }

    if (contactDetails.mobileNumber.trim().length < 8) {
      createMessage("Please enter a valid mobile number.", "error");
      return;
    }

    try {
      const res = await axios.patch("/api/visitors/update-visitors", {
        email: cachedData.email,
        currentStep: "catfawn/step12",
        mobileNumber: contactDetails.mobileNumber,
        telegramUsername: contactDetails.telegramUsername,
        blueskyHandle: contactDetails.blueskyHandle,
        linkedinProfile: contactDetails.linkedinProfile
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        }
      });

      if (res.data.status) {
        localStorage.setItem(
          "catfawn-data",
          JSON.stringify({
            ...cachedData,
            currentStep: "catfawn/step12",
          })
        );

        router.replace("/catfawn/step12");
      } else {
        createMessage(res.data.message || "Unable to update contact details.", "error");
      }
    } catch {
      createMessage("Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const createMessage = (message: string, type: "success" | "error") => {
    setMsgText(message);
    setMsgClass(type);
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 4000);
  };

  return (
    <>
      {showMsg && (
        <div className="w-full absolute top-0 left-1/2 -translate-x-1/2">
          <MessageBanner type={msgClass} message={msgText} />
        </div>
      )}
      <div className="min-h-[29.875rem] xl:w-[36.188rem] bg-[#271114] rounded-[1.25rem] pt-[1.563rem] pb-[1.25rem] px-[3.125rem] max-md:px-5 max-md:py-8">
        <h2 className="relative font-poppins text-center text-[1.563rem] max-md:text-xl leading-[100%] font-bold bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
          <div className="absolute left-0">
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

        <p className="text-[1rem] text-[#FFFFFFE5] font-avenirNext max-md:text-sm font-bold leading-[94%] mt-[0.313rem] -tracking-[0.04em]">
          Step 11 of 14: Your Contact Details.{" "}
          <span className="font-normal font-avenir">
            {" "}
            The CAT FAWN Connection is more than a mobile app. CAT FAWN
            intelligence will be available to you through text messaging,
            messaging apps and social networks. Please let us know the various
            ways the CAT FAWN can reach you. You will have the option to opt-out
            at any time.
          </span>
        </p>

        <form className="mt-[0.313rem] text-[1rem] max-md:text-sm font-normal leading-[100%]">
          <div className="flex flex-col gap-[0.25rem]">
            <div>
              <label className="block text-[0.813rem] mb-[0.125rem] font-normal leading-[100%] text-[#FFFFFFCC]">
                Mobile number
              </label>
              <input
                type="number"
                placeholder="Mobile number"
                className="w-full h-[2.813rem] px-[1.294rem] py-[0.813rem] rounded-lg bg-[#402A2A] backdrop-blur-[12.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-20"
                onChange={(e) => handleChange("mobileNumber", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[0.813rem] mb-[0.125rem] font-normal leading-[100%] text-[#FFFFFFCC]">
                Telegram username
              </label>
              <input
                type="text"
                placeholder="@handle"
                className="w-full h-[2.813rem] px-[1.294rem] py-[0.813rem] rounded-lg bg-[#402A2A] backdrop-blur-[12.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-20"
                onChange={(e) => handleChange("telegramUsername", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[0.813rem] mb-[0.125rem] font-normal leading-[100%] text-[#FFFFFFCC]">
                Bluesky handle
              </label>
              <input
                type="text"
                placeholder="@name.bsky.social"
                className="w-full h-[2.813rem] px-[1.294rem] py-[0.813rem]  rounded-lg bg-[#402A2A] backdrop-blur-[12.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-20"
                onChange={(e) => handleChange("blueskyHandle", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[0.813rem] mb-[0.125rem] font-normal leading-[100%] text-[#FFFFFFCC]">
                LinkedIn profile (full URL)
              </label>
              <input
                type="text"
                placeholder="http://url.com"
                className="w-full h-[2.813rem] px-[1.294rem] py-[0.813rem] rounded-lg bg-[#402A2A] backdrop-blur-[12.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-20"
                onChange={(e) => handleChange("linkedinProfile", e.target.value)}
              />
            </div>

            <button
              type="button"
              className="font-avenirNext h-[3.125rem]  mt-[1.063rem] w-full py-[1.063rem] bg-[#FF710F] text-[1rem] leading-[100%] text-[#2C1316] font-extrabold rounded-[0.625rem] hover:opacity-90"
              onClick={updateContactDetails}
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
