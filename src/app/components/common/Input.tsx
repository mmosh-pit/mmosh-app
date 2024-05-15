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
  onBlur?: () => void;
};

const Input = ({
  textarea,
  type,
  value,
  onBlur,
  required,
  title,
  placeholder,
  helperText,
  onChange,
}: Props) => {
  const getTextType = () => {
    if (textarea) {
      return (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="textarea textarea-bordered text-base textarea-lg w-full bg-black bg-opacity-[0.07] text-base placeholder-white placeholder-opacity-[0.3] h-full"
        ></textarea>
      );
    }

    return (
      <input
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className="input input-bordered h-[2.5vmax] text-base bg-black bg-opacity-[0.07] placeholder-white placeholder-opacity-[0.3]"
      />
    );
  };

  return (
    <div className="flex flex-col w-full">
      <p className="text-xs text-white">
        {title}
        {required && <sup>*</sup>}
      </p>
      {getTextType()}
      {helperText && <p className="text-tiny">{helperText}</p>}
    </div>
  );
};

export default Input;
