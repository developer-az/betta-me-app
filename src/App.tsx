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
  appetite: string;
  activity: string;
  finCondition: string;
  colorCondition: string;
  gillCondition: string;
  bodyCondition: string;
  behavior: string;
}
interface WaterState {
  temperature: number; // Fahrenheit
  pH: number;
  ammonia: number;
  nitrite: number;
  nitrate: number;
}

// Welcome Screen
function Welcome() {
  const navigate = useNavigate();
  const [btnFocused, setBtnFocused] = React.useState(false);
  const btnRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        navigate('/tank');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);
  return (
    <div className="adventure-screen welcome-screen">
      <h1>🐠 Betta Adventure</h1>
      <p>Welcome to your virtual betta fish journey! Ready to create your dream tank and care for your fish?</p>
      <div style={{ margin: '2em 0' }}><FishSVG color="#64b5f6" mood="happy" /></div>
      <button
        className="adventure-btn"
        ref={btnRef}
        onClick={() => navigate('/tank')}
        style={btnFocused ? {
          outline: '3px solid #1976d2',
          boxShadow: '0 0 0 4px #90caf9',
        } : {}}
        onFocus={() => setBtnFocused(true)}
        onBlur={() => setBtnFocused(false)}
      >
        Start Your Adventure
      </button>
    </div>
  );
}

// Tank Creation Screen
function TankStep({ tank, setTank }: { tank: TankState; setTank: (t: TankState) => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const fromDashboard = location.state && location.state.fromDashboard;
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (fromDashboard) navigate('/dashboard');
        else if (tank.size >= 1) navigate('/fish');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [fromDashboard, navigate, tank.size]);
  return (
    <div className="adventure-screen tank-screen">
      <h2>Step 1: Create Your Tank</h2>
      <TankSVG size={tank.size} />
      <form style={{ margin: '1.5em 0' }}>
        <label>
          Tank Size (gallons):
          <input type="range" min={1} max={20} value={tank.size} onChange={e => setTank({ ...tank, size: Number(e.target.value) })} />
          <span style={{ marginLeft: 8, fontWeight: 600 }}>{tank.size} gal</span>
        </label>
        {tank.size < 3 && (
          <div style={{ color: '#d32f2f', fontWeight: 600, marginTop: 8, background: '#fff3e0', borderRadius: 8, padding: '8px 12px' }}>
            Warning: A tank smaller than 3 gallons is not recommended for bettas. Consider upgrading for better health and happiness.
          </div>
        )}
        <label style={{ display: 'block', marginTop: 12 }}>
          <input type="checkbox" checked={tank.heater} onChange={e => setTank({ ...tank, heater: e.target.checked })} /> Heater
        </label>
        <label style={{ display: 'block', marginTop: 6 }}>
          <input type="checkbox" checked={tank.filter} onChange={e => setTank({ ...tank, filter: e.target.checked })} /> Filter
        </label>
      </form>
      {fromDashboard ? (
        <button className="adventure-btn" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      ) : (
        <button className="adventure-btn" onClick={() => navigate('/fish')} disabled={tank.size < 1}>Next: Add Your Betta</button>
      )}
    </div>
  );
}

