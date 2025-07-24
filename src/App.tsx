import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';

// SVGs
const TankSVG = ({ size = 20 }: { size?: number }) => (
  <svg width={size * 11} height={size * 6} viewBox="0 0 220 120">
    <ellipse cx="110" cy="100" rx="100" ry="15" fill="#b3e5fc" />
    <rect x="10" y="20" width="200" height="80" rx="20" fill="#81d4fa" stroke="#0288d1" strokeWidth="3" />
    <ellipse cx="110" cy="100" rx="100" ry="15" fill="#4fc3f7" opacity="0.3" />
  </svg>
);
const FishSVG = ({ color = '#e57373', mood = 'happy' }: { color?: string; mood?: string }) => (
  <svg width="80" height="40" viewBox="0 0 80 40">
    <ellipse cx="30" cy="20" rx="18" ry="10" fill={color} />
    <polygon points="48,20 70,10 70,30" fill={color} />
    <circle cx="22" cy="18" r="2" fill="#222" />
    {mood === 'happy' && <path d="M25 25 Q28 28 31 25" stroke="#222" strokeWidth="1" fill="none" />}
    {mood === 'sad' && <path d="M25 28 Q28 25 31 28" stroke="#222" strokeWidth="1" fill="none" />}
  </svg>
);

// Types
interface TankState {
  size: number;
  heater: boolean;
  filter: boolean;
}
interface FishState {
  name: string;
  color: string;
}
interface WaterState {
  temperature: number;
  pH: number;
  ammonia: number;
  nitrite: number;
  nitrate: number;
}

// Welcome Screen
function Welcome() {
  const navigate = useNavigate();
  return (
    <div className="adventure-screen welcome-screen">
      <h1>🐠 Betta Adventure</h1>
      <p>Welcome to your virtual betta fish journey! Ready to create your dream tank and care for your fish?</p>
      <div style={{ margin: '2em 0' }}><FishSVG color="#64b5f6" mood="happy" /></div>
      <button className="adventure-btn" onClick={() => navigate('/tank')}>Start Your Adventure</button>
    </div>
  );
}

// Tank Creation Screen
function TankStep({ tank, setTank }: { tank: TankState; setTank: (t: TankState) => void }) {
  const navigate = useNavigate();
  return (
    <div className="adventure-screen tank-screen">
      <h2>Step 1: Create Your Tank</h2>
      <TankSVG size={tank.size} />
      <form style={{ margin: '1.5em 0' }}>
        <label>
          Tank Size (gallons):
          <input type="range" min={5} max={30} value={tank.size} onChange={e => setTank({ ...tank, size: Number(e.target.value) })} />
          <span style={{ marginLeft: 8, fontWeight: 600 }}>{tank.size} gal</span>
        </label>
        <label style={{ display: 'block', marginTop: 12 }}>
          <input type="checkbox" checked={tank.heater} onChange={e => setTank({ ...tank, heater: e.target.checked })} /> Heater
        </label>
        <label style={{ display: 'block', marginTop: 6 }}>
          <input type="checkbox" checked={tank.filter} onChange={e => setTank({ ...tank, filter: e.target.checked })} /> Filter
        </label>
      </form>
      <button className="adventure-btn" onClick={() => navigate('/fish')} disabled={tank.size < 5}>Next: Add Your Betta</button>
    </div>
  );
}

// Fish Creation Screen
function FishStep({ fish, setFish }: { fish: FishState; setFish: (f: FishState) => void }) {
  const navigate = useNavigate();
  const colors = ['#e57373', '#64b5f6', '#81c784', '#ffd54f', '#ba68c8', '#ff8a65'];
  return (
    <div className="adventure-screen fish-screen">
      <h2>Step 2: Add Your Betta</h2>
      <div style={{ margin: '1.5em 0' }}><FishSVG color={fish.color} mood="happy" /></div>
      <form style={{ marginBottom: 16 }}>
        <label>
          Name:
          <input type="text" value={fish.name} onChange={e => setFish({ ...fish, name: e.target.value })} placeholder="Your betta's name" style={{ marginLeft: 8 }} />
        </label>
        <div style={{ marginTop: 12 }}>
          Color:
          {colors.map(c => (
            <button key={c} type="button" style={{ background: c, border: fish.color === c ? '2px solid #222' : '1px solid #ccc', borderRadius: '50%', width: 32, height: 32, margin: '0 6px', cursor: 'pointer' }} onClick={() => setFish({ ...fish, color: c })} aria-label={c} />
          ))}
        </div>
      </form>
      <button className="adventure-btn" onClick={() => navigate('/water')} disabled={!fish.name}>Next: Test Water</button>
    </div>
  );
}

