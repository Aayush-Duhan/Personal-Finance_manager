import React, { useState, useEffect, useRef } from 'react';
import { Bars3Icon, UserCircleIcon, XMarkIcon, HomeIcon, DocumentTextIcon, ChartPieIcon, WalletIcon } from '@heroicons/react/24/solid'; // Import icons
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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

  // Handle swipe gestures
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    mobileMenuRef.current.startX = touch.clientX;
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const deltaX = touch.clientX - mobileMenuRef.current.startX;
    if (deltaX > 50) {
      setIsMobileMenuOpen(false); // Swipe right to close menu
    } else if (deltaX < -50) {
      setIsMobileMenuOpen(true); // Swipe left to open menu
    }
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
        closeMobileMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const handleLinkClick = (item) => {
    setActiveItem(item);
    closeMobileMenu(); // Close menu on link click
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-black to-gray-900 p-4 flex items-center justify-between shadow-none relative">
      <div className="md:hidden">
        <Bars3Icon className="text-gray-300 w-6 h-6 cursor-pointer" onClick={toggleMobileMenu} />
      </div>

      <ul className="hidden md:flex space-x-6 text-white">
        <li>
          <Link
            to="/"
            className={`hover:text-gray-300 flex items-center ${activeItem === 'dashboard' ? 'text-blue-400' : ''}`}
            onClick={() => handleLinkClick('dashboard')}
          >
            <HomeIcon className="w-5 h-5 mr-1" aria-hidden="true" />
            <span className="sr-only">Dashboard</span> {/* Screen reader text */}
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/transactions"
            className={`hover:text-gray-300 flex items-center ${activeItem === 'transactions' ? 'text-blue-400' : ''}`}
            onClick={() => handleLinkClick('transactions')}
          >
            <DocumentTextIcon className="w-5 h-5 mr-1" aria-hidden="true" />
            <span className="sr-only">Transactions</span>
            Transactions
          </Link>
        </li>
        <li>
          <Link
            to="/reports"
            className={`hover:text-gray-300 flex items-center ${activeItem === 'reports' ? 'text-blue-400' : ''}`}
            onClick={() => handleLinkClick('reports')}
          >
            <ChartPieIcon className="w-5 h-5 mr-1" aria-hidden="true" />
            <span className="sr-only">Reports</span>
            Reports
          </Link>
        </li>
        <li>
          <Link
            to="/budgeting"
            className={`hover:text-gray-300 flex items-center ${activeItem === 'budgeting' ? 'text-blue-400' : ''}`}
            onClick={() => handleLinkClick('budgeting')}
          >
            <WalletIcon className="w-5 h-5 mr-1" aria-hidden="true" />
            <span className="sr-only">Budgeting</span>
            Budgeting
          </Link>
        </li>
      </ul>

      <h1 className="text-white text-2xl font-semibold font-poppins flex-grow text-center" style={{ userSelect: 'none' }}>
        Personal Finance Manager
      </h1>

      <div className="relative flex items-center space-x-4">
        <div
          className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center cursor-pointer"
          onClick={toggleDropdown}
          ref={dropdownRef}
          tabIndex={0} // Make it focusable
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleDropdown();
            }
          }}
        >
          <UserCircleIcon className="text-gray-300 w-full h-full" />
        </div>

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
                  className="block px-4 py-2 hover:bg-gray-700 flex items-center"
                  onClick={() => handleOptionClick('profile')}
                >
                  <span className="sr-only">Profile</span>
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className="block px-4 py-2 hover:bg-gray-700 flex items-center"
                  onClick={() => handleOptionClick('settings')}
                >
                  <span className="sr-only">Settings</span>
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  to="/logout"
                  className="block px-4 py-2 hover:bg-gray-700 flex items-center"
                  onClick={() => handleOptionClick('logout')}
                >
                  <span className="sr-only">Logout</span>
                  Logout
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </div>

      {isMobileMenuOpen && (
        <motion.div
          ref={mobileMenuRef}
          className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-90 z-40 flex flex-col items-center justify-start pt-16"
          initial={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <div className="flex items-center justify-end w-full pr-4">
            <XMarkIcon className="text-gray-300 w-8 h-8 cursor-pointer" onClick={closeMobileMenu} />
          </div>

          <div className="flex flex-col items-center w-full space-y-4">
            <Link
              to="/"
              className={`text-white text-lg w-full py-4 text-center ${activeItem === 'dashboard' ? 'text-blue-400' : ''}`}
              onClick={() => handleLinkClick('dashboard')}
            >
              <HomeIcon className="w-5 h-5 mr-1" aria-hidden="true" />
              <span className="sr-only">Dashboard</span> {/* Screen reader text */}
              Dashboard
            </Link>
            <Link
              to="/transactions"
              className={`text-white text-lg w-full py-4 text-center ${activeItem === 'transactions' ? 'text-blue-400' : ''}`}
              onClick={() => handleLinkClick('transactions')}
            >
              <DocumentTextIcon className="w-5 h-5 mr-1" aria-hidden="true" />
              <span className="sr-only">Transactions</span>
              Transactions
            </Link>
            <Link
              to="/reports"
              className={`text-white text-lg w-full py-4 text-center ${activeItem === 'reports' ? 'text-blue-400' : ''}`}
              onClick={() => handleLinkClick('reports')}
            >
              <ChartPieIcon className="w-5 h-5 mr-1" aria-hidden="true" />
              <span className="sr-only">Reports</span>
              Reports
            </Link>
            <Link
              to="/budgeting"
              className={`text-white text-lg w-full py-4 text-center ${activeItem === 'budgeting' ? 'text-blue-400' : ''}`}
              onClick={() => handleLinkClick('budgeting')}
            >
              <WalletIcon className="w-5 h-5 mr-1" aria-hidden="true" />
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

