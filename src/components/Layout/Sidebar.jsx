import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/energy', label: 'Energy Analysis' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/reports', label: 'Reports' },
    { path: '/alerts', label: 'Alerts' },
    { path: '/settings', label: 'Settings' },
    { path: '/global-weather', label: 'Global Weather' },
    { path: '/admin', label: 'Admin Console' }
  ];

  return (
    <aside className="w-64 border-r border-borderLight dark:border-gray-800 bg-white dark:bg-darkSecondary hidden md:flex flex-col h-full sticky top-0 transition-colors">
      <div className="p-6 border-b border-borderLight dark:border-gray-800">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal to-blue">
          EcoDash
        </h1>
        <p className="text-xs text-textSecondary mt-1">Renewable Energy</p>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              isActive ? 'nav-link-active block' : 'nav-link block'
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-borderLight dark:border-gray-800 text-xs text-center text-textSecondary dark:text-gray-500">
        &copy; 2026 EcoDash Inc.
      </div>
    </aside>
  );
};

export default Sidebar;
