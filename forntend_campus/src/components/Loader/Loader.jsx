import React from 'react';

const Loader = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-12 w-12 border-4',
    large: 'h-16 w-16 border-4'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full border-indigo-500/20 border-t-indigo-600 ${sizeClasses[size]}`} />
    </div>
  );
};

export default Loader;
