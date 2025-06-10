import React, { useState } from 'react';
import { useTransactionContext } from '../context/TransactionContext';
import BalanceCard from '../components/dashboard/BalanceCard';
import CategoryChart from '../components/dashboard/CategoryChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import { PlusCircle, Tag } from 'lucide-react';
import TransactionModal from '../components/transactions/TransactionModal';
import CategoryModal from '../components/categories/CategoryModal';

const Dashboard = () => {
  const { 
    transactions, 
    totalCredit, 
    totalDebit, 
    balance,
    categories,
    addTransaction,
    addCategory
  } = useTransactionContext();

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const handleAddTransaction = async (data) => {
    try {
      await addTransaction(data);
      setIsTransactionModalOpen(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleAddCategory = async (data) => {
    try {
      await addCategory(data);
      setIsCategoryModalOpen(false);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Dashboard</h1>
        <div className="flex space-x-3">
          <button 
            className="btn btn-secondary flex items-center"
            onClick={() => setIsCategoryModalOpen(true)}
          >
            <Tag size={18} className="mr-1" />
            Add Category
          </button>
          <button 
            className="btn btn-primary flex items-center"
            onClick={() => setIsTransactionModalOpen(true)}
          >
            <PlusCircle size={18} className="mr-1" />
            Add Transaction
          </button>
        </div>
      </div>

      <BalanceCard 
        totalCredit={totalCredit} 
        totalDebit={totalDebit} 
        balance={balance} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryChart transactions={transactions} />
        <RecentTransactions transactions={transactions} />
      </div>

      <TransactionModal 
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        categories={categories}
        onSubmit={handleAddTransaction}
      />

      <CategoryModal 
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleAddCategory}
      />
    </div>
  );
};

export default Dashboard;