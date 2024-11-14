import React, { useState, useEffect } from 'react';
import { signOut, fetchUserAttributes, getCurrentUser } from '@aws-amplify/auth';
import { ArrowRightOnRectangleIcon, UserCircleIcon, EnvelopeIcon, PencilIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import config from '../utils/config';

const API_ENDPOINT = `${config.apiEndpoint.replace('/transactions', '')}/profile`;
const axiosConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
};
const Profile = () => {
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    currency: 'USD'
  });

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const user = await getCurrentUser();
      const response = await axios.get(API_ENDPOINT, {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': user.userId
        }
      });

      if (response.data.statusCode === 401 || response.data.statusCode === 404) {
        setShowCreateProfile(true);
        return;
      }

      const data = typeof response.data.body === 'string' 
        ? JSON.parse(response.data.body) 
        : response.data.body;

      if (data) {
        setProfileData({
          name: data.name || '',
          email: data.email || '',
          currency: data.currency || 'USD'
        });
        setShowCreateProfile(false);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch email from Cognito
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const attributes = await fetchUserAttributes();
        setEmail(attributes.email);
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };
    fetchUserEmail();
    fetchUserProfile();
  }, []);

  const handleCreateProfile = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      
      const profilePayload = {
        name: profileData.name || '',
        email: profileData.email || '',
        currency: profileData.currency || 'USD'
      };

      const response = await axios.post(
        API_ENDPOINT,
        profilePayload,
        {
          ...axiosConfig,
          headers: {
            ...axiosConfig.headers,
            'Authorization': user.userId
          }
        }
      );

      if (response.data.statusCode === 201) {
        await fetchUserProfile();
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      setError('Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      setLoading(true);
      const user = await getCurrentUser();
      
      const profilePayload = {
        name: profileData.name || '',
        email: profileData.email || '',
        currency: profileData.currency || 'USD'
      };

      const response = await axios.put(
        API_ENDPOINT,
        profilePayload,
        {
          ...axiosConfig,
          headers: {
            ...axiosConfig.headers,
            'Authorization': user.userId
          }
        }
      );

      if (response.data.statusCode === 200) {
        setIsEditing(false);
        await fetchUserProfile();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem('isLoggedIn');
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Create Profile Modal
  const CreateProfileModal = () => (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 px-4">
      <div className="bg-black border border-gray-800 rounded-lg p-8 max-w-md w-full relative shadow-2xl">
        <h3 className="text-2xl font-semibold mb-6 text-indigo-400 text-center">Welcome! Create Your Profile</h3>
        <p className="text-gray-400 mb-8 text-center">Please set up your profile to continue using the app.</p>
        <div className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-3 bg-gray-900 border border-gray-800 rounded-lg text-white 
                focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all
                focus:outline-none"
              required
              placeholder="Enter your name"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Preferred Currency <span className="text-red-500">*</span></label>
            <select
              value={profileData.currency}
              onChange={(e) => setProfileData(prev => ({ ...prev, currency: e.target.value }))}
              className="w-full p-3 bg-gray-900 border border-gray-800 rounded-lg text-white 
                focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all
                focus:outline-none"
              required
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
          {error && (
            <div className="text-red-500 text-sm bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-3">
              {error}
            </div>
          )}
          <button
            onClick={handleCreateProfile}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 
              disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 
              transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            disabled={loading || !profileData.name}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : (
              'Create Profile'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Render CreateProfileModal before the main content if showCreateProfile is true
  if (showCreateProfile) {
    return <CreateProfileModal />;
  }

  return (
    <div className="flex flex-col items-center py-8 px-4 sm:px-6 md:px-12 pb-24 md:pb-8 bg-black min-h-[calc(100vh-80px)] text-white">
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-6 w-full max-w-lg">
          {error}
        </div>
      )}

      {/* Profile Header */}
      <div className="relative bg-gray-800 shadow-2xl rounded-3xl p-6 sm:p-8 md:p-10 max-w-lg w-full text-center transition-transform duration-300 hover:scale-105">
        <div className="flex justify-center mb-4 sm:mb-6">
          <UserCircleIcon className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 text-indigo-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-1 sm:mb-2">{profileData.name}</h2>
        <p className="text-gray-300 text-sm sm:text-base">{email}</p>
      </div>

      {/* Personal Information Section */}
      <div className="bg-gray-800 shadow-2xl rounded-3xl p-6 sm:p-8 mt-6 sm:mt-8 max-w-lg w-full">
        <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-indigo-400">Personal Information</h3>
        <div className="space-y-5">
          <div className="flex items-center space-x-4">
            <UserCircleIcon className="w-5 sm:w-6 h-5 sm:h-6 text-indigo-500" />
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="flex-grow p-2 sm:p-3 border border-gray-700 rounded-md bg-gray-700 text-white focus:border-indigo-500 transition-all"
              readOnly={!isEditing}
            />
          </div>
          <div className="flex items-center space-x-4">
            <EnvelopeIcon className="w-5 sm:w-6 h-5 sm:h-6 text-indigo-500" />
            <input
              type="email"
              value={email}
              className="flex-grow p-2 sm:p-3 border border-gray-700 rounded-md bg-gray-700 text-white"
              readOnly
            />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xl">💰</span>
            <select
              value={profileData.currency}
              onChange={(e) => setProfileData({ ...profileData, currency: e.target.value })}
              className="flex-grow p-2 sm:p-3 border border-gray-700 rounded-md bg-gray-700 text-white focus:border-indigo-500 transition-all"
              disabled={!isEditing}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Account Actions Section */}
      <div className="bg-gray-800 shadow-2xl rounded-3xl p-6 sm:p-8 mt-6 sm:mt-8 max-w-lg w-full">
        <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-indigo-400">Account Actions</h3>
        <div className="space-y-4">
          <button
            onClick={handleUpdateProfile}
            className="w-full bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-transform duration-200 transform hover:scale-105 flex items-center justify-center"
          >
            <PencilIcon className="w-5 h-5 mr-2" />
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
          {isEditing && (
            <button
              onClick={() => {
                setIsEditing(false);
                fetchUserProfile();
              }}
              className="w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-transform duration-200 transform hover:scale-105"
            >
              Cancel
            </button>
          )}
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
