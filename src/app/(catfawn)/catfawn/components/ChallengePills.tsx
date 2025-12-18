import React from "react";

export interface ChallengeItem {
  label: string;
}

interface ChallengePillsProps {
  challenges: ChallengeItem[];
  min?: number;
  onChange: (selected: string[]) => void;
  value?: string[];
}

const ChallengePills: React.FC<ChallengePillsProps> = ({
  challenges,
  onChange,
  value=[],
}) => {
  const toggleSelect = (label: string) => {
    const next = value.includes(label)
      ? value.filter((x) => x !== label)
      : [...value, label];

    onChange(next);
  };

  return (
    <div className="py-[0.875rem] ps-[0.5rem] pe-[0.313rem] bg-[#271114] rounded-[1.25rem] border border-[rgba(255,255,255,0.16)]">
      <div className="max-h-[12.938rem] overflow-y-scroll flex flex-wrap gap-[0.625rem] pe-[0.688rem]">
        {challenges.map((item) => {
          const isActive = value.includes(item.label);

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => toggleSelect(item.label)}
              className={`py-[0.75rem] px-[0.525rem] rounded-full text-[0.875rem] leading-[1rem] font-normal transition border border-[rgba(255,255,255,0.16)]
              ${
                isActive
                  ? "bg-[#FF710F] text-black"
                  : "bg-[rgba(255,255,255,0.08)] text-white"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChallengePills;
