import React from 'react';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

interface LinkButtonProps extends Omit<ButtonProps, 'onClick' | 'type' | 'loading'> {
  href: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-purple-600 hover:bg-purple-700 text-white',
  secondary: 'bg-white border-2 border-purple-300 text-purple-900 hover:bg-purple-50',
  ghost: 'bg-transparent border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-lavender focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}

export function LinkButton({
  variant = 'primary',
  size = 'md',
  children,
  disabled = false,
  className = '',
  href,
}: LinkButtonProps) {
  if (disabled) {
    return (
      <span className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} pointer-events-none opacity-50 ${className}`}>
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
