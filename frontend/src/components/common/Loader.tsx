import React from 'react';
import { CgSpinner } from 'react-icons/cg';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'accent' | 'white' | 'mint';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'w-4 h-4 text-base',
  md: 'w-6 h-6 text-xl',
  lg: 'w-8 h-8 text-2xl',
  xl: 'w-12 h-12 text-4xl',
};

const colorMap = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent',
  white: 'text-white',
  mint: 'text-mint',
};

export default function Loader({
  size = 'md',
  color = 'accent',
  text,
  fullScreen = false,
  className = '',
}: LoaderProps) {
  const spinner = (
    <div className={`inline-flex items-center justify-center gap-2.5 ${className}`}>
      <CgSpinner className={`animate-spin ${sizeMap[size]} ${colorMap[color]}`} />
      {text && <span className={`text-sm font-medium ${colorMap[color]}`}>{text}</span>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="p-6 rounded-xl bg-white shadow-xl border border-gray-100 flex flex-col items-center gap-3">
          <CgSpinner className={`animate-spin ${sizeMap.xl} text-accent`} />
          {text && <p className="text-secondary font-medium text-sm">{text}</p>}
        </div>
      </div>
    );
  }

  return spinner;
}
