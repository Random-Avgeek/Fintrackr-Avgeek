import React, { useState } from 'react';
import { useTransactionContext } from '../context/TransactionContext';
import TransactionList from '../components/transactions/TransactionList';
import TransactionFilter from '../components/transactions/TransactionFilter';
import TransactionModal from '../components/transactions/TransactionModal';
import { PlusCircle } from 'lucide-react';

const Transactions = () => {
  const { 
    transactions, 
    categories,
    addTransaction, 
    updateTransaction, 
    deleteTransaction 
  } = useTransactionContext();

  const [filter, setFilter] = useState({ type: '', category: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  const handleAddTransaction = async (data) => {
    try {
      await addTransaction(data);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleEditTransaction = (transaction) => {
    setCurrentTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleUpdateTransaction = async (data) => {
    try {
      await updateTransaction(currentTransaction._id, data);
      setIsModalOpen(false);
      setCurrentTransaction(null);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const handleModalSubmit = (data) => {
    if (currentTransaction) {
      handleUpdateTransaction(data);
    } else {
      handleAddTransaction(data);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentTransaction(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <button 
          className="btn btn-primary flex items-center"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircle size={18} className="mr-1" />
          Add Transaction
        </button>
      </div>

      <TransactionFilter 
        filter={filter}
        setFilter={setFilter}
        categories={categories}
      />

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <TransactionList 
          transactions={transactions}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          filter={filter}
        />
      </div>

      <TransactionModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        transaction={currentTransaction}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default Transactions;