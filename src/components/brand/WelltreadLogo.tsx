type Variant = "full" | "symbol" | "wordmark";

type Props = {
  variant?: Variant;
  className?: string;
  symbolSize?: number;
  ariaLabel?: string;
};

export function WelltreadLogo({
  variant = "full",
  className = "",
  symbolSize = 20,
  ariaLabel = "Welltread",
}: Props) {
  const symbol = (
    <svg
      width={symbolSize}
      height={symbolSize}
      viewBox="0 0 40 40"
      aria-hidden="true"
      className="shrink-0"
    >
      <g fill="currentColor">
        <rect x="4" y="26" width="11" height="4" rx="2" />
        <rect x="14.5" y="18" width="11" height="4" rx="2" />
        <rect x="25" y="10" width="11" height="4" rx="2" />
      </g>
    </svg>
  );

  if (variant === "symbol") {
    return (
      <span className={`inline-flex ${className}`} role="img" aria-label={ariaLabel}>
        {symbol}
      </span>
    );
  }

  if (variant === "wordmark") {
    return (
      <span className={className} role="img" aria-label={ariaLabel}>
        welltread
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 ${className}`}
      role="img"
      aria-label={ariaLabel}
    >
      {symbol}
      <span>welltread</span>
    </span>
  );
}
