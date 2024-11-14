import React, { useState, useEffect } from 'react';
import { signOut, fetchUserAttributes, getCurrentUser } from '@aws-amplify/auth';
import { ArrowRightOnRectangleIcon, UserCircleIcon, EnvelopeIcon, PencilIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import config from '../utils/config';

const API_ENDPOINT = `${config.apiEndpoint.replace('/transactions', '')}/profile`;
const USER_POOL_ID = 'ap-south-1_IslMhK8Md'; // Your Cognito User Pool ID

const axiosConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
};

// Add profile avatar component
const ProfileAvatar = ({ name }) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex justify-center mb-6">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
        <div className="relative w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-700 group-hover:border-indigo-500 transition-colors">
          <span className="text-2xl font-bold text-gray-200">{initials}</span>
        </div>
      </div>
    </div>
  );
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
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

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

  const handleSubscribe = async () => {
    try {
      setSubscriptionLoading(true);
      const user = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      const email = attributes.email;

      if (email) {
        const response = await axios.post(
          `${config.apiEndpoint.replace('/transactions', '')}/subscribe`,
          { email },
          {
            ...axiosConfig,
            headers: {
              ...axiosConfig.headers,
              'Authorization': user.userId
            }
          }
        );

        if (response.data.statusCode === 200) {
          setIsSubscribed(true);
          setError('');
        }
      }
    } catch (error) {
      setError('Failed to subscribe to notifications');
      console.error('Subscription error:', error);
    } finally {
      setSubscriptionLoading(false);
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
    <div className="bg-black text-white min-h-screen p-6 font-sans mb-16 lg:mb-0">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center lg:flex-row lg:justify-between lg:items-center mb-8">
          <h1 className="text-3xl text-center font-bold text-gray-100 mb-4 lg:mb-0">Profile</h1>
        </div>

        {/* Profile Avatar */}
        <ProfileAvatar name={profileData.name || 'User'} />

        {/* Profile Info Section */}
        <div className="bg-gray-900/70 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 shadow-xl">
          <div className="flex flex-col space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                disabled={!isEditing}
                className="w-full p-3 bg-gray-800/70 border border-gray-600/50 rounded-lg text-gray-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
              />
            </div>

            {/* Email Display */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <div className="flex items-center p-3 bg-gray-800/70 border border-gray-600/50 rounded-lg">
                <EnvelopeIcon className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-200">{email}</span>
              </div>
            </div>

            {/* Currency Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Currency</label>
              <select
                value={profileData.currency}
                onChange={(e) => setProfileData({ ...profileData, currency: e.target.value })}
                disabled={!isEditing}
                className="w-full p-3 bg-gray-800/70 border border-gray-600/50 rounded-lg text-gray-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-gray-900/70 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-medium text-gray-200">Notification Preferences</h2>
                <span className="px-2 py-1 text-xs font-medium bg-indigo-500/10 text-indigo-400 rounded-full">Beta</span>
              </div>
              <p className="text-sm text-gray-400">Get notified when your spending exceeds budget limits</p>
            </div>

            <button
              onClick={handleSubscribe}
              disabled={isSubscribed || subscriptionLoading}
              className={`
                relative px-6 py-2.5 rounded-lg font-medium transition-all duration-200
                flex items-center justify-center
                ${isSubscribed 
                  ? 'bg-gray-800/50 text-gray-400 border border-gray-700/50'
                  : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {subscriptionLoading ? (
                <>
                  <div className="absolute inset-0 bg-indigo-500/5 rounded-lg animate-pulse"></div>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                  <span>Processing...</span>
                </>
              ) : isSubscribed ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Subscribed</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span>Enable Alerts</span>
                </>
              )}
            </button>
          </div>

          {/* Status Messages */}
          {isSubscribed && (
            <div className="mt-4 p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg">
              <p className="text-sm text-gray-300">
                You'll receive email notifications when your spending exceeds budget limits.
              </p>
            </div>
          )}
        </div>

        {/* Account Actions - removed margin from here since it's on parent */}
        <div className="bg-gray-900/70 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 shadow-xl">
          <h3 className="text-lg font-medium text-gray-100 mb-4">Account Actions</h3>
          <div className="space-y-4">
            <button
              onClick={handleUpdateProfile}
              className="w-full p-3 bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 rounded-lg font-medium hover:bg-indigo-600/30 transition-all duration-200"
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full p-3 bg-rose-600/20 text-rose-300 border border-rose-500/30 rounded-lg font-medium hover:bg-rose-600/30 transition-all duration-200"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Error Message - with updated colors */}
        {error && (
          <div className="p-3 bg-rose-600/20 border border-rose-500/30 rounded-lg">
            <p className="text-sm text-rose-300">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
