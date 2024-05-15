type Props = {
  title: string;
  action: () => void;
  isPrimary: boolean;
  isLoading: boolean;
  size: "small" | "large";
  disabled?: boolean;
};

const Button = ({
  isLoading,
  action,
  title,
  isPrimary,
  size,
  disabled,
}: Props) => (
  <button
    className={`${isPrimary && "bg-[#CD068E]"} ${size === "small" ? "p-2" : "p-4"} rounded-md flex items-center justify-center text-center ${disabled && "opacity-70"}`}
    onClick={action}
    disabled={disabled}
  >
    {isLoading ? (
      <span className="loading loading-spinner loading-lg bg-[#BEEF00]"></span>
    ) : (
      <p className="text-white text-base text-center">{title}</p>
    )}
  </button>
);

export default Button;
