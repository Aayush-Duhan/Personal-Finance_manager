import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp, confirmSignUp } from '@aws-amplify/auth';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState(1); // Step 1: Sign-Up, Step 2: Verification
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle sign-up submission
  const handleSignUp = async (event) => {
    event.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await signUp({
        username: email,
        password,
        attributes: { email }
      });
      setStep(2); // Move to verification step
    } catch (error) {
      setError('Failed to sign up. Please try again.');
      console.error('Error signing up:', error);
    }
  };

  // Handle verification code submission
  const handleVerifyCode = async (event) => {
    event.preventDefault();
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: verificationCode
      });
      navigate('/login');
    } catch (error) {
      setError('Invalid verification code. Please try again.');
      console.error('Error verifying code:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      <div className="w-full max-w-md md:max-w-sm p-6 md:p-8 bg-stone-950 rounded-lg transition-transform transform hover:scale-105 duration-300 ease-in-out">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4 md:mb-6">
          {step === 1 ? 'Sign Up' : 'Verify Email'}
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {step === 1 ? (
          // Sign-Up Form
          <form onSubmit={handleSignUp} className="space-y-4 md:space-y-6">
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

            <button
              type="submit"
              className="w-full p-2 md:p-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg"
            >
              Submit
            </button>
          </form>
        ) : (
          // Verification Code Input Form
          <form onSubmit={handleVerifyCode} className="space-y-4 md:space-y-6">
            <div className="space-y-1">
              <label htmlFor="verificationCode" className="block text-gray-400 text-sm md:text-base">
                Verification Code
              </label>
              <input
                type="text"
                name="verificationCode"
                id="verificationCode"
                placeholder="Enter the code sent to your email"
                className="w-full p-2 md:p-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full p-2 md:p-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg"
            >
              Verify
            </button>
          </form>
        )}

        {step === 1 && (
          <p className="text-center text-xs md:text-sm text-gray-400 mt-4 md:mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-500 hover:underline">
              Log in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default SignUp;
