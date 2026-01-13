type Props = React.SVGProps<SVGSVGElement>;

const GoogleIcon = (props: Props) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M44.5 20H24V28.5H35.8C34.2 33.1 29.9 36.5 24 36.5C17.1 36.5 11.5 30.9 11.5 24C11.5 17.1 17.1 11.5 24 11.5C27 11.5 29.7 12.6 31.8 14.4L37.8 8.4C34.1 5 29.3 3 24 3C12.4 3 3 12.4 3 24C3 35.6 12.4 45 24 45C35.6 45 45 35.6 45 24C45 22.6 44.8 21.3 44.5 20Z"
      fill="white"
    />
  </svg>
);

export default GoogleIcon;
