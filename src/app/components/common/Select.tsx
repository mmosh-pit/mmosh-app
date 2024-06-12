import { ChangeEventHandler } from "react";

type Options = {
  label: string;
  value: string;
};

type Props = {
  value: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  options: Options[];
};

const Select = ({ value, options, onChange }: Props) => (
  <select
    className="select text-base h-10 min-h-10 w-full select-bordered bg-black bg-opacity-[0.07]"
    value={value}
    onChange={onChange}
  >
    {options.map((option) => (
      <option className="bg-black" value={option.value} key={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

export default Select;
