import React from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const RecentTransactions = ({ transactions }) => {
  // Show only the 5 most recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-card p-5">
      <h3 className="text-base font-medium text-gray-700 mb-4">Recent Transactions</h3>
      
      {recentTransactions.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm">No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div 
              key={transaction._id} 
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-3 ${
                  transaction.type === 'credit' 
                    ? 'bg-success-100 text-success-600' 
                    : 'bg-danger-100 text-danger-600'
                }`}>
                  {transaction.type === 'credit' 
                    ? <ArrowUpRight size={16} /> 
                    : <ArrowDownRight size={16} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {transaction.category}
                    {transaction.description && ` - ${transaction.description}`}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(transaction.timestamp)}</p>
                </div>
              </div>
              <div className={`flex items-center ${
                transaction.type === 'credit' ? 'text-success-600' : 'text-danger-600'
              }`}>
                <DollarSign size={14} className="mr-0.5" />
                <span className="font-medium">
                  {transaction.type === 'credit' ? '+' : '-'}{transaction.amount.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;