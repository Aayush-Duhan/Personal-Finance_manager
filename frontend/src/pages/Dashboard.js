import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '@aws-amplify/auth';
import axios from 'axios';
import config from '../utils/config';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { formatCurrency, fetchUserPreferences } from '../utils/formatters';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const API_ENDPOINT = config.dashboardEndpoint;
const axiosConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    summary: {
      monthlyIncome: 0,
      monthlyExpenses: 0,
      netSavings: 0,
      savingsRate: 0
    },
    categoryTotals: {},
    budgetProgress: [],
    yearlyTrends: {},
    recentTransactions: []
  });

  // Add state for selected month
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format

  // Add state for user's currency
  const [userCurrency, setUserCurrency] = useState('USD');

  useEffect(() => {
    fetchUserProfile();
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      
      const response = await axios.get(API_ENDPOINT, {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': user.userId
        }
      });

      if (response.data.statusCode === 200) {
        const data = typeof response.data.body === 'string' 
          ? JSON.parse(response.data.body) 
          : response.data.body;
        
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Add function to fetch user profile
  const fetchUserProfile = async () => {
    try {
      const user = await getCurrentUser();
      const response = await axios.get(
        `${config.apiEndpoint.replace('/transactions', '')}/profile`,
        {
          ...axiosConfig,
          headers: {
            ...axiosConfig.headers,
            'Authorization': user.userId
          }
        }
      );

      if (response.data.statusCode === 200) {
        const profileData = typeof response.data.body === 'string' 
          ? JSON.parse(response.data.body) 
          : response.data.body;
        
        setUserCurrency(profileData.currency || 'USD');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Add formatCurrency helper function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: userCurrency
    }).format(amount);
  };

  // Chart data functions using dashboardData
  const getMonthlyTrendData = () => {
    // Filter transactions for selected month
    const monthlyTransactions = dashboardData.recentTransactions.filter(t => 
      t.date.startsWith(selectedMonth)
    );

    // Get all days in the selected month
    const daysInMonth = new Date(selectedMonth.slice(0, 4), selectedMonth.slice(5, 7), 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Initialize daily totals
    const dailyTotals = days.reduce((acc, day) => {
      const dayStr = `${selectedMonth}-${String(day).padStart(2, '0')}`;
      acc[dayStr] = { income: 0, expenses: 0 };
      return acc;
    }, {});

    // Calculate daily totals
    monthlyTransactions.forEach(t => {
      if (t.type === 'income') {
        dailyTotals[t.date].income += Number(t.amount);
      } else {
        dailyTotals[t.date].expenses += Number(t.amount);
      }
    });

    const sortedDays = Object.keys(dailyTotals).sort();

    return {
      labels: sortedDays.map(date => new Date(date).getDate()), // Show only day number
      datasets: [
        {
          label: 'Income',
          data: sortedDays.map(date => dailyTotals[date].income),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4
        },
        {
          label: 'Expenses',
          data: sortedDays.map(date => dailyTotals[date].expenses),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.4
        }
      ]
    };
  };

  const getIncomeCategoryData = () => {
    return {
      labels: Object.keys(dashboardData.categoryTotals?.income || {}),
      datasets: [{
        data: Object.values(dashboardData.categoryTotals?.income || {}),
        backgroundColor: [
          'rgba(52, 211, 153, 0.6)',  // Emerald
          'rgba(14, 165, 233, 0.6)',  // Sky
          'rgba(99, 102, 241, 0.6)',  // Indigo
          'rgba(139, 92, 246, 0.6)',  // Purple
          'rgba(59, 130, 246, 0.6)',  // Blue
          'rgba(16, 185, 129, 0.6)'   // Green
        ]
      }]
    };
  };

  const getExpenseCategoryData = () => {
    return {
      labels: Object.keys(dashboardData.categoryTotals?.expense || {}),
      datasets: [{
        data: Object.values(dashboardData.categoryTotals?.expense || {}),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)'
        ]
      }]
    };
  };

  const getBudgetProgressData = () => {
    return {
      labels: dashboardData.budgetProgress.map(b => b.category),
      datasets: [
        {
          label: 'Budget',
          data: dashboardData.budgetProgress.map(b => b.budget),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Spent',
          data: dashboardData.budgetProgress.map(b => b.spent),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  return (
    <div className="bg-black text-white min-h-screen p-6 font-sans mb-16 lg:mb-0">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-white">
            Financial Overview
          </h1>
          <div className="text-sm text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Monthly Income */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-5 border border-gray-800/50 h-[140px] hover:border-gray-700/50 transition-colors">
            <div className="flex flex-col justify-between h-full">
              <h3 className="text-sm font-medium text-gray-400">Monthly Income</h3>
              <p className="text-2xl font-semibold text-emerald-400">
                {formatCurrency(dashboardData.summary.monthlyIncome)}
              </p>
            </div>
          </div>

          {/* Monthly Expenses */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-5 border border-gray-800/50 h-[140px] hover:border-gray-700/50 transition-colors">
            <div className="flex flex-col justify-between h-full">
              <h3 className="text-sm font-medium text-gray-400">Monthly Expenses</h3>
              <p className="text-2xl font-semibold text-rose-400">
                {formatCurrency(dashboardData.summary.monthlyExpenses)}
              </p>
            </div>
          </div>

          {/* Net Savings */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-5 border border-gray-800/50 h-[140px] hover:border-gray-700/50 transition-colors">
            <div className="flex flex-col justify-between h-full">
              <h3 className="text-sm font-medium text-gray-400">Net Savings</h3>
              <p className={`text-2xl font-semibold ${
                dashboardData.summary.netSavings >= 0 ? 'text-sky-400' : 'text-rose-400'
              }`}>
                {formatCurrency(Math.abs(dashboardData.summary.netSavings))}
              </p>
            </div>
          </div>

          {/* Savings Rate */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-5 border border-gray-800/50 h-[140px] hover:border-gray-700/50 transition-colors">
            <div className="flex flex-col justify-between h-full">
              <h3 className="text-sm font-medium text-gray-400">Savings Rate</h3>
              <p className="text-2xl font-semibold text-indigo-400">
                {dashboardData.summary.savingsRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trend */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800/50 h-[400px]">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 lg:gap-0">
              <h2 className="text-lg font-medium text-gray-200">Daily Trend</h2>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full lg:w-auto bg-gray-800 text-gray-200 px-3 py-1 rounded-lg border border-gray-700 focus:outline-none focus:border-gray-600"
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const date = new Date();
                  date.setMonth(date.getMonth() - i);
                  const monthStr = date.toISOString().slice(0, 7);
                  return (
                    <option key={monthStr} value={monthStr}>
                      {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="h-[250px] lg:h-[calc(100%-4rem)]">
              <Line 
                data={getMonthlyTrendData()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: window.innerWidth < 1024 ? 'bottom' : 'top',
                      labels: { color: 'rgb(156, 163, 175)' }
                    },
                    tooltip: {
                      callbacks: {
                        title: (context) => {
                          const dayNum = context[0].label;
                          const date = new Date(`${selectedMonth}-${dayNum.padStart(2, '0')}`);
                          return date.toLocaleDateString('default', { 
                            month: 'long', 
                            day: 'numeric',
                            year: 'numeric'
                          });
                        }
                      }
                    }
                  },
                  scales: {
                    y: { 
                      ticks: { color: 'rgb(156, 163, 175)' },
                      grid: { color: 'rgba(31, 41, 55, 0.5)' }
                    },
                    x: { 
                      ticks: { color: 'rgb(156, 163, 175)' },
                      grid: { color: 'rgba(31, 41, 55, 0.5)' }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800/50 h-[700px] lg:h-[400px]">
            <h2 className="text-lg font-medium text-gray-200 mb-6">Income & Expense Categories</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Income Categories */}
              <div className="flex flex-col h-[280px] lg:h-[280px]">
                <h3 className="text-sm font-medium text-gray-400 mb-2 text-center">Income Sources</h3>
                <div className="flex-1 relative">
                  <Doughnut 
                    data={getIncomeCategoryData()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: { 
                            color: 'rgb(156, 163, 175)',
                            boxWidth: 12,
                            padding: 10,
                            font: {
                              size: 11
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Expense Categories */}
              <div className="flex flex-col h-[280px] lg:h-[280px]">
                <h3 className="text-sm font-medium text-gray-400 mb-2 text-center">Expense Categories</h3>
                <div className="flex-1 relative">
                  <Doughnut 
                    data={getExpenseCategoryData()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: { 
                            color: 'rgb(156, 163, 175)',
                            boxWidth: 12,
                            padding: 10,
                            font: {
                              size: 11
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Budget Progress */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800/50 h-[400px]">
            <h2 className="text-lg font-medium text-gray-200 mb-6">Budget Progress</h2>
            <div className="h-[250px] lg:h-[calc(100%-4rem)]">
              <Bar 
                data={getBudgetProgressData()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: window.innerWidth < 1024 ? 'bottom' : 'top',
                      labels: { color: 'rgb(156, 163, 175)' }
                    }
                  },
                  scales: {
                    y: { 
                      ticks: { color: 'rgb(156, 163, 175)' },
                      grid: { color: 'rgba(31, 41, 55, 0.5)' }
                    },
                    x: { 
                      ticks: { color: 'rgb(156, 163, 175)' },
                      grid: { color: 'rgba(31, 41, 55, 0.5)' }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800/50 h-[400px]">
            <h2 className="text-lg font-medium text-gray-200 mb-6">Recent Transactions</h2>
            <div className="space-y-3 h-[250px] lg:h-[320px] overflow-y-auto scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-gray-700">
              {dashboardData.recentTransactions.map((transaction, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-800/50"
                >
                  <div>
                    <p className="font-medium text-gray-200">{transaction.description}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">{transaction.category}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-sm text-gray-400">{new Date(transaction.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className={`font-medium ${
                    transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Number(transaction.amount))}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="fixed bottom-4 right-4 bg-rose-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg shadow-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
