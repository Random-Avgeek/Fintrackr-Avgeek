import React from 'react';
import { Filter, X } from 'lucide-react';

const TransactionFilter = ({ filter, setFilter, categories }) => {
  const handleClearFilters = () => {
    setFilter({ type: '', category: '' });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700 flex items-center">
          <Filter size={16} className="mr-2" /> Filter Transactions
        </h3>
        {(filter.type || filter.category) && (
          <button
            onClick={handleClearFilters}
            className="text-xs text-gray-500 flex items-center hover:text-gray-700"
          >
            <X size={14} className="mr-1" /> Clear Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Transaction Type</label>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter({ ...filter, type: '' })}
              className={`px-3 py-1 rounded-md text-xs font-medium ${
                filter.type === ''
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter({ ...filter, type: 'credit' })}
              className={`px-3 py-1 rounded-md text-xs font-medium ${
                filter.type === 'credit'
                  ? 'bg-success-100 text-success-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setFilter({ ...filter, type: 'debit' })}
              className={`px-3 py-1 rounded-md text-xs font-medium ${
                filter.type === 'debit'
                  ? 'bg-danger-100 text-danger-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Expense
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            className="block w-full px-3 py-1.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
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