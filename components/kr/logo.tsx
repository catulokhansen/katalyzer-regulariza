interface LogoProps {
  size?: number;
  decorative?: boolean;
  className?: string;
}

export function KatalyzerLogo({
  size = 42,
  decorative = false,
  className,
}: LogoProps) {
  const w = size;
  const h = size * (64 / 72);
  const a11y = decorative
    ? { "aria-hidden": true as const }
    : { role: "img", "aria-label": "Katalyzer Regulariza" };
  return (
    <svg
      {...a11y}
      fill="none"
      width={w}
      height={h}
      viewBox="0 0 72 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <polygon fill="#0A2A5F" points="36,0 18,32 54,32" />
      <polygon fill="#7B2CBF" points="0,64 18,32 36,64" />
      <polygon fill="#00E0FF" points="72,64 54,32 36,64" />
      <polygon
        fill="none"
        points="36,0 0,64 72,64"
        stroke="rgba(10,42,95,0.18)"
        strokeWidth="1.5"
      />
    </svg>
  );
}
