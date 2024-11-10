import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, } from "react-router-dom";
import Profile from './pages/Profile';
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Budget from "./pages/Budgeting";
import Reports from "./pages/Reports";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import { fetchAuthSession, signOut } from "@aws-amplify/auth";
import { Hub } from "@aws-amplify/core";
import { Amplify } from "aws-amplify";
import awsmobile from "./aws-exports";

Amplify.configure(awsmobile);

function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const session = await fetchAuthSession();
        if (session?.tokens) {
          setIsAuthenticated(true);
          localStorage.setItem('isLoggedIn', 'true');
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('isLoggedIn');
        }
      } catch (error) {
        if (error.name !== 'InvalidIdentityPoolConfigurationException') {
          console.error('Error fetching auth session:', error);
        }
        setIsAuthenticated(false);
        localStorage.removeItem('isLoggedIn');
      }
    };

    const handleAuthEvents = ({ payload: { event } }) => {
      switch (event) {
        case 'signIn':
          checkAuthStatus();
          break;
        case 'signOut':
          setIsAuthenticated(false);
          localStorage.removeItem('isLoggedIn');
          break;
        default:
          break;
      }
    };

    const hubListener = Hub.listen('auth', handleAuthEvents);
    checkAuthStatus();

    return () => {
      if (hubListener) {
        hubListener();
      }
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut({ global: true });
      setIsAuthenticated(false);
      localStorage.removeItem('isLoggedIn');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="app-container">
      {!isAuthenticated && !isAuthPage && <Navigate to="/login" replace />}
      {isAuthenticated && !isAuthPage && <Navbar onLogout={handleLogout} />}
      <div className="flex">
        {isAuthenticated && !isAuthPage && <Sidebar />}
        <div className={`flex-grow ${isAuthPage ? "" : "ml-0 md:ml-20"}`}>
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? 
                <Navigate to="/" replace /> : 
                <Login setIsAuthenticated={setIsAuthenticated} />
              }
            />
            <Route
              path="/signup"
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <Signup />
              }
            />
            <Route
              path="/"
              element={
                isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/transactions"
              element={
                isAuthenticated ? <Expenses /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/budgeting"
              element={
                isAuthenticated ? <Budget /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/reports"
              element={
                isAuthenticated ? <Reports /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/profile"
              element={
                isAuthenticated ? <Profile /> : <Navigate to="/login" replace />
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
