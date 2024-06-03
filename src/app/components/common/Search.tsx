import SearchIcon from "@/assets/icons/SearchIcon";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const Search = ({ value, onChange, placeholder }: Props) => (
  <div className="w-full flex items-center bg-[#384658] bg-opacity-80 border-[1px] border-[#FFF] border-opacity-30 rounded-full p-3">
    <SearchIcon />
    <input
      placeholder={placeholder || "Search"}
      className="ml-1 w-full bg-transparent outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default Search;
