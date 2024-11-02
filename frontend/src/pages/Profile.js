import React, { useState, useEffect } from 'react';
import { signOut, fetchUserAttributes } from '@aws-amplify/auth'; 
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
    <div className="flex flex-col items-center py-10 px-4 md:px-10 bg-black min-h-[calc(100vh-80px)]">
      {/* Profile Header */}
      <div className="bg-gray-900 shadow-md rounded-lg p-6 w-full max-w-lg text-center">
        <img
          src="https://via.placeholder.com/150"
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500"
        />
        <h2 className="text-2xl font-semibold text-white mb-2">John Doe</h2>
        <p className="text-gray-400">{email || 'Loading...'}</p>
      </div>

      {/* Personal Information Section */}
      <div className="bg-gray-900 shadow-md rounded-lg p-6 mt-6 w-full max-w-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400">Full Name</label>
            <input
              type="text"
              value="John Doe"
              className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:border-blue-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-gray-400">Email</label>
            <input
              type="email"
              value={email || 'Loading...'}
              className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:border-blue-500"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="bg-gray-900 shadow-md rounded-lg p-6 mt-6 w-full max-w-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Receive Email Notifications</span>
            <input type="checkbox" className="form-checkbox text-blue-500" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Two-Factor Authentication</span>
            <input type="checkbox" className="form-checkbox text-blue-500" />
          </div>
        </div>
      </div>

      {/* Account Actions Section */}
      <div className="bg-gray-900 shadow-md rounded-lg p-6 mt-6 w-full max-w-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Account Actions</h3>
        <div className="space-y-4">
          <button className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-600">
            Edit Profile
          </button>
          <button onClick={handleLogout} className="w-full bg-red-500 text-white py-2 rounded-md font-semibold hover:bg-red-600">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
