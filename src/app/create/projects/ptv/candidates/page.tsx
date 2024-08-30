"use client";
import CandidateCard from "@/app/components/Project/Candidates/CandidateCard";
import CandidateFilters from "@/app/components/Project/Candidates/CandidateFilters";
import PartyFilters from "@/app/components/Project/Candidates/PartyFilters";
import SearchBar from "@/app/components/Project/Candidates/SearchBar";
import StatesSelect from "@/app/components/Project/Candidates/StatesSelect";
import { Candidate } from "@/app/models/candidate";
import axios from "axios";
import * as React from "react";

const Candidates = () => {
  const [candidates, setCandidates] = React.useState<Candidate[]>([]);

  const [filteredCandidates, setFilteredCandidates] = React.useState<
    Candidate[]
  >([]);

  const [selectedCandidateFilter, setSelectedCandidateFilter] = React.useState<
    string[]
  >([]);

  const [selectedPartyFilter, setSelectedPartyFilter] = React.useState<
    string[]
  >([]);

  const [searchText, setSearchText] = React.useState("");

  const [selectedState, setSelectedState] = React.useState("");

  const getCandidates = React.useCallback(async () => {
    const response = await axios.get("/api/get-candidates");

    console.log("Got response here: ", response);

    setCandidates(response.data);
    setFilteredCandidates(response.data);
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

  const filterCandidates = React.useCallback(() => {
    const newCandidates = candidates.filter((value) => {
      const matchesCandidateFilter =
        selectedCandidateFilter.length > 0
          ? selectedCandidateFilter.includes(value.CANDIDATE_ID.at(0)!)
          : true;
      const matchesPartyFilter =
        selectedPartyFilter.length > 0
          ? selectedPartyFilter.includes(value.PARTY)
          : true;

      return (
        matchesCandidateFilter &&
        matchesPartyFilter &&
        value.CANDIDATE_NAME.toLowerCase().includes(searchText.toLowerCase()) &&
        (selectedState === "" ? true : value.REG_ABBR === selectedState)
      );
    });

    setFilteredCandidates(newCandidates);
  }, [
    selectedCandidateFilter,
    selectedPartyFilter,
    filteredCandidates,
    candidates,
    searchText,
    selectedState,
  ]);

  React.useEffect(() => {
    filterCandidates();
  }, [selectedCandidateFilter, selectedPartyFilter, searchText, selectedState]);

  React.useEffect(() => {
    getCandidates();
  }, [getCandidates]);

  return (
    <div className="w-full h-full background-content">
      <div className="w-full h-full flex flex-col px-16 mt-16 relative">
        <div className="w-full flex justify-between">
          <CandidateFilters
            selectedCandidateFilter={selectedCandidateFilter}
            handleChangeFilterValue={handleChangeFilterValue}
          />

          <div className="flex flex-col w-[25%]">
            <StatesSelect
              selectedElement={selectedState}
              onChange={setSelectedState}
            />
          </div>

          <div className="flex flex-col">
            <SearchBar setSearchText={setSearchText} />
          </div>
        </div>

        <div className="mt-8">
          <PartyFilters
            handleChangePartyFilterValue={handleChangePartyFilterValue}
            selectedPartyFilter={selectedPartyFilter}
          />
        </div>

        <div className="w-full flex flex-col mt-12">
          <div className="w-full flex flex-col self-start">
            <p className="text-base text-white">
              Candidates{" "}
              <span className="text-base">({filteredCandidates.length})</span>
            </p>

            <div className="mt-4 grid grid-cols-auto md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
              {filteredCandidates.map((candidate) => (
                <CandidateCard
                  key={candidate.CANDIDATE_ID}
                  candidate={candidate}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Candidates;
