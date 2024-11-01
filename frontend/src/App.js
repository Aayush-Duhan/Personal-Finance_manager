import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Budget from './pages/Budgeting';
import Reports from './pages/Reports';
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';

function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check local storage for login status
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    setIsAuthenticated(loggedInStatus === 'true');
  }, []);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="app-container">
      {/* Redirect to login if not authenticated */}
      {!isAuthenticated && !isAuthPage && <Navigate to="/login" replace />}

      {/* Show Navbar and Sidebar only if authenticated */}
      {isAuthenticated && !isAuthPage && <Navbar />}
      <div className="flex">
        {isAuthenticated && !isAuthPage && <Sidebar />}
        <div className={`flex-grow ${isAuthPage ? '' : 'ml-0 md:ml-20'}`}>
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <Login />
              }
            />
            <Route
              path="/signup"
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <Signup />
              }
            />
            <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
            <Route path="/expenses" element={isAuthenticated ? <Expenses /> : <Navigate to="/login" replace />} />
            <Route path="/budgeting" element={isAuthenticated ? <Budget /> : <Navigate to="/login" replace />} />
            <Route path="/reports" element={isAuthenticated ? <Reports /> : <Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

// Wrap App with Router in the main index file if not done already
export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
