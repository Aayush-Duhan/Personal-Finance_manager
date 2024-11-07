import React, { useState, useEffect } from 'react';
import { signOut, fetchUserAttributes, updateUserAttributes, confirmUserAttribute } from '@aws-amplify/auth'; 
import { ArrowRightOnRectangleIcon, UserCircleIcon, EnvelopeIcon, PencilIcon, ShieldCheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

const Profile = () => {
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const attributes = await fetchUserAttributes();
        const emailAttr = attributes.email;
        setEmail(emailAttr);
        setNewEmail(emailAttr);
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };
    fetchUserEmail();
  }, []);

  const handleUpdateProfile = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      await updateUserAttributes({
        userAttributes: {
          email: newEmail,
        }
      });
      
      setIsEditing(false);
      setUpdateError('');
      setShowVerificationModal(true);
    } catch (error) {
      console.error('Error updating email:', error);
      setUpdateError(error.message || 'An error occurred while updating email');
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    try {
      await confirmUserAttribute({
        userAttributeKey: 'email',
        confirmationCode: verificationCode
      });
      setEmail(newEmail);
      setShowVerificationModal(false);
      setVerificationCode('');
      setVerificationError('');
      alert('Email verified successfully!');
    } catch (error) {
      console.error('Error verifying email:', error);
      setVerificationError(error.message || 'Invalid verification code');
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
              value={isEditing ? newEmail : email}
              onChange={(e) => setNewEmail(e.target.value)}
              className="flex-grow p-2 sm:p-3 border border-gray-700 rounded-md bg-gray-700 text-white focus:border-indigo-500 transition-all"
              readOnly={!isEditing}
            />
          </div>
          {updateError && (
            <p className="text-red-500 text-sm mt-2">{updateError}</p>
          )}
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
                setNewEmail(email);
                setUpdateError('');
              }}
              className="w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-transform duration-200 transform hover:scale-105 flex items-center justify-center"
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

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowVerificationModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            
            <h3 className="text-xl font-semibold mb-4 text-indigo-400">Verify Your Email</h3>
            <p className="text-gray-300 mb-4">
              We've sent a verification code to {newEmail}. Please enter the code below to verify your email address.
            </p>
            
            <form onSubmit={handleVerifyEmail} className="space-y-4">
              <input
                type="text"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full p-3 border border-gray-700 rounded-md bg-gray-700 text-white focus:border-indigo-500 transition-all"
              />
              
              {verificationError && (
                <p className="text-red-500 text-sm">{verificationError}</p>
              )}
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-500 text-white py-2 rounded-lg font-semibold hover:bg-indigo-600 transition-all"
                >
                  Verify
                </button>
                <button
                  type="button"
                  onClick={() => setShowVerificationModal(false)}
                  className="flex-1 bg-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
