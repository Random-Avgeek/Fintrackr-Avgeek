import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ListPlus, PieChart, Settings } from 'lucide-react';

const Sidebar = () => {
  const navLinks = [
    { to: '/', icon: <Home size={20} />, text: 'Dashboard' },
    { to: '/transactions', icon: <ListPlus size={20} />, text: 'Transactions' },
    { to: '/reports', icon: <PieChart size={20} />, text: 'Reports' },
    { to: '/settings', icon: <Settings size={20} />, text: 'Settings' },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors duration-700">
        <div className="p-4">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
            Main Menu
          </h2>
          <nav className="mt-5 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <span className="mr-3">{link.icon}</span>
                {link.text}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-10 transition-colors duration-700">
        <div className="grid grid-cols-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2 text-xs font-medium transition-colors duration-200 ${
                  isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'
                }`
              }
            >
              <span className="mb-1">{link.icon}</span>
              <span>{link.text}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;