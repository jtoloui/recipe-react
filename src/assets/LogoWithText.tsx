type LogoWithTextProps = {
  className?: string;
  /**
   * Surface the lockup sits on:
   *  - 'light' (default): green bowl + amber steam, ink "just" + green "cooking"
   *  - 'dark' / 'green': white bowl + amber steam, white wordmark
   * The mark recolors to stay legible — never green-on-green.
   */
  surface?: 'light' | 'dark' | 'green';
};

/**
 * JustCooking horizontal lockup — the "Nest Steam" mark + "justcooking"
 * wordmark. viewBox sized so the mark sits left of the text baseline.
 */
function LogoWithText({ className, surface = 'light' }: LogoWithTextProps) {
  const bowl = surface === 'light' ? '#30BE76' : '#FFFFFF';
  const justFill = surface === 'light' ? '#0F1F17' : '#FFFFFF';
  const cookingFill = surface === 'green' ? '#FFFFFF' : '#30BE76';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="30"
      viewBox="0 0 210 44"
      fill="none"
      className={className}
      role="img"
      aria-label="JustCooking"
    >
      {/* Mark (Nest Steam) scaled into a 44x44 box on the left */}
      <g transform="translate(0 -10)">
        <g
          fill="none"
          stroke="#F8B449"
          strokeWidth="3.4"
          strokeLinecap="round"
        >
          <path d="M25 15c2.6 2.4 2.6 5.2 0 7.6" />
          <path d="M32 12c2.9 3 2.9 6.4 0 9.4" />
          <path d="M39 15c2.6 2.4 2.6 5.2 0 7.6" />
        </g>
        <path d="M12 33h40a20 18 0 0 1-40 0Z" fill={bowl} />
      </g>

      {/* Wordmark */}
      <text
        x="60"
        y="30"
        fontFamily="Nunito, ui-sans-serif, system-ui, sans-serif"
        fontSize="26"
        fontWeight="800"
        letterSpacing="-0.5"
      >
        <tspan fill={justFill}>just</tspan>
        <tspan fill={cookingFill}>cooking</tspan>
      </text>
    </svg>
  );
}

export default LogoWithText;
