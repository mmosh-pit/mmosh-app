import * as React from "react";

import { Candidate } from "@/app/models/candidate";
import axios from "axios";
import ArrowDown from "@/assets/icons/ArrowDown";
import ArrowUp from "@/assets/icons/ArrowUp";
import SimpleInput from "../../common/SimpleInput";

type Props = {
  value: string;
  onChangeValue: (value: string) => void;
};

const CoinsCandidatesSelect = ({ value, onChangeValue }: Props) => {
  const divHeight = 50;
  const [candidates, setCandidates] = React.useState<Candidate[]>([]);
  const [searchText, setSearchText] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [displayItems, setDisplayItems] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const animating = React.useRef(false);

  const getCandidates = async (page: number) => {
    const response = await axios.get(
      `/api/get-leaderboard-candidates?search=${searchText}&page=${page}`,
    );

    setPage(page + 1);

    setCandidates(response.data);
  };

  React.useEffect(() => {
    if (!isOpen) {
      animating.current = true;
      setTimeout(() => {
        setDisplayItems(false);
        animating.current = false;
      }, 100);
      return;
    }

    setDisplayItems(true);
  }, [isOpen]);

  const toggleContainer = () => {
    if (animating.current) return;
    setIsOpen(!isOpen);
  };

  React.useEffect(() => {
    getCandidates(0);
  }, [searchText]);

  return (
    <div className="flex flex-col w-full">
      <p className="text-sm text-white">
        Candidate You're Endorsing or Opposing <sup>*</sup>
      </p>

      <div
        className={`candidates-select ${isOpen && "opened"} px-[1vmax] mt-2`}
        style={{
          height: !isOpen ? `${divHeight}px` : "500px",
        }}
      >
        <div
          className="w-full flex justify-between items-center self-center"
          onClick={toggleContainer}
        >
          {isOpen
            ? (
              <div className="flex" onClick={(e) => e.preventDefault()}>
                <SimpleInput value={searchText} onChange={(e) => setSearchText(e.target.value)} />
              </div>
            )
            : (
              <div className="flex">
                <p className="text-xs text-gray-300">{value ?? "Candidate You're Endorsing or Opposing"}</p>
              </div>
            )}

          {isOpen ? <ArrowUp /> : <ArrowDown />}
        </div>
        {displayItems && (
          <div className="candidates-select-open">
            <div className="w-full h-[1px] bg-[#6E5FB1] px-2 my-2" />

            {candidates.map((candidate) => {
              return (
                <div
                  className="flex items-center my-1"
                  key={candidate.CANDIDATE_ID}
                  onClick={() => onChangeValue(candidate.CANDIDATE_ID)}
                >
                  <p className="text-gray-400 text-xs">
                    {candidate.CANDIDATE_NAME.split(",").reverse().join(" ")}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinsCandidatesSelect;
