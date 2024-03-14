import { useAtom } from "jotai";

import { lineage } from "@/app/store";

const LineageFilterOptions = () => {
  const [lineageOptions, setLineageOptions] = useAtom(lineage);

  const toggleChangeOption = (field: string) => {
    const newValues = [...lineageOptions].map((val) => {
      if (val.value === field) {
        val.selected = !val.selected;
      }

      return { ...val };
    });

    setLineageOptions(newValues);
  };

  return (
    <div className="relative flex self-start mt-4">
      {lineageOptions.map((option) => (
        <div
          key={option.value}
          className="flex justify-center items-center mx-4 cursor-pointer relative"
          onClick={() => toggleChangeOption(option.value)}
        >
          <input
            type="radio"
            name={`radio-${option.value}`}
            className="radio"
            checked={option.selected}
            onChange={() => {}}
          />
          <p className="text-base text-white ml-4">
            {option.label} <span className="text-xs">({option.subLabel})</span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default LineageFilterOptions;
