import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar'; // Import Sidebar component
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Budget from './pages/Budgeting';
import Reports from './pages/Reports';
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';

function App() {
  return (
    <Router>
      {/* Navbar at the top */}
      <Navbar />

      <div className="flex">
        {/* Sidebar positioned on the left on desktop, bottom on mobile */}
        <Sidebar />

        {/* Main content area with adjusted spacing */}
        <div className="flex-grow ml-0 md:ml-20 bg-black min-h-screen p-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/budgeting" element={<Budget />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
