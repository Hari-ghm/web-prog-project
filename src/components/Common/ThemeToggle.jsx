import React from 'react';
import { useTheme } from '../../hooks/useTheme';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
      <button 
        onClick={() => toggleTheme('light')}
        className={`px-3 py-1 text-sm rounded-md transition-all ${theme === 'light' ? 'bg-white dark:bg-gray-600 shadow-sm text-navy font-medium' : 'text-gray-500 hover:text-gray-700'}`}
      >
        Light
      </button>
      <button 
        onClick={() => toggleTheme('dark')}
        className={`px-3 py-1 text-sm rounded-md transition-all ${theme === 'dark' ? 'bg-white dark:bg-gray-600 shadow-sm text-navy dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
      >
        Dark
      </button>
    </div>
  );
};

export default ThemeToggle;
