type LogoProps = {
  className?: string;
};

function Logo({ className }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="512"
      height="512"
      viewBox="0 0 18 28"
      className={className}
    >
      <g fill="none" fillRule="evenodd">
        <path
          fill="#30BE76"
          d="M14.657 24C10.571 27.837 4.06 27.726.113 23.753L14.911 9.86c3.946 3.973 3.832 10.304-.254 14.14z"
        />
        <path
          fill="#F8B449"
          d="M17.685 4.053L2.887 17.947C-1.06 13.974-.946 7.643 3.14 3.807 7.227-.03 13.739.08 17.685 4.053z"
        />
      </g>
    </svg>
  );
}

export default Logo;
