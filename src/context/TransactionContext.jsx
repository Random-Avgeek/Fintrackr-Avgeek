import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const TransactionContext = createContext();

const API_URL = 'http://127.0.0.1:5000/api/transactions';

const initialState = {
  transactions: [],
  monthlySummary: [],
  loading: false,
  error: null,
  totalCredit: 0,
  totalDebit: 0,
  balance: 0,
  categories: ['Food', 'Travel', 'Billing', 'Shopping', 'Entertainment', 'Others'],
};

const transactionReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        transactions: action.payload,
        totalCredit: calculateTotal(action.payload, 'credit'),
        totalDebit: calculateTotal(action.payload, 'debit'),
        balance: calculateTotal(action.payload, 'credit') - calculateTotal(action.payload, 'debit'),
      };
    case 'FETCH_MONTHLY_SUMMARY_SUCCESS':
      return {
        ...state,
        monthlySummary: action.payload,
      };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_TRANSACTION':
      const newTransactions = [...state.transactions, action.payload];
      return {
        ...state,
        transactions: newTransactions,
        totalCredit: calculateTotal(newTransactions, 'credit'),
        totalDebit: calculateTotal(newTransactions, 'debit'),
        balance: calculateTotal(newTransactions, 'credit') - calculateTotal(newTransactions, 'debit'),
      };
    case 'UPDATE_TRANSACTION':
      const updatedTransactions = state.transactions.map((transaction) =>
        transaction._id === action.payload._id ? action.payload : transaction
      );
      return {
        ...state,
        transactions: updatedTransactions,
        totalCredit: calculateTotal(updatedTransactions, 'credit'),
        totalDebit: calculateTotal(updatedTransactions, 'debit'),
        balance: calculateTotal(updatedTransactions, 'credit') - calculateTotal(updatedTransactions, 'debit'),
      };
    case 'DELETE_TRANSACTION':
      const filteredTransactions = state.transactions.filter(
        (transaction) => transaction._id !== action.payload
      );
      return {
        ...state,
        transactions: filteredTransactions,
        totalCredit: calculateTotal(filteredTransactions, 'credit'),
        totalDebit: calculateTotal(filteredTransactions, 'debit'),
        balance: calculateTotal(filteredTransactions, 'credit') - calculateTotal(filteredTransactions, 'debit'),
      };
    default:
      return state;
  }
};

const calculateTotal = (transactions, type) => {
  return transactions
    .filter((transaction) => transaction.type === type)
    .reduce((acc, transaction) => acc + transaction.amount, 0);
};

export const TransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  useEffect(() => {
    fetchTransactions();
    fetchMonthlySummary();
  }, []);

  const fetchTransactions = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const response = await axios.get(API_URL);
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchMonthlySummary = async () => {
    try {
      const response = await axios.get(`${API_URL}/monthly-summary`);
      dispatch({ type: 'FETCH_MONTHLY_SUMMARY_SUCCESS', payload: response.data });
    } catch (error) {
      console.error('Error fetching monthly summary:', error);
    }
  };

  const addTransaction = async (transaction) => {
    try {
      const response = await axios.post(API_URL, transaction);
      dispatch({ type: 'ADD_TRANSACTION', payload: response.data });
      fetchMonthlySummary(); // Refresh monthly summary after adding a transaction
      return response.data;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const updateTransaction = async (id, transaction) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, transaction);
      dispatch({ type: 'UPDATE_TRANSACTION', payload: response.data });
      fetchMonthlySummary(); // Refresh monthly summary after updating a transaction
      return response.data;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
      fetchMonthlySummary(); // Refresh monthly summary after deleting a transaction
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        ...state,
        fetchTransactions,
        fetchMonthlySummary,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionContext = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactionContext must be used within a TransactionProvider');
  }
  return context;
};