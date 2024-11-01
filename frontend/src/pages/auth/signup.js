import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '@aws-amplify/auth';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: { email }
      },
    });
      navigate('/login');
    } catch (error) {
      setError('Failed to sign up. Please try again.');
      console.error('Error signing up:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      <div className="w-full max-w-md md:max-w-sm p-6 md:p-8 bg-stone-950 rounded-lg transition-transform transform hover:scale-105 duration-300 ease-in-out">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4 md:mb-6">Sign Up</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSignUp} className="space-y-4 md:space-y-6">
          {/* Email Input */}
          <div className="space-y-1">
            <label htmlFor="email" className="block text-gray-400 text-sm md:text-base">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              className="w-full p-2 md:p-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label htmlFor="password" className="block text-gray-400 text-sm md:text-base">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              className="w-full p-2 md:p-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="block text-gray-400 text-sm md:text-base">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm your password"
              className="w-full p-2 md:p-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-2 md:p-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg"
          >
            Submit
          </button>
        </form>

        {/* Social Login Section */}
        <div className="flex items-center justify-center mt-4 md:mt-6 space-x-2 md:space-x-3">
          <div className="flex-1 h-px bg-gray-700" />
          <p className="text-xs md:text-sm text-gray-400">Enter details to proceed</p>
          <div className="flex-1 h-px bg-gray-700" />
        </div>

        <p className="text-center text-xs md:text-sm text-gray-400 mt-4 md:mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
