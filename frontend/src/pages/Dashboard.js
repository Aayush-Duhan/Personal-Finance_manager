import React from 'react';

const Dashboard = () => {
  return (
    <div className="bg-black text-white min-h-screen p-4 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
        <div className="text-2xl font-bold">Finance Manager</div>
        <div className="flex space-x-2">
          <button className="text-gray-300"><i className="fas fa-bell"></i></button>
          <button className="text-gray-300"><i className="fas fa-user-circle"></i></button>
        </div>
      </header>

      {/* Income & Expenses Summary */}
      <section className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-900 p-4 rounded-lg">
          <div className="text-gray-400">Income</div>
          <div className="text-xl font-bold">$5,000</div>
        </div>
        <div className="bg-slate-900 p-4 rounded-lg">
          <div className="text-gray-400">Expenses</div>
          <div className="text-xl font-bold">$3,200</div>
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
        <div className="space-y-2">
          {/* Transaction Item */}
          <div className="flex items-center bg-slate-900 p-3 rounded-lg">
            <div className="text-2xl mr-3">💵</div>
            <div className="flex-1">
              <div className="font-bold">Salary</div>
              <div className="text-sm text-gray-400">Monthly salary from company</div>
            </div>
            <div className="text-sm text-gray-400">10:00 AM</div>
          </div>
          {/* Add more transactions as needed */}
        </div>
      </section>

      {/* Monthly Budget Overview */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Monthly Budget Overview</h2>
        <div className="bg-slate-900 p-4 rounded-lg">
          <div className="flex justify-between mb-1 text-sm">
            <span>$5,000 of $6,000 goal</span>
            <span>25%</span>
          </div>
          <div className="bg-gray-700 h-2 rounded">
            <div className="bg-blue-500 h-2 rounded" style={{ width: '25%' }}></div>
          </div>
        </div>
      </section>

      {/* Financial Goals */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Financial Goals</h2>
        <div className="space-y-2">
          <div className="flex items-center bg-slate-900 p-3 rounded-lg">
            <div className="text-2xl mr-3">🌴</div>
            <div className="flex-1">
              <div className="font-bold">Vacation</div>
              <div className="text-sm text-gray-400">Save for summer vacation</div>
            </div>
          </div>
          <div className="flex items-center bg-slate-900 p-3 rounded-lg">
            <div className="text-2xl mr-3">🏦</div>
            <div className="flex-1">
              <div className="font-bold">Emergency Fund</div>
              <div className="text-sm text-gray-400">Build emergency savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Reports and Insights */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Reports and Insights</h2>
        <div className="bg-slate-900 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2">Expense Distribution</h3>
          <div className="flex justify-center">
            {/* Placeholder for Pie Chart */}
            <div className="text-2xl font-bold text-blue-500">100</div>
          </div>
        </div>
        <div className="bg-slate-900 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Income vs Expenses</h3>
          {/* Placeholder for Line Chart */}
          <div className="h-24 bg-gray-700 rounded"></div>
        </div>
      </section>

      {/* Quick Actions */}
      <footer className="flex justify-between items-center bg-slate-900 p-4 rounded-lg">
        <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg mr-2">+ Income</button>
        <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg">+ Expense</button>
      </footer>
    </div>
  );
};

export default Dashboard;
