type Props = React.SVGProps<SVGSVGElement>;

const ArrowIcon = (props: Props) => (
  <svg
    width="1vmax"
    height="1vmax"
    viewBox="0 0 7 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1 11L6 6L1 1"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default ArrowIcon;
