import { ChangeEventHandler, ClipboardEventHandler, LegacyRef } from "react";

type Props = {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  reference?: LegacyRef<HTMLInputElement>;
  onPaste?: ClipboardEventHandler<HTMLInputElement>;
  maxLength?: number;
};

const SimpleInput = ({
  value,
  onChange,
  placeholder,
  reference,
  onPaste,
  maxLength,
}: Props) => (
  <input
    ref={reference}
    value={value}
    maxLength={maxLength}
    onChange={onChange}
    onPaste={onPaste}
    placeholder={placeholder}
    className="input input-bordered h-[2vmax] max-w-[100%] text-center text-xs bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3] p-0"
  />
);

export default SimpleInput;
