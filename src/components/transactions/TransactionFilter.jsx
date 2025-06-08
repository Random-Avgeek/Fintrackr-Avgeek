import React from 'react';
import { Filter, X } from 'lucide-react';

const TransactionFilter = ({ filter, setFilter, categories }) => {
  const handleClearFilters = () => {
    setFilter({ type: '', category: '' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center transition-colors duration-300">
          <Filter size={16} className="mr-2" /> Filter Transactions
        </h3>
        {(filter.type || filter.category) && (
          <button
            onClick={handleClearFilters}
            className="text-xs text-gray-500 dark:text-gray-400 flex items-center hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <X size={14} className="mr-1" /> Clear Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Transaction Type</label>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter({ ...filter, type: '' })}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${
                filter.type === ''
                  ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter({ ...filter, type: 'credit' })}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${
                filter.type === 'credit'
                  ? 'bg-success-100 dark:bg-success-900/40 text-success-700 dark:text-success-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setFilter({ ...filter, type: 'debit' })}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${
                filter.type === 'debit'
                  ? 'bg-danger-100 dark:bg-danger-900/40 text-danger-700 dark:text-danger-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Expense
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Category</label>
          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            className="block w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-300"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilter;