"use client";

import React from "react";
import ChallengePills, { ChallengeItem } from "../components/ChallengePills";

const Step7VC = () => {
  const items: ChallengeItem[] = [
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

  const handleChange = (selected: string[]) => {
    console.log("Selected:", selected);
    console.log("Valid:", selected.length >= 3);
  };
  return (
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
        <ChallengePills challenges={items} onChange={handleChange} min={3} />
      </div>

      <button
        type="button"
        className="font-avenirNext w-full h-[3.125rem] py-[1.063rem] bg-[#FF710F] mt-[1rem] text-[1rem] leading-[100%] text-[#2C1316] font-extrabold rounded-[0.625rem] hover:opacity-90"
      >
        Next
      </button>
    </div>
  );
};

export default Step7VC;
