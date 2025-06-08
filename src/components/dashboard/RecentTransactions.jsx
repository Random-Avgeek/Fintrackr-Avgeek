import React from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const RecentTransactions = ({ transactions }) => {
  // Show only the 5 most recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-5 transition-colors duration-300">
      <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">Recent Transactions</h3>
      
      {recentTransactions.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div 
              key={transaction._id} 
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-3 transition-colors duration-300 ${
                  transaction.type === 'credit' 
                    ? 'bg-success-100 dark:bg-success-900/40 text-success-600 dark:text-success-400' 
                    : 'bg-danger-100 dark:bg-danger-900/40 text-danger-600 dark:text-danger-400'
                }`}>
                  {transaction.type === 'credit' 
                    ? <ArrowUpRight size={16} /> 
                    : <ArrowDownRight size={16} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 transition-colors duration-300">
                    {transaction.category}
                    {transaction.description && ` - ${transaction.description}`}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">{formatDate(transaction.timestamp)}</p>
                </div>
              </div>
              <div className={`flex items-center transition-colors duration-300 ${
                transaction.type === 'credit' 
                  ? 'text-success-600 dark:text-success-400' 
                  : 'text-danger-600 dark:text-danger-400'
              }`}>
                <DollarSign size={14} className="mr-0.5" />
                <span className="font-medium">
                  {transaction.type === 'credit' ? '+' : '-'}{transaction.amount.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;