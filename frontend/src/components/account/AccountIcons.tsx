type IconProps = { size?: number };

export function UserIcon({ size = 96 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4.5" />
      <path d="M3.5 20.5c0-4.2 3.8-6.5 8.5-6.5s8.5 2.3 8.5 6.5z" />
    </svg>
  );
}

export function AdminIcon({ size = 96 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="10" cy="8" r="4.5" />
      <path d="M2 20.5c0-4.2 3.6-6.5 8-6.5c1.1 0 2.1.1 3 .4V20.5z" />
      <rect x="15" y="15" width="7" height="6" rx="1" />
      <path
        d="M16.5 15v-1.5a2 2 0 0 1 4 0V15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}