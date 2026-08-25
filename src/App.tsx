import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { DataProvider } from './components/DataProvider';
import { ToastProvider } from './components/Toast';
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
import CareSchedulePage from './components/CareSchedulePage';
import PricingPage from './pages/Pricing';
import ShopPage from './pages/Shop';
import GuidesPage, { GuideArticlePage } from './pages/Guides';
import InsightsPage from './pages/Insights';
import CheckoutPage from './pages/Checkout';
import PrivacyPage, { TermsPage } from './pages/Legal';
import StatusPage from './pages/Status';
import ResetPasswordPage from './pages/ResetPassword';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SubscriptionProvider>
          <ToastProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <DataProvider>
                <Routes>
                  <Route path="/" element={<WelcomePage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/guides" element={<GuidesPage />} />
                  <Route path="/guides/:slug" element={<GuideArticlePage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/signup" element={<SignupForm />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/tank" element={<ProtectedRoute><TankPage /></ProtectedRoute>} />
                  <Route path="/fish" element={<ProtectedRoute><FishPage /></ProtectedRoute>} />
                  <Route path="/water" element={<ProtectedRoute><WaterPage /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                  <Route path="/insights" element={<ProtectedRoute><InsightsPage /></ProtectedRoute>} />
                  <Route path="/app/shop" element={<ProtectedRoute><ShopPage /></ProtectedRoute>} />
                  <Route path="/care" element={<ProtectedRoute><CareSchedulePage /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                  <Route path="/status" element={<ProtectedRoute><StatusPage /></ProtectedRoute>} />
                </Routes>
              </DataProvider>
            </Router>
          </ToastProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
