import React from 'react';
import { useTransactionContext } from '../context/TransactionContext';
import BalanceCard from '../components/dashboard/BalanceCard';
import CategoryChart from '../components/dashboard/CategoryChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import { PlusCircle } from 'lucide-react';
import TransactionModal from '../components/transactions/TransactionModal';

const Dashboard = () => {
  const { 
    transactions, 
    totalCredit, 
    totalDebit, 
    balance,
    addTransaction
  } = useTransactionContext();

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleAddTransaction = async (data) => {
    try {
      await addTransaction(data);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Dashboard</h1>
        <button 
          className="btn btn-primary flex items-center"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircle size={18} className="mr-1" />
          Add Transaction
        </button>
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTransaction}
      />
    </div>
  );
};

export default Dashboard;