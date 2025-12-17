"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChallengePills, { ChallengeItem } from "../components/ChallengePills";
import Spinner from "../components/Spinner";
import MessageBanner from "@/app/(main)/components/common/MessageBanner";

const Step7VC = () => {
  const router = useRouter();

  const [cachedData, setCachedData] = useState<any>(null);
  const [selectedAbilities, setSelectedAbilities] = useState<string[]>([]);

  const [showMsg, setShowMsg] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [msgClass, setMsgClass] = useState<"success" | "error">("success");
  const [isLoading, setIsLoading] = useState(false);

  const ABILITIES: ChallengeItem[] = [
    { label: "🧠 Emotional intelligence" },
    { label: "🔌 Adaptability" },
    { label: "💥 Collaboration" },
    { label: "🧩 Strategic thinking" },
    { label: "👂🏻 Listening deeply" },
    { label: "🔮 Intuition and insight" },
    { label: "👁️ Self-discipline" },
    { label: "🎏 Patience and persistence" },
    { label: "📪 Empathy and compassion" },
  ];

  useEffect(() => {
    const stored = localStorage.getItem("catfawn-data");

    if (!stored) {
      router.replace("/");
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setCachedData(parsed);

      if (parsed.currentStep && parsed.currentStep !== "catfawn/step7") {
        router.replace(`/${parsed.currentStep}`);
      }

      // Prefill if user revisits
      if (Array.isArray(parsed.abilities)) {
        setSelectedAbilities(parsed.abilities);
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
    setSelectedAbilities(selected);
  };

  const handleSubmit = async () => {
    setIsLoading(true)
    if (selectedAbilities.length < 3) {
      createMessage("Please select at least 3 abilities.", "error");
      setIsLoading(false)
      return;
    }

    localStorage.setItem(
      "catfawn-data",
      JSON.stringify({
        ...cachedData,
        abilities: selectedAbilities,
        currentStep: "catfawn/step8",
      })
    );
    router.replace("/catfawn/step8");
    setIsLoading(false);
  };

  return (
    <>
      {showMsg && (
        <div className="w-full absolute top-0 left-1/2 -translate-x-1/2">
          <MessageBanner type={msgClass} message={msgText} />
        </div>
      )}
      <div className="min-h-[29.875rem] xl:w-[36.188rem] bg-[#271114] rounded-[1.25rem] pt-[1.563rem] pb-[0.938rem] pl-[3.25rem] pe-[3.063rem] max-md:px-5 max-md:py-8">
        <h2 className="relative font-poppinsNew text-center text-[1.563rem] max-md:text-xl leading-[100%] font-bold bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
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
          Step 7 of 14: Attributes{" "}
          <span className="font-normal font-avenir">
            You already carry powerful abilities—gifts shaped by your experience,
            your nature, and your relationships. When named, they can become
            steady sources of strength.
          </span>
        </p>

        <p className="text-[1rem] max-md:text-sm font-normal leading-[94%] mt-[1.25rem] -tracking-[0.02em] px-[0.313rem]">
          Which abilities or strengths feel alive in you right now?
          <br /> (Select at least three. You can modify them anytime.)
        </p>

        <div className="mt-[2.438rem]">
          <ChallengePills
            challenges={ABILITIES}
            onChange={handleChange}
            min={3}
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="steps_btn_submit mt-[1rem]"
        >
          {isLoading ? <Spinner /> : "Next"}
        </button>
      </div>
    </>
  );
};

export default Step7VC;
