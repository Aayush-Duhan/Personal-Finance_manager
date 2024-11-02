import React, { useState, useEffect } from 'react';
import { signOut, fetchUserAttributes } from '@aws-amplify/auth'; 
import { ArrowRightOnRectangleIcon, UserCircleIcon, EnvelopeIcon, PencilIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';

const Profile = () => {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const attributes = await fetchUserAttributes();
        const emailAttr = attributes.email;
        setEmail(emailAttr);
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };
    fetchUserEmail();
  }, []);

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
    <div className="flex flex-col items-center py-8 px-4 sm:px-6 md:px-12 pb-24 md:pb-8 bg-black min-h-[calc(100vh-80px)] text-white">
      {/* Profile Header */}
      <div className="relative bg-gray-800 shadow-2xl rounded-3xl p-6 sm:p-8 md:p-10 max-w-lg w-full text-center transition-transform duration-300 hover:scale-105">
        <div className="flex justify-center mb-4 sm:mb-6">
          <UserCircleIcon className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 text-indigo-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-1 sm:mb-2">John Doe</h2>
        <p className="text-gray-300 text-sm sm:text-base">{email || 'Loading...'}</p>
      </div>

      {/* Personal Information Section */}
      <div className="bg-gray-800 shadow-2xl rounded-3xl p-6 sm:p-8 mt-6 sm:mt-8 max-w-lg w-full">
        <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-indigo-400">Personal Information</h3>
        <div className="space-y-5">
          <div className="flex items-center space-x-4">
            <EnvelopeIcon className="w-5 sm:w-6 h-5 sm:h-6 text-indigo-500" />
            <input
              type="email"
              value={email || 'Loading...'}
              className="flex-grow p-2 sm:p-3 border border-gray-700 rounded-md bg-gray-700 text-white focus:border-indigo-500 transition-all"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="bg-gray-800 shadow-2xl rounded-3xl p-6 sm:p-8 mt-6 sm:mt-8 max-w-lg w-full">
        <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-indigo-400">Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 flex items-center">
              <ShieldCheckIcon className="w-5 h-5 text-indigo-500 mr-2" /> Two-Factor Authentication
            </span>
            <input type="checkbox" className="form-checkbox rounded-md text-indigo-500 focus:ring-0 focus:border-indigo-500 transition-all" />
          </div>
        </div>
      </div>

      {/* Account Actions Section */}
      <div className="bg-gray-800 shadow-2xl rounded-3xl p-6  sm:p-8 mt-6 sm:mt-8 max-w-lg w-full">
        <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-indigo-400">Account Actions</h3>
        <div className="space-y-4">
          <button className="w-full bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-transform duration-200 transform hover:scale-105 flex items-center justify-center">
            <PencilIcon className="w-5 h-5 mr-2" />
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-transform duration-200 transform hover:scale-105 flex items-center justify-center"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
