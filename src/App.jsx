import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Reports from './pages/Reports';
import Categories from './pages/Categories';
import Settings from './pages/Settings';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ProtectedRoute from './components/auth/ProtectedRoute'; // Assumed to exist and handle auth check
import { AuthProvider, useAuth } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';
import { ThemeProvider } from './context/ThemeContext';
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  // Display a loading spinner while the authentication state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          {/* Tailwind CSS for a simple loading spinner */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    // Main application wrapper with responsive design and theme transitions
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-700 font-inter">
      {/* Defines all the routes for the application */}
      <Routes>
        {/* Public routes: Accessible to users regardless of authentication status.
            If a user is already authenticated, they are redirected to the dashboard.
        */}
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginForm /> : <Navigate to="/" replace />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <RegisterForm /> : <Navigate to="/" replace />}
        />

        {/* Protected routes: These routes require the user to be authenticated.
            The `ProtectedRoute` component acts as a guard, redirecting unauthenticated users
            to the login page.
        */}
        <Route
          path="/*" // This wildcard path ensures all other routes fall under the protected scope
          element={
            <ProtectedRoute>
              {/* TransactionProvider wraps components that need transaction-related data */}
              <TransactionProvider>
                <Header /> {/* Header component for navigation and branding */}
                <div className="flex flex-1"> {/* Flex container for sidebar and main content */}
                  <Sidebar /> {/* Sidebar component for primary navigation */}
                  <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
                    {/* Nested Routes for the authenticated sections of the application.
                        These routes are only rendered if the user is authenticated.
                    */}
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/transactions" element={<Transactions />} />
                      <Route path="/budget" element={<Budget />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/settings" element={<Settings />} />
                      {/* Fallback route for any undefined path within the protected area,
                          redirecting back to the dashboard.
                      */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
              </TransactionProvider>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

/**
 * The main App component that sets up all global context providers
 * and the BrowserRouter for client-side routing.
 */
function App() {
  return (
    // ThemeProvider provides dark/light mode functionality to the app
    <ThemeProvider>
      {/* AuthProvider manages user authentication state across the entire application */}
      <AuthProvider>
        {/* BrowserRouter enables declarative routing in your React application */}
        <Router>
          <AppContent /> {/* Renders the main application content and handles routes */}
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
