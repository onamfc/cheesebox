interface SetupIconProps {
  className?: string;
}

export default function SetupIcon({ className = "" }: SetupIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 3V6M12 18V21M21 12H18M6 12H3M18.364 18.364L16.243 16.243M7.757 7.757L5.636 5.636M18.364 5.636L16.243 7.757M7.757 16.243L5.636 18.364"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
