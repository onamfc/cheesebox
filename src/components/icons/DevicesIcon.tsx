interface DevicesIconProps {
  className?: string;
}

export default function DevicesIcon({ className = "" }: DevicesIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="2"
        y="3"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M6 17H12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9 13V17"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="17"
        y="7"
        width="5"
        height="11"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="19.5"
        cy="16"
        r="0.5"
        fill="currentColor"
      />
    </svg>
  );
}
