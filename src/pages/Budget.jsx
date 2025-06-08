import React, { useState, useEffect } from 'react';
import { useTransactionContext } from '../context/TransactionContext';
import { PlusCircle, Target, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import BudgetModal from '../components/budget/BudgetModal';
import BudgetCard from '../components/budget/BudgetCard';
import BudgetChart from '../components/budget/BudgetChart';

const Budget = () => {
  const { 
    budgets, 
    budgetComparison, 
    categories,
    addBudget, 
    updateBudget, 
    deleteBudget,
    fetchBudgetComparison 
  } = useTransactionContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });

  useEffect(() => {
    fetchBudgetComparison(selectedPeriod);
  }, [selectedPeriod]);

  const handleAddBudget = async (data) => {
    try {
      await addBudget({ ...data, ...selectedPeriod });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };

  const handleEditBudget = (budget) => {
    setCurrentBudget(budget);
    setIsModalOpen(true);
  };

  const handleUpdateBudget = async (data) => {
    try {
      await updateBudget(currentBudget._id, { ...data, ...selectedPeriod });
      setIsModalOpen(false);
      setCurrentBudget(null);
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  const handleDeleteBudget = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await deleteBudget(id);
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    }
  };

  const handleModalSubmit = (data) => {
    if (currentBudget) {
      handleUpdateBudget(data);
    } else {
      handleAddBudget(data);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentBudget(null);
  };

  const totalBudgeted = budgetComparison.reduce((sum, item) => sum + item.budgeted, 0);
  const totalSpent = budgetComparison.reduce((sum, item) => sum + item.actual, 0);
  const totalRemaining = totalBudgeted - totalSpent;
  const overBudgetCount = budgetComparison.filter(item => item.status === 'over').length;
  const warningCount = budgetComparison.filter(item => item.status === 'warning').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Budget Management</h1>
        <button 
          className="btn btn-primary flex items-center"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircle size={18} className="mr-1" />
          Add Budget
        </button>
      </div>

      {/* Period Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 transition-colors duration-300">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
            <select
              value={selectedPeriod.year}
              onChange={(e) => setSelectedPeriod({ ...selectedPeriod, year: parseInt(e.target.value) })}
              className="input w-24"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Month</label>
            <select
              value={selectedPeriod.month}
              onChange={(e) => setSelectedPeriod({ ...selectedPeriod, month: parseInt(e.target.value) })}
              className="input w-32"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>
                  {new Date(2024, month - 1).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-5 transition-colors duration-300">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Budgeted</h3>
            <Target className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            ${totalBudgeted.toFixed(2)}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-5 transition-colors duration-300">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent</h3>
            <TrendingUp className="h-5 w-5 text-danger-600 dark:text-danger-400" />
          </div>
          <div className="text-2xl font-bold text-danger-600 dark:text-danger-400">
            ${totalSpent.toFixed(2)}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-5 transition-colors duration-300">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Remaining</h3>
            <CheckCircle className={`h-5 w-5 ${totalRemaining >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`} />
          </div>
          <div className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
            ${totalRemaining.toFixed(2)}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card p-5 transition-colors duration-300">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Alerts</h3>
            <AlertTriangle className="h-5 w-5 text-warning-600 dark:text-warning-400" />
          </div>
          <div className="text-2xl font-bold text-warning-600 dark:text-warning-400">
            {overBudgetCount + warningCount}
          </div>
        </div>
      </div>

      {/* Budget Chart */}
      {budgetComparison.length > 0 && (
        <div className="mb-6">
          <BudgetChart data={budgetComparison} />
        </div>
      )}

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgetComparison.map((budget) => (
          <BudgetCard
            key={budget.category}
            budget={budget}
            onEdit={() => handleEditBudget(budgets.find(b => b.category === budget.category))}
            onDelete={() => handleDeleteBudget(budgets.find(b => b.category === budget.category)?._id)}
          />
        ))}
      </div>

      {budgetComparison.length === 0 && (
        <div className="text-center py-10">
          <Target className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No budgets set</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Start by creating your first budget to track your spending goals.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            Create Budget
          </button>
        </div>
      )}

      <BudgetModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        budget={currentBudget}
        categories={categories}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default Budget;