import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Moon, Sun } from 'lucide-react';
import { useTransactionContext } from '../../context/TransactionContext';
import { useTheme } from '../../context/ThemeContext';
import RupeeIcon from '../icons/RupeeIcon';

const Header = () => {
  const { totalCredit, totalDebit, balance } = useTransactionContext();
  const { isDarkMode, toggleDarkMode } = useTheme();

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