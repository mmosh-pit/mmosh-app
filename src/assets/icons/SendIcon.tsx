type Props = React.SVGProps<SVGSVGElement>;

const SendIcon = (props: Props) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M27.1959 3.76608C27.8619 1.92378 26.0767 0.138534 24.2344 0.806076L1.71833 8.94916C-0.130128 9.61824 -0.35367 12.1404 1.34679 13.1255L8.53404 17.2865L14.952 10.8685C15.2428 10.5877 15.6322 10.4323 16.0364 10.4358C16.4406 10.4393 16.8273 10.6015 17.1131 10.8873C17.399 11.1732 17.5611 11.5598 17.5646 11.964C17.5681 12.3683 17.4127 12.7577 17.1319 13.0485L10.714 19.4664L14.8765 26.6537C15.86 28.3541 18.3822 28.129 19.0513 26.2821L27.1959 3.76608Z"
      fill="white"
    />
  </svg>
);

export default SendIcon;