import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const TransactionContext = createContext();

const API_URL = 'https://avgeek-fintrackr-services.onrender.com/api';

const initialState = {
  transactions: [],
  monthlySummary: [],
  yearlySummary: [],
  categoryBreakdown: [],
  budgets: [],
  budgetComparison: [],
  categories: [],
  loading: false,
  error: null,
  totalCredit: 0,
  totalDebit: 0,
  balance: 0,
  pagination: {
    page: 1,
    limit: 50,
    total: 0,
    pages: 0
  }
};

const transactionReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        transactions: action.payload.transactions,
        pagination: action.payload.pagination,
        totalCredit: calculateTotal(action.payload.transactions, 'credit'),
        totalDebit: calculateTotal(action.payload.transactions, 'debit'),
        balance: calculateTotal(action.payload.transactions, 'credit') - calculateTotal(action.payload.transactions, 'debit'),
      };
    case 'FETCH_MONTHLY_SUMMARY_SUCCESS':
      return { ...state, monthlySummary: action.payload };
    case 'FETCH_YEARLY_SUMMARY_SUCCESS':
      return { ...state, yearlySummary: action.payload };
    case 'FETCH_CATEGORY_BREAKDOWN_SUCCESS':
      return { ...state, categoryBreakdown: action.payload };
    case 'FETCH_BUDGETS_SUCCESS':
      return { ...state, budgets: action.payload };
    case 'FETCH_BUDGET_COMPARISON_SUCCESS':
      return { ...state, budgetComparison: action.payload };
    case 'FETCH_CATEGORIES_SUCCESS':
      return { ...state, categories: action.payload };
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
    case 'ADD_BUDGET':
      return { ...state, budgets: [...state.budgets, action.payload] };
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(budget =>
          budget._id === action.payload._id ? action.payload : budget
        )
      };
    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(budget => budget._id !== action.payload)
      };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category =>
          category._id === action.payload._id ? action.payload : category
        )
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category._id !== action.payload)
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
    fetchYearlySummary();
    fetchCategories();
    fetchBudgets();
    fetchBudgetComparison();
  }, []);

  const fetchTransactions = async (params = {}) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await axios.get(`${API_URL}/transactions?${queryParams}`);
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchMonthlySummary = async () => {
    try {
      const response = await axios.get(`${API_URL}/transactions/monthly-summary`);
      dispatch({ type: 'FETCH_MONTHLY_SUMMARY_SUCCESS', payload: response.data });
    } catch (error) {
      console.error('Error fetching monthly summary:', error);
    }
  };

  const fetchYearlySummary = async () => {
    try {
      const response = await axios.get(`${API_URL}/transactions/yearly-summary`);
      dispatch({ type: 'FETCH_YEARLY_SUMMARY_SUCCESS', payload: response.data });
    } catch (error) {
      console.error('Error fetching yearly summary:', error);
    }
  };

  const fetchCategoryBreakdown = async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await axios.get(`${API_URL}/transactions/category-breakdown?${queryParams}`);
      dispatch({ type: 'FETCH_CATEGORY_BREAKDOWN_SUCCESS', payload: response.data });
    } catch (error) {
      console.error('Error fetching category breakdown:', error);
    }
  };

  const fetchBudgets = async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await axios.get(`${API_URL}/budgets?${queryParams}`);
      dispatch({ type: 'FETCH_BUDGETS_SUCCESS', payload: response.data });
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const fetchBudgetComparison = async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await axios.get(`${API_URL}/budgets/comparison?${queryParams}`);
      dispatch({ type: 'FETCH_BUDGET_COMPARISON_SUCCESS', payload: response.data });
    } catch (error) {
      console.error('Error fetching budget comparison:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      dispatch({ type: 'FETCH_CATEGORIES_SUCCESS', payload: response.data });
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Initialize default categories if none exist
      try {
        await axios.post(`${API_URL}/categories/initialize`);
        const response = await axios.get(`${API_URL}/categories`);
        dispatch({ type: 'FETCH_CATEGORIES_SUCCESS', payload: response.data });
      } catch (initError) {
        console.error('Error initializing categories:', initError);
      }
    }
  };

  const addTransaction = async (transaction) => {
    try {
      const response = await axios.post(`${API_URL}/transactions`, transaction);
      dispatch({ type: 'ADD_TRANSACTION', payload: response.data });
      fetchMonthlySummary();
      fetchYearlySummary();
      fetchBudgetComparison();
      return response.data;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const updateTransaction = async (id, transaction) => {
    try {
      const response = await axios.put(`${API_URL}/transactions/${id}`, transaction);
      dispatch({ type: 'UPDATE_TRANSACTION', payload: response.data });
      fetchMonthlySummary();
      fetchYearlySummary();
      fetchBudgetComparison();
      return response.data;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API_URL}/transactions/${id}`);
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
      fetchMonthlySummary();
      fetchYearlySummary();
      fetchBudgetComparison();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };

  const addBudget = async (budget) => {
    try {
      const response = await axios.post(`${API_URL}/budgets`, budget);
      dispatch({ type: 'ADD_BUDGET', payload: response.data });
      fetchBudgetComparison();
      return response.data;
    } catch (error) {
      console.error('Error adding budget:', error);
      throw error;
    }
  };

  const updateBudget = async (id, budget) => {
    try {
      const response = await axios.put(`${API_URL}/budgets/${id}`, budget);
      dispatch({ type: 'UPDATE_BUDGET', payload: response.data });
      fetchBudgetComparison();
      return response.data;
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  };

  const deleteBudget = async (id) => {
    try {
      await axios.delete(`${API_URL}/budgets/${id}`);
      dispatch({ type: 'DELETE_BUDGET', payload: id });
      fetchBudgetComparison();
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  };

  const addCategory = async (category) => {
    try {
      const response = await axios.post(`${API_URL}/categories`, category);
      dispatch({ type: 'ADD_CATEGORY', payload: response.data });
      return response.data;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };

  const updateCategory = async (id, category) => {
    try {
      const response = await axios.put(`${API_URL}/categories/${id}`, category);
      dispatch({ type: 'UPDATE_CATEGORY', payload: response.data });
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${API_URL}/categories/${id}`);
      dispatch({ type: 'DELETE_CATEGORY', payload: id });
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        ...state,
        fetchTransactions,
        fetchMonthlySummary,
        fetchYearlySummary,
        fetchCategoryBreakdown,
        fetchBudgets,
        fetchBudgetComparison,
        fetchCategories,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
        addCategory,
        updateCategory,
        deleteCategory,
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