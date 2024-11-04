import React, { useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';

const Budget = () => {
  const [totalBudget, setTotalBudget] = useState(6000);
  const [spent, setSpent] = useState(3000);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Groceries', limit: 800, spent: 600 },
    { id: 2, name: 'Transport', limit: 300, spent: 200 },
    { id: 3, name: 'Entertainment', limit: 500, spent: 450 },
  ]);

  const addCategory = () => {
    const newCategory = {
      id: Date.now(),
      name: '',
      limit: 0,
      spent: 0,
    };
    setCategories([...categories, newCategory]);
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  return (
    <div className="bg-black text-white min-h-screen p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6">Budgeting Overview</h1>

      {/* Overall Budget Section */}
      <section className="bg-slate-900 p-6 rounded-lg mb-8 shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Total Budget</h2>
        <div className="text-lg mb-2">
          You've spent <span className="font-bold">${spent}</span> out of <span className="font-bold">${totalBudget}</span>.
        </div>
        <div className="bg-gray-700 h-3 rounded-lg overflow-hidden">
          <div className="bg-blue-700 h-full" style={{ width: `${(spent / totalBudget) * 100}%` }}></div>
        </div>
      </section>

      {/* Category Budgets Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Category Budgets</h2>
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-slate-900 p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-1 text-sm">
                <span className="font-semibold">{category.name || 'New Category'}</span>
                <span className="text-gray-400">
                  ${category.spent} of ${category.limit}
                </span>
              </div>
              <div className="bg-gray-700 h-3 rounded-lg overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width: `${(category.spent / category.limit) * 100}%`,
                    backgroundColor: category.spent > category.limit ? '#FF4C4C' : '#10B981',
                  }}
                ></div>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="text-red-400 hover:text-red-500 transition-all duration-200"
                  aria-label="Delete category"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Button to add new category */}
        <button
          onClick={addCategory}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-all duration-300"
        >
          + Add New Category
        </button>
      </section>

      {/* Monthly Spending Analysis */}
      <section className="bg-slate-900 p-6 rounded-lg mb-8 shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Monthly Spending Analysis</h2>
        <div className="text-gray-400 text-sm mb-2">
          Breakdown of monthly expenses across categories.
        </div>
        <div className="h-48 bg-gray-800 rounded-lg flex items-center justify-center">
          {/* Placeholder for Pie Chart */}
          <span className="text-yellow-500 font-bold">[Pie Chart Placeholder]</span>
        </div>
      </section>

      {/* Quick Budget Actions */}
      <footer className="bg-slate-900 p-4 rounded-lg flex justify-between items-center shadow-md">
        <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-300">
          Set Budget
        </button>
      </footer>
    </div>
  );
};

export default Budget;
