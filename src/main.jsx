import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider

// Get your Google Client ID from environment variables
// It will be loaded from your .env file locally, or Vercel's environment variables when deployed.
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* GoogleOAuthProvider wraps your App to provide the Google Client ID context */}
    {/* Ensure GOOGLE_CLIENT_ID is properly set in your .env or Vercel environment */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
