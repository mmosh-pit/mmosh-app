type Props = {
    checked: boolean;
    disabled: boolean
    onChoose: () => void;
    title: string;
};

const Radio = ({
    checked,
    disabled,
    onChoose,
    title
  }: Props) => (
    <div className="form-control">
        <label className="label cursor-pointer">
            <input type="radio" name="radio-10" className="radio checked:bg-primary" checked={checked} />
            <span className="label-text text-para-font-size pl-1 pr-2.5">{title}</span> 
        </label>
    </div>
  );
  
  export default Radio;