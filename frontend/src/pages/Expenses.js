import React, { useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';

const Expenses = () => {
  // States for expenses and incomes
  const [expenses, setExpenses] = useState([
    { id: 1, name: 'Groceries', amount: 120, date: '2024-10-01' },
    { id: 2, name: 'Electricity Bill', amount: 80, date: '2024-10-02' },
  ]);

  const [incomes, setIncomes] = useState([
    { id: 1, name: 'Salary', amount: 2000, date: '2024-10-01' },
  ]);

  const [newTransaction, setNewTransaction] = useState({ name: '', amount: '', date: '', type: 'expense' });
  const [editingId, setEditingId] = useState(null);

  // Helper functions for both expenses and incomes
  const handleAddTransaction = () => {
    if (!newTransaction.name || !newTransaction.amount || !newTransaction.date) return;
    const updatedList = [
      ...newTransaction.type === 'expense' ? expenses : incomes,
      { ...newTransaction, id: Date.now() }
    ];
    newTransaction.type === 'expense' ? setExpenses(updatedList) : setIncomes(updatedList);
    setNewTransaction({ name: '', amount: '', date: '', type: 'expense' });
  };

  const handleEditTransaction = (transaction, type) => {
    setNewTransaction({ ...transaction, type });
    setEditingId(transaction.id);
  };

  const handleSaveEdit = () => {
    const updateList = (list) =>
      list.map((transaction) => (transaction.id === editingId ? newTransaction : transaction));
    newTransaction.type === 'expense' ? setExpenses(updateList(expenses)) : setIncomes(updateList(incomes));
    setEditingId(null);
    setNewTransaction({ name: '', amount: '', date: '', type: 'expense' });
  };

  const handleDeleteTransaction = (id, type) => {
    const updatedList = (type === 'expense' ? expenses : incomes).filter((item) => item.id !== id);
    type === 'expense' ? setExpenses(updatedList) : setIncomes(updatedList);
  };

  return (
    <div className="bg-black text-white min-h-screen p-6 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Manage Transactions</h1>
      </header>

      {/* Add New Transaction */}
      <section className="bg-gray-900 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <button
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
          onClick={editingId ? handleSaveEdit : handleAddTransaction}
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
                <span className="text-gray-500 text-sm">{expense.date}</span>
              </div>
              <div className="flex space-x-3">
                <button className="text-yellow-400 hover:text-yellow-500" onClick={() => handleEditTransaction(expense, 'expense')}>
                  <FaEdit />
                </button>
                <button className="text-red-400 hover:text-red-500" onClick={() => handleDeleteTransaction(expense.id, 'expense')}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Incomes List */}
      <section className=" mb-4 pb-16 md:pb-4">
        <h2 className="text-xl font-semibold mb-4">Income History</h2>
        <div className="space-y-3">
          {incomes.map((income) => (
            <div key={income.id} className="flex justify-between items-center bg-gray-900 p-4 rounded-lg shadow-md">
              <div className="flex flex-col">
                <span className="font-bold">{income.name}</span>
                <span className="text-gray-400">${income.amount}</span>
                <span className="text-gray-500 text-sm">{income.date}</span>
              </div>
              <div className="flex space-x-3">
                <button className="text-yellow-400 hover:text-yellow-500" onClick={() => handleEditTransaction(income, 'income')}>
                  <FaEdit />
                </button>
                <button className="text-red-400 hover:text-red-500" onClick={() => handleDeleteTransaction(income.id, 'income')}>
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
