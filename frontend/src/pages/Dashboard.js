import React from 'react';
import { FaBell, FaPlusCircle } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <div className="bg-black text-white min-h-screen p-6 font-sans space-y-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Finance Manager</h1>
        <div className="flex items-center space-x-4">
          <FaBell className="text-gray-300 text-xl cursor-pointer" />
        </div>
      </header>

      {/* Income & Expenses Summary */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-gray-400 text-lg mb-2">Income</h2>
          <p className="text-2xl font-bold">$5,000</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-gray-400 text-lg mb-2">Expenses</h2>
          <p className="text-2xl font-bold">$3,200</p>
        </div>
      </section>

      {/* Recent Transactions */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="space-y-3">
          <div className="flex items-center bg-gray-900 p-4 rounded-lg shadow-md">
            <div className="text-2xl mr-3">💵</div>
            <div className="flex-1">
              <h3 className="font-bold">Salary</h3>
              <p className="text-sm text-gray-400">Monthly salary from company</p>
            </div>
            <span className="text-gray-400 text-sm">10:00 AM</span>
          </div>
          {/* Add additional transactions here */}
        </div>
      </section>

      {/* Monthly Budget Overview */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Monthly Budget Overview</h2>
        <div className="bg-gray-900 p-6 rounded-lg shadow-md">
          <div className="flex justify-between text-sm mb-2">
            <span>$5,000 of $6,000 goal</span>
            <span>25%</span>
          </div>
          <div className="bg-gray-700 h-2 rounded">
            <div className="bg-blue-600 h-2 rounded" style={{ width: '25%' }}></div>
          </div>
        </div>
      </section>

      {/* Financial Goals */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Financial Goals</h2>
        <div className="space-y-3">
          <div className="flex items-center bg-gray-900 p-4 rounded-lg shadow-md">
            <div className="text-2xl mr-3">🌴</div>
            <div className="flex-1">
              <h3 className="font-bold">Vacation</h3>
              <p className="text-sm text-gray-400">Save for summer vacation</p>
            </div>
          </div>
          <div className="flex items-center bg-gray-900 p-4 rounded-lg shadow-md">
            <div className="text-2xl mr-3">🏦</div>
            <div className="flex-1">
              <h3 className="font-bold">Emergency Fund</h3>
              <p className="text-sm text-gray-400">Build emergency savings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reports and Insights */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Reports and Insights</h2>
        <div className="bg-gray-900 p-6 rounded-lg shadow-md mb-6">
          <h3 className="font-semibold mb-4">Expense Distribution</h3>
          <div className="h-36 flex justify-center items-center bg-gray-800 rounded-lg">
            {/* Placeholder for Pie Chart */}
            <div className="text-2xl font-bold text-blue-600">Chart</div>
          </div>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg shadow-md">
          <h3 className="font-semibold mb-4">Income vs Expenses</h3>
          <div className="h-36 bg-gray-800 rounded-lg">
            {/* Placeholder for Line Chart */}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <footer className="flex justify-center gap-4">
        <button className="flex items-center justify-center w-full max-w-xs bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg">
          <FaPlusCircle className="mr-2" />
          Add Income
        </button>
        <button className="flex items-center justify-center w-full max-w-xs bg-purple-700 hover:bg-purple-800 text-white py-2 rounded-lg">
          <FaPlusCircle className="mr-2" />
          Add Expense
        </button>
      </footer>
    </div>
  );
};

export default Dashboard;
