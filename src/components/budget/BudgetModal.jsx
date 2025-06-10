import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const BudgetModal = ({ isOpen, onClose, budget, categories, onSubmit }) => {
  const initialFormData = {
    category: '',
    amount: '',
    period: 'monthly',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.category,
        amount: budget.amount.toString(),
        period: budget.period,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [budget]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
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

  const expenseCategories = categories.filter(cat => cat.type === 'expense' || cat.type === 'both');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity duration-300"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full duration-300">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 transition-colors duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">
                {budget ? 'Edit Budget' : 'Add New Budget'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="bg-white dark:bg-gray-800 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  disabled={!!budget}
                >
                  <option value="">Select a category</option>
                  {expenseCategories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-xs text-danger-600 dark:text-danger-400">{errors.category}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="amount" className="label">
                  Budget Amount (₹)
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
                  <p className="mt-1 text-xs text-danger-600 dark:text-danger-400">{errors.amount}</p>
                )}
              </div>

              <div className="form-group">
                <label className="label">Budget Period</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="period"
                      value="monthly"
                      checked={formData.period === 'monthly'}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Monthly</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="period"
                      value="yearly"
                      checked={formData.period === 'yearly'}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Yearly</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary flex items-center"
                >
                  <X size={16} className="mr-1" />
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary flex items-center">
                  <Check size={16} className="mr-1" />
                  {budget ? 'Update' : 'Add'} Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetModal;