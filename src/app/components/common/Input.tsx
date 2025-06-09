import { ChangeEventHandler } from "react";

type Props = {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  type: string;
  placeholder: string;
  title: string;
  required: boolean;
  helperText?: string;
  textarea?: boolean;
  readonly?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  error?: boolean;
  trailing?: React.ReactNode;
};

const Input = ({
  textarea,
  type,
  value,
  onBlur,
  onFocus,
  required,
  title,
  placeholder,
  helperText,
  readonly,
  onChange,
  error,
  trailing,
}: Props) => {
  const getTextType = () => {
    if (textarea) {
      return (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          readOnly={readonly}
          rows={8}
          className="textarea textarea-bordered textarea-lg w-full bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3] h-full text-xs backdrop-container"
        ></textarea>
      );
    }

    return (
      <label
        className={`flex justify-between items-center input input-bordered text-base bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3] backdrop-container ${error && "border-red-500"}`}
      >
        <input
          type={type}
          value={value}
          readOnly={readonly}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          className="grow bg-transparent"
        />
        {trailing ? trailing : <></>}
      </label>
    );
  };

  return (
    <div className="flex flex-col w-full">
      <p
        className={`${title.length > 40 ? "text-tiny" : "text-xs"} text-white`}
      >
        {title}
        {required && <sup>*</sup>}
      </p>
      {getTextType()}
      {helperText && (
        <p className={`text-tiny ${error && "text-red-500"}`}>{helperText}</p>
      )}
    </div>
  );
};

export default Input;