// Water Testing Screen
function WaterStep({ water, setWater, fishColor }: { water: WaterState; setWater: (w: WaterState) => void; fishColor: string }) {
  const navigate = useNavigate();
  // Mood logic
  const happy =
    water.temperature >= 24 && water.temperature <= 28 &&
    water.pH >= 6.5 && water.pH <= 7.5 &&
    water.ammonia === 0 &&
    water.nitrite === 0 &&
    water.nitrate <= 20;
  return (
    <div className="adventure-screen water-screen">
      <h2>Step 3: Test Your Water</h2>
      <TankSVG />
      <div style={{ position: 'relative', top: '-60px', left: '60px' }}><FishSVG color={fishColor} mood={happy ? 'happy' : 'sad'} /></div>
      <form style={{ margin: '1.5em 0', maxWidth: 320, marginLeft: 'auto', marginRight: 'auto' }}>
        <label>Temperature (°C):
          <input type="range" min={20} max={32} value={water.temperature} onChange={e => setWater({ ...water, temperature: Number(e.target.value) })} />
          <span style={{ marginLeft: 8 }}>{water.temperature}°C</span>
        </label><br />
        <label>pH:
          <input type="range" min={5} max={9} step={0.1} value={water.pH} onChange={e => setWater({ ...water, pH: Number(e.target.value) })} />
          <span style={{ marginLeft: 8 }}>{water.pH.toFixed(1)}</span>
        </label><br />
        <label>Ammonia (ppm):
          <input type="range" min={0} max={2} step={0.1} value={water.ammonia} onChange={e => setWater({ ...water, ammonia: Number(e.target.value) })} />
          <span style={{ marginLeft: 8 }}>{water.ammonia}</span>
        </label><br />
        <label>Nitrite (ppm):
          <input type="range" min={0} max={2} step={0.1} value={water.nitrite} onChange={e => setWater({ ...water, nitrite: Number(e.target.value) })} />
          <span style={{ marginLeft: 8 }}>{water.nitrite}</span>
        </label><br />
        <label>Nitrate (ppm):
          <input type="range" min={0} max={40} step={1} value={water.nitrate} onChange={e => setWater({ ...water, nitrate: Number(e.target.value) })} />
          <span style={{ marginLeft: 8 }}>{water.nitrate}</span>
        </label>
      </form>
      <button className="adventure-btn" onClick={() => navigate('/dashboard')}>Finish: See Your Tank</button>
    </div>
  );
}

// Dashboard/Virtual Tank
function Dashboard({ tank, fish, water }: { tank: TankState; fish: FishState; water: WaterState }) {
  // Mood logic
  const happy =
    water.temperature >= 24 && water.temperature <= 28 &&
    water.pH >= 6.5 && water.pH <= 7.5 &&
    water.ammonia === 0 &&
    water.nitrite === 0 &&
    water.nitrate <= 20;
  return (
    <div className="adventure-screen dashboard-screen">
      <h2>Your Virtual Betta Tank</h2>
      <div style={{ position: 'relative', width: tank.size * 11, margin: '0 auto' }}>
        <TankSVG size={tank.size} />
        <div style={{ position: 'absolute', top: 40, left: 70 }}><FishSVG color={fish.color} mood={happy ? 'happy' : 'sad'} /></div>
      </div>
      <div style={{ margin: '1.5em 0', fontSize: '1.1em' }}>
        <strong>Tank:</strong> {tank.size} gal, {tank.heater ? 'Heater' : 'No Heater'}, {tank.filter ? 'Filter' : 'No Filter'}<br />
        <strong>Betta:</strong> {fish.name} <span style={{ color: fish.color, fontWeight: 700 }}>●</span><br />
        <strong>Water:</strong> {water.temperature}°C, pH {water.pH.toFixed(1)}, NH₃ {water.ammonia}, NO₂⁻ {water.nitrite}, NO₃⁻ {water.nitrate}
      </div>
      <p>{happy ? 'Your betta is happy and healthy!' : 'Some water parameters are off. Adjust them for a happier fish.'}</p>
    </div>
  );
}

function App() {
  // State for the adventure
  const [tank, setTank] = useState<TankState>({ size: 10, heater: true, filter: true });
  const [fish, setFish] = useState<FishState>({ name: '', color: '#e57373' });
  const [water, setWater] = useState<WaterState>({ temperature: 26, pH: 7, ammonia: 0, nitrite: 0, nitrate: 10 });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/tank" element={<TankStep tank={tank} setTank={setTank} />} />
        <Route path="/fish" element={<FishStep fish={fish} setFish={setFish} />} />
        <Route path="/water" element={<WaterStep water={water} setWater={setWater} fishColor={fish.color} />} />
        <Route path="/dashboard" element={<Dashboard tank={tank} fish={fish} water={water} />} />
      </Routes>
    </Router>
  );
}

export default App;
