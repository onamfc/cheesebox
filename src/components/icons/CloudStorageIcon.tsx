interface CloudStorageIconProps {
  className?: string;
}

export default function CloudStorageIcon({ className = "" }: CloudStorageIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8 14.5C5.51472 14.5 3.5 12.4853 3.5 10C3.5 7.51472 5.51472 5.5 8 5.5C8.49143 5.5 8.96526 5.5767 9.4095 5.71883M15 14.5C17.4853 14.5 19.5 12.4853 19.5 10C19.5 7.51472 17.4853 5.5 15 5.5C14.5086 5.5 14.0347 5.5767 13.5905 5.71883M9.4095 5.71883C10.1578 3.54381 12.2435 2 14.7 2C17.8483 2 20.4 4.55172 20.4 7.7C20.4 8.00442 20.3737 8.30262 20.3237 8.59264M9.4095 5.71883C8.66122 3.54381 6.57554 2 4.11899 2C0.970641 2 -1.58109 4.55172 -1.58109 7.7C-1.58109 8.00442 -1.55476 8.30262 -1.50478 8.59264"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 17.5C7 16.6716 7.67157 16 8.5 16H15.5C16.3284 16 17 16.6716 17 17.5V20.5C17 21.3284 16.3284 22 15.5 22H8.5C7.67157 22 7 21.3284 7 20.5V17.5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M10 19H14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
