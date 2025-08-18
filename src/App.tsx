import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

 
