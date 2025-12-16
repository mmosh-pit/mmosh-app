"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ChallengePills, { ChallengeItem } from "../components/ChallengePills";
import Spinner from "../components/Spinner";
import MessageBanner from "@/app/(main)/components/common/MessageBanner";

const Step6VC = () => {
  const router = useRouter();

  const [cachedData, setCachedData] = useState<any>(null);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);

  const [showMsg, setShowMsg] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [msgClass, setMsgClass] = useState<"success" | "error">("success");
  const [isLoading, setIsLoading] = useState(false);

  const CHALLENGES: ChallengeItem[] = [
    { label: "💤 Sleep better" },
    { label: "💡 Start my own business" },
    { label: "⚡ Boost energy" },
    { label: "🌟 Feel more connected" },
    { label: "⌛ Manage time better" },
    { label: "🤹🏻‍♂️ Manage stress" },
    { label: "💪🏻 Build self-confidence" },
    { label: "🚀 Start my own business" },
    { label: "⏰ Manage time better" },
  ];

  /** 🔹 Load cached data */
  useEffect(() => {
    const stored = localStorage.getItem("catfawn-data");

    if (!stored) {
      router.replace("/");
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setCachedData(parsed);

      if (parsed.currentStep && parsed.currentStep !== "catfawn/step6") {
        router.replace(`/${parsed.currentStep}`);
      }

      // Prefill if user comes back
      if (Array.isArray(parsed.challenges)) {
        setSelectedChallenges(parsed.challenges);
      }
    } catch {
      router.replace("/");
    }
  }, []);

  const createMessage = (message: string, type: "success" | "error") => {
    setMsgText(message);
    setMsgClass(type);
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 4000);
  };

  const handleChange = (selected: string[]) => {
    setSelectedChallenges(selected);
  };

  const submitStep6 = async () => {
    if (selectedChallenges.length < 3) {
      createMessage("Please select at least 3 challenges.", "error");
      return;
    }

    try {
      setIsLoading(true);

      const res = await axios.patch(
        "/api/visitors/update-visitors",
        {
          email: cachedData.email,
          currentStep: "catfawn/step7",
          challenges: selectedChallenges,
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
            challenges: selectedChallenges,
            currentStep: "catfawn/step7",
          })
        );

        router.replace("/catfawn/step7");
      } else {
        createMessage(res.data.message || "Failed to save challenges", "error");
      }
    } catch {
      createMessage("Something went wrong", "error");
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
      <div className="min-h-[29.875rem] xl:w-[36.188rem] bg-[#271114] rounded-[1.25rem] pt-[1.563rem] pb-[0.938rem] pl-[3.25rem] pe-[3.063rem] max-md:px-5 max-md:py-8">
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
        <p className="text-[1rem] text-[#FFFFFFE5] font-avenirNext max-md:text-sm font-bold leading-[94%] mt-[0.313rem] -tracking-[0.02em]">
          Step 6 of 14: Challenges.{" "}
          <span className="font-normal font-avenir">
            The CAT-FAWN Connection can help you navigate the challenges you’re
            facing—whether they relate to personal growth, professional life, or
            your relationships with others. By sharing the areas you want support
            with, CAT-FAWN can tailor your experience from the start.
          </span>
        </p>

        <p className="text-[1rem] max-md:text-sm font-normal leading-[94%] mt-[.8rem] -tracking-[0.02em] px-[0.313rem]">
          Which challenges are most present for you right now?
          <br /> (Please select at least three. You’ll be able to update these
          anytime.)
        </p>

        <div className="mt-[0.563rem]">
          <ChallengePills challenges={CHALLENGES} onChange={handleChange} min={3} />
        </div>

        <button
          type="button"
          className="font-avenirNext w-full h-[3.125rem] bg-[#FF710F] mt-[5.563rem] text-[#2C1316] font-extrabold rounded-[0.625rem] flex items-center justify-center gap-2"
        >
          {isLoading && <Spinner size="sm" />}
          Next
        </button>
      </div>
    </>
  );
};

export default Step6VC;