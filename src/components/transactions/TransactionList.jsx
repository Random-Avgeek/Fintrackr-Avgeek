import React from 'react';
import { Edit2, Trash2, DollarSign } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const TransactionList = ({ transactions, onEdit, onDelete, filter }) => {
  // Filter transactions by type and category if provided
  const filteredTransactions = transactions.filter((transaction) => {
    // Apply type filter
    if (filter.type && transaction.type !== filter.type) {
      return false;
    }
    
    // Apply category filter
    if (filter.category && transaction.category !== filter.category) {
      return false;
    }
    
    return true;
  });

  if (filteredTransactions.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
              Category
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
              Description
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
              Amount
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
          {filteredTransactions.map((transaction) => (
            <tr key={transaction._id} className="transaction-item hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                {formatDate(transaction.timestamp)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-300">
                  {transaction.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                {transaction.description || '—'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`flex items-center text-sm transition-colors duration-300 ${
                  transaction.type === 'credit' 
                    ? 'text-success-600 dark:text-success-400' 
                    : 'text-danger-600 dark:text-danger-400'
                }`}>
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span className="font-medium">
                    {transaction.type === 'credit' ? '+' : '-'}{transaction.amount.toFixed(2)}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(transaction)}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 mr-3 transition-colors duration-200"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(transaction._id)}
                  className="text-danger-600 dark:text-danger-400 hover:text-danger-900 dark:hover:text-danger-300 transition-colors duration-200"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;