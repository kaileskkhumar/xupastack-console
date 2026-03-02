const Logo = ({ className = "h-7 w-7" }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="logo-grad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="hsl(265, 80%, 65%)" />
        <stop offset="1" stopColor="hsl(280, 70%, 50%)" />
      </linearGradient>
      <filter id="logo-glow">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    {/* Outer rounded square */}
    <rect x="1" y="1" width="30" height="30" rx="8" fill="hsl(265, 80%, 60%)" fillOpacity="0.1" stroke="url(#logo-grad)" strokeWidth="1.5" />
    {/* X mark */}
    <g filter="url(#logo-glow)">
      <path
        d="M10 10L16 16M16 16L22 22M16 16L22 10M16 16L10 22"
        stroke="url(#logo-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    {/* Inner glow dot */}
    <circle cx="16" cy="16" r="2" fill="hsl(265, 80%, 70%)" fillOpacity="0.5" />
  </svg>
);

export default Logo;
