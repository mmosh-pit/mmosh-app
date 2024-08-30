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
          id="checkbox1"
          type="checkbox"
          className="checkbox checked:border-[#F4F4F4] [--chkbg:theme(#645EBE)]"
          checked={selectedPartyFilter.includes("DEM")}
          onChange={(_) => {
            handleChangePartyFilterValue("DEM");
          }}
        />
        <p className="text-white text-base ml-2">Dem</p>
      </div>

      <div className="flex items-center justify-center mx-2">
        <input
          id="checkbox1"
          type="checkbox"
          className="checkbox checked:border-[#F4F4F4] [--chkbg:theme(#645EBE)]"
          checked={selectedPartyFilter.includes("REP")}
          onChange={(_) => {
            handleChangePartyFilterValue("REP");
          }}
        />
        <p className="text-white text-base ml-2">Rep</p>
      </div>

      <div className="flex items-center justify-center mx-2">
        <input
          id="checkbox1"
          type="checkbox"
          className="checkbox checked:border-[#F4F4F4] [--chkbg:theme(#645EBE)]"
          checked={selectedPartyFilter.includes("IND")}
          onChange={(_) => {
            handleChangePartyFilterValue("IND");
          }}
        />
        <p className="text-white text-base ml-2">Ind</p>
      </div>

      <div className="flex items-center justify-center mx-2">
        <input
          id="checkbox1"
          type="checkbox"
          className="checkbox checked:border-[#F4F4F4] [--chkbg:theme(#645EBE)]"
          checked={selectedPartyFilter.includes("GRE")}
          onChange={(_) => {
            handleChangePartyFilterValue("GRE");
          }}
        />
        <p className="text-white text-base ml-2">Green</p>
      </div>

      <div className="flex items-center justify-center mx-2">
        <input
          id="checkbox1"
          type="checkbox"
          className="checkbox checked:border-[#F4F4F4] [--chkbg:theme(#645EBE)]"
          checked={selectedPartyFilter.includes("LIB")}
          onChange={(_) => {
            handleChangePartyFilterValue("LIB");
          }}
        />
        <p className="text-white text-base ml-2">Lib</p>
      </div>

      <div className="flex items-center justify-center mx-2">
        <input
          id="checkbox1"
          type="checkbox"
          className="checkbox checked:border-[#F4F4F4] [--chkbg:theme(#645EBE)]"
          checked={selectedPartyFilter.includes("OTHER")}
          onChange={(_) => {
            handleChangePartyFilterValue("OTHER");
          }}
        />
        <p className="text-white text-base ml-2">Other</p>
      </div>
    </div>
  </div>
);

export default PartyFilters;
