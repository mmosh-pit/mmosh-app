"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LikertQuestionVW from "../../components/LikertQuestion/LikertQuestionVW";
import Spinner from "../../components/Spinner";
import { ErrorContainerVW } from "../../components/ErrorContainer/ErrorContainerVW";
import { BackArrowVW } from "../../components/BackArrow/BackArrowVW";

const Step5VC1 = () => {
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
    { id: "q1", text: "Listing off the best places to go" },
    {
      id: "q2",
      text: "Wanting to get going now without all the talking and planning",
    },
    {
      id: "q3",
      text: "Talking it up tossing out suggestions for new places to go",
    },
    { id: "q4", text: "Trying to make sure everyone’s opinions are heard" },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [msgClass, setMsgClass] = useState<"success" | "error">("success");

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

      if (result?.completedSteps !== undefined && result?.completedSteps < 5) {
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

  const likertAnswers = LIKERT_QUESTIONS.reduce(
    (acc, q) => {
      const value = form[q.id as keyof typeof form];

      if (value !== null) {
        acc[formatLikertKey(q.text)] = LIKERT_LABELS[value];
      }

      return acc;
    },
    {} as Record<string, string>
  );

  const submitStep5 = async () => {
    setIsLoading(true);
    if (Object.values(form).some((v) => v === null)) {
      createMessage("Please answer all questions.", "error");
      setIsLoading(false);
      return;
    }
    const existingData = cachedData;

    localStorage.setItem(
      "catfawn-data",
      JSON.stringify({
        ...cachedData,
        likertAnswers: {
          ...(existingData.likertAnswers || {}),
          ...likertAnswers,
        },
        currentStep: "catfawn/step5/2",
        completedSteps:
          cachedData.completedSteps && cachedData.completedSteps < 6
            ? 6
            : cachedData.completedSteps,
      })
    );

    router.replace("/catfawn/step5/2");
  };

  return (
    <>
      <ErrorContainerVW
        showMessage={showMsg}
        className={msgClass}
        messageText={msgText}
      />

      <div className="min-h-[29.875rem] xl:w-[36.188rem] bg-[#271114] rounded-[1.25rem] pt-[1.563rem] pb-[0.938rem] pl-[3.25rem] pe-[3.063rem] max-md:px-5 max-md:py-8">
        <h2 className="relative font-poppinsNew text-center text-[1.563rem] max-md:text-lg font-bold bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
          <BackArrowVW onClick={() => router.replace("/catfawn/step5")} />
          Request Early Access
          <div className="font-normal font-avenir absolute top-1/2 -translate-y-1/2 right-0 text-[#FFFFFFE5] text-[0.75rem] -tracking-[0.04em]">
            <span className="font-avenirNext font-extrabold">1</span>/12
          </div>
        </h2>

        <p className="max-sm:text-base font-avenirNext leading-[94%] -tracking-[0.02em] text-[#FFFFFFE5] font-bold mt-[0.375rem]">
          Step 5 of 14: Your CAT FAWN Source Code.
        </p>

        <p className="max-sm:text-base text-[#FFFFFFE5] font-avenirLtStd mt-2 lg:mt-[1.813rem] text-[0.938rem] leading-snug lg:leading-[110%] font-bold -tracking-[0.07em]">
          A group is making plans to go out, but nothing’s been decided yet. Are
          you:
        </p>

        <ul className="flex justify-end gap-[0.813rem] text-[0.75rem] font-normal mt-[0.625rem] leading-[110%] -tracking-[0.04em] pr-1">
          <li>Very Rarely</li>
          <li>Sometimes</li>
          <li>Very Often</li>
        </ul>

        <div className="flex flex-col gap-[0.938rem] mt-[0.625rem]">
          {LIKERT_QUESTIONS.map((q) => (
            <LikertQuestionVW
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
          className="steps_btn_submit mt-20"
        >
          {isLoading ? <Spinner size="sm" /> : "Next"}
        </button>
      </div>
    </>
  );
};

export default Step5VC1;
