"use client";

import React, { useState } from "react";
import LikertQuestion from "../../components/LikertQuestion";

const Step5VC2 = () => {
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
        <div className="font-normal absolute top-0 right-0 text-[#FFFFFFE5] text-[0.75rem] -tracking-[0.04em]">
          <span className="font-extrabold">2</span>/12
        </div>
      </h2>

      <p className="text-[1rem] text-[#FFFFFFE5] font-avenirNext max-md:text-sm font-bold leading-[94%] mt-[0.313rem] -tracking-[0.02em]">
        Step 5 of 14: Your CAT FAWN Source Code.
      </p>
      <p className="text-[0.938rem] text-[#FFFFFFE5] font-avenirNext max-md:text-sm font-bold leading-[110%] mt-[1.813rem] -tracking-[0.07em]">
        Two friends of yours are at odds, and you have been asked to help
        resolve their dispute. Do you:
      </p>

      <ul className="flex justify-end gap-[0.625rem] text-[0.75rem] font-normal mt-[0.625rem] leading-[110%] -tracking-[0.04em]">
        <li>Very</li>
        <li>Rarely</li>
        <li>Sometimes</li>
        <li>Very</li>
        <li>Often</li>
      </ul>

      <div className="flex flex-col gap-[0.938rem] mt-[0.625rem]">
        <LikertQuestion
          name="q1"
          text="Research the issue and consider it carefully, searching for a solution"
          value={form.q1}
          onChange={(v) => setForm({ ...form, q1: v })}
        />
        <LikertQuestion
          name="q2"
          text="Remind both of them of your loyalty to them and your willingness to work with them to resolve the problem."
          value={form.q2}
          onChange={(v) => setForm({ ...form, q2: v })}
        />
        <LikertQuestion
          name="q3"
          text="Talk with each in turn, waiting for a flash of insight in the moment to help you resolve the situation"
          value={form.q3}
          onChange={(v) => setForm({ ...form, q3: v })}
        />
        <LikertQuestion
          name="q4"
          text="Try to understand how each of them feels and find a way to support both of them"
          value={form.q4}
          onChange={(v) => setForm({ ...form, q4: v })}
        />
      </div>

      <button
        type="button"
        className="font-avenirNext w-full h-[3.125rem] py-[1.063rem] bg-[#FF710F] mt-[5.563rem] text-[1rem] leading-[100%] text-[#2C1316] font-extrabold rounded-[0.625rem] hover:opacity-90"
      >
        Next
      </button>
    </div>
  );
};

export default Step5VC2;
