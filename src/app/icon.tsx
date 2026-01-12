import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Icon generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
          borderRadius: '6px',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 512 512"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m468.8 235.007-401.359-231.73a24.2 24.2 0 0 0 -12.087-3.285h-.07a24.247 24.247 0 0 0 -12.094 3.287 24 24 0 0 0 -12.11 20.992v463.456a24.186 24.186 0 0 0 36.36 20.994l401.36-231.731a24.238 24.238 0 0 0 0-41.983z"
            fillRule="evenodd"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
