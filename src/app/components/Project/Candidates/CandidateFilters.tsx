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
          id="radio1"
          type="radio"
          className="radio radio-secondary"
          checked={selectedCandidateFilter.includes("P")}
          onChange={() => {}}
          onClick={(_) => {
            handleChangeFilterValue("P");
          }}
        />
        <p className="text-white text-base ml-2">Presidential</p>
      </div>

      <div className="flex items-center justify-center mx-4">
        <input
          id="radio1"
          type="radio"
          className="radio radio-secondary"
          checked={selectedCandidateFilter.includes("S")}
          onChange={() => {}}
          onClick={(_) => {
            handleChangeFilterValue("S");
          }}
        />
        <p className="text-white text-base ml-2">Senatorial</p>
      </div>

      <div className="flex items-center justify-center ml-2">
        <input
          id="radio1"
          type="radio"
          className="radio radio-secondary"
          checked={selectedCandidateFilter.includes("H")}
          onChange={() => {}}
          onClick={(_) => {
            handleChangeFilterValue("H");
          }}
        />
        <p className="text-white text-base ml-2">Congressional</p>
      </div>
    </div>
  </div>
);

export default CandidateFilters;
