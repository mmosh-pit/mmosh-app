"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import CandidateCard from "@/app/components/Project/Candidates/CandidateCard";
import CandidateFilters from "@/app/components/Project/Candidates/CandidateFilters";
import DistrictSelect from "@/app/components/Project/Candidates/DistrictSelect";
import PartyFilters from "@/app/components/Project/Candidates/PartyFilters";
import SearchBar from "@/app/components/Project/Candidates/SearchBar";
import StatesSelect from "@/app/components/Project/Candidates/StatesSelect";
import useCheckMobileScreen from "@/app/lib/useCheckMobileScreen";
import { Candidate } from "@/app/models/candidate";

const Candidates = () => {
  const isMobile = useCheckMobileScreen();

  const navigate = useRouter();

  const fetching = React.useRef(false);
  const containerRef = React.useRef<any>(null);
  const lastPageTriggered = React.useRef(false);

  const [totalCandidates, setTotalCandidates] = React.useState(0);
  const [candidates, setCandidates] = React.useState<Candidate[]>([]);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [selectedCandidateFilter, setSelectedCandidateFilter] = React.useState<
    string[]
  >(["P", "S", "H"]);
  const [selectedPartyFilter, setSelectedPartyFilter] = React.useState<
    string[]
  >(["DEM", "REP", "IND", "GRE", "LIB", "OTHER"]);

  const [searchText, setSearchText] = React.useState("");

  const [selectedState, setSelectedState] = React.useState("");
  const [selectedDistrict, setSelectedDistrict] = React.useState("");

  const getCandidates = React.useCallback(async () => {
    const response = await axios.get("/api/get-candidates-total");

    setTotalCandidates(response.data);
  }, []);

  const handleChangeFilterValue = React.useCallback(
    (value: string) => {
      setSelectedCandidateFilter((prev) => {
        let newItems = [...prev];

        if (newItems.includes(value)) {
          newItems = newItems.filter((element) => element !== value);
        } else {
          newItems.push(value);
        }

        return newItems;
      });
    },
    [selectedCandidateFilter, setSelectedCandidateFilter],
  );

  const handleChangePartyFilterValue = React.useCallback(
    (value: string) => {
      setSelectedPartyFilter((prev) => {
        let newItems = [...prev];

        if (newItems.includes(value)) {
          newItems = newItems.filter((element) => element !== value);
        } else {
          newItems.push(value);
        }

        return newItems;
      });
    },
    [selectedCandidateFilter, setSelectedCandidateFilter],
  );

  const filterCandidates = React.useCallback(
    async (page: number) => {
      console.log(
        "Selected state and district: ",
        selectedState,
        selectedDistrict,
      );
      fetching.current = true;
      const resultingCandidates = await axios.get(
        `/api/get-leaderboard-candidates?search=${searchText}&types=${selectedCandidateFilter.join(",")}&parties=${selectedPartyFilter.join(",")}&page=${page}&count=20&state=${selectedState}&district=${selectedDistrict}`,
      );

      setCurrentPage(page + 1);

      if (resultingCandidates.data.length === 0) {
        lastPageTriggered.current = true;
      }

      if (page == 0) {
        setCandidates(resultingCandidates.data);
      } else {
        setCandidates((prev) => {
          return [...prev, ...resultingCandidates.data];
        });
      }
      fetching.current = false;
    },
    [
      selectedCandidateFilter,
      selectedPartyFilter,
      candidates,
      searchText,
      selectedState,
      selectedDistrict,
      currentPage,
    ],
  );

  React.useEffect(() => {
    lastPageTriggered.current = false;
    if (!fetching.current) {
      filterCandidates(0);
    }
  }, [
    selectedCandidateFilter,
    selectedPartyFilter,
    searchText,
    selectedState,
    selectedDistrict,
    searchText,
  ]);

  React.useEffect(() => {
    getCandidates();
  }, [fetching.current]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    if (
      containerRef.current.scrollHeight - containerRef.current.scrollTop <=
        containerRef.current.clientHeight + 50 &&
      !lastPageTriggered.current &&
      !fetching.current
    ) {
      filterCandidates(currentPage);
    }
  };

  const getFiltersByDeviceSize = React.useCallback(() => {
    if (isMobile) {
      return (
        <>
          <div className="w-full flex justify-between mb-4">
            <div className="w-[30%]">
              <StatesSelect
                selectedElement={selectedState}
                onChange={setSelectedState}
              />
            </div>

            {selectedState !== "" && (
              <div className="w-[30%]">
                <DistrictSelect
                  selectedElement={selectedDistrict}
                  onChange={setSelectedDistrict}
                />
              </div>
            )}
          </div>

          <div className="self-center w-[60%] my-4">
            <SearchBar setSearchText={setSearchText} />
          </div>

          <div className="mb-2">
            <CandidateFilters
              selectedCandidateFilter={selectedCandidateFilter}
              handleChangeFilterValue={handleChangeFilterValue}
            />
          </div>

          <PartyFilters
            handleChangePartyFilterValue={handleChangePartyFilterValue}
            selectedPartyFilter={selectedPartyFilter}
          />
        </>
      );
    }

    return (
      <>
        <div className="w-full flex justify-between">
          <CandidateFilters
            selectedCandidateFilter={selectedCandidateFilter}
            handleChangeFilterValue={handleChangeFilterValue}
          />

          <div className="flex w-[25%]">
            <StatesSelect
              selectedElement={selectedState}
              onChange={setSelectedState}
            />

            {selectedState !== "" && (
              <DistrictSelect
                selectedElement={selectedDistrict}
                onChange={setSelectedDistrict}
              />
            )}
          </div>

          <div className="flex flex-col w-[20%]">
            <SearchBar setSearchText={setSearchText} />
          </div>
        </div>

        <div className="mt-8">
          <PartyFilters
            handleChangePartyFilterValue={handleChangePartyFilterValue}
            selectedPartyFilter={selectedPartyFilter}
          />
        </div>
      </>
    );
  }, [
    isMobile,
    selectedPartyFilter,
    selectedCandidateFilter,
    selectedDistrict,
    selectedState,
  ]);

  return (
    <div
      className="w-full h-full background-content max-h-[500px] mix-blend-hard-light"
      onScroll={handleScroll}
      ref={containerRef}
    >
      <div className="w-full h-full flex flex-col md:px-16 px-4 mt-16 relative">
        {getFiltersByDeviceSize()}
        <div className="w-full flex flex-col mt-12">
          <div className="w-full flex flex-col self-start">
            <p className="text-xl text-white font-bold">
              Candidates{" "}
              <span className="text-base font-normal">({totalCandidates})</span>
            </p>

            <div className="mt-4 grid grid-cols-auto md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
              {candidates.map((candidate) => (
                <div
                  onClick={() => {
                    navigate.push(
                      `/create/projects/ptv/candidates/${candidate.CANDIDATE_ID}`,
                    );
                  }}
                  className="cursor-pointer"
                  key={candidate.CANDIDATE_ID}
                >
                  <CandidateCard
                    key={candidate.CANDIDATE_ID}
                    candidate={candidate}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Candidates;
