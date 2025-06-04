import React from 'react';
import { X } from 'lucide-react';
import TransactionForm from './TransactionForm';

const TransactionModal = ({ isOpen, onClose, transaction, onSubmit }) => {
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
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="modal-content bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {transaction ? 'Edit Transaction' : 'Add New Transaction'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            <TransactionForm
              transaction={transaction}
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