// Fish Creation Screen
function FishStep({ fish, setFish }: { fish: FishState; setFish: (f: FishState) => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const fromDashboard = location.state && location.state.fromDashboard;
  const colors = ['#e57373', '#64b5f6', '#81c784', '#ffd54f', '#ba68c8', '#ff8a65'];
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (fromDashboard) navigate('/dashboard');
        else navigate('/water');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [fromDashboard, navigate]);
  return (
    <div className="adventure-screen fish-screen" style={{ maxWidth: 420, margin: '0 auto', padding: 16 }}>
      <h2>Step 2: Add Your Betta</h2>
      <div style={{ margin: '1.5em 0' }}><FishSVG color={fish.color} mood="happy" /></div>
      <form style={{ marginBottom: 16 }}>
        <div className="card-section" style={{ background: '#f3f6fa', borderRadius: 12, padding: 16, marginBottom: 18 }}>
          <div className="section-header" style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>General</div>
          <label style={{ display: 'block', marginBottom: 12 }}>
            Name:
            <input type="text" value={fish.name} onChange={e => setFish({ ...fish, name: e.target.value })} placeholder="Your betta's name" style={{ marginLeft: 8, fontSize: 16, padding: 6, borderRadius: 6, border: '1px solid #cfd8dc', width: '70%' }} />
          </label>
          <div style={{ marginTop: 8, marginBottom: 12 }}>
            Color:
            {colors.map(c => (
              <button key={c} type="button" style={{ background: c, border: fish.color === c ? '2px solid #222' : '1px solid #ccc', borderRadius: '50%', width: 36, height: 36, margin: '0 8px', cursor: 'pointer' }} onClick={() => setFish({ ...fish, color: c })} aria-label={c} />
            ))}
          </div>
        </div>
        <div className="card-section" style={{ background: '#f3f6fa', borderRadius: 12, padding: 16, marginBottom: 18 }}>
          <div className="section-header" style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Appearance</div>
          <label style={{ display: 'block', marginBottom: 12 }}>
            Fin Condition:
            <select value={fish.finCondition} onChange={e => setFish({ ...fish, finCondition: e.target.value })} style={{ fontSize: 16, padding: 6, borderRadius: 6, border: '1px solid #cfd8dc', marginLeft: 8 }}>
              <option>Healthy</option>
              <option>Fin rot</option>
              <option>Torn</option>
              <option>Clamped</option>
            </select>
          </label>
          <label style={{ display: 'block', marginBottom: 12 }}>
            Coloration:
            <select value={fish.colorCondition} onChange={e => setFish({ ...fish, colorCondition: e.target.value })} style={{ fontSize: 16, padding: 6, borderRadius: 6, border: '1px solid #cfd8dc', marginLeft: 8 }}>
              <option>Vibrant</option>
              <option>Faded</option>
              <option>Spots</option>
            </select>
          </label>
          <label style={{ display: 'block', marginBottom: 12 }}>
            Gills/Breathing:
            <select value={fish.gillCondition} onChange={e => setFish({ ...fish, gillCondition: e.target.value })} style={{ fontSize: 16, padding: 6, borderRadius: 6, border: '1px solid #cfd8dc', marginLeft: 8 }}>
              <option>Normal</option>
              <option>Rapid</option>
              <option>Gasping</option>
            </select>
          </label>
          <label style={{ display: 'block', marginBottom: 12 }}>
            Body Condition:
            <select value={fish.bodyCondition} onChange={e => setFish({ ...fish, bodyCondition: e.target.value })} style={{ fontSize: 16, padding: 6, borderRadius: 6, border: '1px solid #cfd8dc', marginLeft: 8 }}>
              <option>Normal</option>
              <option>Bloated</option>
              <option>Thin</option>
            </select>
          </label>
        </div>
        <div className="card-section" style={{ background: '#f3f6fa', borderRadius: 12, padding: 16, marginBottom: 18 }}>
          <div className="section-header" style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Behavior</div>
          <label style={{ display: 'block', marginBottom: 12 }}>
            Appetite:
            <select value={fish.appetite} onChange={e => setFish({ ...fish, appetite: e.target.value })} style={{ fontSize: 16, padding: 6, borderRadius: 6, border: '1px solid #cfd8dc', marginLeft: 8 }}>
              <option>Eating well</option>
              <option>Not eating</option>
            </select>
          </label>
          <label style={{ display: 'block', marginBottom: 12 }}>
            Activity:
            <select value={fish.activity} onChange={e => setFish({ ...fish, activity: e.target.value })} style={{ fontSize: 16, padding: 6, borderRadius: 6, border: '1px solid #cfd8dc', marginLeft: 8 }}>
              <option>Normal</option>
              <option>Lethargic</option>
              <option>Hyperactive</option>
            </select>
          </label>
          <label style={{ display: 'block', marginBottom: 12 }}>
            Behavior:
            <select value={fish.behavior} onChange={e => setFish({ ...fish, behavior: e.target.value })} style={{ fontSize: 16, padding: 6, borderRadius: 6, border: '1px solid #cfd8dc', marginLeft: 8 }}>
              <option>Normal</option>
              <option>Hiding</option>
              <option>Aggressive</option>
            </select>
          </label>
        </div>
      </form>
      {fromDashboard ? (
        <button className="adventure-btn" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      ) : (
        <button className="adventure-btn" onClick={() => navigate('/water')} disabled={!fish.name}>Next: Test Water</button>
      )}
    </div>
  );
}

