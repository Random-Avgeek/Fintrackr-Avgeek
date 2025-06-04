import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, DollarSign } from 'lucide-react';
import { useTransactionContext } from '../../context/TransactionContext';

const Header = () => {
  const { totalCredit, totalDebit, balance } = useTransactionContext();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BarChart3 className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">FinTrackr</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="px-3 py-1 rounded-md bg-success-50 text-success-700 flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              <span className="font-medium">Income: ${totalCredit.toFixed(2)}</span>
            </div>
            <div className="px-3 py-1 rounded-md bg-danger-50 text-danger-700 flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              <span className="font-medium">Expense: ${totalDebit.toFixed(2)}</span>
            </div>
            <div className="px-3 py-1 rounded-md bg-primary-50 text-primary-700 flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              <span className="font-medium">Balance: ${balance.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile summary bar */}
      <div className="md:hidden flex justify-between px-4 py-2 bg-gray-50 text-sm">
        <div className="text-success-700">
          <span className="font-medium">Income: ${totalCredit.toFixed(2)}</span>
        </div>
        <div className="text-danger-700">
          <span className="font-medium">Expense: ${totalDebit.toFixed(2)}</span>
        </div>
        <div className="text-primary-700">
          <span className="font-medium">Balance: ${balance.toFixed(2)}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;