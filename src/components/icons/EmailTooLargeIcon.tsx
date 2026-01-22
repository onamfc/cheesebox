interface EmailTooLargeIconProps {
  className?: string;
}

export default function EmailTooLargeIcon({ className = "" }: EmailTooLargeIconProps) {
  return (
    <svg
      height="512"
      viewBox="0 0 512 512"
      width="512"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="m375.384 309.59v46.4a12 12 0 0 0 24 0v-46.4a12 12 0 1 0 -24 0z"></path>
      <path d="m387.384 379.146a12 12 0 0 0 -12 12v9.81a12 12 0 0 0 24 0v-9.81a12 12 0 0 0 -12-12z"></path>
      <path d="m510.393 424.674-111.009-192.274v-127.116a36 36 0 0 0 -35.958-35.958h-327.468a36 36 0 0 0 -35.958 35.958v207.133a36 36 0 0 0 35.958 35.958h272.468l-44.051 76.3a12 12 0 0 0 10.393 18h225.232a12 12 0 0 0 10.393-18zm-156.723-331.348-152.921 163.007-152.92-163.007zm-317.712 231.049a11.971 11.971 0 0 1 -11.958-11.958v-207.133a12.021 12.021 0 0 1 .192-2.075l167.808 178.873a12 12 0 0 0 17.5 0l165.883-176.822v127.14l-53.1 91.975zm259.594 94.3 91.832-159.058 91.832 159.058z"></path>
    </svg>
  );
}
