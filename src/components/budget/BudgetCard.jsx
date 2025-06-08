import React from 'react';
import { Edit2, Trash2, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const getStatusIcon = () => {
    switch (budget.status) {
      case 'over':
        return <AlertTriangle className="h-5 w-5 text-danger-600 dark:text-danger-400" />;
      case 'warning':
        return <TrendingUp className="h-5 w-5 text-warning-600 dark:text-warning-400" />;
      default:
        return <CheckCircle className="h-5 w-5 text-success-600 dark:text-success-400" />;
    }
  };

  const getStatusColor = () => {
    switch (budget.status) {
      case 'over':
        return 'text-danger-600 dark:text-danger-400';
      case 'warning':
        return 'text-warning-600 dark:text-warning-400';
      default:
        return 'text-success-600 dark:text-success-400';
    }
  };

  const getProgressBarColor = () => {
    switch (budget.status) {
      case 'over':
        return 'bg-danger-500';
      case 'warning':
        return 'bg-warning-500';
      default:
        return 'bg-success-500';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-5 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {getStatusIcon()}
          <h3 className="ml-2 text-lg font-medium text-gray-900 dark:text-white">
            {budget.category}
          </h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 transition-colors duration-200"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={onDelete}
            className="text-danger-600 dark:text-danger-400 hover:text-danger-900 dark:hover:text-danger-300 transition-colors duration-200"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Budgeted:</span>
          <span className="font-medium text-gray-900 dark:text-white">${budget.budgeted.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Spent:</span>
          <span className={`font-medium ${getStatusColor()}`}>${budget.actual.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Remaining:</span>
          <span className={`font-medium ${budget.remaining >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
            ${budget.remaining.toFixed(2)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Progress</span>
            <span>{budget.percentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor()}`}
              style={{ width: `${Math.min(budget.percentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {budget.status === 'over' && (
          <div className="mt-3 p-2 bg-danger-50 dark:bg-danger-900/20 rounded-md">
            <p className="text-xs text-danger-700 dark:text-danger-400">
              Over budget by ${(budget.actual - budget.budgeted).toFixed(2)}
            </p>
          </div>
        )}

        {budget.status === 'warning' && (
          <div className="mt-3 p-2 bg-warning-50 dark:bg-warning-900/20 rounded-md">
            <p className="text-xs text-warning-700 dark:text-warning-400">
              Approaching budget limit
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetCard;