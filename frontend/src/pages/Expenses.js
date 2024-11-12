import React, { useState, useEffect, useCallback } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import config from '../utils/config';
import { getCurrentUser } from 'aws-amplify/auth';

// Move constants outside component
const API_ENDPOINT = config.apiEndpoint;
const axiosConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
};

const Expenses = () => {
  // Define getCurrentDate function first
  const getCurrentDate = () => {
    // Get current date in IST
    const now = new Date();
    
    // If time is before midnight (00:00), use current date
    // If time is after midnight, use next date
    if (now.getHours() === 0 && now.getMinutes() === 0) {
      // It's exactly midnight, add one day
      now.setDate(now.getDate() + 1);
    }
    
    // Format date to YYYY-MM-DD
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  // Initialize states
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [newTransaction, setNewTransaction] = useState({ 
    name: '', 
    amount: '', 
    date: getCurrentDate(),
    type: 'expense',
    category: 'Other'
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add categories array
  const expenseCategories = [
    'Food & Dining',
    'Transportation',
    'Housing',
    'Utilities',
    'Healthcare',
    'Entertainment',
    'Shopping',
    'Education',
    'Travel',
    'Other'
  ];

  const incomeCategories = [
    'Salary',
    'Freelance',
    'Investments',
    'Rental',
    'Business',
    'Gift',
    'Other'
  ];

  // Wrap fetchTransactions with useCallback
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const userId = await getUserId();
      if (!userId) return;

      const response = await axios.get(API_ENDPOINT, {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': userId
        }
      });

      let transactions = response.data;
      if (typeof transactions === 'string') {
        transactions = JSON.parse(transactions);
      }

      const mappedTransactions = transactions.map(t => ({
        id: t.id,
        name: t.description || t.name,
        amount: t.amount,
        date: t.date,
        type: t.type,
        category: t.category
      }));

      setExpenses(mappedTransactions.filter(t => t.type === 'expense'));
      setIncomes(mappedTransactions.filter(t => t.type === 'income'));
    } catch (error) {
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array is now fine

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Simplified getUserId function without logging
  const getUserId = async () => {
    try {
      const user = await getCurrentUser();
      if (user.userId) {
        return user.userId;
      }
      throw new Error('Could not determine user ID');
    } catch (error) {
      console.error('Error getting user ID:', error);
      setError('Authentication error');
      return null;
    }
  };

  // Update handleAddTransaction to use getCurrentDate
  const handleAddTransaction = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = await getUserId();
      if (!userId) return;

      if (!newTransaction.name || !newTransaction.amount || !newTransaction.date) {
        setError('Please fill in all fields');
        return;
      }

      const transactionData = {
        description: newTransaction.name,
        amount: Number(newTransaction.amount),
        date: newTransaction.date,
        category: newTransaction.category,
        type: newTransaction.type
      };

      const response = await axios.post(API_ENDPOINT, transactionData, {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': userId
        }
      });

      if (response.data) {
        await fetchTransactions();
        setNewTransaction({ 
          name: '', 
          amount: '', 
          date: getCurrentDate(),
          type: 'expense',
          category: 'Other'
        });
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      setError(error.response?.data?.error || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingId(transaction.id);
    setNewTransaction({
      name: transaction.name,
      amount: transaction.amount,
      date: transaction.date,
      type: transaction.type,
      category: transaction.category
    });
  };

  // Update handleSaveEdit to use user ID
  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      const userId = await getUserId();
      if (!userId) return;
      
      const updatedTransaction = {
        description: newTransaction.name,
        amount: Number(newTransaction.amount),
        date: newTransaction.date,
        category: newTransaction.category,
        type: newTransaction.type
      };

      await axios.put(`${API_ENDPOINT}/${editingId}`, updatedTransaction, {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': userId
        }
      });
      
      await fetchTransactions();
      setEditingId(null);
      setNewTransaction({ 
        name: '', 
        amount: '', 
        date: getCurrentDate(), 
        type: 'expense', 
        category: 'Other' 
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      setError('Failed to update transaction');
    } finally {
      setLoading(false);
    }
  };

  // Update handleDeleteTransaction to use user ID
  const handleDeleteTransaction = async (id, type) => {
    try {
      setLoading(true);
      const userId = await getUserId();
      if (!userId) return;

      await axios.delete(`${API_ENDPOINT}/${id}`, {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': userId
        }
      });
      
      await fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      setError('Failed to delete transaction');
    } finally {
      setLoading(false);
    }
  };

  // Rest of your JSX remains the same
  return (
    <div className="bg-black text-white min-h-screen p-6 font-sans">
      {loading && (
        <div className="text-center py-4">
          <p>Loading...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Manage Transactions</h1>
      </header>

      {/* Add New Transaction Form */}
      <section className="bg-gray-900 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Transaction' : 'Add New Transaction'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Name"
            className="p-3 bg-gray-800 text-white rounded-lg"
            value={newTransaction.name}
            onChange={(e) => setNewTransaction({ ...newTransaction, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Amount"
            className="p-3 bg-gray-800 text-white rounded-lg"
            value={newTransaction.amount}
            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
          />
          <input
            type="date"
            className="p-3 bg-gray-800 text-white rounded-lg"
            value={newTransaction.date}
            onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
          />
          <select
            className="p-3 bg-gray-800 text-white rounded-lg"
            value={newTransaction.type}
            onChange={(e) => setNewTransaction({ 
              ...newTransaction, 
              type: e.target.value,
              category: e.target.value === 'expense' ? 'Other' : 'Salary'
            })}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          {/* Add category dropdown - only show for expenses */}
          {newTransaction.type === 'expense' && (
            <select
              className="p-3 bg-gray-800 text-white rounded-lg"
              value={newTransaction.category}
              onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
            >
              {expenseCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          )}
          {newTransaction.type === 'income' && (
            <select
              className="p-3 bg-gray-800 text-white rounded-lg"
              value={newTransaction.category}
              onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
            >
              {incomeCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          )}
        </div>
        <button
          className={`mt-4 ${editingId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'} 
            text-white py-2 px-4 rounded-lg`}
          onClick={editingId ? handleSaveEdit : handleAddTransaction}
          disabled={loading}
        >
          {editingId ? 'Save Changes' : 'Add Transaction'}
        </button>
      </section>

      {/* Expenses List */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Expense History</h2>
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div key={expense.id} className="flex justify-between items-center bg-gray-900 p-4 rounded-lg shadow-md">
              <div className="flex flex-col">
                <span className="font-bold">{expense.name}</span>
                <span className="text-gray-400">${expense.amount}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 text-sm">{expense.date}</span>
                  <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-300">
                    {expense.category || 'Other'}
                  </span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button 
                  className="text-yellow-400 hover:text-yellow-500" 
                  onClick={() => handleEditTransaction(expense)}
                  disabled={loading}
                >
                  <FaEdit />
                </button>
                <button 
                  className="text-red-400 hover:text-red-500" 
                  onClick={() => handleDeleteTransaction(expense.id, 'expense')}
                  disabled={loading}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Incomes List */}
      <section className="mb-4 pb-16 md:pb-4">
        <h2 className="text-xl font-semibold mb-4">Income History</h2>
        <div className="space-y-3">
          {incomes.map((income) => (
            <div key={income.id} className="flex justify-between items-center bg-gray-900 p-4 rounded-lg shadow-md">
              <div className="flex flex-col">
                <span className="font-bold">{income.name}</span>
                <span className="text-gray-400">${income.amount}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 text-sm">{income.date}</span>
                  <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-300">
                    {income.category || 'Other'}
                  </span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button 
                  className="text-yellow-400 hover:text-yellow-500" 
                  onClick={() => handleEditTransaction(income)}
                  disabled={loading}
                >
                  <FaEdit />
                </button>
                <button 
                  className="text-red-400 hover:text-red-500" 
                  onClick={() => handleDeleteTransaction(income.id, 'income')}
                  disabled={loading}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Expenses;
