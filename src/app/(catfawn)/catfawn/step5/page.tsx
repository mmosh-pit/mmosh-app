"use client";
import React from "react";
import Spinner from "../components/Spinner";
import { useRouter } from "next/navigation";

const Step5VC = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const [cachedData, setCachedData] = React.useState<any>({});

  React.useEffect(() => {
    const stored = localStorage.getItem("catfawn-data");
    if (!stored) {
      return router.replace("/catfawn");
    }
    try {
      const result = JSON.parse(stored);
      setCachedData(result);
      console;
      if (result?.completedSteps !== undefined && result?.completedSteps < 4) {
        router.replace(`/${result.currentStep}`);
      }
    } catch {
      router.replace("/catfawn");
    }
  }, []);

  return (
    <div className="min-h-[29.875rem]   xl:w-[36.188rem] bg-[#271114] rounded-[1.25rem] pt-[1.563rem] pb-[0.938rem] pl-[3.25rem] pe-[3.063rem] max-md:px-5 max-md:py-8">
      <h2 className="relative font-poppinsNew text-center text-[1.563rem] max-md:text-xl leading-[100%] font-bold bg-gradient-to-r from-[#FFFFFF] to-[#FFFFFF88] bg-clip-text text-transparent">
        <div className="absolute top-1/2 -translate-y-1/2 left-0 cursor-pointer">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => {
              router.replace("/catfawn/step4");
            }}
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
        Step 5 of 15: Your CAT FAWN Source Code.{" "}
        <span className="font-normal font-avenir">
          The CAT FAWN Connection encourages personal growth, professional
          development and collective action. To get started, CAT FAWN would like
          to learn a bit about you by asking twelve questions. Each question
          outlines a situation and has four possible responses. Read all four,
          and then rate each response from 1 to 5:
        </span>
      </p>

      <div className="w-full max-w-[18.25rem] mx-auto text-[1rem] font-normal leading-[110%] text-[#FFFFFFE5] mt-[0.563rem] -tracking-[0.04em]">
        <ul className="flex flex-col gap-[0.25rem]">
          <li>1 = “I would rarely if ever do this”</li>
          <li>2 = “I might do this, but not often”</li>
          <li>3 = “I would sometimes choose this option”</li>
          <li>4 = “I would be likely to do this”</li>
          <li>5 = “I would almost always do this”</li>
        </ul>
      </div>

      <p className="text-[1rem] text-[#FFFFFFE5] max-md:text-sm font-normal leading-snug lg:leading-[94%] mt-[1.25rem] -tracking-[0.02em] px-[0.313rem]">
        Rate each response independent of the others; they may be the same or
        different. Some responses may seem equivalent or not applicable to you,
        and some questions may not have any responses that really fit you. Just
        do your best to rate each one honestly. Don’t think too hard about these
        either: your first response is likely the most honest one.
      </p>

      <button
        type="button"
        className="steps_btn_submit mt-[2.313rem]"
        onClick={() => {
          setIsLoading(true);
          localStorage.setItem(
            "catfawn-data",
            JSON.stringify({
              ...cachedData,
              currentStep: "catfawn/step5/1",
              completedSteps: 5,
            })
          );

          router.replace("/catfawn/step5/1");
        }}
      >
        {isLoading && <Spinner size="sm" />}
        <span>Next</span>
      </button>
    </div>
  );
};

export default Step5VC;
