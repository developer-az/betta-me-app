import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navigation from './components/Navigation';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import WelcomePage from './pages/Welcome';
import TankPage from './pages/Tank';
import FishPage from './pages/Fish';
import WaterPage from './pages/Water';
import DashboardPage from './pages/Dashboard';
import { TankState, FishState, WaterState } from './types';

export default function App() {
  const [tank, setTank] = React.useState<TankState>({ size: 10, heater: true, filter: true });
  const [fish, setFish] = React.useState<FishState>({ name: '', color: '#e57373', appetite: 'Eating well', activity: 'Normal', finCondition: 'Healthy', colorCondition: 'Vibrant', gillCondition: 'Normal', bodyCondition: 'Normal', behavior: 'Normal' });
  const [water, setWater] = React.useState<WaterState>({ temperature: 78, pH: 7, ammonia: 0, nitrite: 0, nitrate: 10 });

  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/tank" element={
            <ProtectedRoute>
              <Navigation />
              <TankPage tank={tank} setTank={setTank} />
            </ProtectedRoute>
          } />
          <Route path="/fish" element={
            <ProtectedRoute>
              <Navigation />
              <FishPage fish={fish} setFish={setFish} />
            </ProtectedRoute>
          } />
          <Route path="/water" element={
            <ProtectedRoute>
              <Navigation />
              <WaterPage water={water} setWater={setWater} fishColor={fish.color} />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Navigation />
              <DashboardPage tank={tank} fish={fish} water={water} />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

 
