/**
 * Format a date string or timestamp to a human-readable format
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

/**
 * Group transactions by category and calculate totals
 * @param {Array} transactions - Array of transaction objects
 * @param {string} type - Transaction type ('credit' or 'debit')
 * @returns {Object} - Object with categories as keys and totals as values
 */
export const getCategoryTotals = (transactions, type) => {
  const filteredTransactions = transactions.filter(t => t.type === type);
  
  return filteredTransactions.reduce((acc, transaction) => {
    const { category, amount } = transaction;
    
    if (!acc[category]) {
      acc[category] = 0;
    }
    
    acc[category] += amount;
    return acc;
  }, {});
};

/**
 * Format a number as Indian Rupees currency
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format amount with Rupee symbol (₹)
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted amount with ₹ symbol
 */
export const formatRupees = (amount) => {
  return `₹${new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
};

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for performance optimization
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Memoization function for expensive calculations
 * @param {Function} fn - Function to memoize
 * @returns {Function} - Memoized function
 */
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};