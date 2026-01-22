interface ShareLinkIconProps {
  className?: string;
}

export default function ShareLinkIcon({ className = "" }: ShareLinkIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M13.544 10.456C14.7867 11.6987 14.7867 13.6755 13.544 14.9182L11.0156 17.4466C9.77289 18.6893 7.79614 18.6893 6.55342 17.4466C5.31071 16.2039 5.31071 14.2271 6.55342 12.9844L7.81787 11.72"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10.456 13.544C9.21329 12.3013 9.21329 10.3245 10.456 9.08178L12.9844 6.55342C14.2271 5.31071 16.2039 5.31071 17.4466 6.55342C18.6893 7.79614 18.6893 9.77289 17.4466 11.0156L16.1821 12.28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
