import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

export default function InputField({
  label,
  icon,
  error,
  id,
  className = '',
  ...props
}: InputFieldProps) {
  const inputId = id || props.name || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="block text-sm font-semibold text-secondary mb-1.5"
      >
        {label}
      </label>

      <div className="relative rounded-lg shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}

        <input
          id={inputId}
          className={`w-full py-2.5 rounded-lg border text-sm transition-all focus:outline-none ${
            icon ? 'pl-10 pr-4' : 'px-4'
          } ${
            error
              ? 'border-rose-300 text-rose-900 focus:ring-2 focus:ring-rose-400 focus:border-rose-400'
              : 'border-gray-300 text-gray-900 focus:ring-2 focus:ring-accent focus:border-accent'
          } ${className}`}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-1 text-xs text-rose-600 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
