"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChallengePills, { ChallengeItem } from "../components/ChallengePills";
import Spinner from "../components/Spinner";
import { ErrorContainerVW } from "../components/ErrorContainer/ErrorContainerVW";
import { BackArrowVW } from "../components/BackArrow/BackArrowVW";

const step8 = () => {
  const router = useRouter();

  const [cachedData, setCachedData] = useState<any>({});
  const [selectedAspirations, setSelectedAspirations] = useState<string[]>([]);

  const [showMsg, setShowMsg] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [msgClass, setMsgClass] = useState<"success" | "error">("success");
  const [isLoading, setIsLoading] = useState(false);
  const ASPIRATIONS: ChallengeItem[] = [
    { label: "🎓 Access to education" },
    { label: "🌳 Climate action" },
    { label: "💵 Economic fairness" },
    { label: "🤖 Ethical technology & AI" },
    { label: "🏠 Homelessness" },
    { label: "🌊 Ocean conservation" },
    { label: "🙅🏻 Human trafficking & modern slavery" },
    { label: "🌈 LGBTQ+ inclusion" },
  ];

  useEffect(() => {
    const stored = localStorage.getItem("catfawn-data");

    if (!stored) {
      router.replace("/catfawn");
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      setCachedData(parsed);

      if (parsed?.completedSteps !== undefined && parsed?.completedSteps < 19) {
        router.replace(`/${parsed.currentStep}`);
      }

      if (Array.isArray(parsed.aspirations)) {
        setSelectedAspirations(parsed.aspirations);
      }
    } catch {
      router.replace("/catfawn");
    }
  }, []);

  const handleChange = (selected: string[]) => {
    setSelectedAspirations(selected);
    console.log("Selected:", selected);
  };

  const createMessage = (message: string, type: "success" | "error") => {
    window.scrollTo(0, 0);
    setMsgText(message);
    setMsgClass(type);
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 4000);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (selectedAspirations.length < 3) {
      createMessage("Please select at least 3 aspirations.", "error");
      setIsLoading(false);
      return;
    }

    localStorage.setItem(
      "catfawn-data",
      JSON.stringify({
        ...cachedData,
        aspirations: selectedAspirations,
        currentStep: "catfawn/step9",
        completedSteps:
          cachedData.completedSteps && cachedData.completedSteps < 20
            ? 20
            : cachedData.completedSteps,
      })
    );
    router.replace("/catfawn/step9");
    setIsLoading(false);
  };

  return (
    <>
      <ErrorContainerVW
        showMessage={showMsg}
        className={msgClass}
        messageText={msgText}
      />
      <div className="min-h-[29.875rem] xl:w-[36.188rem] bg-[#271114] rounded-[1.25rem] pt-[1.563rem] pb-[0.938rem] pl-[3.25rem] pe-[3.063rem] max-md:px-5 max-md:py-8">
        <h2 className="relative font-poppinsNew text-center text-[1.563rem] max-md:text-lg leading-[100%] font-bold bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
          <BackArrowVW onClick={() => router.replace("/catfawn/step7")} />
          Request Early Access
        </h2>
        <p className="max-sm:text-base text-[#FFFFFFE5] font-avenirNext max-md:text-sm font-bold leading-snug lg:leading-[94%] mt-[0.313rem] -tracking-[0.02em]">
          Step 8 of 15: Aspirations.{" "}
          <span className="font-normal font-avenir">
            What are you working toward — in your life, your community, or the
            wider world? These aspirations help CAT-FAWN understand the values
            and directions that matter to you.
          </span>
        </p>

        <p className="max-sm:text-base text-[1rem] max-md:text-sm font-normal leading-[94%] mt-[1.25rem] -tracking-[0.02em] px-[0.313rem]">
          (Select at least three. You can modify them anytime.)
        </p>

        <div className="mt-7 lg:mt-[3.375rem]">
          <ChallengePills
            challenges={ASPIRATIONS}
            onChange={handleChange}
            value={selectedAspirations}
            min={3}
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="steps_btn_submit max-md:mt-[6.625rem] max-lg:mt-14 mt-[1rem]"
        >
          {isLoading ? <Spinner /> : "Next"}
        </button>
      </div>
    </>
  );
};

export default step8;
