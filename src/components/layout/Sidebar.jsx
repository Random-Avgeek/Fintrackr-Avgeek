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
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Main Menu
          </h2>
          <nav className="mt-5 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="grid grid-cols-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2 text-xs font-medium ${
                  isActive ? 'text-primary-600' : 'text-gray-600'
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