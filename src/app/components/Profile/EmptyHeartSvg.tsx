type Props = React.SVGProps<SVGSVGElement>;

const EmptyHeartSvg = (props: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="13"
    viewBox="0 0 16 13"
    fill="none"
    {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.710938 4.35833C0.710938 2.10833 2.68594 0.375 5.0026 0.375C6.19677 0.375 7.24844 0.935 8.0026 1.66C8.75677 0.935 9.8076 0.375 11.0026 0.375C13.3193 0.375 15.2943 2.10833 15.2943 4.35833C15.2943 5.9 14.6368 7.255 13.7259 8.40167C12.8176 9.545 11.6276 10.5158 10.4893 11.305C10.0534 11.6067 9.61427 11.8842 9.21094 12.0892C8.8326 12.2817 8.39844 12.4583 8.0026 12.4583C7.60677 12.4583 7.1726 12.2817 6.79427 12.0892C6.35183 11.8558 5.92509 11.5939 5.51677 11.305C4.3776 10.5158 3.18844 9.545 2.27927 8.40167C1.36844 7.255 0.710938 5.9 0.710938 4.35833ZM5.0026 1.625C3.26927 1.625 1.96094 2.9 1.96094 4.35833C1.96094 5.5275 2.4576 6.61667 3.2576 7.62333C4.05927 8.63167 5.13844 9.5225 6.22844 10.2775C6.64094 10.5633 7.02844 10.8058 7.36177 10.9758C7.71844 11.1575 7.9251 11.2083 8.0026 11.2083C8.0801 11.2083 8.28677 11.1575 8.64427 10.975C9.0367 10.7672 9.41527 10.5342 9.7776 10.2775C10.8668 9.5225 11.9459 8.6325 12.7476 7.62333C13.5476 6.61667 14.0443 5.5275 14.0443 4.35833C14.0443 2.9 12.7359 1.625 11.0026 1.625C10.0076 1.625 9.0776 2.21917 8.49844 2.97417C8.44008 3.05022 8.365 3.11183 8.27903 3.15422C8.19305 3.19662 8.09847 3.21867 8.0026 3.21867C7.90674 3.21867 7.81216 3.19662 7.72618 3.15422C7.6402 3.11183 7.56513 3.05022 7.50677 2.97417C6.9276 2.21917 5.99844 1.625 5.0026 1.625Z"
      fill="#D6D6D6"
    />
  </svg>
);

export default EmptyHeartSvg;