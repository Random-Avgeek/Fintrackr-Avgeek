import React, { useState } from 'react';
import { Filter, X, Search, Calendar } from 'lucide-react';

const TransactionFilter = ({ filter, setFilter, categories, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleClearFilters = () => {
    setFilter({ 
      type: '', 
      category: '', 
      startDate: '', 
      endDate: '',
      sortBy: 'timestamp',
      sortOrder: 'desc'
    });
    setSearchTerm('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center transition-colors duration-300">
          <Filter size={16} className="mr-2" /> Filter & Search Transactions
        </h3>
        {(filter.type || filter.category || filter.startDate || filter.endDate || searchTerm) && (
          <button
            onClick={handleClearFilters}
            className="text-xs text-gray-500 dark:text-gray-400 flex items-center hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <X size={14} className="mr-1" /> Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search */}
        <div className="lg:col-span-3">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
            Search
          </label>
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by category or description..."
                className="input pl-10"
              />
            </div>
            <button
              type="submit"
              className="ml-2 btn btn-primary"
            >
              Search
            </button>
          </form>
        </div>

        {/* Transaction Type */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
            Transaction Type
          </label>
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

        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
            Category
          </label>
          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            className="input"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
            Sort By
          </label>
          <div className="flex space-x-2">
            <select
              value={filter.sortBy}
              onChange={(e) => setFilter({ ...filter, sortBy: e.target.value })}
              className="input flex-1"
            >
              <option value="timestamp">Date</option>
              <option value="amount">Amount</option>
              <option value="category">Category</option>
            </select>
            <select
              value={filter.sortOrder}
              onChange={(e) => setFilter({ ...filter, sortOrder: e.target.value })}
              className="input w-20"
            >
              <option value="desc">↓</option>
              <option value="asc">↑</option>
            </select>
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
            Start Date
          </label>
          <input
            type="date"
            value={filter.startDate}
            onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
            className="input"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
            End Date
          </label>
          <input
            type="date"
            value={filter.endDate}
            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
            className="input"
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionFilter;