type LogoProps = {
  className?: string;
  /**
   * Surface the logo sits on, which controls the bowl fill:
   *  - 'light' (default): green bowl + amber steam (light UI)
   *  - 'dark' / 'green': white bowl + amber steam (dark or brand-green surfaces)
   * Steam is always amber; the mark recolors to stay legible — never green-on-green.
   */
  surface?: 'light' | 'dark' | 'green';
};

/**
 * JustCooking "Nest Steam" mark — a rounded bowl (nest) with three rising
 * steam ribbons. viewBox 0 0 64 64.
 */
function Logo({ className, surface = 'light' }: LogoProps) {
  const bowl = surface === 'light' ? '#30BE76' : '#FFFFFF';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      role="img"
      aria-label="JustCooking"
    >
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
      <path
        d="M15.5 37.5c3.4 5 9.2 8.2 16.5 8.2"
        stroke="#0A2618"
        strokeOpacity="0.16"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default Logo;
