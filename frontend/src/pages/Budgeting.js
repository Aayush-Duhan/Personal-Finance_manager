import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '@aws-amplify/auth';
import axios from 'axios';
import config from '../utils/config';
import { Bar } from 'react-chartjs-2';
import { formatCurrency, fetchUserPreferences } from '../utils/formatters';

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

const ProgressRing = ({ progress, size = 60 }) => {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  const color = progress > 100 ? '#EF4444' : '#10B981';

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        className="text-gray-700"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className="transition-all duration-500 ease-in-out"
        strokeWidth={strokeWidth}
        stroke={color}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
      <text
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
        className="text-sm font-medium"
        fill="white"
        transform={`rotate(90 ${size / 2} ${size / 2})`}
      >
        {Math.min(Math.round(progress), 100)}%
      </text>
    </svg>
  );
};

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
                className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-colors duration-200"
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
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{budget.category}</h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingBudget(budget)}
                            className="p-2 text-blue-500 hover:text-blue-400 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this budget?')) {
                                handleDeleteBudget(budget.category);
                              }
                            }}
                            className="p-2 text-red-500 hover:text-red-400 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-900 p-3 rounded-lg">
                          <p className="text-sm text-gray-400">Budget</p>
                          <p className="text-2xl font-bold text-indigo-400">
                            {formatCurrency(budget.amount)}
                          </p>
                        </div>
                        <div className="bg-gray-900 p-3 rounded-lg">
                          <p className="text-sm text-gray-400">Spent</p>
                          <p className="text-lg font-medium text-rose-400">
                            {formatCurrency(budget.spent)}
                          </p>
                        </div>
                        <div className="bg-gray-900 p-3 rounded-lg">
                          <p className="text-sm text-gray-400">Remaining</p>
                          <p className={`text-lg font-semibold ${
                            budget.remaining > 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {formatCurrency(budget.remaining)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <ProgressRing progress={budget.progress} />
                        <div className="flex-1">
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${
                                budget.progress > 100 ? 'bg-red-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(budget.progress, 100)}%` }}
                            />
                          </div>
                        </div>
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
