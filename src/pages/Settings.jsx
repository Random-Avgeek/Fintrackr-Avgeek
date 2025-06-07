import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Appearance</h2>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDarkMode ? (
                <Moon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              ) : (
                <Sun className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              )}
              <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
            </div>
            
            <button
              onClick={toggleDarkMode}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out bg-gray-200 dark:bg-gray-700"
              role="switch"
              aria-checked={isDarkMode}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;