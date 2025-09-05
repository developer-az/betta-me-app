import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './components/DataProvider';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import WelcomePage from './pages/Welcome';
import TankPage from './pages/Tank';
import FishPage from './pages/Fish';
import WaterPage from './pages/Water';
import DashboardPage from './pages/Dashboard';
import SettingsPage from './components/SettingsPage';

export default function App() {

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <DataProvider>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/tank" element={
                <ProtectedRoute>
                  <TankPage />
                </ProtectedRoute>
              } />
              <Route path="/fish" element={
                <ProtectedRoute>
                  <FishPage />
                </ProtectedRoute>
              } />
              <Route path="/water" element={
                <ProtectedRoute>
                  <WaterPage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
            </Routes>
          </DataProvider>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

 
