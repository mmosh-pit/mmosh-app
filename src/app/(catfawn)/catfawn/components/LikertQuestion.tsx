import React from "react";

type LikertQuestionProps = {
  name: string;
  text: string;
  value: number | null;
  onChange: (value: number) => void;
};

export default function LikertQuestion({
  name,
  text,
  value,
  onChange,
}: LikertQuestionProps) {
  return (
    <div className="flex items-center justify-between gap-[0.625rem] text-[#FFFFFFE5]">
      <p className="text-[0.75rem] leading-[110%] font-normal -tracking-[0.04em]">
        {text}
      </p>

      <div className="flex justify-between gap-[1.938rem]">
        {[1, 2, 3, 4, 5].map((num) => (
          <label
            key={num}
            className="flex flex-col items-center gap-[0.188rem] cursor-pointer"
          >
            <span className="text-[0.813rem] font-semibold leading-[110%] -tracking-[0.04em]">
              {num}
            </span>
            <input
              type="radio"
              name={name}
              value={num}
              checked={value === num}
              onChange={() => onChange(num)}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
