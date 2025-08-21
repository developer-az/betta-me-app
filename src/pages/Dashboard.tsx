import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { TankSVG, FishSVG } from '../components/Visuals';
import { TankState, FishState, WaterState } from '../types';
import { useNavigate } from 'react-router-dom';
import { FlaskIcon, FishIcon, DropIcon, HeartIcon, BarIcon, PencilIcon } from '../components/Icons';

type DashboardProps = {
  tank?: TankState;
  fish?: FishState;
  water?: WaterState;
};

export default function DashboardPage({ tank, fish, water }: DashboardProps) {
  const navigate = useNavigate();
  const [showUpdateMenu, setShowUpdateMenu] = React.useState(false);
  const [fishPos, setFishPos] = React.useState(0.5);
  const [fishDir, setFishDir] = React.useState(1);
  const [fishPause, setFishPause] = React.useState(false);
  const [fishTime, setFishTime] = React.useState(0);

  React.useEffect(() => {
    if (fishPause) return;
    const interval = setInterval(() => {
      setFishTime(t => t + 0.03);
      setFishPos(pos => {
        let next = pos + 0.005 * fishDir * (Math.random() * 0.7 + 0.3);
        if (next > 1) { setFishDir(-1); next = 1; }
        else if (next < 0) { setFishDir(1); next = 0; }
        else if (Math.random() < 0.005) { setFishDir(d => -d); }
        if (Math.random() < 0.01) { setFishPause(true); setTimeout(() => setFishPause(false), 600 + Math.random() * 1200); }
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [fishDir, fishPause]);

  const happy =
    water && water.temperature >= 75 && water.temperature <= 82 &&
    water.pH >= 6.5 && water.pH <= 7.5 &&
    water.ammonia === 0 &&
    water.nitrite === 0 &&
    water.nitrate <= 20 &&
    fish && fish.finCondition === 'Healthy' &&
    fish.activity === 'Normal' &&
    fish.appetite === 'Eating well' &&
    fish.colorCondition === 'Vibrant' &&
    fish.gillCondition === 'Normal' &&
    fish.bodyCondition === 'Normal' &&
    fish.behavior === 'Normal' &&
    tank && tank.heater &&
    tank.filter;

  let score = 100;
  if (tank && tank.size < 3) score -= 30; else if (tank && tank.size < 5) score -= 10; else if (tank && tank.size < 10) score -= 5;
  if (tank && !tank.heater) score -= 20;
  if (tank && !tank.filter) score -= 20;
  if (water && (water.temperature < 75 || water.temperature > 82)) score -= 10;
  if (water && (water.pH < 6.5 || water.pH > 7.5)) score -= 5;
  if (water && water.ammonia > 0) score -= 20;
  if (water && water.nitrite > 0) score -= 10;
  if (water && water.nitrate > 20) score -= 5;
  if (fish && fish.finCondition !== 'Healthy') score -= 10;
  if (fish && fish.activity !== 'Normal') score -= 5;
  if (fish && fish.appetite !== 'Eating well') score -= 5;
  if (fish && fish.colorCondition !== 'Vibrant') score -= 5;
  if (fish && fish.gillCondition !== 'Normal') score -= 5;
  if (fish && fish.bodyCondition !== 'Normal') score -= 5;
  if (fish && fish.behavior !== 'Normal') score -= 5;
  score = Math.max(0, Math.min(100, score));

  const tankWidth = (tank?.size || 10) * 11;
  const tankHeight = (tank?.size || 10) * 6;
  const fishWidth = tankWidth * 0.22;
  const fishHeight = fishWidth * 0.5;
  const fishLeft = fishPos * (tankWidth - fishWidth);

  function getGroupedIssueAnalysis() {
    const symptoms: { key: string; label: string }[] = [];
    if (fish && fish.appetite !== 'Eating well') symptoms.push({ key: 'appetite', label: 'Loss of appetite' });
    if (fish && fish.activity !== 'Normal') symptoms.push({ key: 'activity', label: 'Abnormal activity' });
    if (fish && fish.finCondition !== 'Healthy') symptoms.push({ key: 'fin', label: 'Fin issues' });
    if (fish && fish.colorCondition !== 'Vibrant') symptoms.push({ key: 'color', label: 'Color loss/spots' });
    if (fish && fish.gillCondition !== 'Normal') symptoms.push({ key: 'gills', label: 'Gill/breathing issues' });
    if (fish && fish.bodyCondition !== 'Normal') symptoms.push({ key: 'body', label: 'Body condition' });
    if (fish && fish.behavior !== 'Normal') symptoms.push({ key: 'behavior', label: 'Unusual behavior' });
    if (water && (water.temperature < 75 || water.temperature > 82)) symptoms.push({ key: 'temp', label: 'Temperature out of range' });
    if (water && (water.pH < 6.5 || water.pH > 7.5)) symptoms.push({ key: 'ph', label: 'pH out of range' });
    if (water && water.ammonia > 0) symptoms.push({ key: 'ammonia', label: 'High ammonia' });
    if (water && water.nitrite > 0) symptoms.push({ key: 'nitrite', label: 'High nitrite' });
    if (water && water.nitrate > 20) symptoms.push({ key: 'nitrate', label: 'High nitrate' });
    if (tank && !tank.heater) symptoms.push({ key: 'heater', label: 'No heater' });
    if (tank && !tank.filter) symptoms.push({ key: 'filter', label: 'No filter' });
    if (tank && tank.size < 3) symptoms.push({ key: 'size', label: 'Tank too small' });

    const causes = [
      { key: 'ammonia', label: 'High ammonia', test: () => water && water.ammonia > 0, likelihood: water && water.ammonia > 0.5 ? 'Very likely' : 'Possible', explains: ['appetite', 'fin', 'color', 'gills', 'body'], tip: 'Do a water change and check your filter. Ammonia should always be 0.' },
      { key: 'nitrite', label: 'High nitrite', test: () => water && water.nitrite > 0, likelihood: water && water.nitrite > 0.5 ? 'Very likely' : 'Possible', explains: ['appetite', 'activity', 'fin', 'color', 'gills', 'body'], tip: 'Do a water change and check your filter. Nitrite should always be 0.' },
      { key: 'nitrate', label: 'High nitrate', test: () => water && water.nitrate > 20, likelihood: water && water.nitrate > 40 ? 'Very likely' : 'Possible', explains: ['appetite', 'color', 'body'], tip: 'Do a partial water change to reduce nitrate.' },
      { key: 'temp', label: 'Temperature out of range', test: () => water && (water.temperature < 75 || water.temperature > 82), likelihood: water && (water.temperature < 72 || water.temperature > 85) ? 'Very likely' : 'Possible', explains: ['appetite', 'activity', 'gills'], tip: 'Keep temperature between 75–82°F for bettas.' },
      { key: 'ph', label: 'pH out of range', test: () => water && (water.pH < 6.5 || water.pH > 7.5), likelihood: water && (water.pH < 6 || water.pH > 8) ? 'Very likely' : 'Possible', explains: ['appetite', 'color', 'gills'], tip: 'Aim for pH 6.5–7.5. Sudden changes can stress your betta.' },
      { key: 'heater', label: 'No heater', test: () => tank && !tank.heater, likelihood: 'Possible', explains: ['temp', 'activity', 'appetite'], tip: 'A heater is important for stable, warm water.' },
      { key: 'filter', label: 'No filter', test: () => tank && !tank.filter, likelihood: 'Possible', explains: ['ammonia', 'nitrite', 'nitrate'], tip: 'A filter helps keep water clean and safe.' },
      { key: 'size', label: 'Tank too small', test: () => tank && tank.size < 3, likelihood: 'Possible', explains: ['activity', 'behavior'], tip: 'A 3+ gallon tank is best for betta health.' },
      { key: 'fin', label: 'Fin issues', test: () => fish && fish.finCondition !== 'Healthy', likelihood: 'Possible', explains: ['fin'], tip: 'Fin rot or damage can be from poor water, injury, or infection.' },
      { key: 'color', label: 'Color loss/spots', test: () => fish && fish.colorCondition !== 'Vibrant', likelihood: 'Possible', explains: ['color'], tip: 'Color loss can be from stress, illness, or poor water.' },
      { key: 'gills', label: 'Gill/breathing issues', test: () => fish && fish.gillCondition !== 'Normal', likelihood: 'Possible', explains: ['gills'], tip: 'Rapid or gasping breathing can be from toxins or disease.' },
      { key: 'body', label: 'Body condition', test: () => fish && fish.bodyCondition !== 'Normal', likelihood: 'Possible', explains: ['body'], tip: 'Bloated or thin bettas may have diet or internal issues.' },
      { key: 'behavior', label: 'Unusual behavior', test: () => fish && fish.behavior !== 'Normal', likelihood: 'Possible', explains: ['behavior'], tip: 'Hiding or aggression can be from stress, tank mates, or illness.' },
    ];

    const grouped = causes
      .map(cause => {
        if (!cause.test()) return null as any;
        const explained = symptoms.filter(s => (cause.explains as string[]).includes(s.key));
        const symptomLabels = explained.length > 0 ? explained.map(e => e.label) : ['Direct metric condition'];
        return { label: cause.label, likelihood: cause.likelihood as string, symptoms: symptomLabels, tip: cause.tip as string };
      })
      .filter(Boolean) as { label: string; likelihood: string; symptoms: string[]; tip: string }[];
    return grouped;
  }
  const groupedIssues = getGroupedIssueAnalysis();

  return (
    <Layout currentStep="/dashboard">
      <div>
        <div className="text-xl font-bold mb-3">Welcome back, Betta Keeper!</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div className="flex">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full">
              <div className="p-3 rounded-2xl shadow bg-blue-50/95 dark:bg-blue-900/30 min-h-[180px]">
                <div className="flex items-center gap-2 mb-1 text-primary font-bold"><FlaskIcon /> Tank</div>
                <div className="text-sm"><strong>Size:</strong> {tank?.size || 10} gal</div>
                <div className="text-sm"><strong>Heater:</strong> {tank?.heater ? 'Yes' : 'No'}</div>
                <div className="text-sm"><strong>Filter:</strong> {tank?.filter ? 'Yes' : 'No'}</div>
              </div>
            </motion.div>
          </div>
          <div className="flex">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full">
              <div className="p-3 rounded-2xl shadow bg-slate-50/95 dark:bg-slate-800/70 min-h-[180px] flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1 text-primary font-bold"><FishIcon /> Betta</div>
                <div className="relative" style={{ width: tankWidth, height: tankHeight }}>
                  <TankSVG size={tank?.size || 10} />
                  <motion.div animate={{ x: fishLeft, y: Math.max(0, tankHeight * 0.15 + 0.2 * tankHeight * Math.sin(fishTime * 2)), scaleX: fishDir === 1 ? 1 : -1, opacity: fishPause ? 0.7 : 1 }} transition={{ type: 'spring', stiffness: 60, damping: 20 }} style={{ position: 'absolute', width: fishWidth, height: fishHeight, pointerEvents: 'none' }}>
                    <FishSVG color={fish?.color || '#e57373'} mood={happy ? 'happy' : 'sad'} />
                  </motion.div>
                  <div className="absolute left-0 bottom-0 w-full text-center font-semibold text-sm">{fish?.name || 'Your Betta'}</div>
                </div>
                <div className="text-sm"><strong>Color:</strong> <span style={{ color: fish?.color || '#e57373' }}>{fish?.color || '#e57373'}</span></div>
              </div>
            </motion.div>
          </div>
          <div className="flex">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="w-full">
              <div className="p-3 rounded-2xl shadow bg-green-50/95 dark:bg-green-900/30 min-h-[180px]">
                <div className="flex items-center gap-2 mb-1 text-primary font-bold"><DropIcon /> Water</div>
                <div className="text-sm"><strong>Temp:</strong> {water?.temperature || 78}°F</div>
                <div className="text-sm"><strong>pH:</strong> {(water?.pH || 7).toFixed(1)}</div>
                <div className="text-sm"><strong>NH₃:</strong> {water?.ammonia || 0}</div>
                <div className="text-sm"><strong>NO₂⁻:</strong> {water?.nitrite || 0}</div>
                <div className="text-sm"><strong>NO₃⁻:</strong> {water?.nitrate || 10}</div>
              </div>
            </motion.div>
          </div>
          <div className="flex">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full">
              <div className="p-3 rounded-2xl shadow bg-yellow-50/95 dark:bg-yellow-900/30 min-h-[180px]">
                <div className="flex items-center gap-2 mb-1 text-primary font-bold"><HeartIcon /> Health</div>
                <div className="text-sm"><strong>Appetite:</strong> {fish?.appetite || 'Eating well'}</div>
                <div className="text-sm"><strong>Activity:</strong> {fish?.activity || 'Normal'}</div>
                <div className="text-sm"><strong>Fin:</strong> {fish?.finCondition || 'Healthy'}</div>
                <div className="text-sm"><strong>Color:</strong> {fish?.colorCondition || 'Vibrant'}</div>
                <div className="text-sm"><strong>Gills:</strong> {fish?.gillCondition || 'Normal'}</div>
                <div className="text-sm"><strong>Body:</strong> {fish?.bodyCondition || 'Normal'}</div>
                <div className="text-sm"><strong>Behavior:</strong> {fish?.behavior || 'Normal'}</div>
              </div>
            </motion.div>
          </div>
          <div className="flex">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="w-full">
              <div className="p-3 rounded-2xl shadow bg-slate-100/95 dark:bg-slate-800/70 min-h-[120px] flex flex-col items-center justify-center">
                <div className="flex items-center gap-2 mb-1 text-primary font-bold"><BarIcon /> BettaScore</div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded h-4 mb-1 relative">
                  <div className={`h-4 rounded absolute left-0 top-0 transition-all`} style={{ width: `${score}%`, background: score > 80 ? '#4caf50' : score > 60 ? '#ff9800' : '#f44336' }} />
                  <div className="absolute left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-800 dark:text-slate-100 leading-4 w-full text-center">{score}%</div>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="flex">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0 }} className="w-full">
              <div className="p-3 rounded-2xl shadow bg-white/95 dark:bg-slate-800/70 min-h-[120px] flex flex-col items-center justify-center">
                <button className="px-5 py-2 rounded-xl bg-primary text-white font-semibold inline-flex items-center gap-2" onClick={() => setShowUpdateMenu(v => !v)}>
                  <PencilIcon /> Update Tank / Fish / Water
                </button>
                {showUpdateMenu && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl shadow p-2 mt-2 z-10 relative w-56 mx-auto">
                    <div className="font-semibold mb-1">Update:</div>
                    <div className="space-y-2">
                      <button className="w-full px-3 py-2 rounded bg-primary text-white" onClick={() => { setShowUpdateMenu(false); navigate('/tank', { state: { fromDashboard: true } }); }}>Step 1: Tank</button>
                      <button className="w-full px-3 py-2 rounded bg-primary text-white" onClick={() => { setShowUpdateMenu(false); navigate('/fish', { state: { fromDashboard: true } }); }}>Step 2: Fish</button>
                      <button className="w-full px-3 py-2 rounded bg-primary text-white" onClick={() => { setShowUpdateMenu(false); navigate('/water', { state: { fromDashboard: true } }); }}>Step 3: Water</button>
                      <button className="w-full px-3 py-2 rounded bg-slate-100 dark:bg-slate-700 dark:text-slate-100" onClick={() => setShowUpdateMenu(false)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
        <div className="mt-4 text-slate-800 dark:text-slate-100">{happy ? 'Your betta is happy and healthy!' : 'See below for possible reasons and tips.'}</div>
        {!happy && groupedIssues.length > 0 && (
          <div className="mt-2 w-full max-w-md mx-auto shadow p-3 rounded-xl bg-white/90 dark:bg-slate-800/90">
            <div className="font-bold mb-2">Possible Issues & Causes:</div>
            <ul className="space-y-3">
              {groupedIssues.map((issue, i) => (
                <li key={i} className="text-sm">
                  <div className="font-semibold flex items-center gap-2">
                    {issue.label}
                    <span className={`ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${issue.likelihood === 'Very likely' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                      {issue.likelihood}
                    </span>
                  </div>
                  <div className="mt-1">Affects: {issue.symptoms.join(', ')}</div>
                  <div className="mt-1 italic">Tip: {issue.tip}</div>
                  <a className="mt-1 inline-block text-primary hover:underline" href={`https://www.google.com/search?q=betta+${encodeURIComponent(issue.label)}`} target="_blank" rel="noreferrer">Learn more</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
}



