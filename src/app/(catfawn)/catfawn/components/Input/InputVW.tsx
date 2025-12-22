interface InputVWProps {
  labelText: string;
  value: string;
  placeHolder: string;
  inputType: string;
  isRequired: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputVW = (props: InputVWProps) => {
  const { labelText, value, placeHolder, inputType, isRequired, onChange } =
    props;
  return (
    <div>
      <label className="block text-[#FFFFFFCC] mb-[0.313rem] leading-[100%]">
        {labelText}
        {isRequired && "*"}
      </label>
      <input
        type={inputType}
        placeholder={placeHolder}
        className="w-full h-[2.813rem] px-[1.25rem] py-[0.813rem] rounded-lg bg-[#402A2A] backdrop-blur-[20.16px] border border-[#FFFFFF29] text-white focus:outline-none placeholder:text-[#FFFFFF] placeholder:opacity-20"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
