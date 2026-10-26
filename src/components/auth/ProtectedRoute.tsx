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
      <div className="flex min-h-screen items-center justify-center bg-cream-50 dark:bg-ink-950">
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
