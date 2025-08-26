import React from 'react';
import { clsx } from 'clsx';

const Input = ({ 
  label,
  error,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className,
  ...props 
}) => {
  const inputClasses = clsx(
    'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    'bg-white text-gray-900 placeholder-gray-500',
    error && 'border-red-500 focus:ring-red-500',
    LeftIcon && 'pl-10',
    RightIcon && 'pr-10',
    className
  );

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LeftIcon size={16} className="text-gray-400" />
          </div>
        )}
        <input className={inputClasses} {...props} />
        {RightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <RightIcon size={16} className="text-gray-400" />
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p className={clsx(
          'text-sm',
          error ? 'text-red-600' : 'text-gray-500'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input; 