import React from 'react';
import { X } from 'lucide-react';
import TransactionForm from './TransactionForm';

const TransactionModal = ({ isOpen, onClose, transaction, categories, onSubmit }) => {
  if (!isOpen) return null;

  const handleSubmit = (data) => {
    onSubmit(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity duration-300"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full duration-300">
          <div className="modal-content bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 transition-colors duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">
                {transaction ? 'Edit Transaction' : 'Add New Transaction'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="bg-white dark:bg-gray-800 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>
            <TransactionForm
              transaction={transaction}
              categories={categories}
              onSubmit={handleSubmit}
              onCancel={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;