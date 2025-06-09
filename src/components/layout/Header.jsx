import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, Moon, Sun, LogOut, User } from 'lucide-react';
import { useTransactionContext } from '../../context/TransactionContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import RupeeIcon from '../icons/RupeeIcon';

const Header = () => {
  const { totalCredit, totalDebit, balance } = useTransactionContext();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-gradient-vibrant-light dark:bg-gradient-vibrant-dark bg-[length:300%_300%] animate-gradient-shift border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10 backdrop-blur-md transition-all duration-1000 ease-smooth shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center transition-all duration-500 hover:scale-105 group">
              <BarChart3 className="h-8 w-8 text-primary-600 dark:text-primary-400 transition-all duration-500 group-hover:rotate-12 group-hover:text-primary-500 dark:group-hover:text-primary-300" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white transition-all duration-500 group-hover:text-primary-600 dark:group-hover:text-primary-400">FinTrackr</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300 hover:scale-105"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>
            
            <div className="hidden md:flex items-center space-x-4">
              <div className="px-4 py-2 rounded-xl bg-success-50/90 dark:bg-success-900/40 text-success-700 dark:text-success-300 flex items-center backdrop-blur-sm transition-all duration-600 hover:scale-105 hover:shadow-glow-success border border-success-200/50 dark:border-success-700/50">
                <RupeeIcon size={16} className="mr-2 animate-pulse-gentle" />
                <span className="font-semibold">Income: ₹{totalCredit.toFixed(2)}</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-danger-50/90 dark:bg-danger-900/40 text-danger-700 dark:text-danger-300 flex items-center backdrop-blur-sm transition-all duration-600 hover:scale-105 hover:shadow-glow-danger border border-danger-200/50 dark:border-danger-700/50">
                <RupeeIcon size={16} className="mr-2 animate-pulse-gentle" />
                <span className="font-semibold">Expense: ₹{totalDebit.toFixed(2)}</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-primary-50/90 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 flex items-center backdrop-blur-sm transition-all duration-600 hover:scale-105 hover:shadow-glow-primary border border-primary-200/50 dark:border-primary-700/50">
                <RupeeIcon size={16} className="mr-2 animate-pulse-gentle" />
                <span className="font-semibold">Balance: ₹{balance.toFixed(2)}</span>
              </div>
            </div>

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-lg bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300">
                <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.firstName}
                </span>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    {user?.email}
                  </div>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-danger-600 dark:text-danger-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile summary bar */}
      <div className="md:hidden flex justify-between px-4 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md text-sm transition-all duration-800 border-t border-gray-200/30 dark:border-gray-700/30">
        <div className="text-success-700 dark:text-success-300 transition-all duration-600 hover:scale-105">
          <span className="font-semibold">Income: ₹{totalCredit.toFixed(2)}</span>
        </div>
        <div className="text-danger-700 dark:text-danger-300 transition-all duration-600 hover:scale-105">
          <span className="font-semibold">Expense: ₹{totalDebit.toFixed(2)}</span>
        </div>
        <div className="text-primary-700 dark:text-primary-300 transition-all duration-600 hover:scale-105">
          <span className="font-semibold">Balance: ₹{balance.toFixed(2)}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;