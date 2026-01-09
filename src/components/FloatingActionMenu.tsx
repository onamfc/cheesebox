"use client";

import { useState } from "react";

type RecordingMode = "webcam" | "screen";

interface FloatingActionMenuProps {
  onUpload: () => void;
  onRecord: (mode: RecordingMode) => void;
}

export default function FloatingActionMenu({
  onUpload,
  onRecord,
}: FloatingActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  // Calculate positions for the menu items in a radial pattern
  // Items will fan out equally from left (180°) to top (90°)
  const menuItems = [
    {
      name: "Upload",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      action: () => handleAction(onUpload),
      angle: 180, // Left
    },
    {
      name: "Webcam",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      action: () => handleAction(() => onRecord("webcam")),
      angle: 135, // Diagonal
    },
    {
      name: "Screen Record",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      action: () => handleAction(() => onRecord("screen")),
      angle: 90, // Top
    },
  ];

  const radius = 110; // Distance from center to prevent overlap

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Menu Items */}
      {menuItems.map((item, index) => {
        const angle = (item.angle * Math.PI) / 180;
        const x = Math.cos(angle) * radius;
        const y = -Math.sin(angle) * radius; // Negative because Y increases downward

        return (
          <button
            key={item.name}
            onClick={item.action}
            className={`absolute bottom-0 right-0 w-14 h-14 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-out ${
              isOpen
                ? "opacity-100 scale-100"
                : "opacity-0 scale-0 pointer-events-none"
            }`}
            style={{
              transform: isOpen
                ? `translate(${x}px, ${y}px)`
                : "translate(0, 0)",
              transitionDelay: isOpen ? `${index * 50}ms` : "0ms",
            }}
            title={item.name}
          >
            {item.icon}
          </button>
        );
      })}

      {/* Main Button */}
      <button
        onClick={toggleMenu}
        className={`w-16 h-16 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
          isOpen ? "rotate-45" : "rotate-0"
        }`}
        title={isOpen ? "Close menu" : "Open menu"}
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
}
