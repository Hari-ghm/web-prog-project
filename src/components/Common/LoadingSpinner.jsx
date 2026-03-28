import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-full w-full p-8">
      <div className="animate-pulse-slow font-medium text-teal dark:text-teal">
        Loading...
      </div>
    </div>
  );
};

export default LoadingSpinner;
