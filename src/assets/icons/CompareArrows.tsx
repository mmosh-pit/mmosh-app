type Props = React.SVGProps<SVGSVGElement>;

const CompareArrows = (props: Props) => (
  <svg
    width="1vmax"
    height="1vmax"
    viewBox="0 0 14 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.22382 6.2959L7.23493 6.2959C6.73493 6.2959 6.49048 5.66309 6.83493 5.29981L9.93493 2.04199C10.1571 1.81934 10.5016 1.81934 10.7238 2.04199L13.8238 5.29981C14.1794 5.66309 13.9349 6.2959 13.4349 6.2959L11.446 6.2959L11.446 13.3389C11.446 13.9834 10.946 14.5107 10.3349 14.5107C9.72382 14.5107 9.22382 13.9834 9.22382 13.3389L9.22382 6.2959ZM4.77937 1.64063L4.77937 8.6836L6.77937 8.6836C7.26826 8.6836 7.52382 9.31641 7.16826 9.67969L4.06826 12.9375C3.84604 13.1602 3.50159 13.1602 3.27937 12.9375L0.179372 9.67969C-0.176183 9.31641 0.0682608 8.6836 0.568261 8.6836L2.55715 8.6836L2.55715 1.64062C2.55715 0.996094 3.05715 0.46875 3.66826 0.46875C4.27937 0.46875 4.77937 0.996094 4.77937 1.64063Z"
      fill="#E5E5E5"
    />
  </svg>
);

export default CompareArrows;