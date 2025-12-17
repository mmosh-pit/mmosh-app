"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import LikertQuestion from "../../components/LikertQuestion";
import Spinner from "../../components/Spinner";
import MessageBanner from "@/app/(main)/components/common/MessageBanner";

const Step5VC5 = () => {
  const router = useRouter();

  const [cachedData, setCachedData] = useState<any>(null);

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
    {
      id: "q1",
      text: "Talk to them in a straightforward manner about their behavior.",
    },
    { id: "q2", text: "Invent a reason to take them home." },
    {
      id: "q3",
      text: "Head the problem off before anyone else says anything.",
    },
    {
      id: "q4",
      text: "Put your arm around your friend and talk quietly with them.",
    },
  ];

  const [showMsg, setShowMsg] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [msgClass, setMsgClass] = useState<"success" | "error">("success");
  const [isLoading, setIsLoading] = useState(false);

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

      if (parsed.currentStep && parsed.currentStep !== "catfawn/step5/5") {
        router.replace(`/${parsed.currentStep}`);
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

  const likertAnswers = LIKERT_QUESTIONS.reduce(
    (acc, q) => {
      const value = form[q.id as keyof typeof form];
      if (value !== null) {
        acc[
          q.text
            .trim()
            .replace(/[^\w\s]/g, "")
            .replace(/\s+/g, "-")
        ] = LIKERT_LABELS[value];
      }
      return acc;
    },
    {} as Record<string, string>
  );

  const submitStep5 = async () => {
    if (Object.values(form).some((v) => v === null)) {
      createMessage("Please answer all questions.", "error");
      return;
    }

    try {
      setIsLoading(true);
      // Replace with your API call
      // const res = await axios.patch(
      //   "/api/visitors/update-visitors",
      //   {
      //     email: cachedData.email,
      //     currentStep: "catfawn/step5/6",
      //     likertAnswers,
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      //     },
      //   }
      // );

      // if (res.data.status) {
      localStorage.setItem(
        "catfawn-data",
        JSON.stringify({
          ...cachedData,
          currentStep: "catfawn/step5/6",
          likertAnswers: likertAnswers,
        })
      );

      router.replace("/catfawn/step5/6");
      // } else {
      //   createMessage(res.data.message || "Failed to save data", "error");
      // }
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
          <div className="font-normal font-avenir absolute top-0 right-0 text-[#FFFFFFE5] text-[0.75rem] -tracking-[0.04em]">
            <span className="font-extrabold">5</span>/12
          </div>
        </h2>

        <p className="text-[1rem] text-[#FFFFFFE5] font-avenirNext max-md:text-sm font-bold leading-[94%] mt-[0.313rem] -tracking-[0.02em]">
          Step 5 of 14: Your CAT FAWN Source Code.
        </p>

        <p className="text-[0.938rem] text-[#FFFFFFE5] font-avenirNext max-md:text-sm font-bold leading-[110%] mt-[1.813rem] -tracking-[0.07em]">
          You have a difficult decision to make. Do you:
        </p>

        <ul className="flex justify-end gap-[0.625rem] text-[0.75rem] font-normal mt-[0.625rem] leading-[110%] -tracking-[0.04em]">
          <li>Very</li>
          <li>Rarely</li>
          <li>Sometimes</li>
          <li>Very</li>
          <li>Often</li>
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
          className="font-avenirNext w-full h-[3.125rem] bg-[#FF710F] mt-[5.563rem] text-[#2C1316] font-extrabold rounded-[0.625rem] flex items-center justify-center gap-2"
        >
          {isLoading && <Spinner size="sm" />}
          Next
        </button>
      </div>
    </>
  );
};

export default Step5VC5;
