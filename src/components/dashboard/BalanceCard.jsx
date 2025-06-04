import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const BalanceCard = ({ totalCredit, totalDebit, balance }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-card p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
          <div className="bg-success-100 p-2 rounded-full">
            <TrendingUp className="h-5 w-5 text-success-600" />
          </div>
        </div>
        <div className="flex items-center text-2xl font-bold text-success-600">
          <DollarSign className="h-6 w-6 mr-1" />
          {totalCredit.toFixed(2)}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-card p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
          <div className="bg-danger-100 p-2 rounded-full">
            <TrendingDown className="h-5 w-5 text-danger-600" />
          </div>
        </div>
        <div className="flex items-center text-2xl font-bold text-danger-600">
          <DollarSign className="h-6 w-6 mr-1" />
          {totalDebit.toFixed(2)}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-card p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">Current Balance</h3>
          <div className="bg-primary-100 p-2 rounded-full">
            <DollarSign className="h-5 w-5 text-primary-600" />
          </div>
        </div>
        <div className={`flex items-center text-2xl font-bold ${balance >= 0 ? 'text-primary-600' : 'text-danger-600'}`}>
          <DollarSign className="h-6 w-6 mr-1" />
          {balance.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;