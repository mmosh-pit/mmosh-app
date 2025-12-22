interface CheckBoxVWProps {
  step: string;
  labelText: string;
  hasChecked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export const CheckBoxVW = (props: CheckBoxVWProps) => {
  const { step, labelText, hasChecked, onChange } = props;
  if (step === "step3" || step === "step4") {
    return (
      <label className="flex items-center gap-0.5">
        <input
          type="checkbox"
          className="w-[1.438rem] h-[1.438rem] rounded-[0.313rem]"
          checked={hasChecked}
          onChange={onChange}
        />
        {labelText}
      </label>
    );
  }
};
