import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, CurrencyDollarIcon, ChartPieIcon, DocumentTextIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';

const Sidebar = () => {
  return (
    <div className="fixed bottom-0 md:top-0 md:left-0 md:bottom-auto md:h-full flex md:flex-col justify-between items-center bg-black p-2 md:p-4 w-full md:w-20 hover:md:w-56 transition-all duration-300 z-50 ring-1 ring-white group">
      {/* Flex container for navigation items */}
      <div className="flex md:flex-col flex-grow justify-between md:justify-start items-center w-full md:w-auto md:space-y-6">
        {/* Upper Section for Main Links */}
        <div className="flex md:flex-col items-center md:items-start justify-evenly w-full md:w-auto md:space-y-6 md:mt-8">
          <Link to="/" className="flex items-center hover:bg-slate-800 p-2 rounded-full md:rounded-lg transition-all duration-300">
            <HomeIcon className="w-6 h-6 text-white" />
            <span className="ml-3 text-white hidden md:group-hover:inline-block">Dashboard</span>
          </Link>

          <Link to="/expenses" className="flex items-center hover:bg-slate-800 p-2 rounded-full md:rounded-lg transition-all duration-300">
            <CurrencyDollarIcon className="w-6 h-6 text-white" />
            <span className="ml-3 text-white hidden md:group-hover:inline-block">Expenses</span>
          </Link>

          <Link to="/budgeting" className="flex items-center hover:bg-slate-800 p-2 rounded-full md:rounded-lg transition-all duration-300">
            <ChartPieIcon className="w-6 h-6 text-white" />
            <span className="ml-3 text-white hidden md:group-hover:inline-block">Budgeting</span>
          </Link>

          <Link to="/reports" className="flex items-center hover:bg-slate-800 p-2 rounded-full md:rounded-lg transition-all duration-300">
            <DocumentTextIcon className="w-6 h-6 text-white" />
            <span className="ml-3 text-white hidden md:group-hover:inline-block">Reports</span>
          </Link>

          {/* Profile Link Moved Here */}
          <Link to="/profile" className="flex items-center hover:bg-slate-800 p-2 rounded-full md:rounded-lg transition-all duration-300">
            <UserCircleIcon className="w-6 h-6 text-white" />
            <span className="ml-3 text-white hidden md:group-hover:inline-block">Profile</span>
          </Link>
        </div>
      </div>

      {/* Logout Button (only visible on desktop) */}
      <div className="hidden md:flex md:justify-center md:items-center mb-2 md:mb-4">
        <Link
          to="/logout"
          className="flex items-center p-2 rounded-full md:rounded-lg transition-all duration-300 hover:bg-red-900 hover:text-white"
        >
          <ArrowRightOnRectangleIcon className="w-6 h-6 text-white" />
          <span className="ml-3 text-white hidden md:group-hover:inline-block">Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
