// Biblioteca de ícones centralizada
// Evita duplicação de SVGs across components

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

const defaultProps: IconProps = {
  size: 20,
  color: "currentColor",
};

export function ClipboardIcon({ size, color, className }: IconProps = defaultProps) {
  return (
    <svg
      width={size ?? 20}
      height={size ?? 20}
      fill={color ?? "currentColor"}
      viewBox="0 0 20 20"
      className={className}
    >
      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
      <path
        fillRule="evenodd"
        d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function ChartIcon({ size, color, className }: IconProps = defaultProps) {
  return (
    <svg
      width={size ?? 20}
      height={size ?? 20}
      fill={color ?? "currentColor"}
      viewBox="0 0 20 20"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function StarIcon({ size, color, className }: IconProps = defaultProps) {
  return (
    <svg
      width={size ?? 20}
      height={size ?? 20}
      fill={color ?? "currentColor"}
      viewBox="0 0 20 20"
      className={className}
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export function SpinnerIcon({ size, color, className }: IconProps = defaultProps) {
  return (
    <svg
      width={size ?? 20}
      height={size ?? 20}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ animation: "spin 1s linear infinite" }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color ?? "var(--text-muted)"}
        strokeWidth="3"
        opacity="0.3"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke={color ?? "var(--accent)"}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SearchIcon({ size, color, className }: IconProps = defaultProps) {
  return (
    <svg
      width={size ?? 20}
      height={size ?? 20}
      fill={color ?? "currentColor"}
      viewBox="0 0 20 20"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
        clipRule="evenodd"
      />
    </svg>
  );
}
