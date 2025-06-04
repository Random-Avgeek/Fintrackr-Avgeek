import React from 'react';
import { Edit2, Trash2, DollarSign } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const TransactionList = ({ transactions, onEdit, onDelete, filter }) => {
  // Filter transactions by type and category if provided
  const filteredTransactions = transactions.filter((transaction) => {
    // Apply type filter
    if (filter.type && transaction.type !== filter.type) {
      return false;
    }
    
    // Apply category filter
    if (filter.category && transaction.category !== filter.category) {
      return false;
    }
    
    return true;
  });

  if (filteredTransactions.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredTransactions.map((transaction) => (
            <tr key={transaction._id} className="transaction-item hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(transaction.timestamp)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                  {transaction.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {transaction.description || '—'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`flex items-center text-sm ${
                  transaction.type === 'credit' ? 'text-success-600' : 'text-danger-600'
                }`}>
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span className="font-medium">
                    {transaction.type === 'credit' ? '+' : '-'}{transaction.amount.toFixed(2)}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(transaction)}
                  className="text-primary-600 hover:text-primary-900 mr-3"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(transaction._id)}
                  className="text-danger-600 hover:text-danger-900"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;