import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatRupees } from '../../utils/helpers';

const BalanceCard = ({ totalCredit, totalDebit, balance }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-5 transition-colors duration-300">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">Total Income</h3>
          <div className="bg-success-100 dark:bg-success-900/40 p-2 rounded-full transition-colors duration-300">
            <TrendingUp className="h-5 w-5 text-success-600 dark:text-success-400" />
          </div>
        </div>
        <div className="flex items-center text-2xl font-bold text-success-600 dark:text-success-400 transition-colors duration-300">
          {formatRupees(totalCredit)}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-5 transition-colors duration-300">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">Total Expenses</h3>
          <div className="bg-danger-100 dark:bg-danger-900/40 p-2 rounded-full transition-colors duration-300">
            <TrendingDown className="h-5 w-5 text-danger-600 dark:text-danger-400" />
          </div>
        </div>
        <div className="flex items-center text-2xl font-bold text-danger-600 dark:text-danger-400 transition-colors duration-300">
          {formatRupees(totalDebit)}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-5 transition-colors duration-300">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">Current Balance</h3>
          <div className="bg-primary-100 dark:bg-primary-900/40 p-2 rounded-full transition-colors duration-300">
            {/* You can add a rupee icon here if you want */}
            <span className="h-5 w-5 text-primary-600 dark:text-primary-400 text-xl">₹</span>
          </div>
        </div>
        <div className={`flex items-center text-2xl font-bold transition-colors duration-300 ${
          balance >= 0 
            ? 'text-primary-600 dark:text-primary-400' 
            : 'text-danger-600 dark:text-danger-400'
        }`}>
          {formatRupees(balance)}
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;