import { SetStateAction } from "react";

type Props = {
  type: string;
  setType: React.Dispatch<SetStateAction<string>>;
};

const DateTypeSelector = ({ type, setType }: Props) => (
  <div className="flex">
    <div
      className={`${type === "day" ? "bg-[#8511F98F]" : "bg-transparent border-[1px] border-[#FFFFFF22]"} flex justify-center items-center w-[1.2vmax] h-[1.2vmax] mx-1 rounded-full cursor-pointer`}
      onClick={() => setType("day")}
    >
      D
    </div>

    <div
      className={`${type === "week" ? "bg-[#8511F98F]" : "bg-transparent border-[1px] border-[#FFFFFF22]"} flex justify-center items-center w-[1.2vmax] h-[1.2vmax] mx-1 rounded-full cursor-pointer`}
      onClick={() => setType("week")}
    >
      W
    </div>

    <div
      className={`${type === "month" ? "bg-[#8511F98F]" : "bg-transparent border-[1px] border-[#FFFFFF22]"} flex justify-center items-center w-[1.2vmax] h-[1.2vmax] mx-1 rounded-full cursor-pointer`}
      onClick={() => setType("month")}
    >
      M
    </div>

    <div
      className={`${type === "year" ? "bg-[#8511F98F]" : "bg-transparent border-[1px] border-[#FFFFFF22]"} flex justify-center items-center w-[1.2vmax] h-[1.2vmax] mx-1 rounded-full cursor-pointer`}
      onClick={() => setType("year")}
    >
      Y
    </div>
  </div>
);

export default DateTypeSelector;
