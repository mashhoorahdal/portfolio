const Logo = ({ size = 36, className = '', animated = true }) => {
  const id = 'ma-grad';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label="Mashhoor Ahdal"
      className={`${className} ${animated ? 'transition-transform duration-300 hover:rotate-[8deg]' : ''}`}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgb(var(--accent))" />
          <stop offset="100%" stopColor="rgb(var(--accent-hover))" />
        </linearGradient>
        <linearGradient id={`${id}-soft`} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgb(var(--accent) / 0.25)" />
          <stop offset="100%" stopColor="rgb(var(--accent-hover) / 0.05)" />
        </linearGradient>
      </defs>

      {/* Rounded square frame */}
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="16"
        fill={`url(#${id}-soft)`}
        stroke={`url(#${id})`}
        strokeWidth="2"
      />

      {/* M strokes */}
      <path
        d="M14 46 V20 L24 36 L34 20 V46"
        stroke={`url(#${id})`}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* A strokes (overlapping M's right leg for monogram feel) */}
      <path
        d="M34 46 L44 20 L54 46"
        stroke={`url(#${id})`}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M38.5 38 H49.5"
        stroke={`url(#${id})`}
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Accent dot — period after MA. */}
      <circle cx="56" cy="46" r="2.3" fill={`url(#${id})`} />
    </svg>
  );
};

export default Logo;
