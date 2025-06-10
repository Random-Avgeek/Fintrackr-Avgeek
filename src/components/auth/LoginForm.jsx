import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Mail, Lock } from 'lucide-react'; // Keep Lucide icons
import { useAuth } from '../../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google'; // Import GoogleLogin component

const LoginForm = () => {
  // Destructure login, loading, error, clearError from useAuth, and add googleLogin
  const { login, googleLogin, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear validation errors when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }

    // Clear auth errors
    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.login.trim()) {
      errors.login = 'Email or username is required';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // The button will be disabled by `loading` state, so this check is redundant but harmless
    // if (loading) return; 

    const result = await login(formData);
    if (!result.success) {
      // Error is handled by the auth context and displayed
      console.error('Login failed:', result.error);
    }
  };

  // Callback function for successful Google Sign-In
  const handleGoogleSuccess = async (credentialResponse) => {
    console.log('Google login successful:', credentialResponse);
    // credentialResponse.credential contains the Google ID token (JWT)
    // Send this ID token to your backend for verification and user processing
    const result = await googleLogin(credentialResponse.credential);
    if (result.success) {
      // Assuming successful login navigates to the dashboard
      // The `navigate('/')` should be handled by App.jsx's ProtectedRoute
      // or you can explicitly navigate here if needed, but often not necessary
      // as AuthContext update will trigger App.jsx's routing.
    } else {
      // If Google login fails on backend, AuthContext will set error state
      console.error('Google login failed on backend:', result.error);
    }
  };

  // Callback function for failed Google Sign-In
  const handleGoogleError = () => {
    console.error('Google login failed. Check console for details.');
    // You might want to update your AuthContext's error state or show a user-friendly message
    clearError(); // Clear any previous errors
    // dispatch({ type: 'AUTH_FAIL', payload: 'Google sign-in failed. Please try again.' });
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your FinTrackr account
          </p>
        </div>

        {/* Google Login Button */}
        <div className="flex justify-center mt-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess} // Handle successful Google login
            onError={handleGoogleError}   // Handle Google login errors
            useOneTap                             // Optionally use Google One Tap for seamless login
          />
        </div>

        {/* OR separator for traditional login */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400">
            Or continue with
          </span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Display general authentication errors from AuthContext */}
          {error && (
            <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 text-danger-700 dark:text-danger-400 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Email or Username Input */}
            <div>
              <label htmlFor="login" className="label">
                Email or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="login"
                  name="login"
                  type="text"
                  value={formData.login}
                  onChange={handleChange}
                  className={`input pl-10 ${validationErrors.login ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                  placeholder="Enter your email or username"
                />
              </div>
              {validationErrors.login && (
                <p className="mt-1 text-xs text-danger-600 dark:text-danger-400">
                  {validationErrors.login}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`input pl-10 pr-10 ${validationErrors.password ? 'border-danger-500 focus:ring-danger-500' : ''}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-xs text-danger-600 dark:text-danger-400">
                  {validationErrors.password}
                </p>
              )}
            </div>
          </div>

          {/* Sign In Button */}
          <div>
            <button
              type="submit"
              disabled={loading} // Disable button while loading
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign in
                </div>
              )}
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
