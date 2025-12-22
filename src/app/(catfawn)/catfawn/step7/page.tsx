"use client";

import React, {useState } from "react";
import { useRouter } from "next/navigation";
import ChallengePills, { ChallengeItem } from "../components/ChallengePills";
import Spinner from "../components/Spinner";
import MessageBanner from "@/app/(main)/components/common/MessageBanner";

const Step7VC = () => {
  const router = useRouter();

  const [cachedData, setCachedData] = useState<any>(null);
  const msgTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  
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

  React.useEffect(() => {
    const stored = localStorage.getItem("catfawn-data");
    if (!stored) {
      return router.replace("/catfawn");
    }
    try {
      const parsed = JSON.parse(stored);
      setCachedData(parsed);

      if (parsed?.completedSteps !== undefined && parsed?.completedSteps < 18) {
        router.replace(`/${parsed.currentStep}`);
      }

      if (Array.isArray(parsed.abilities)) {
        setSelectedAbilities(parsed.abilities);
      }
    } catch {
      router.replace("/catfawn");
    }
  }, []);

  const createMessage = (message: string, type: "error" | "success") => {
    window.scrollTo(0, 0);

    setMsgText(message);
    setMsgClass(type);
    setShowMsg(true);

    if (msgTimeoutRef.current) {
      clearTimeout(msgTimeoutRef.current);
    }

    msgTimeoutRef.current = setTimeout(() => {
      setShowMsg(false);
      msgTimeoutRef.current = null;
    }, 4000);
  };

  const handleChange = (selected: string[]) => {
    setSelectedAbilities(selected);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (selectedAbilities.length < 3) {
      createMessage("Please select at least 3 abilities.", "error");
      setIsLoading(false);
      return;
    }

    localStorage.setItem(
      "catfawn-data",
      JSON.stringify({
        ...cachedData,
        abilities: selectedAbilities,
        currentStep: "catfawn/step8",
        completedSteps:
          cachedData.completedSteps && cachedData.completedSteps < 19
            ? 19
            : cachedData.completedSteps,
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
      <form className="min-h-[29.875rem] xl:w-[36.188rem] bg-[#271114] rounded-[1.25rem] pt-[1.563rem] pb-[0.938rem] pl-[3.25rem] pe-[3.063rem] max-md:px-5 max-md:py-8" onSubmit={handleSubmit}>
        <h2 className="relative font-poppinsNew text-center text-[1.563rem] max-md:text-lg leading-[100%] font-bold bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
          <div
            className="absolute top-1/2 -translate-y-1/2 left-0 cursor-pointer"
            onClick={() => {
              router.replace("/catfawn/step6");
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
        <p className="max-sm:text-base text-[#FFFFFFE5] font-avenirNext max-md:text-sm font-bold leading-snug lg:leading-[94%] mt-[0.313rem] -tracking-[0.02em]">
          Step 7 of 15: Attributes{" "}
          <span className="font-normal font-avenir">
            You already carry powerful abilities—gifts shaped by your
            experience, your nature, and your relationships. When named, they
            can become steady sources of strength.
          </span>
        </p>

        <p className="max-sm:text-base text-[1rem] max-md:text-sm font-normal leading-snug lg:leading-[94%] mt-[1.25rem] -tracking-[0.02em] px-[0.313rem]">
          Which abilities or strengths feel alive in you right now?
          <br /> (Select at least three. You can modify them anytime.)
        </p>

        <div className="mt-[2.438rem]">
          <ChallengePills
            challenges={ABILITIES}
            onChange={handleChange}
            value={selectedAbilities}
            min={3}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="steps_btn_submit mt-[1rem]"
        >
          {isLoading ? <Spinner /> : "Next"}
        </button>
      </form>
    </>
  );
};

export default Step7VC;
