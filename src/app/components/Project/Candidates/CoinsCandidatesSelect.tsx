import * as React from "react";

import { Candidate } from "@/app/models/candidate";
import axios from "axios";
import ArrowDown from "@/assets/icons/ArrowDown";
import ArrowUp from "@/assets/icons/ArrowUp";

type Props = {
  value: Candidate | null;
  onChangeValue: (value: Candidate | null) => void;
};

const CoinsCandidatesSelect = ({ value, onChangeValue }: Props) => {
  const divHeight = 50;
  const [candidates, setCandidates] = React.useState<Candidate[]>([]);
  const [searchText, setSearchText] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [displayItems, setDisplayItems] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const lastPageTriggered = React.useRef(false);
  const isQuerying = React.useRef(false);

  const animating = React.useRef(false);

  const getCandidates = async (page: number) => {
    isQuerying.current = true;
    const response = await axios.get(
      `/api/get-leaderboard-candidates?search=${searchText}&page=${page}&count=50`,
    );

    setPage(page + 1);

    if (response.data.length === 0) return;

    setCandidates(response.data);
    isQuerying.current = false;
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

  const handleScroll = () => {
    console.log("Scrolling...");
    if (!containerRef.current) return;

    if (
      containerRef.current.scrollHeight - containerRef.current.scrollTop <=
        containerRef.current.clientHeight + 50 &&
      !lastPageTriggered.current &&
      !isQuerying.current
    ) {
      console.log("Executing");
      getCandidates(page);
    }
  };

  return (
    <div className="flex flex-col w-full relative">
      <p className="text-sm text-white">
        Candidate You're Endorsing or Opposing <sup>*</sup>
      </p>

      <div
        className={`candidates-select absolute top-[14px] md:top-[16px] ${isOpen && "opened"} px-[1vmax] mt-2`}
        style={{
          height: !isOpen ? `${divHeight}px` : "300px",
        }}
      >
        <div
          className="w-full flex justify-between items-center self-center"
          onClick={toggleContainer}
        >
          {isOpen ? (
            <div className="w-[90%]" onClick={(e) => e.stopPropagation()}>
              <input
                className="input input-ghost w-full mt-2"
                value={searchText}
                placeholder="Search for Candidate by Name, Party or State"
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          ) : (
            <div className="flex">
              {value ? (
                <p className="text-xs text-white">
                  {value.CANDIDATE_NAME.split(",").reverse().join(" ")}
                </p>
              ) : (
                <p className="text-xs text-gray-500">
                  Search for Candidate by Name, Party or State
                </p>
              )}
            </div>
          )}

          {isOpen ? <ArrowUp /> : <ArrowDown />}
        </div>
        {displayItems && (
          <div
            className="candidates-select-open"
            ref={containerRef}
            onScroll={handleScroll}
          >
            <div className="w-full h-[1px] bg-[#6E5FB1] px-4 my-2" />

            {candidates.map((candidate) => {
              return (
                <div
                  className="flex items-center my-3 cursor-pointer"
                  key={candidate.CANDIDATE_ID}
                  onClick={() => {
                    setIsOpen(false);
                    onChangeValue(candidate);
                  }}
                >
                  <p className="text-gray-200 text-xs">
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
