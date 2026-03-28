import React, { useState } from 'react';
import ThemeToggle from '../Common/ThemeToggle';
import StateSelector from '../Selectors/StateSelector';
import CitySelector from '../Selectors/CitySelector';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { downloadCSV } from '../../utils/exportUtils';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { fallbackMode, lastUpdated, energyData } = useData();
  const { user, logout } = useAuth();

  return (
    <header className="bg-white dark:bg-darkSecondary border-b border-borderLight dark:border-gray-800 sticky top-0 z-10 transition-colors">
      <div className="px-6 py-4 flex items-center justify-between">
        
        {/* Mobile Logo & Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-textSecondary hover:text-navy dark:hover:text-white"
          >
            Menu
          </button>
          <span className="font-bold text-teal">EcoDash</span>
        </div>

        {/* Global Controls */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex flex-col text-xs text-textSecondary dark:text-gray-400">
            <span>Location Setup</span>
          </div>
          <StateSelector />
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <CitySelector />
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-6">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-xs text-textSecondary dark:text-gray-400">
              Live Data
            </span>
            <span className="text-[10px] text-gray-400">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
          
          <button 
            onClick={() => downloadCSV(energyData)}
            className="hidden lg:block text-xs font-semibold px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-textPrimary dark:text-gray-200 rounded-lg border border-borderLight dark:border-gray-700 transition"
          >
            Download CSV
          </button>

          <ThemeToggle />
          
          <div className="relative">
            <button 
              onClick={() => setProfileOpen(!profileOpen)}
              className="h-8 w-8 rounded-full bg-gradient-to-tr from-teal to-blue flex items-center justify-center text-white text-sm font-bold shadow-sm"
            >
              {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-darkSecondary rounded-md shadow-lg py-1 border border-borderLight dark:border-gray-700 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-borderLight dark:border-gray-700">
                  <p className="text-sm font-medium text-textPrimary dark:text-darkTextPrimary">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-textSecondary dark:text-gray-500 truncate">{user?.email || 'admin@ecodash.com'}</p>
                </div>
                <button 
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
