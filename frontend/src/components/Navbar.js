import React, { useState, useEffect, useRef } from 'react';
import { Bars3Icon, UserCircleIcon, XMarkIcon, HomeIcon, DocumentTextIcon, ChartPieIcon, WalletIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const dropdownRef = useRef(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (item) => {
    setActiveItem(item);
    setIsDropdownOpen(false);
  };

  const handleLinkClick = (item) => {
    setActiveItem(item);
    closeMobileMenu();
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-black to-gray-900 p-4 flex items-center justify-between shadow-none relative">
      {/* Left side - Hamburger Icon (visible only on mobile) */}
      <div className="md:hidden">
        <Bars3Icon className="text-gray-300 w-6 h-6 cursor-pointer" onClick={toggleMobileMenu} />
      </div>

      {/* Left side - Desktop Navigation */}
      <ul className="hidden md:flex space-x-6 text-white">
        <li>
          <Link
            to="/"
            className={`hover:text-gray-300 ${activeItem === 'dashboard' ? 'text-blue-400' : ''}`}
            onClick={() => { setActiveItem('dashboard'); closeMobileMenu(); }}
          >
            <HomeIcon className="w-5 h-5 inline-block mr-1" aria-hidden="true" />
            <span className="sr-only">Dashboard</span>
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/transactions"
            className={`hover:text-gray-300 ${activeItem === 'transactions' ? 'text-blue-400' : ''}`}
            onClick={() => { setActiveItem('transactions'); closeMobileMenu(); }}
          >
            <DocumentTextIcon className="w-5 h-5 inline-block mr-1" aria-hidden="true" />
            <span className="sr-only">Transactions</span>
            Transactions
          </Link>
        </li>
        <li>
          <Link
            to="/reports"
            className={`hover:text-gray-300 ${activeItem === 'reports' ? 'text-blue-400' : ''}`}
            onClick={() => { setActiveItem('reports'); closeMobileMenu(); }}
          >
            <ChartPieIcon className="w-5 h-5 inline-block mr-1" aria-hidden="true" />
            <span className="sr-only">Reports</span>
            Reports
          </Link>
        </li>
        <li>
          <Link
            to="/budgeting"
            className={`hover:text-gray-300 ${activeItem === 'budgeting' ? 'text-blue-400' : ''}`}
            onClick={() => { setActiveItem('budgeting'); closeMobileMenu(); }}
          >
            <WalletIcon className="w-5 h-5 inline-block mr-1" aria-hidden="true" />
            <span className="sr-only">Budgeting</span>
            Budgeting
          </Link>
        </li>
      </ul>

      {/* Center - Title */}
      <h1 className="text-white text-2xl font-semibold font-poppins flex-grow text-center" style={{ userSelect: 'none' }}>
        Personal Finance Manager
      </h1>

      {/* Right side - Profile Icon */}
      <div className="relative flex items-center space-x-4">
        <div
          className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center cursor-pointer"
          onClick={toggleDropdown}
          ref={dropdownRef}
        >
          <UserCircleIcon className="text-gray-300 w-full h-full" />
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <motion.div
            className="absolute w-48 bg-black text-white rounded-md shadow-lg z-50"
            style={{ top: 'calc(100% + 5px)', right: '0' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="py-2">
              <li>
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-700"
                  onClick={() => handleOptionClick('profile')}
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className="block px-4 py-2 hover:bg-gray-700"
                  onClick={() => handleOptionClick('settings')}
                >
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  to="/logout"
                  className="block px-4 py-2 hover:bg-gray-700"
                  onClick={() => handleOptionClick('logout')}
                >
                  Logout
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </div>

      {/* Mobile Menu Dropdown (visible on mobile when menu is open) */}
      {isMobileMenuOpen && (
        <motion.div
          className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-90 z-40 flex flex-col items-center justify-start pt-16"
          initial={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {/* Close Button at the Top */}
          <div className="flex items-center justify-end w-full pr-4">
            <XMarkIcon className="text-gray-300 w-8 h-8 cursor-pointer" onClick={closeMobileMenu} />
          </div>

          {/* Menu Items - Vertically Centered and Spacious */}
          <div className="flex flex-col items-center w-full space-y-4">
            <Link
              to="/"
              className={`text-white text-lg w-full py-4 text-center ${activeItem === 'dashboard' ? 'bg-blue-600' : ''}`}
              onClick={() => handleLinkClick('dashboard')}
            >
              <HomeIcon className="w-5 h-5 inline-block mr-1" aria-hidden="true" />
              <span className="sr-only">Dashboard</span>
              Dashboard
            </Link>
            <Link
              to="/transactions"
              className={`text-white text-lg w-full py-4 text-center ${activeItem === 'transactions' ? 'bg-blue-600' : ''}`}
              onClick={() => handleLinkClick('transactions')}
            >
              <DocumentTextIcon className="w-5 h-5 inline-block mr-1" aria-hidden="true" />
              <span className="sr-only">Transactions</span>
              Transactions
            </Link>
            <Link
              to="/reports"
              className={`text-white text-lg w-full py-4 text-center ${activeItem === 'reports' ? 'bg-blue-600' : ''}`}
              onClick={() => handleLinkClick('reports')}
            >
              <ChartPieIcon className="w-5 h-5 inline-block mr-1" aria-hidden="true" />
              <span className="sr-only">Reports</span>
              Reports
            </Link>
            <Link
              to="/budgeting"
              className={`text-white text-lg w-full py-4 text-center ${activeItem === 'budgeting' ? 'bg-blue-600' : ''}`}
              onClick={() => handleLinkClick('budgeting')}
            >
              <WalletIcon className="w-5 h-5 inline-block mr-1" aria-hidden="true" />
              <span className="sr-only">Budgeting</span>
              Budgeting
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
