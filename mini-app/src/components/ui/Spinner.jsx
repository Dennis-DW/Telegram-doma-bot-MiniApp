import React from 'react';
import { clsx } from 'clsx';

const Spinner = ({ 
  size = 'medium',
  className,
  ...props 
}) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  const classes = clsx(
    'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
    sizes[size],
    className
  );

  return (
    <div className={classes} {...props} />
  );
};

export default Spinner; 