import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn, getCurrentUser, signInWithRedirect } from '@aws-amplify/auth';
import { Hub } from '@aws-amplify/core';
import { Amplify } from 'aws-amplify';
import awsmobile from '../../aws-exports';

Amplify.configure(awsmobile);

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setIsAuthenticated(true);
          navigate('/');
        }
      } catch (error) {}
    };

    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signInWithRedirect":
          checkUser();
          break;
        case "signInWithRedirect_failure":
          setError("An error occurred during the Google sign-in process.");
          break;
        case "signOut":
          window.sessionStorage.clear();
          window.localStorage.clear();
          break;
        default:
          break;
      }
    });

    checkUser();
    return unsubscribe;
  }, [navigate, setIsAuthenticated]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await signIn({
        username: email,
        password,
      });
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
      switch (error.code) {
        case 'UserNotFoundException':
          setError('Email address not found. Please check and try again.');
          break;
        case 'NotAuthorizedException':
          setError('Invalid password. Please try again.');
          break;
        case 'UserDisabledException':
          setError('Your account has been disabled. Please contact support.');
          break;
        default:
          setError('Failed to log in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // Clear all storage
      window.sessionStorage.clear();
      window.localStorage.clear();
      
      // Ensure Google Auth instance is signed out
      const googleAuth = window.gapi?.auth2?.getAuthInstance();
      if (googleAuth) {
        await googleAuth.signOut();
        await googleAuth.disconnect(); // Disconnect to ensure full sign-out
      }
      
      await signInWithRedirect({
        provider: 'Google',
        options: {
          prompt: 'select_account', // Force account selection
          accessType: 'offline',
          customState: Date.now().toString(),
          responseType: 'code',
          scope: ['email', 'profile'],
          max_age: 0, // Force reauthentication
          authorizationParams: {
            prompt: 'select_account',
            access_type: 'offline',
            response_type: 'code',
          }
        }
      });
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      <div className="w-full max-w-md md:max-w-sm p-6 md:p-8 bg-stone-950 rounded-lg transition-transform transform hover:scale-105 duration-300 ease-in-out">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4 md:mb-6">Login</h2>

        <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
          <div className="space-y-1">
            <label htmlFor="email" className="block text-gray-400 text-sm md:text-base">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your Email Id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 md:p-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-gray-400 text-sm md:text-base">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 md:p-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
              required
            />
            <div className="flex justify-end mt-1">
              <Link to="/forgot-password" className="text-xs md:text-sm text-gray-400 hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-2 md:p-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="flex items-center justify-center mt-4 md:mt-6 space-x-2 md:space-x-3">
          <div className="flex-1 h-px bg-gray-700" />
          <p className="text-xs md:text-sm text-gray-400">Login with social accounts</p>
          <div className="flex-1 h-px bg-gray-700" />
        </div>

        <div className="flex justify-center mt-4 space-x-3 md:space-x-4">
          <button
            onClick={handleGoogleSignIn}
            aria-label="Log in with Google"
            className="p-2 md:p-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
          >
            <svg className="w-5 h-5" viewBox="0 0 32 32" fill="currentColor">
              <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z" />
            </svg>
          </button> 
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <p className="text-center text-xs md:text-sm text-gray-400 mt-4 md:mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
