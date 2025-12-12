import React, { useState } from "react";

export interface ChallengeItem {
  label: string;
}

interface ChallengePillsProps {
  challenges: ChallengeItem[];
  min?: number;
  onChange?: (selected: string[]) => void;
}

const ChallengePills: React.FC<ChallengePillsProps> = ({
  challenges,
  min = 3,
  onChange,
}) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (label: string) => {
    const next = selected.includes(label)
      ? selected.filter((x) => x !== label)
      : [...selected, label];

    setSelected(next);
    onChange?.(next);
  };

  return (
    <div className="py-[0.875rem] h-full ps-[0.5rem] pe-[0.313rem] bg-[#271114] rounded-[1.25rem] border border-[rgba(255,255,255,0.16)]">
      <div className="h-full overflow-y-auto flex flex-wrap gap-[0.625rem] pe-[0.688rem]">
        {challenges.map((item) => {
          const isActive = selected.includes(item.label);

          return (
            <button
              key={item.label}
              onClick={() => toggleSelect(item.label)}
              className={`py-[0.75rem] px-[0.525rem] rounded-full text-[0.875rem] leading-[1rem] font-normal transition border border-[rgba(255,255,255,0.16)]
              ${isActive ? "bg-[#FF710F] text-black" : "bg-[rgba(255,255,255,0.08)] text-white"}
            `}
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
