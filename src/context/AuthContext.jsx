import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Ensure this API_URL points to your backend (local or Render)
const API_URL = import.meta.env.VITE_API_URL || 'https://avgeek-fintrackr-services.onrender.com/api';

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true, // Initial loading state for auth check
  error: null
};

// Reducer function to manage authentication state
const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };
    case 'AUTH_FAIL':
      // Reset all auth-related state on failure
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload
      };
    case 'LOGOUT':
      // Clear user data and authentication status
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Effect to set up Axios interceptor and perform initial token verification
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Set default Authorization header for all Axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      verifyToken(); // Attempt to verify the token on app load
    } else {
      // If no token exists, set auth state to not authenticated
      dispatch({ type: 'AUTH_FAIL', payload: null });
    }

    // Axios response interceptor to automatically handle 401 Unauthorized errors
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // If a 401 response is received, it indicates token invalidity or expiration
        if (error.response?.status === 401) {
          console.warn('Authentication token expired or invalid. Logging out.');
          logout(); // Trigger a client-side logout
        }
        return Promise.reject(error); // Re-throw the error for component-level handling
      }
    );

    // Cleanup function for the interceptor
    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []); // Empty dependency array means this runs once on component mount

  // Function to verify the stored token with the backend
  const verifyToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.data.user,
          token: localStorage.getItem('token') // Use the existing token from localStorage
        }
      });
    } catch (error) {
      console.error('Token verification failed:', error.response?.data?.message || error.message);
      // Clean up token and auth header on verification failure
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      dispatch({ type: 'AUTH_FAIL', payload: error.response?.data?.message || 'Token verification failed' });
    }
  };

  // Function to handle user registration
  const register = async (userData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_FAIL', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Function to handle traditional email/username and password login
  const login = async (credentials) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_FAIL', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // --- New function to handle Google login ---
  const googleLogin = async (idToken) => {
    dispatch({ type: 'AUTH_START' });
    try {
      // Send the Google ID token received from the frontend to your backend
      // Your backend will verify this token and handle user creation/login
      const response = await axios.post(`${API_URL}/auth/google-login`, { idToken });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Google login failed';
      dispatch({ type: 'AUTH_FAIL', payload: errorMessage });
      console.error('Google login error on frontend:', error.response?.data || error);
      return { success: false, error: errorMessage };
    }
  };

  // Function to handle user logout
  const logout = async () => {
    try {
      // Best practice: inform backend of logout (e.g., for token blacklisting)
      await axios.post(`${API_URL}/auth/logout`);
    } catch (error) {
      console.error('Error during backend logout process:', error);
      // Continue with client-side cleanup even if backend logout fails
    } finally {
      localStorage.removeItem('token'); // Remove token from client storage
      delete axios.defaults.headers.common['Authorization']; // Remove auth header
      dispatch({ type: 'LOGOUT' }); // Update frontend state
    }
  };

  // Function to update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, profileData);
      dispatch({ type: 'UPDATE_USER', payload: response.data.user });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      return { success: false, error: errorMessage };
    }
  };

  // Function to change user password
  const changePassword = async (passwordData) => {
    try {
      const response = await axios.put(`${API_URL}/auth/change-password`, passwordData);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password change failed';
      return { success: false, error: errorMessage };
    }
  };

  // Function to clear authentication errors
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Provide auth state and functions to the rest of the application
  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        googleLogin, // Expose the new googleLogin function
        logout,
        updateProfile,
        changePassword,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
