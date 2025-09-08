import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowGuestMode?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowGuestMode = true }) => {
  const { user, loading, isGuestMode } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    );
  }

  // Allow access if user is authenticated OR if guest mode is enabled and allowed for this route
  if (user || (allowGuestMode && isGuestMode)) {
    return <>{children}</>;
  }

  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
