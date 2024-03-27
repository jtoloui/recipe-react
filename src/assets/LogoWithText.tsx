type LogoWithTextProps = {
  className?: string;
};
function LogoWithText({ className }: LogoWithTextProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="28"
      viewBox="-4 0 90 28"
      className={className}
    >
      <g fill="none" fillRule="evenodd">
        <text
          fill="#363837"
          fontSize="20"
          fontWeight="bold"
          letterSpacing="0.4"
          transform="translate(28 4)"
          className="dark:fill-white-500"
        >
          <tspan x="0" y="16" className="dark:text-whit">
            toloui
          </tspan>
        </text>
        <path
          fill="#30BE76"
          d="M14.657 24C10.571 27.837 4.06 27.726.113 23.753L14.911 9.86c3.946 3.973 3.832 10.304-.254 14.14z"
        ></path>
        <path
          fill="#F8B449"
          d="M17.685 4.053L2.887 17.947C-1.06 13.974-.946 7.643 3.14 3.807 7.227-.03 13.739.08 17.685 4.053z"
        ></path>
      </g>
    </svg>
  );
}

export default LogoWithText;
