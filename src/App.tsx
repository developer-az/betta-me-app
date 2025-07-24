import React, { useState, useEffect } from 'react';
import './App.css';

// Types for tank, fish, and parameters
interface Tank {
  name: string;
  size: number; // gallons
  heater: boolean;
  filter: boolean;
}

interface Fish {
  name: string;
  activity: string;
  appetite: string;
  finCondition: string;
  color: string;
  gillCondition: string;
  bodyCondition: string;
  behavior: string;
}

interface WaterParams {
  temperature: number;
  pH: number;
  ammonia: number;
  nitrite: number;
  nitrate: number;
  gh?: number;
  kh?: number;
}

// Helpers for local storage
const STORAGE_KEY = 'bettaMeData';
const HISTORY_KEY = 'bettaMeHistory';
const REMINDER_KEY = 'bettaMeReminders';

interface ReminderState {
  lastFed: string; // ISO date string
  lastWaterChange: string; // ISO date string
}

function saveToStorage(tank: Tank | null, fish: Fish | null, params: WaterParams | null) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ tank, fish, params })
  );
}

function loadFromStorage(): { tank: Tank | null; fish: Fish | null; params: WaterParams | null } {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return { tank: null, fish: null, params: null };
  try {
    return JSON.parse(data);
  } catch {
    return { tank: null, fish: null, params: null };
  }
}

