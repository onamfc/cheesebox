"use client";

/**
 * Theme Provider Wrapper
 * ======================
 *
 * Client-side wrapper for the ThemeProvider that can be used in server components.
 */

import { ThemeProvider } from '@/contexts/ThemeContext';
import { ReactNode } from 'react';

interface ThemeProviderWrapperProps {
  children: ReactNode;
  initialTheme: string;
}

export default function ThemeProviderWrapper({
  children,
  initialTheme
}: ThemeProviderWrapperProps) {
  return (
    <ThemeProvider initialTheme={initialTheme}>
      {children}
    </ThemeProvider>
  );
}
