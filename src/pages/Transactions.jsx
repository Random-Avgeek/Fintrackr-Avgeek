import React, { useState, useEffect } from 'react';
import { useTransactionContext } from '../context/TransactionContext';
import TransactionList from '../components/transactions/TransactionList';
import TransactionFilter from '../components/transactions/TransactionFilter';
import TransactionModal from '../components/transactions/TransactionModal';
import { PlusCircle } from 'lucide-react';

const Transactions = () => {
  const { 
    transactions, 
    pagination,
    categories,
    addTransaction, 
    updateTransaction, 
    deleteTransaction,
    fetchTransactions
  } = useTransactionContext();

  const [filter, setFilter] = useState({ 
    type: '', 
    category: '', 
    startDate: '', 
    endDate: '',
    sortBy: 'timestamp',
    sortOrder: 'desc'
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  useEffect(() => {
    const params = {};
    Object.keys(filter).forEach(key => {
      if (filter[key]) params[key] = filter[key];
    });
    fetchTransactions(params);
  }, [filter]);

  const handleAddTransaction = async (data) => {
    try {
      await addTransaction(data);
      setIsModalOpen(false);
      // Refresh transactions with current filters
      const params = {};
      Object.keys(filter).forEach(key => {
        if (filter[key]) params[key] = filter[key];
      });
      fetchTransactions(params);
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
      // Refresh transactions with current filters
      const params = {};
      Object.keys(filter).forEach(key => {
        if (filter[key]) params[key] = filter[key];
      });
      fetchTransactions(params);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        // Refresh transactions with current filters
        const params = {};
        Object.keys(filter).forEach(key => {
          if (filter[key]) params[key] = filter[key];
        });
        fetchTransactions(params);
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

  const handleSearch = (searchTerm) => {
    setFilter({ ...filter, search: searchTerm });
  };

  const handlePageChange = (page) => {
    const params = { ...filter, page };
    fetchTransactions(params);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Transactions</h1>
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
        onSearch={handleSearch}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-colors duration-300">
        <TransactionList 
          transactions={transactions}
          pagination={pagination}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          onPageChange={handlePageChange}
        />
      </div>

      <TransactionModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        transaction={currentTransaction}
        categories={categories}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default Transactions;