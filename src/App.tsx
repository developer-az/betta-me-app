import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { DataProvider } from './components/DataProvider';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import WelcomePage from './pages/Welcome';

const LoginForm = lazy(() => import('./components/auth/LoginForm'));
const SignupForm = lazy(() => import('./components/auth/SignupForm'));
const TankPage = lazy(() => import('./pages/Tank'));
const FishPage = lazy(() => import('./pages/Fish'));
const WaterPage = lazy(() => import('./pages/Water'));
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const SettingsPage = lazy(() => import('./components/SettingsPage'));
const CareSchedulePage = lazy(() => import('./components/CareSchedulePage'));
const PricingPage = lazy(() => import('./pages/Pricing'));
const ShopPage = lazy(() => import('./pages/Shop'));
const GuidesPage = lazy(() => import('./pages/Guides'));
const GuideArticlePage = lazy(() =>
  import('./pages/Guides').then((module) => ({ default: module.GuideArticlePage }))
);
const InsightsPage = lazy(() => import('./pages/Insights'));
const CheckoutPage = lazy(() => import('./pages/Checkout'));
const PrivacyPage = lazy(() => import('./pages/Legal'));
const TermsPage = lazy(() =>
  import('./pages/Legal').then((module) => ({ default: module.TermsPage }))
);
const ResetPasswordPage = lazy(() => import('./pages/ResetPassword'));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50">
      <LoadingSpinner size="lg" text="Loading…" />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SubscriptionProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <DataProvider>
              <Suspense fallback={<RouteFallback />}>
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
                </Routes>
              </Suspense>
            </DataProvider>
          </Router>
        </SubscriptionProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
