type Props = {
  selectedPartyFilter: string[];
  handleChangePartyFilterValue: (val: string) => void;
};

const PartyFilters = ({
  selectedPartyFilter,
  handleChangePartyFilterValue,
}: Props) => (
  <div className="w-full flex flex-col">
    <h6>Party</h6>

    <div className="w-full flex items-center justify-start mt-4">
      <div className="flex items-center justify-center mr-2">
        <input
          id="radio1"
          type="radio"
          className="radio radio-secondary"
          checked={selectedPartyFilter.includes("DEM")}
          onChange={() => {}}
          onClick={(_) => {
            handleChangePartyFilterValue("DEM");
          }}
        />
        <p className="text-white text-base ml-2">Dem</p>
      </div>

      <div className="flex items-center justify-center mx-2">
        <input
          id="radio1"
          type="radio"
          className="radio radio-secondary"
          checked={selectedPartyFilter.includes("REP")}
          onChange={() => {}}
          onClick={(_) => {
            handleChangePartyFilterValue("REP");
          }}
        />
        <p className="text-white text-base ml-2">Rep</p>
      </div>

      <div className="flex items-center justify-center mx-2">
        <input
          id="radio1"
          type="radio"
          className="radio radio-secondary"
          checked={selectedPartyFilter.includes("IND")}
          onChange={() => {}}
          onClick={(_) => {
            handleChangePartyFilterValue("IND");
          }}
        />
        <p className="text-white text-base ml-2">Ind</p>
      </div>

      <div className="flex items-center justify-center mx-2">
        <input
          id="radio1"
          type="radio"
          className="radio radio-secondary"
          checked={selectedPartyFilter.includes("GRE")}
          onChange={() => {}}
          onClick={(_) => {
            handleChangePartyFilterValue("GRE");
          }}
        />
        <p className="text-white text-base ml-2">Green</p>
      </div>

      <div className="flex items-center justify-center mx-2">
        <input
          id="radio1"
          type="radio"
          className="radio radio-secondary"
          checked={selectedPartyFilter.includes("LIB")}
          onChange={() => {}}
          onClick={(_) => {
            handleChangePartyFilterValue("LIB");
          }}
        />
        <p className="text-white text-base ml-2">Lib</p>
      </div>

      <div className="flex items-center justify-center mx-2">
        <input
          id="radio1"
          type="radio"
          className="radio radio-secondary"
          checked={selectedPartyFilter.includes("OTHER")}
          onChange={() => {}}
          onClick={(_) => {
            handleChangePartyFilterValue("OTHER");
          }}
        />
        <p className="text-white text-base ml-2">Other</p>
      </div>
    </div>
  </div>
);

export default PartyFilters;
