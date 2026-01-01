"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [glitchText, setGlitchText] = useState("404");
  const [scanline, setScanline] = useState(0);

  // Create VHS glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const glitchChars = ["4", "0", "4", "█", "▓", "▒", "░"];
      const randomGlitch = Array.from({ length: 3 }, () =>
        glitchChars[Math.floor(Math.random() * glitchChars.length)]
      ).join("");
      setGlitchText(randomGlitch);

      setTimeout(() => setGlitchText("404"), 100);
    }, 3000);

    const scanlineInterval = setInterval(() => {
      setScanline((prev) => (prev + 1) % 100);
    }, 50);

    return () => {
      clearInterval(glitchInterval);
      clearInterval(scanlineInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden relative">
      {/* CRT Scanlines */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div
          className="absolute w-full h-1 bg-white opacity-10"
          style={{ top: `${scanline}%` }}
        />
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-white opacity-5"
            style={{ top: `${i * 5}%` }}
          />
        ))}
      </div>

      {/* VHS Noise */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
        <div className="w-full h-full bg-gradient-to-b from-transparent via-white to-transparent animate-pulse" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 text-center max-w-2xl">
        {/* VHS TV Frame */}
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-3xl shadow-2xl border-8 border-gray-700">
          {/* Screen */}
          <div className="bg-black p-8 rounded-2xl border-4 border-gray-600 relative overflow-hidden">
            {/* Static noise overlay */}
            <div className="absolute inset-0 opacity-5 bg-noise" />

            {/* Content */}
            <div className="relative">
              {/* VCR Status Bar */}
              <div className="flex items-center justify-between mb-6 text-green-400 font-mono text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span>REC</span>
                </div>
                <span>TRACKING: --:--:--</span>
                <span>SP</span>
              </div>

              {/* 404 Display */}
              <div className="mb-6">
                <h1
                  className="text-9xl font-bold mb-4 font-mono tracking-wider text-green-400"
                  style={{
                    textShadow:
                      "0 0 20px rgba(34, 197, 94, 0.8), 0 0 40px rgba(34, 197, 94, 0.4)",
                  }}
                >
                  {glitchText}
                </h1>

                {/* TV Static bars */}
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-green-400 to-transparent mb-4 animate-pulse" />
              </div>

              {/* Error Messages */}
              <div className="space-y-3 font-mono text-green-400">
                <p className="text-2xl tracking-wide">
                  ▶ PLAYBACK ERROR
                </p>
                <p className="text-lg opacity-80">
                  ⏸ VIDEO TAPE NOT FOUND
                </p>
                <p className="text-sm opacity-60 mt-4">
                  Please check that the tape is inserted correctly
                </p>
                <p className="text-sm opacity-60">
                  or adjust the tracking dial
                </p>
              </div>

              {/* VHS Rewind Animation */}
              <div className="mt-8 flex justify-center gap-4 items-center text-green-400">
                <div className="animate-spin-slow">⟲</div>
                <div className="h-px w-32 bg-green-400 opacity-30" />
                <div className="animate-spin-slow-reverse">⟳</div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-4">
                <Link
                  href="/dashboard"
                  className="block bg-green-900 hover:bg-green-800 text-green-100 font-mono px-6 py-3 rounded transition-colors duration-200 border-2 border-green-400"
                  style={{
                    textShadow: "0 0 10px rgba(34, 197, 94, 0.5)",
                  }}
                >
                  ⏮ RETURN TO VIDEO LIBRARY
                </Link>

                <Link
                  href="/"
                  className="block text-green-400 hover:text-green-300 font-mono text-sm transition-colors duration-200"
                >
                  ⏏ EJECT & GO HOME
                </Link>
              </div>

              {/* Bottom ticker */}
              <div className="mt-8 pt-4 border-t border-green-900">
                <p className="text-green-400 font-mono text-xs opacity-50 animate-pulse">
                  NO SIGNAL · BE KIND, REWIND · NO SIGNAL
                </p>
              </div>
            </div>
          </div>

          {/* VCR Controls */}
          <div className="mt-4 flex justify-center gap-3">
            {["⏮", "⏪", "⏸", "⏺", "⏩", "⏭"].map((symbol, i) => (
              <div
                key={i}
                className="w-10 h-10 bg-gray-600 rounded-sm flex items-center justify-center text-gray-400 text-xs border border-gray-500"
              >
                {symbol}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-slow-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 3s linear infinite;
        }

        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          animation: noise 0.2s infinite;
        }

        @keyframes noise {
          0%,
          100% {
            opacity: 0.05;
          }
          50% {
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  );
}
