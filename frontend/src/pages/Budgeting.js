import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '@aws-amplify/auth';
import axios from 'axios';
import config from '../utils/config';
import { Bar } from 'react-chartjs-2';
import { formatCurrency, fetchUserPreferences } from '../utils/formatters';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const API_ENDPOINT = config.budgetsEndpoint;
const axiosConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
};

const CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Shopping',
  'Utilities',
  'Healthcare',
  'Education',
  'Housing',
  'Travel',
  'Others'
];

const Budgeting = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newBudget, setNewBudget] = useState({ category: '', amount: '' });
  const [editingBudget, setEditingBudget] = useState(null);

  useEffect(() => {
    const initializeData = async () => {
      const user = await getCurrentUser();
      await fetchUserPreferences(user.userId);
      fetchBudgets();
    };
    initializeData();
  }, []);

  const fetchBudgets = async () => {
    try {
      const user = await getCurrentUser();
      const response = await axios.get(API_ENDPOINT, {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': user.userId
        }
      });

      if (response.data.statusCode === 200) {
        const budgetsData = typeof response.data.body === 'string' 
          ? JSON.parse(response.data.body) 
          : response.data.body;
        setBudgets(budgetsData.budgets || []);
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
      setError('Failed to fetch budgets');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBudget = async () => {
    try {
      if (!newBudget.category || !newBudget.amount) {
        setError('Please fill in all fields');
        return;
      }


      const user = await getCurrentUser();

      const budgetData = {
        category: newBudget.category,
        amount: Number(newBudget.amount)
      };


      const response = await axios.post(
        API_ENDPOINT,
        budgetData,
        {
          ...axiosConfig,
          headers: {
            ...axiosConfig.headers,
            'Authorization': user.userId
          }
        }
      );


      if (response.data.statusCode === 201 || response.data.statusCode === 200) {
        await fetchBudgets();
        setNewBudget({ category: '', amount: '' });
        setError('');
      } else {
        throw new Error('Failed to add budget');
      }
    } catch (error) {
      console.error('Error adding budget:', error);
      console.error('Error details:', error.response?.data);
      setError(error.response?.data?.error || 'Failed to add budget');
    }
  };

  const handleUpdateBudget = async (budget) => {
    try {
      const user = await getCurrentUser();
      const response = await axios.put(
        `${API_ENDPOINT}/${budget.category}`,
        { amount: budget.amount },
        {
          ...axiosConfig,
          headers: {
            ...axiosConfig.headers,
            'Authorization': user.userId
          }
        }
      );

      if (response.data.statusCode === 200) {
        await fetchBudgets();
        setEditingBudget(null);
      }
    } catch (error) {
      console.error('Error updating budget:', error);
      setError('Failed to update budget');
    }
  };

  const handleDeleteBudget = async (category) => {
    try {
      const user = await getCurrentUser();
      const response = await axios.delete(
        `${API_ENDPOINT}/${category}`,
        {
          ...axiosConfig,
          headers: {
            ...axiosConfig.headers,
            'Authorization': user.userId
          }
        }
      );

      if (response.data.statusCode === 200) {
        await fetchBudgets();
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
      setError('Failed to delete budget');
    }
  };

  const getBudgetChartData = () => {
    return {
      labels: budgets.map(b => b.category),
      datasets: [
        {
          label: 'Budget',
          data: budgets.map(b => b.amount),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Spent',
          data: budgets.map(b => b.spent),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen p-6 font-sans mb-16 lg:mb-0">
      <h1 className="text-3xl font-bold mb-8">Budgeting</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Budget Form */}
        <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-indigo-400">Add New Budget</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Category</label>
              <select
                value={newBudget.category}
                onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              >
                <option value="">Select Category</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Amount</label>
              <input
                type="number"
                value={newBudget.amount}
                onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                placeholder="Enter amount"
              />
            </div>
            <button
              onClick={handleAddBudget}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-200"
            >
              Add Budget
            </button>
          </div>
        </div>

        {/* Budget Chart */}
        <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-indigo-400">Budget vs Spending</h2>
          {budgets.length > 0 ? (
            <Bar 
              data={getBudgetChartData()}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                    labels: { color: 'white' }
                  }
                },
                scales: {
                  y: { ticks: { color: 'white' } },
                  x: { ticks: { color: 'white' } }
                }
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <p>No budgets to display</p>
            </div>
          )}
        </div>

        {/* Budget List */}
        <div className="lg:col-span-2 bg-gray-900 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-indigo-400">Your Budgets</h2>
          <div className="space-y-4">
            {budgets.map((budget) => (
              <div 
                key={budget.category}
                className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 lg:p-6 border border-gray-800/50"
              >
                {editingBudget?.category === budget.category ? (
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      value={editingBudget.amount}
                      onChange={(e) => setEditingBudget({ ...editingBudget, amount: e.target.value })}
                      className="flex-1 p-2 bg-gray-700 rounded border border-gray-600"
                    />
                    <button
                      onClick={() => handleUpdateBudget(editingBudget)}
                      className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingBudget(null)}
                      className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-200">{budget.category}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingBudget(budget)}
                          className="p-2 text-gray-400 hover:text-indigo-400 transition-colors"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBudget(budget.category)}
                          className="p-2 text-gray-400 hover:text-rose-400 transition-colors"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Budget Info Grid - Optimized for mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Budget Amount */}
                      <div className="bg-gray-800/50 p-3 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Budget</p>
                        <p className="text-lg font-semibold text-indigo-400">
                          {formatCurrency(budget.amount)}
                        </p>
                      </div>

                      {/* Spent Amount */}
                      <div className="bg-gray-800/50 p-3 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Spent</p>
                        <p className="text-lg font-semibold text-rose-400">
                          {formatCurrency(budget.spent)}
                        </p>
                      </div>

                      {/* Remaining Amount */}
                      <div className="bg-gray-800/50 p-3 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Remaining</p>
                        <p className={`text-lg font-semibold ${
                          budget.remaining > 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {formatCurrency(budget.remaining)}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar - Full width on mobile */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Progress</span>
                        <span className="text-sm text-gray-400">
                          {budget.progress.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            budget.progress > 100 ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(budget.progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default Budgeting;