// Water Testing Screen
function WaterStep({ water, setWater, fishColor }: { water: WaterState; setWater: (w: WaterState) => void; fishColor: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const fromDashboard = location.state && location.state.fromDashboard;
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (fromDashboard) navigate('/dashboard');
        else navigate('/dashboard');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [fromDashboard, navigate]);
  // Mood logic
  const happy =
    water.temperature >= 75 && water.temperature <= 82 &&
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
        <label>Temperature (°F):
          <input type="range" min={70} max={88} value={water.temperature} onChange={e => setWater({ ...water, temperature: Number(e.target.value) })} />
          <span style={{ marginLeft: 8 }}>{water.temperature}°F</span>
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
        </label><br />
      </form>
      {fromDashboard ? (
        <button className="adventure-btn" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      ) : (
        <button className="adventure-btn" onClick={() => navigate('/dashboard')}>Finish: See Your Tank</button>
      )}
    </div>
  );
}

// Dashboard/Virtual Tank
function Dashboard({ tank, fish, water, setTank, setFish, setWater }: { tank: TankState; fish: FishState; water: WaterState; setTank: (t: TankState) => void; setFish: (f: FishState) => void; setWater: (w: WaterState) => void; }) {
  const navigate = useNavigate();
  const [showUpdateMenu, setShowUpdateMenu] = useState(false);
  const [fishPos, setFishPos] = useState(0.5); // 0 to 1, percent across tank
  const [fishDir, setFishDir] = useState(1); // 1 = right, -1 = left
  const [fishPause, setFishPause] = useState(false);
  const [fishTime, setFishTime] = useState(0); // for vertical sine
  React.useEffect(() => {
    if (fishPause) return;
    const interval = setInterval(() => {
      setFishTime(t => t + 0.03);
      setFishPos(pos => {
        let next = pos + 0.005 * fishDir * (Math.random() * 0.7 + 0.3); // randomize speed a bit
        if (next > 1) {
          setFishDir(-1);
          next = 1;
        } else if (next < 0) {
          setFishDir(1);
          next = 0;
        } else if (Math.random() < 0.005) { // random direction change
          setFishDir(d => -d);
        }
        if (Math.random() < 0.01) { // random pause
          setFishPause(true);
          setTimeout(() => setFishPause(false), 600 + Math.random() * 1200);
        }
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [fishDir, fishPause]);
  // Mood logic
  const happy =
    water.temperature >= 75 && water.temperature <= 82 &&
    water.pH >= 6.5 && water.pH <= 7.5 &&
    water.ammonia === 0 &&
    water.nitrite === 0 &&
    water.nitrate <= 20 &&
    fish.finCondition === 'Healthy' &&
    fish.activity === 'Normal' &&
    fish.appetite === 'Eating well' &&
    fish.colorCondition === 'Vibrant' &&
    fish.gillCondition === 'Normal' &&
    fish.bodyCondition === 'Normal' &&
    fish.behavior === 'Normal' &&
    tank.heater &&
    tank.filter;

  // BettaScore calculation
  let score = 100;
  // Tank
  if (tank.size < 3) score -= 30;
  else if (tank.size < 5) score -= 10;
  else if (tank.size < 10) score -= 5;
  if (!tank.heater) score -= 20; // Increase penalty for no heater
  if (!tank.filter) score -= 20; // Increase penalty for no filter
  // Water
  if (water.temperature < 75 || water.temperature > 82) score -= 10;
  if (water.pH < 6.5 || water.pH > 7.5) score -= 5;
  if (water.ammonia > 0) score -= 20;
  if (water.nitrite > 0) score -= 10;
  if (water.nitrate > 20) score -= 5;
  // Fish health
  if (fish.finCondition !== 'Healthy') score -= 10;
  if (fish.activity !== 'Normal') score -= 5;
  if (fish.appetite !== 'Eating well') score -= 5;
  if (fish.colorCondition !== 'Vibrant') score -= 5;
  if (fish.gillCondition !== 'Normal') score -= 5;
  if (fish.bodyCondition !== 'Normal') score -= 5;
  if (fish.behavior !== 'Normal') score -= 5;
  // Clamp score
  score = Math.max(0, Math.min(100, score));

  // Helper: Grouped issue analysis for tank, water, and health
  function getGroupedIssueAnalysis() {
    // Collect all non-optimal fields
    const symptoms: { key: string; label: string }[] = [];
    if (fish.appetite !== 'Eating well') symptoms.push({ key: 'appetite', label: 'Loss of appetite' });
    if (fish.activity !== 'Normal') symptoms.push({ key: 'activity', label: 'Abnormal activity' });
    if (fish.finCondition !== 'Healthy') symptoms.push({ key: 'fin', label: 'Fin issues' });
    if (fish.colorCondition !== 'Vibrant') symptoms.push({ key: 'color', label: 'Color loss/spots' });
    if (fish.gillCondition !== 'Normal') symptoms.push({ key: 'gills', label: 'Gill/breathing issues' });
    if (fish.bodyCondition !== 'Normal') symptoms.push({ key: 'body', label: 'Body condition' });
    if (fish.behavior !== 'Normal') symptoms.push({ key: 'behavior', label: 'Unusual behavior' });
    if (water.temperature < 75 || water.temperature > 82) symptoms.push({ key: 'temp', label: 'Temperature out of range' });
    if (water.pH < 6.5 || water.pH > 7.5) symptoms.push({ key: 'ph', label: 'pH out of range' });
    if (water.ammonia > 0) symptoms.push({ key: 'ammonia', label: 'High ammonia' });
    if (water.nitrite > 0) symptoms.push({ key: 'nitrite', label: 'High nitrite' });
    if (water.nitrate > 20) symptoms.push({ key: 'nitrate', label: 'High nitrate' });
    if (!tank.heater) symptoms.push({ key: 'heater', label: 'No heater' });
    if (!tank.filter) symptoms.push({ key: 'filter', label: 'No filter' });
    if (tank.size < 3) symptoms.push({ key: 'size', label: 'Tank too small' });
    if (tank.size < 5) symptoms.push({ key: 'size', label: 'Tank too small' });

    // Map causes to symptoms
    const causes = [
      {
        key: 'ammonia',
        label: 'High ammonia',
        test: () => water.ammonia > 0,
        likelihood: water.ammonia > 0.5 ? 'Very likely' : 'Possible',
        explains: ['appetite', 'fin', 'color', 'gills', 'body'],
        tip: 'Do a water change and check your filter. Ammonia should always be 0.'
      },
      {
        key: 'nitrite',
        label: 'High nitrite',
        test: () => water.nitrite > 0,
        likelihood: water.nitrite > 0.5 ? 'Very likely' : 'Possible',
        explains: ['appetite', 'activity', 'fin', 'color', 'gills', 'body'],
        tip: 'Do a water change and check your filter. Nitrite should always be 0.'
      },
      {
        key: 'nitrate',
        label: 'High nitrate',
        test: () => water.nitrate > 20,
        likelihood: water.nitrate > 40 ? 'Very likely' : 'Possible',
        explains: ['appetite', 'color', 'body'],
        tip: 'Do a partial water change to reduce nitrate.'
      },
      {
        key: 'temp',
        label: 'Temperature out of range',
        test: () => water.temperature < 75 || water.temperature > 82,
        likelihood: (water.temperature < 72 || water.temperature > 85) ? 'Very likely' : 'Possible',
        explains: ['appetite', 'activity', 'gills'],
        tip: 'Keep temperature between 75–82°F for bettas.'
      },
      {
        key: 'ph',
        label: 'pH out of range',
        test: () => water.pH < 6.5 || water.pH > 7.5,
        likelihood: (water.pH < 6 || water.pH > 8) ? 'Very likely' : 'Possible',
        explains: ['appetite', 'color', 'gills'],
        tip: 'Aim for pH 6.5–7.5. Sudden changes can stress your betta.'
      },
      {
        key: 'heater',
        label: 'No heater',
        test: () => !tank.heater,
        likelihood: 'Possible',
        explains: ['temp', 'activity', 'appetite'],
        tip: 'A heater is important for stable, warm water.'
      },
      {
        key: 'filter',
        label: 'No filter',
        test: () => !tank.filter,
        likelihood: 'Possible',
        explains: ['ammonia', 'nitrite', 'nitrate'],
        tip: 'A filter helps keep water clean and safe.'
      },
      {
        key: 'size',
        label: 'Tank too small',
        test: () => tank.size < 3,
        likelihood: 'Possible',
        explains: ['activity', 'behavior'],
        tip: 'A 3+ gallon tank is best for betta health.'
      },
      // Health-specific causes
      {
        key: 'fin',
        label: 'Fin issues',
        test: () => fish.finCondition !== 'Healthy',
        likelihood: 'Possible',
        explains: ['fin'],
        tip: 'Fin rot or damage can be from poor water, injury, or infection.'
      },
      {
        key: 'color',
        label: 'Color loss/spots',
        test: () => fish.colorCondition !== 'Vibrant',
        likelihood: 'Possible',
        explains: ['color'],
        tip: 'Color loss can be from stress, illness, or poor water.'
      },
      {
        key: 'gills',
        label: 'Gill/breathing issues',
        test: () => fish.gillCondition !== 'Normal',
        likelihood: 'Possible',
        explains: ['gills'],
        tip: 'Rapid or gasping breathing can be from toxins or disease.'
      },
      {
        key: 'body',
        label: 'Body condition',
        test: () => fish.bodyCondition !== 'Normal',
        likelihood: 'Possible',
        explains: ['body'],
        tip: 'Bloated or thin bettas may have diet or internal issues.'
      },
      {
        key: 'behavior',
        label: 'Unusual behavior',
        test: () => fish.behavior !== 'Normal',
        likelihood: 'Possible',
        explains: ['behavior'],
        tip: 'Hiding or aggression can be from stress, tank mates, or illness.'
      }
    ];
    // For each cause, if it applies, list the symptoms it may explain
    const grouped = causes
      .map(cause => {
        if (!cause.test()) return null;
        // Find which symptoms this cause explains and are present
        const explained = symptoms.filter(s => cause.explains.includes(s.key));
        if (explained.length === 0) return null;
        return {
          label: cause.label,
          likelihood: cause.likelihood,
          symptoms: explained.map(e => e.label),
          tip: cause.tip
        };
      })
      .filter((x): x is { label: string; likelihood: string; symptoms: string[]; tip: string } => x !== null);
    return grouped;
  }
  const groupedIssues = getGroupedIssueAnalysis();

  // Proportional tank and fish size for Betta card
  const tankWidth = tank.size * 11;
  const tankHeight = tank.size * 6;
  const fishWidth = tankWidth * 0.22; // 22% of tank width
  const fishHeight = fishWidth * 0.5; // maintain aspect ratio (SVG is 80x40)
  const fishLeft = fishPos * (tankWidth - fishWidth);

  return (
    <div className="adventure-screen dashboard-screen" style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <h2 style={{ marginBottom: 24 }}>Your Virtual Betta Tank</h2>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: 32, justifyContent: 'center', alignItems: 'flex-start', marginBottom: 24 }}>
        <div className="card-section" style={{ background: '#e3f2fd', borderRadius: 12, padding: 18, minWidth: 180, maxWidth: 220, flex: '0 0 200px' }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>🐟 Tank</div>
          <div><strong>Size:</strong> {tank.size} gal</div>
          <div><strong>Heater:</strong> {tank.heater ? 'Yes' : 'No'}</div>
          <div><strong>Filter:</strong> {tank.filter ? 'Yes' : 'No'}</div>
        </div>
        <div className="card-section" style={{ background: '#f3f6fa', borderRadius: 12, padding: 18, minWidth: 220, flex: '1 1 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>🐠 Betta</div>
          <div style={{ position: 'relative', width: tankWidth, height: tankHeight, margin: '0 auto 8px auto' }}>
            <TankSVG size={tank.size} />
            <div style={{
              position: 'absolute',
              left: fishLeft,
              top: `calc(30% + ${Math.max(0, tankHeight * 0.15 + 0.2 * tankHeight * Math.sin(fishTime * 2))}px)`,
              transition: fishPause ? 'none' : 'left 0.03s linear, top 0.03s linear',
              transform: fishDir === 1 ? 'scaleX(1)' : 'scaleX(-1)',
              width: fishWidth,
              height: fishHeight,
              pointerEvents: 'none',
              opacity: fishPause ? 0.7 : 1,
            }}>
              <FishSVG color={fish.color} mood={happy ? 'happy' : 'sad'} />
            </div>
            <span style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', textAlign: 'center', fontWeight: 600 }}>{fish.name}</span>
          </div>
          <div><strong>Color:</strong> <span style={{ color: fish.color }}>{fish.color}</span></div>
        </div>
        <div className="card-section" style={{ background: '#e8f5e9', borderRadius: 12, padding: 18, minWidth: 180, maxWidth: 220, flex: '0 0 200px' }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>💧 Water</div>
          <div><strong>Temp:</strong> {water.temperature}°F</div>
          <div><strong>pH:</strong> {water.pH.toFixed(1)}</div>
          <div><strong>NH₃:</strong> {water.ammonia}</div>
          <div><strong>NO₂⁻:</strong> {water.nitrite}</div>
          <div><strong>NO₃⁻:</strong> {water.nitrate}</div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <div className="card-section" style={{ background: '#fffde7', borderRadius: 12, padding: 18, minWidth: 320, maxWidth: 480 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>🩺 Health</div>
          <div><strong>Appetite:</strong> {fish.appetite}</div>
          <div><strong>Activity:</strong> {fish.activity}</div>
          <div><strong>Fin:</strong> {fish.finCondition}</div>
          <div><strong>Color:</strong> {fish.colorCondition}</div>
          <div><strong>Gills:</strong> {fish.gillCondition}</div>
          <div><strong>Body:</strong> {fish.bodyCondition}</div>
          <div><strong>Behavior:</strong> {fish.behavior}</div>
        </div>
      </div>
      <button
        className="adventure-btn"
        style={{ marginBottom: 16, fontSize: 22, width: 48, height: 48, borderRadius: '50%', padding: 0, lineHeight: '48px' }}
        aria-label="Update"
        onClick={() => setShowUpdateMenu(v => !v)}
        title="Update tank, fish, or water parameters"
      >
        🛠️
      </button>
      {showUpdateMenu && (
        <div style={{ background: '#fff', border: '1px solid #cfd8dc', borderRadius: 10, boxShadow: '0 2px 12px rgba(33,150,243,0.13)', padding: 16, marginBottom: 16, zIndex: 10, position: 'relative', width: 220, marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Update:</div>
          <button className="adventure-btn" style={{ width: '100%', margin: '6px 0', fontSize: 16, padding: '0.5em 0' }} onClick={() => { setShowUpdateMenu(false); navigate('/tank', { state: { fromDashboard: true } }); }}>Step 1: Tank</button>
          <button className="adventure-btn" style={{ width: '100%', margin: '6px 0', fontSize: 16, padding: '0.5em 0' }} onClick={() => { setShowUpdateMenu(false); navigate('/fish', { state: { fromDashboard: true } }); }}>Step 2: Fish</button>
          <button className="adventure-btn" style={{ width: '100%', margin: '6px 0', fontSize: 16, padding: '0.5em 0' }} onClick={() => { setShowUpdateMenu(false); navigate('/water', { state: { fromDashboard: true } }); }}>Step 3: Water</button>
          <button style={{ width: '100%', margin: '6px 0', fontSize: 14, background: '#eee', border: 'none', borderRadius: 6, padding: '0.4em 0', cursor: 'pointer' }} onClick={() => setShowUpdateMenu(false)}>Cancel</button>
        </div>
      )}
      <div style={{ margin: '1.5em 0', width: 220, marginLeft: 'auto', marginRight: 'auto' }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>BettaScore
          <span title="Score is based on tank size, heater, filter, water, and fish health parameters. 100% = optimal conditions." style={{ marginLeft: 8, fontSize: 16, cursor: 'help' }}>ⓘ</span>
        </div>
        <div style={{ background: '#e3e8ee', borderRadius: 10, height: 18, width: '100%', marginBottom: 6, position: 'relative' }}>
          <div style={{ width: `${score}%`, background: score > 80 ? '#4caf50' : score > 60 ? '#ff9800' : '#f44336', height: '100%', borderRadius: 10, transition: 'width 0.5s', position: 'absolute', left: 0, top: 0 }} />
          <div style={{ position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', fontWeight: 600, color: '#222', fontSize: 14, lineHeight: '18px', width: '100%' }}>{score}%</div>
        </div>
      </div>
      <p>{happy ? 'Your betta is happy and healthy!' : 'See below for possible reasons and tips.'}</p>
      {(!tank.heater || !tank.filter || tank.size < 5) && (
        <div style={{
          background: '#fffde7',
          border: '1px solid #ffe082',
          borderRadius: 10,
          boxShadow: '0 2px 12px rgba(33,150,243,0.07)',
          padding: 16,
          margin: '16px auto',
          maxWidth: 420
        }}>
          <strong style={{ display: 'block', marginBottom: 8 }}>Tank & Equipment Feedback:</strong>
          {tank.size < 3 && (
            <div style={{ color: '#d32f2f', fontWeight: 600, marginBottom: 8 }}>
              Your tank is smaller than 3 gallons. This is not recommended for bettas and will lower your BettaScore.
            </div>
          )}
          {tank.size >= 3 && tank.size < 5 && (
            <div style={{ color: '#b28704', fontWeight: 600, marginBottom: 8 }}>
              Tanks between 3 and 5 gallons are okay, but 5+ gallons is best for betta health and will improve your BettaScore.
            </div>
          )}
          {!tank.heater && (
            <div style={{ color: '#b28704', fontWeight: 600, marginBottom: 8 }}>
              No heater detected. Bettas need stable, warm water (75–82°F). Add a heater for optimal conditions and a higher BettaScore.
            </div>
          )}
          {!tank.filter && (
            <div style={{ color: '#b28704', fontWeight: 600 }}>
              No filter detected. A filter helps keep water clean and safe, and improves your BettaScore.
            </div>
          )}
        </div>
      )}
      {/* Water Condition Feedback */}
      {(
        water.temperature < 75 || water.temperature > 82 ||
        water.pH < 6.5 || water.pH > 7.5 ||
        water.ammonia > 0 ||
        water.nitrite > 0 ||
        water.nitrate > 20
      ) && (
        <div style={{
          background: '#e3f2fd',
          border: '1px solid #90caf9',
          borderRadius: 10,
          boxShadow: '0 2px 12px rgba(33,150,243,0.07)',
          padding: 16,
          margin: '16px auto',
          maxWidth: 420
        }}>
          <strong style={{ display: 'block', marginBottom: 8 }}>Water Condition Feedback:</strong>
          {water.temperature < 75 || water.temperature > 82 ? (
            <div style={{ color: '#1976d2', fontWeight: 600, marginBottom: 8 }}>
              <span role="img" aria-label="warning">⚠️</span> <b>Warning:</b> Temperature is {water.temperature}°F. Keep between 75–82°F for bettas.
            </div>
          ) : null}
          {water.pH < 6.5 || water.pH > 7.5 ? (
            <div style={{ color: '#1976d2', fontWeight: 600, marginBottom: 8 }}>
              <span role="img" aria-label="warning">⚠️</span> <b>Warning:</b> pH is {water.pH.toFixed(1)}. Aim for 6.5–7.5. Sudden changes can stress your betta.
            </div>
          ) : null}
          {water.ammonia > 0 ? (
            <div style={{ color: '#d32f2f', fontWeight: 600, marginBottom: 8 }}>
              <span role="img" aria-label="warning">⚠️</span> <b>Warning:</b> Ammonia detected ({water.ammonia}). Do a water change and check your filter. Ammonia should always be 0.
            </div>
          ) : null}
          {water.nitrite > 0 ? (
            <div style={{ color: '#d32f2f', fontWeight: 600, marginBottom: 8 }}>
              <span role="img" aria-label="warning">⚠️</span> <b>Warning:</b> Nitrite detected ({water.nitrite}). Do a water change and check your filter. Nitrite should always be 0.
            </div>
          ) : null}
          {water.nitrate > 20 ? (
            <div style={{ color: '#b28704', fontWeight: 600, marginBottom: 8 }}>
              <span role="img" aria-label="warning">⚠️</span> <b>Warning:</b> Nitrate is high ({water.nitrate}). Do a partial water change to reduce nitrate.
            </div>
          ) : null}
        </div>
      )}
      {!happy && groupedIssues.length > 0 && (
        <div className="issue-panel">
          <strong>Possible Issues & Causes:</strong>
          <ul>
            {groupedIssues.map((issue, i) => (
              <li key={i} style={{ marginBottom: 12 }}>
                <strong>{issue.label}</strong> <span style={{ color: issue.likelihood === 'Very likely' ? '#d32f2f' : '#b28704', fontWeight: 600 }}>({issue.likelihood})</span>
                <div style={{ fontSize: 14, margin: '4px 0 4px 0' }}>Affects: {issue.symptoms.join(', ')}</div>
                <span className="tip">Tip: {issue.tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function App() {
  // State for the adventure
  const [tank, setTank] = useState<TankState>({ size: 10, heater: true, filter: true });
  const [fish, setFish] = useState<FishState>({ name: '', color: '#e57373', appetite: 'Eating well', activity: 'Normal', finCondition: 'Healthy', colorCondition: 'Vibrant', gillCondition: 'Normal', bodyCondition: 'Normal', behavior: 'Normal' });
  const [water, setWater] = useState<WaterState>({ temperature: 78, pH: 7, ammonia: 0, nitrite: 0, nitrate: 10 });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/tank" element={<TankStep tank={tank} setTank={setTank} />} />
        <Route path="/fish" element={<FishStep fish={fish} setFish={setFish} />} />
        <Route path="/water" element={<WaterStep water={water} setWater={setWater} fishColor={fish.color} />} />
        <Route path="/dashboard" element={<Dashboard tank={tank} fish={fish} water={water} setTank={setTank} setFish={setFish} setWater={setWater} />} />
      </Routes>
    </Router>
  );
}

export default App;
