type Props = {
  selectedCandidateFilter: string[];
  handleChangeFilterValue: (value: string) => void;
};

const CandidateFilters = ({
  selectedCandidateFilter,
  handleChangeFilterValue,
}: Props) => (
  <div className="flex flex-col">
    <h6>Campaigns</h6>

    <div className="flex items-center mt-4">
      <div className="flex items-center justify-center">
        <input
          id="checkbox1"
          type="checkbox"
          className="checkbox checked:border-[#F4F4F4] [--chkbg:theme(#645EBE)]"
          checked={selectedCandidateFilter.includes("P")}
          onChange={(_) => {
            handleChangeFilterValue("P");
          }}
        />
        <p className="text-white text-base ml-2">Presidential</p>
      </div>

      <div className="flex items-center justify-center mx-4">
        <input
          id="checkbox1"
          type="checkbox"
          className="checkbox checked:border-[#F4F4F4] [--chkbg:theme(#645EBE)]"
          checked={selectedCandidateFilter.includes("S")}
          onChange={(_) => {
            handleChangeFilterValue("S");
          }}
        />
        <p className="text-white text-base ml-2">Senatorial</p>
      </div>

      <div className="flex items-center justify-center ml-2">
        <input
          id="checkbox1"
          type="checkbox"
          className="checkbox checked:border-[#F4F4F4] [--chkbg:theme(#645EBE)]"
          checked={selectedCandidateFilter.includes("H")}
          onChange={(_) => {
            handleChangeFilterValue("H");
          }}
        />
        <p className="text-white text-base ml-2">Congressional</p>
      </div>
    </div>
  </div>
);

export default CandidateFilters;
