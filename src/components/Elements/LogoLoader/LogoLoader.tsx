type LogoLoaderProps = {
  className?: string;
  /** SVG mark size in px. Default 48. */
  size?: number;
};

/**
 * Animated JustCooking "Nest Steam" loader — steam ribbons rise/fade and the
 * bowl gently pulses on a soft green gradient. Used as the image loading state
 * and as the branded placeholder for unresolvable recipe images.
 * Respects prefers-reduced-motion (animation classes no-op there).
 */
export const LogoLoader = ({ className, size = 48 }: LogoLoaderProps) => (
  <div
    className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-green-100 to-green-300 dark:from-slate-700 dark:to-slate-600 ${
      className ?? ''
    }`}
    role="img"
    aria-label="Loading"
  >
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <g fill="none" stroke="#F8B449" strokeWidth="3.4" strokeLinecap="round">
        <path className="jc-steam" d="M25 15c2.6 2.4 2.6 5.2 0 7.6" />
        <path className="jc-steam jc-steam-2" d="M32 12c2.9 3 2.9 6.4 0 9.4" />
        <path className="jc-steam jc-steam-3" d="M39 15c2.6 2.4 2.6 5.2 0 7.6" />
      </g>
      <path className="jc-bowl" d="M12 33h40a20 18 0 0 1-40 0Z" fill="#ffffff" />
    </svg>
  </div>
);

export default LogoLoader;
