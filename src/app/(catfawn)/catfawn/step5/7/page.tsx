"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LikertQuestion from "../../components/LikertQuestion";
import Spinner from "../../components/Spinner";
import MessageBanner from "@/app/(main)/components/common/MessageBanner";

const Step5VC7 = () => {
  const router = useRouter();

  const [cachedData, setCachedData] = useState<any>({});

  const [form, setForm] = useState<{
    q1: number | null;
    q2: number | null;
    q3: number | null;
    q4: number | null;
  }>({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
  });

  const LIKERT_LABELS: Record<number, string> = {
    1: "very rarely",
    2: "rarely",
    3: "sometimes",
    4: "very",
    5: "very often",
  };

  const LIKERT_QUESTIONS = [
    { id: "q1", text: "Competing fiercely on the field." },
    { id: "q2", text: "Coaching your team with a bold strategy." },
    { id: "q3", text: "Cheering your team to victory." },
    { id: "q4", text: "Refereeing as fair a game as possible." },
  ];

  const [showMsg, setShowMsg] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [msgClass, setMsgClass] = useState<"success" | "error">("success");
  const [isLoading, setIsLoading] = useState(false);

  const formatLikertKey = (text: string) =>
    text
      .trim()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

  React.useEffect(() => {
    const stored = localStorage.getItem("catfawn-data");
    if (!stored) {
      router.replace("/catfawn");
      return;
    }

    try {
      const result = JSON.parse(stored);
      setCachedData(result);

      if (result.likertAnswers) {
        const restoredForm: any = { q1: null, q2: null, q3: null, q4: null };

        LIKERT_QUESTIONS.forEach((q) => {
          const key = formatLikertKey(q.text);
          const label = result.likertAnswers[key];

          if (label) {
            const value = Number(
              Object.keys(LIKERT_LABELS).find(
                (k) => LIKERT_LABELS[Number(k)] === label
              )
            );

            restoredForm[q.id] = value ?? null;
          }
        });

        setForm(restoredForm);
      }

      if (result?.completedSteps !== undefined && result?.completedSteps < 11) {
        router.replace(`/${result.currentStep}`);
      }
    } catch {
      router.replace("/catfawn");
    }
  }, []);


  const createMessage = (message: string, type: "success" | "error") => {
    window.scrollTo(0, 0);
    setMsgText(message);
    setMsgClass(type);
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 4000);
  };

  const likertAnswers = LIKERT_QUESTIONS.reduce((acc, q) => {
    const value = form[q.id as keyof typeof form];

    if (value !== null) {
      acc[formatLikertKey(q.text)] = LIKERT_LABELS[value];
    }

    return acc;
  }, {} as Record<string, string>);

  const submitStep5 = async () => {
    setIsLoading(true);
    if (Object.values(form).some((v) => v === null)) {
      createMessage("Please answer all questions.", "error");
      setIsLoading(false);
      return;
    }
    const existingData = cachedData
    localStorage.setItem(
      "catfawn-data",
      JSON.stringify({
        ...cachedData,
        currentStep: "catfawn/step5/8",
        likertAnswers: {
          ...(existingData.likertAnswers || {}),
          ...likertAnswers,
        },
        completedSteps:
          cachedData.completedSteps && cachedData.completedSteps < 12
            ? 12
            : cachedData.completedSteps,
      })
    );
    router.replace("/catfawn/step5/8");
  };

  return (
    <>
      {showMsg && (
        <div className="w-full absolute top-0 left-1/2 -translate-x-1/2">
          <MessageBanner type={msgClass} message={msgText} />
        </div>
      )}

      <div className="min-h-[29.875rem] xl:w-[36.188rem] bg-[#271114] rounded-[1.25rem] pt-[1.563rem] pb-[0.938rem] pl-[3.25rem] pe-[3.063rem] max-md:px-5 max-md:py-8">
        <h2 className="relative font-poppinsNew text-center text-[1.563rem] max-md:text-lg leading-[100%] font-bold bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
          <div
            className="absolute top-1/2 -translate-y-1/2 left-0 cursor-pointer"
            onClick={() => {
              router.replace("/catfawn/step5/6");
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
          <div className="font-normal font-avenirNext absolute top-1/2 -translate-y-1/2 right-0 text-[#FFFFFFE5] text-[0.75rem] -tracking-[0.04em]">
            <span className="font-extrabold">7</span>/12
          </div>
        </h2>

        <p className="max-sm:text-base text-[#FFFFFFE5] font-avenirNext max-md:text-sm font-bold leading-[94%] mt-[0.313rem] -tracking-[0.02em]">
          Step 5 of 14: Your CAT FAWN Source Code.
        </p>

        <p className="text-[0.938rem] text-[#FFFFFFE5] font-avenirLtStd max-md:text-sm font-bold leading-[110%] mt-3 lg:mt-[1.813rem] -tracking-[0.07em]">
          You’re at a big sporting event. Are you:{" "}
        </p>

        <ul className="flex justify-end gap-[0.813rem] text-[0.75rem] font-normal mt-[0.625rem] leading-[110%] -tracking-[0.04em] pr-2">
          <li>Very Rarely</li>
          <li>Sometimes</li>
          <li>Very Often</li>
        </ul>

        <div className="flex flex-col gap-[0.938rem] mt-[0.625rem]">
          {LIKERT_QUESTIONS.map((q) => (
            <LikertQuestion
              key={q.id}
              name={q.id}
              text={q.text}
              value={form[q.id as keyof typeof form]}
              onChange={(v) => setForm({ ...form, [q.id]: v })}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={submitStep5}
          disabled={isLoading}
          className="steps_btn_submit mt-[5.563rem]"
        >
          {isLoading && <Spinner size="sm" />}
          Next
        </button>
      </div>
    </>
  );
};

export default Step5VC7;
