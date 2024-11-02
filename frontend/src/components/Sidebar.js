import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  CurrencyDollarIcon,
  ChartPieIcon,
  DocumentTextIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/solid';
import { signOut } from '@aws-amplify/auth';

const Sidebar = () => {
  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem('isLoggedIn');
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="fixed bottom-0 md:top-0 md:left-0 md:bottom-auto md:h-full flex md:flex-col justify-between items-center bg-black p-2 md:p-4 pb-5 w-full md:w-20 hover:md:w-56 transition-all duration-300 z-50 ring-1 ring-white group">
      {/* Main Navigation Links */}
      <div className="flex md:flex-col flex-grow justify-between md:justify-start items-center w-full md:w-auto md:space-y-6">
        <div className="flex md:flex-col items-center md:items-start justify-evenly w-full md:w-auto md:space-y-6 md:mt-8">
          <NavLink
            to="/"
            exact="true"
            className={({ isActive }) =>
              `flex items-center hover:bg-slate-800 p-2 rounded-full md:rounded-lg transition-all duration-300 ${
                isActive ? 'bg-slate-900 text-white' : 'text-gray-400'
              }`
            }
          >
            <HomeIcon className="w-6 h-6" />
            <span className="ml-3 hidden md:group-hover:inline-block">Dashboard</span>
          </NavLink>

          <NavLink
            to="/expenses"
            exact="true"
            className={({ isActive }) =>
              `flex items-center hover:bg-slate-800 p-2 rounded-full md:rounded-lg transition-all duration-300 ${
                isActive ? 'bg-slate-900 text-white' : 'text-gray-400'
              }`
            }
          >
            <CurrencyDollarIcon className="w-6 h-6" />
            <span className="ml-3 hidden md:group-hover:inline-block">Expenses</span>
          </NavLink>

          <NavLink
            to="/budgeting"
            exact="true"
            className={({ isActive }) =>
              `flex items-center hover:bg-slate-800 p-2 rounded-full md:rounded-lg transition-all duration-300 ${
                isActive ? 'bg-slate-900 text-white' : 'text-gray-400'
              }`
            }
          >
            <ChartPieIcon className="w-6 h-6" />
            <span className="ml-3 hidden md:group-hover:inline-block">Budgeting</span>
          </NavLink>

          <NavLink
            to="/reports"
            exact="true"
            className={({ isActive }) =>
              `flex items-center hover:bg-slate-800 p-2 rounded-full md:rounded-lg transition-all duration-300 ${
                isActive ? 'bg-slate-900 text-white' : 'text-gray-400'
              }`
            }
          >
            <DocumentTextIcon className="w-6 h-6" />
            <span className="ml-3 hidden md:group-hover:inline-block">Reports</span>
          </NavLink>

          <NavLink
            to="/profile"
            exact="true"
            className={({ isActive }) =>
              `flex items-center hover:bg-slate-800 p-2 rounded-full md:rounded-lg transition-all duration-300 ${
                isActive ? 'bg-slate-900 text-white' : 'text-gray-400'
              }`
            }
          >
            <UserCircleIcon className="w-6 h-6" />
            <span className="ml-3 hidden md:group-hover:inline-block">Profile</span>
          </NavLink>
        </div>
      </div>

      {/* Logout Button */}
      <div className="hidden md:flex md:justify-center md:items-center mb-2 md:mb-4">
        <button
          onClick={handleLogout}
          className="flex items-center p-2 rounded-full md:rounded-lg transition-all duration-300 hover:bg-red-900 hover:text-white"
        >
          <ArrowRightOnRectangleIcon className="w-6 h-6 text-white" />
          <span className="ml-3 text-white hidden md:group-hover:inline-block">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
