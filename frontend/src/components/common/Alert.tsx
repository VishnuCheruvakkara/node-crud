import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';

interface AlertProps {
  type?: 'error' | 'success' | 'info';
  message: string;
  onClose?: () => void;
  className?: string;
}

const styles = {
  error: {
    container: 'bg-rose-50 border-rose-200 text-rose-700',
    icon: <FiAlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />,
  },
  success: {
    container: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    icon: <FiCheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: <FiInfo className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />,
  },
};

export default function Alert({
  type = 'error',
  message,
  onClose,
  className = '',
}: AlertProps) {
  if (!message) return null;

  const currentStyle = styles[type];

  return (
    <div
      className={`flex items-start gap-3 p-3.5 rounded-lg border text-sm font-medium shadow-sm transition-all ${currentStyle.container} ${className}`}
      role="alert"
    >
      {currentStyle.icon}
      <div className="flex-1">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="text-gray-400 hover:text-gray-600 p-0.5 rounded transition-colors"
          aria-label="Close alert"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
