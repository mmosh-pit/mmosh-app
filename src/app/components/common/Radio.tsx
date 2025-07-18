type Props = {
  checked: boolean;
  onChoose: () => void;
  title: string;
  name?: string;
  disabled?: boolean;
};

const Radio = ({ checked, onChoose, title, name }: Props) => (
  <div className="form-control">
    <label className="label cursor-pointer">
      <input
        type="radio"
        name={name ?? "radio-10"}
        className="radio checked:bg-primary"
        checked={checked}
        onChange={() => {
          onChoose();
        }}
      />
      <span className="label-text text-para-font-size pl-1 pr-2.5 text-white">
        {title}
      </span>
    </label>
  </div>
);

export default Radio;
