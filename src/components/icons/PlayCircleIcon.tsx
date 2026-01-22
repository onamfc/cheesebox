interface PlayCircleIconProps {
  className?: string;
}

export default function PlayCircleIcon({ className = "" }: PlayCircleIconProps) {
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
        r="10"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M9.5 8.97114C9.5 8.58634 9.93425 8.34768 10.2572 8.55279L16.0522 12.0816C16.3491 12.2709 16.3491 12.7291 16.0522 12.9184L10.2572 16.4472C9.93425 16.6523 9.5 16.4137 9.5 16.0289V8.97114Z"
        fill="currentColor"
      />
    </svg>
  );
}
