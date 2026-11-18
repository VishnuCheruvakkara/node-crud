import React from 'react';
import Loader from './Loader';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
}

const variants = {
  primary:
    'bg-accent hover:bg-secondary text-white border-transparent shadow-sm hover:shadow',
  secondary:
    'bg-secondary hover:bg-primary text-white border-transparent shadow-sm',
  danger:
    'bg-rose-600 hover:bg-rose-700 text-white border-transparent shadow-sm',
  outline:
    'bg-white hover:bg-gray-50 text-secondary border-gray-300 shadow-sm',
  ghost:
    'bg-transparent hover:bg-gray-100 text-secondary border-transparent',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs font-medium rounded-md gap-1.5',
  md: 'px-4 py-2.5 text-sm font-semibold rounded-lg gap-2',
  lg: 'px-6 py-3 text-base font-semibold rounded-lg gap-2.5',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  icon,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      disabled={isDisabled}
      className={`inline-flex items-center justify-center border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader
          size="sm"
          color="white"
          text={loadingText || (typeof children === 'string' ? `${children}...` : undefined)}
        />
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
