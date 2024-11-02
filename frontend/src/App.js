import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Profile from './pages/Profile';
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Budget from "./pages/Budgeting";
import Reports from "./pages/Reports";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import { fetchAuthSession } from "@aws-amplify/auth";
import { Amplify } from "aws-amplify";
import amplifyConfig from "./aws-exports";

Amplify.configure(amplifyConfig);

function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      // Check local storage first
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      if (loggedIn) {
        // If the user is logged in, check the session
        try {
          const session = await fetchAuthSession();
          if (session) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem('isLoggedIn'); // Clear local storage if session is invalid
          }
        } catch (error) {
          console.error('Error fetching auth session:', error);
          setIsAuthenticated(false);
          localStorage.removeItem('isLoggedIn'); // Clear local storage on error
        }
      } else {
        setIsAuthenticated(false);
      }
    };
    
    checkAuthStatus();
  }, []);
  

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="app-container">
      {!isAuthenticated && !isAuthPage && <Navigate to="/login" replace />}
      {isAuthenticated && !isAuthPage && <Navbar />}
      <div className="flex">
        {isAuthenticated && !isAuthPage && <Sidebar />}
        <div className={`flex-grow ${isAuthPage ? "" : "ml-0 md:ml-20"}`}>
          <Routes>
          <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login setIsAuthenticated={setIsAuthenticated} />
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
                isAuthenticated ? (
                  <Dashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/expenses"
              element={
                isAuthenticated ? (
                  <Expenses />
                ) : (
                  <Navigate to="/login" replace />
                )
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
