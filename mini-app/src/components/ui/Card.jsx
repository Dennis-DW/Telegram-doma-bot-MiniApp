import React from 'react';
import { clsx } from 'clsx';

const Card = ({ 
  children, 
  className,
  padding = 'default',
  hover = false,
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    small: 'p-3',
    default: 'p-4',
    large: 'p-6'
  };

  const classes = clsx(
    'bg-white border border-gray-200 rounded-lg shadow-sm',
    paddingClasses[padding],
    hover && 'transition-all duration-200 hover:shadow-md hover:border-gray-300',
    className
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card; 