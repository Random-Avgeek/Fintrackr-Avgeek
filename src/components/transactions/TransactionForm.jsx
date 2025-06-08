import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const TransactionForm = ({ transaction, categories, onSubmit, onCancel }) => {
  const initialFormData = {
    type: 'debit',
    amount: '',
    category: '',
    description: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        category: transaction.category,
        description: transaction.description || '',
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear validation error when user corrects the field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        amount: Number(formData.amount),
      });
    }
  };

  // Filter categories based on transaction type
  const availableCategories = categories.filter(cat => 
    cat.type === 'both' || 
    (formData.type === 'credit' && (cat.type === 'income' || cat.type === 'both')) ||
    (formData.type === 'debit' && (cat.type === 'expense' || cat.type === 'both'))
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-group">
        <label className="label">Transaction Type</label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="credit"
              checked={formData.type === 'credit'}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">Income</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="debit"
              checked={formData.type === 'debit'}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">Expense</span>
          </label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="amount" className="label">
          Amount ($)
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          min="0"
          step="0.01"
          className={`input ${errors.amount ? 'border-danger-500 focus:ring-danger-500' : ''}`}
        />
        {errors.amount && (
          <p className="mt-1 text-xs text-danger-600 dark:text-danger-400 transition-colors duration-300">{errors.amount}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="category" className="label">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`input ${errors.category ? 'border-danger-500 focus:ring-danger-500' : ''}`}
        >
          <option value="">Select a category</option>
          {availableCategories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-xs text-danger-600 dark:text-danger-400 transition-colors duration-300">{errors.category}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description" className="label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add details about this transaction"
          rows="3"
          className="input"
        ></textarea>
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary flex items-center"
        >
          <X size={16} className="mr-1" />
          Cancel
        </button>
        <button type="submit" className="btn btn-primary flex items-center">
          <Check size={16} className="mr-1" />
          {transaction ? 'Update' : 'Add'} Transaction
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;