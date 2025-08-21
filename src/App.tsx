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
import { TankState, FishState, WaterState, CareState } from './types';

export default function App() {
  // Load saved data from localStorage on app initialization
  const [tank, setTank] = React.useState<TankState>(() => {
    const saved = localStorage.getItem('betta-tank-data');
    return saved ? JSON.parse(saved) : { size: 10, heater: true, filter: true };
  });
  
  const [fish, setFish] = React.useState<FishState>(() => {
    const saved = localStorage.getItem('betta-fish-data');
    return saved ? JSON.parse(saved) : { name: '', color: '#e57373', appetite: 'Eating well', activity: 'Normal', finCondition: 'Healthy', colorCondition: 'Vibrant', gillCondition: 'Normal', bodyCondition: 'Normal', behavior: 'Normal' };
  });
  
  const [water, setWater] = React.useState<WaterState>(() => {
    const saved = localStorage.getItem('betta-water-data');
    return saved ? JSON.parse(saved) : { temperature: 78, pH: 7, ammonia: 0, nitrite: 0, nitrate: 10 };
  });

  const [care, setCare] = React.useState<CareState>(() => {
    const saved = localStorage.getItem('betta-care-data');
    return saved ? JSON.parse(saved) : {
      lastFed: null,
      lastWaterChange: null,
      waterChangeHistory: [],
      feedingSchedule: { timesPerDay: 2, lastReminder: null }
    };
  });

  // Save data to localStorage whenever state changes
  React.useEffect(() => {
    localStorage.setItem('betta-tank-data', JSON.stringify(tank));
  }, [tank]);

  React.useEffect(() => {
    localStorage.setItem('betta-fish-data', JSON.stringify(fish));
  }, [fish]);

  React.useEffect(() => {
    localStorage.setItem('betta-water-data', JSON.stringify(water));
  }, [water]);

  React.useEffect(() => {
    localStorage.setItem('betta-care-data', JSON.stringify(care));
  }, [care]);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/tank" element={<TankPage tank={tank} setTank={setTank} />} />
        <Route path="/fish" element={<FishPage fish={fish} setFish={setFish} />} />
        <Route path="/water" element={<WaterPage water={water} setWater={setWater} fishColor={fish.color} />} />
        <Route path="/dashboard" element={<DashboardPage tank={tank} fish={fish} water={water} />} />
      </Routes>
    </Router>
  );
}

 
