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

const OTHER_PARTIES = ["CON", "UNK", "DFL", "CONST", "UN"];

const Candidates = () => {
  const isMobile = useCheckMobileScreen();

  const navigate = useRouter();

  const [candidates, setCandidates] = React.useState<Candidate[]>([]);

  const [filteredCandidates, setFilteredCandidates] = React.useState<
    Candidate[]
  >([]);

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
    const response = await axios.get("/api/get-candidates");

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

      const partyFilterOther = selectedPartyFilter.includes("OTHER");

      const matchesPartyFilter =
        selectedPartyFilter.length > 0
          ? selectedPartyFilter.includes(value.PARTY)
          : true;

      return (
        matchesCandidateFilter &&
        (partyFilterOther
          ? OTHER_PARTIES.includes(value.PARTY) || matchesPartyFilter
          : matchesPartyFilter) &&
        value.CANDIDATE_NAME.toLowerCase().includes(searchText.toLowerCase()) &&
        (selectedState === "" ? true : value.REG_ABBR === selectedState) &&
        (selectedState !== "" && selectedDistrict !== ""
          ? value.DISTRICT === Number(selectedDistrict)
          : true)
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
    selectedDistrict,
  ]);

  React.useEffect(() => {
    filterCandidates();
  }, [
    selectedCandidateFilter,
    selectedPartyFilter,
    searchText,
    selectedState,
    selectedDistrict,
  ]);

  React.useEffect(() => {
    getCandidates();
  }, [getCandidates]);

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
    <div className="w-full h-full background-content">
      <div className="w-full h-full flex flex-col md:px-16 px-4 mt-16 relative">
        {getFiltersByDeviceSize()}
        <div className="w-full flex flex-col mt-12">
          <div className="w-full flex flex-col self-start">
            <p className="text-xl text-white font-bold">
              Candidates{" "}
              <span className="text-base font-normal">
                ({filteredCandidates.length})
              </span>
            </p>

            <div className="mt-4 grid grid-cols-auto md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
              {filteredCandidates.map((candidate) => (
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