function saveHistory(history: WaterParamsHistory[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}
function loadHistory(): WaterParamsHistory[] {
  const data = localStorage.getItem(HISTORY_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveReminders(reminders: ReminderState) {
  localStorage.setItem(REMINDER_KEY, JSON.stringify(reminders));
}
function loadReminders(): ReminderState {
  const data = localStorage.getItem(REMINDER_KEY);
  if (!data) return { lastFed: '', lastWaterChange: '' };
  try {
    return JSON.parse(data);
  } catch {
    return { lastFed: '', lastWaterChange: '' };
  }
}

interface WaterParamsHistory extends WaterParams {
  date: string; // ISO string
}

function App() {
  // State for tank, fish, and water parameters
  const [tank, setTank] = useState<Tank | null>(null);
  const [fish, setFish] = useState<Fish | null>(null);
  const [params, setParams] = useState<WaterParams | null>(null);
  const [history, setHistory] = useState<WaterParamsHistory[]>([]);
  const [reminders, setReminders] = useState<ReminderState>({ lastFed: '', lastWaterChange: '' });

  // Load from local storage on mount
  useEffect(() => {
    const { tank, fish, params } = loadFromStorage();
    setTank(tank);
    setFish(fish);
    setParams(params);
    setHistory(loadHistory());
    setReminders(loadReminders());
  }, []);

  // Save to local storage on change
  useEffect(() => {
    saveToStorage(tank, fish, params);
  }, [tank, fish, params]);
  useEffect(() => {
    saveHistory(history);
  }, [history]);
  useEffect(() => {
    saveReminders(reminders);
  }, [reminders]);

  // BettaScore calculation (simple version)
  function calculateBettaScore(tank: Tank | null, fish: Fish | null, params: WaterParams | null): number {
    if (!tank || !fish || !params) return 0;
    let score = 100;
    // Tank size
    if (tank.size < 5) score -= 20;
    if (!tank.heater) score -= 10;
    if (!tank.filter) score -= 10;
    // Water params
    if (params.temperature < 24 || params.temperature > 28) score -= 10;
    if (params.pH < 6.5 || params.pH > 7.5) score -= 5;
    if (params.ammonia > 0) score -= 20;
    if (params.nitrite > 0) score -= 10;
    if (params.nitrate > 20) score -= 5;
    // Fish health (very basic)
    if (fish.finCondition !== 'Healthy') score -= 10;
    if (fish.activity !== 'Normal') score -= 5;
    if (fish.appetite !== 'Eating well') score -= 5;
    if (fish.color !== 'Vibrant') score -= 5;
    if (fish.gillCondition !== 'Normal') score -= 5;
    if (fish.bodyCondition !== 'Normal') score -= 5;
    if (fish.behavior !== 'Normal') score -= 5;
    return Math.max(0, score);
  }

  const bettaScore = calculateBettaScore(tank, fish, params);

  // Form state for Tank
  const [tankForm, setTankForm] = useState<Tank>({
    name: tank?.name || '',
    size: tank?.size || 5,
    heater: tank?.heater ?? true,
    filter: tank?.filter ?? true,
  });

  // Form state for Fish
  const [fishForm, setFishForm] = useState<Fish>({
    name: fish?.name || '',
    activity: fish?.activity || 'Normal',
    appetite: fish?.appetite || 'Eating well',
    finCondition: fish?.finCondition || 'Healthy',
    color: fish?.color || 'Vibrant',
    gillCondition: fish?.gillCondition || 'Normal',
    bodyCondition: fish?.bodyCondition || 'Normal',
    behavior: fish?.behavior || 'Normal',
  });

  // Form state for Water Params
  const [paramsForm, setParamsForm] = useState<WaterParams>({
    temperature: params?.temperature || 26,
    pH: params?.pH || 7,
    ammonia: params?.ammonia || 0,
    nitrite: params?.nitrite || 0,
    nitrate: params?.nitrate || 10,
    gh: params?.gh,
    kh: params?.kh,
  });

  // Handlers
  function handleTankSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTank({ ...tankForm });
  }
  function handleFishSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFish({ ...fishForm });
  }
  function handleParamsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setParams({ ...paramsForm });
    // Add to history
    const entry: WaterParamsHistory = { ...paramsForm, date: new Date().toISOString() };
    setHistory(h => [entry, ...h].slice(0, 30)); // keep last 30 entries
  }

  // Reset all data
  function handleReset() {
    setTank(null);
    setFish(null);
    setParams(null);
    setTankForm({ name: '', size: 5, heater: true, filter: true });
    setFishForm({ name: '', activity: 'Normal', appetite: 'Eating well', finCondition: 'Healthy', color: 'Vibrant', gillCondition: 'Normal', bodyCondition: 'Normal', behavior: 'Normal' });
    setParamsForm({ temperature: 26, pH: 7, ammonia: 0, nitrite: 0, nitrate: 10, gh: undefined, kh: undefined });
    localStorage.removeItem(STORAGE_KEY);
  }

  // Reminders logic
  const today = new Date().toISOString().slice(0, 10);
  const fedToday = reminders.lastFed === today;
  const waterChangedToday = reminders.lastWaterChange === today;
  function markFed() {
    setReminders(r => ({ ...r, lastFed: today }));
  }
  function markWaterChange() {
    setReminders(r => ({ ...r, lastWaterChange: today }));
  }

  // BettaScore visual feedback
  let scoreColor = '#4caf50';
  let scoreEmoji = '🐟';
  if (bettaScore < 60) {
    scoreColor = '#f44336';
    scoreEmoji = '😟';
  } else if (bettaScore < 80) {
    scoreColor = '#ff9800';
    scoreEmoji = '😐';
  } else {
    scoreColor = '#4caf50';
    scoreEmoji = '😊';
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Betta Fish Keeper</h1>
        <p>Track your betta's health and tank conditions. Get your BettaScore!</p>
      </header>
      <main className="betta-main">
        {/* Reminders Section */}
        <section className="reminders-section">
          <h2>Reminders</h2>
          <div className="reminder-row">
            <span>Feeding:</span>
            <button className={fedToday ? 'reminder-done' : 'reminder-action'} onClick={markFed} disabled={fedToday}>
              {fedToday ? 'Fed Today ✔️' : 'Mark as Fed'}
            </button>
          </div>
          <div className="reminder-row">
            <span>Water Change:</span>
            <button className={waterChangedToday ? 'reminder-done' : 'reminder-action'} onClick={markWaterChange} disabled={waterChangedToday}>
              {waterChangedToday ? 'Changed Today ✔️' : 'Mark as Changed'}
            </button>
          </div>
        </section>
        <button className="reset-btn" onClick={handleReset}>Reset All</button>
        <section>
          <h2>1. Tank Setup</h2>
          <form onSubmit={handleTankSubmit} className="betta-form">
            <label>
              Tank Name:
              <input type="text" value={tankForm.name} onChange={e => setTankForm(f => ({ ...f, name: e.target.value }))} required />
              <span className="helper-text">Give your tank a name for easy reference.</span>
            </label>
            <label>
              Size (gallons):
              <input type="number" min={1} value={tankForm.size} onChange={e => setTankForm(f => ({ ...f, size: Number(e.target.value) }))} required />
              <span className="helper-text">Minimum 5 gallons recommended for bettas.</span>
            </label>
            <label>
              Heater:
              <input type="checkbox" checked={tankForm.heater} onChange={e => setTankForm(f => ({ ...f, heater: e.target.checked }))} />
              <span className="helper-text">Bettas need stable warm water (24–28°C).</span>
            </label>
            <label>
              Filter:
              <input type="checkbox" checked={tankForm.filter} onChange={e => setTankForm(f => ({ ...f, filter: e.target.checked }))} />
              <span className="helper-text">A filter helps keep water clean and healthy.</span>
            </label>
            <button type="submit">Save Tank</button>
            {tank && <div className="saved-msg">Saved!</div>}
          </form>
        </section>
        <section>
          <h2>2. Fish Profile</h2>
          <form onSubmit={handleFishSubmit} className="betta-form">
            <label>
              Name:
              <input type="text" value={fishForm.name} onChange={e => setFishForm(f => ({ ...f, name: e.target.value }))} required />
              <span className="helper-text">Name your betta fish!</span>
            </label>
            <label>
              Activity:
              <select value={fishForm.activity} onChange={e => setFishForm(f => ({ ...f, activity: e.target.value }))}>
                <option>Normal</option>
                <option>Lethargic</option>
                <option>Hyperactive</option>
              </select>
              <span className="helper-text">Normal activity is a good sign.</span>
            </label>
            <label>
              Appetite:
              <select value={fishForm.appetite} onChange={e => setFishForm(f => ({ ...f, appetite: e.target.value }))}>
                <option>Eating well</option>
                <option>Not eating</option>
              </select>
              <span className="helper-text">Loss of appetite can indicate stress or illness.</span>
            </label>
            <label>
              Fin Condition:
              <select value={fishForm.finCondition} onChange={e => setFishForm(f => ({ ...f, finCondition: e.target.value }))}>
                <option>Healthy</option>
                <option>Fin rot</option>
                <option>Torn</option>
                <option>Clamped</option>
              </select>
              <span className="helper-text">Look for tears, rot, or clamped fins.</span>
            </label>
            <label>
              Coloration:
              <select value={fishForm.color} onChange={e => setFishForm(f => ({ ...f, color: e.target.value }))}>
                <option>Vibrant</option>
                <option>Faded</option>
                <option>Spots</option>
              </select>
              <span className="helper-text">Faded color or spots may indicate health issues.</span>
            </label>
            <label>
              Gills/Breathing:
              <select value={fishForm.gillCondition} onChange={e => setFishForm(f => ({ ...f, gillCondition: e.target.value }))}>
                <option>Normal</option>
                <option>Rapid</option>
                <option>Gasping</option>
              </select>
              <span className="helper-text">Rapid or gasping breathing can be a warning sign.</span>
            </label>
            <label>
              Body Condition:
              <select value={fishForm.bodyCondition} onChange={e => setFishForm(f => ({ ...f, bodyCondition: e.target.value }))}>
                <option>Normal</option>
                <option>Bloated</option>
                <option>Thin</option>
              </select>
              <span className="helper-text">Check for bloating or weight loss.</span>
            </label>
            <label>
              Behavior:
              <select value={fishForm.behavior} onChange={e => setFishForm(f => ({ ...f, behavior: e.target.value }))}>
                <option>Normal</option>
                <option>Hiding</option>
                <option>Aggressive</option>
              </select>
              <span className="helper-text">Unusual behavior can indicate stress or illness.</span>
            </label>
            <button type="submit">Save Fish</button>
            {fish && <div className="saved-msg">Saved!</div>}
          </form>
        </section>
        <section>
          <h2>3. Water Parameters</h2>
          <form onSubmit={handleParamsSubmit} className="betta-form">
            <label>
              Temperature (°C):
              <input type="number" min={10} max={35} value={paramsForm.temperature} onChange={e => setParamsForm(f => ({ ...f, temperature: Number(e.target.value) }))} required />
              <span className="helper-text">Ideal: 24–28°C (75–82°F).</span>
            </label>
            <label>
              pH:
              <input type="number" step={0.1} min={4} max={10} value={paramsForm.pH} onChange={e => setParamsForm(f => ({ ...f, pH: Number(e.target.value) }))} required />
              <span className="helper-text">Ideal: 6.5–7.5.</span>
            </label>
            <label>
              Ammonia (ppm):
              <input type="number" step={0.01} min={0} value={paramsForm.ammonia} onChange={e => setParamsForm(f => ({ ...f, ammonia: Number(e.target.value) }))} required />
              <span className="helper-text">Should always be 0.</span>
            </label>
            <label>
              Nitrite (ppm):
              <input type="number" step={0.01} min={0} value={paramsForm.nitrite} onChange={e => setParamsForm(f => ({ ...f, nitrite: Number(e.target.value) }))} required />
              <span className="helper-text">Should always be 0.</span>
            </label>
            <label>
              Nitrate (ppm):
              <input type="number" step={0.1} min={0} value={paramsForm.nitrate} onChange={e => setParamsForm(f => ({ ...f, nitrate: Number(e.target.value) }))} required />
              <span className="helper-text">Keep below 20 ppm for bettas.</span>
            </label>
            <label>
              GH (optional):
              <input type="number" min={0} value={paramsForm.gh ?? ''} onChange={e => setParamsForm(f => ({ ...f, gh: e.target.value ? Number(e.target.value) : undefined }))} />
              <span className="helper-text">General hardness (not critical for most bettas).</span>
            </label>
            <label>
              KH (optional):
              <input type="number" min={0} value={paramsForm.kh ?? ''} onChange={e => setParamsForm(f => ({ ...f, kh: e.target.value ? Number(e.target.value) : undefined }))} />
              <span className="helper-text">Carbonate hardness (not critical for most bettas).</span>
            </label>
            <button type="submit">Save Parameters</button>
            {params && <div className="saved-msg">Saved!</div>}
          </form>
          {/* History Table */}
          <div className="history-table-wrapper">
            <h3>Parameter History</h3>
            {history.length === 0 ? (
              <div className="helper-text">No history yet. Save water parameters to start tracking.</div>
            ) : (
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Temp (°C)</th>
                    <th>pH</th>
                    <th>NH₃</th>
                    <th>NO₂⁻</th>
                    <th>NO₃⁻</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i}>
                      <td>{new Date(h.date).toLocaleString()}</td>
                      <td>{h.temperature}</td>
                      <td>{h.pH}</td>
                      <td>{h.ammonia}</td>
                      <td>{h.nitrite}</td>
                      <td>{h.nitrate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
        <section>
          <h2>BettaScore</h2>
          <div className="betta-score-bar-wrapper">
            <div className="betta-score-bar" style={{ width: `${bettaScore}%`, background: scoreColor }} />
          </div>
          <div className="betta-score" style={{ fontSize: 32, fontWeight: 'bold', margin: '1em 0', color: scoreColor }}>
            {bettaScore} {scoreEmoji}
          </div>
          <p>Your BettaScore reflects how optimal your tank and fish conditions are for a healthy betta.</p>
        </section>
      </main>
    </div>
  );
}

export default App;
