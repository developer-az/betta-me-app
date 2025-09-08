import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { TankSVG, FishSVG } from '../components/Visuals';
import { useNavigate } from 'react-router-dom';
import { FlaskIcon, FishIcon, DropIcon, HeartIcon, BarIcon, PencilIcon, AlertTriangleIcon, CheckCircleIcon, ClockIcon, UserIcon } from '../components/Icons';
import { useData } from '../components/DataProvider';
import LoadingSpinner from '../components/LoadingSpinner';
import { analyzeWaterHealth, analyzeFishHealth, getHealthScore, getHealthScoreDescription } from '../lib/healthAlerts';

export default function DashboardPage() {
  const { tank, fish, water, loading } = useData();
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
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

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

  // Get health alerts and score using new system
  const waterAlerts = analyzeWaterHealth(water);
  const fishAlerts = analyzeFishHealth(fish);
  const allAlerts = [...waterAlerts, ...fishAlerts];
  const healthScore = getHealthScore(fish, water);
  const healthDescription = getHealthScoreDescription(healthScore);

  // Legacy score calculation for tank visualization
  let score = 100;
  if (tank.size < 3) score -= 30; else if (tank.size < 5) score -= 10; else if (tank.size < 10) score -= 5;
  if (!tank.heater) score -= 20;
  if (!tank.filter) score -= 20;
  if (water.temperature < 75 || water.temperature > 82) score -= 10;
  if (water.pH < 6.5 || water.pH > 7.5) score -= 5;
  if (water.ammonia > 0) score -= 20;
  if (water.nitrite > 0) score -= 10;
  if (water.nitrate > 20) score -= 5;
  if (fish.finCondition !== 'Healthy') score -= 10;
  if (fish.activity !== 'Normal') score -= 5;
  if (fish.appetite !== 'Eating well') score -= 5;
  if (fish.colorCondition !== 'Vibrant') score -= 5;
  if (fish.gillCondition !== 'Normal') score -= 5;
  if (fish.bodyCondition !== 'Normal') score -= 5;
  if (fish.behavior !== 'Normal') score -= 5;
  score = Math.max(0, Math.min(100, score));

  const tankWidth = tank.size * 11;
  const tankHeight = tank.size * 6;
  const fishWidth = tankWidth * 0.22;
  const fishHeight = fishWidth * 0.5;
  const fishLeft = fishPos * (tankWidth - fishWidth);

  function getGroupedIssueAnalysis() {
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

    const causes = [
      { key: 'ammonia', label: 'High ammonia', test: () => water.ammonia > 0, likelihood: water.ammonia > 0.5 ? 'Very likely' : 'Possible', explains: ['appetite', 'fin', 'color', 'gills', 'body'], tip: 'Do a water change and check your filter. Ammonia should always be 0.' },
      { key: 'nitrite', label: 'High nitrite', test: () => water.nitrite > 0, likelihood: water.nitrite > 0.5 ? 'Very likely' : 'Possible', explains: ['appetite', 'activity', 'fin', 'color', 'gills', 'body'], tip: 'Do a water change and check your filter. Nitrite should always be 0.' },
      { key: 'nitrate', label: 'High nitrate', test: () => water.nitrate > 20, likelihood: water.nitrate > 40 ? 'Very likely' : 'Possible', explains: ['appetite', 'color', 'body'], tip: 'Do a partial water change to reduce nitrate.' },
      { key: 'temp', label: 'Temperature out of range', test: () => water.temperature < 75 || water.temperature > 82, likelihood: (water.temperature < 72 || water.temperature > 85) ? 'Very likely' : 'Possible', explains: ['appetite', 'activity', 'gills'], tip: 'Keep temperature between 75–82°F for bettas.' },
      { key: 'ph', label: 'pH out of range', test: () => water.pH < 6.5 || water.pH > 7.5, likelihood: (water.pH < 6 || water.pH > 8) ? 'Very likely' : 'Possible', explains: ['appetite', 'color', 'gills'], tip: 'Aim for pH 6.5–7.5. Sudden changes can stress your betta.' },
      { key: 'heater', label: 'No heater', test: () => !tank.heater, likelihood: 'Possible', explains: ['temp', 'activity', 'appetite'], tip: 'A heater is important for stable, warm water.' },
      { key: 'filter', label: 'No filter', test: () => !tank.filter, likelihood: 'Possible', explains: ['ammonia', 'nitrite', 'nitrate'], tip: 'A filter helps keep water clean and safe.' },
      { key: 'size', label: 'Tank too small', test: () => tank.size < 3, likelihood: 'Possible', explains: ['activity', 'behavior'], tip: 'A 3+ gallon tank is best for betta health.' },
      { key: 'fin', label: 'Fin issues', test: () => fish.finCondition !== 'Healthy', likelihood: 'Possible', explains: ['fin'], tip: 'Fin rot or damage can be from poor water, injury, or infection.' },
      { key: 'color', label: 'Color loss/spots', test: () => fish.colorCondition !== 'Vibrant', likelihood: 'Possible', explains: ['color'], tip: 'Color loss can be from stress, illness, or poor water.' },
      { key: 'gills', label: 'Gill/breathing issues', test: () => fish.gillCondition !== 'Normal', likelihood: 'Possible', explains: ['gills'], tip: 'Rapid or gasping breathing can be from toxins or disease.' },
      { key: 'body', label: 'Body condition', test: () => fish.bodyCondition !== 'Normal', likelihood: 'Possible', explains: ['body'], tip: 'Bloated or thin bettas may have diet or internal issues.' },
      { key: 'behavior', label: 'Unusual behavior', test: () => fish.behavior !== 'Normal', likelihood: 'Possible', explains: ['behavior'], tip: 'Hiding or aggression can be from stress, tank mates, or illness.' },
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
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome back, Betta Keeper!
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Monitor your betta's health and environment at a glance
          </p>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tank Environment Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="lg:col-span-4"
          >
            <div className="bg-gradient-to-br from-blue-50/80 via-white/90 to-indigo-50/80 dark:from-blue-900/20 dark:via-slate-800/50 dark:to-indigo-900/20 backdrop-blur-sm border border-blue-100 dark:border-blue-800/30 rounded-3xl p-6 shadow-xl shadow-blue-100/50 dark:shadow-blue-900/20 hover:shadow-2xl hover:shadow-blue-200/60 dark:hover:shadow-blue-900/30 transition-all duration-300 min-h-[200px]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500 rounded-2xl shadow-lg">
                  <FlaskIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Tank Environment</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Your betta's home setup</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white/60 dark:bg-slate-700/30 rounded-xl backdrop-blur-sm">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Tank Size</span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold text-lg">{tank.size} gallons</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/60 dark:bg-slate-700/30 rounded-xl backdrop-blur-sm">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Heater</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${tank.heater ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
                    {tank.heater ? '✓ Active' : '✗ Missing'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/60 dark:bg-slate-700/30 rounded-xl backdrop-blur-sm">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Filter</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${tank.filter ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
                    {tank.filter ? '✓ Running' : '✗ Missing'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Betta Display Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="lg:col-span-8"
          >
            <div className="bg-gradient-to-br from-slate-50/80 via-white/90 to-slate-100/80 dark:from-slate-800/50 dark:via-slate-700/50 dark:to-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-600/30 rounded-3xl p-6 shadow-xl shadow-slate-100/50 dark:shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-200/60 dark:hover:shadow-slate-900/30 transition-all duration-300 min-h-[200px]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl shadow-lg">
                  <FishIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    {fish.name || 'Your Betta'}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Swimming in their home</p>
                </div>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                {/* Tank Visualization */}
                <div className="relative flex-shrink-0" style={{ width: tankWidth, height: tankHeight }}>
                  <TankSVG size={tank.size} />
                  <motion.div 
                    animate={{ 
                      x: fishLeft, 
                      y: Math.max(0, tankHeight * 0.15 + 0.2 * tankHeight * Math.sin(fishTime * 2)), 
                      scaleX: fishDir === 1 ? 1 : -1, 
                      opacity: fishPause ? 0.7 : 1 
                    }} 
                    transition={{ type: 'spring', stiffness: 60, damping: 20 }} 
                    style={{ position: 'absolute', width: fishWidth, height: fishHeight, pointerEvents: 'none' }}
                  >
                    <FishSVG color={fish.color} mood={happy ? 'happy' : 'sad'} />
                  </motion.div>
                </div>
                
                {/* Fish Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Color:</span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-white shadow-lg" 
                        style={{ backgroundColor: fish.color }}
                      />
                      <span className="text-slate-900 dark:text-slate-100 font-semibold" style={{ color: fish.color }}>
                        {fish.color}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`text-center p-4 rounded-2xl ${happy ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
                    <div className={`text-2xl mb-1 ${happy ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                      {happy ? '😊' : '😟'}
                    </div>
                    <div className={`font-bold ${happy ? 'text-green-800 dark:text-green-300' : 'text-yellow-800 dark:text-yellow-300'}`}>
                      {happy ? 'Happy & Healthy!' : 'Needs Attention'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Water Quality Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7 }}
            className="lg:col-span-6"
          >
            <div className="bg-gradient-to-br from-green-50/80 via-white/90 to-emerald-50/80 dark:from-green-900/20 dark:via-slate-800/50 dark:to-emerald-900/20 backdrop-blur-sm border border-green-100 dark:border-green-800/30 rounded-3xl p-6 shadow-xl shadow-green-100/50 dark:shadow-green-900/20 hover:shadow-2xl hover:shadow-green-200/60 dark:hover:shadow-green-900/30 transition-all duration-300 min-h-[240px]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl shadow-lg">
                  <DropIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Water Quality</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Essential parameters</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/60 dark:bg-slate-700/30 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">Temperature</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {water.temperature}°F
                  </div>
                  <div className={`text-xs mt-1 ${(water.temperature >= 75 && water.temperature <= 82) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {(water.temperature >= 75 && water.temperature <= 82) ? 'Optimal' : 'Check'}
                  </div>
                </div>
                
                <div className="bg-white/60 dark:bg-slate-700/30 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">pH Level</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {water.pH.toFixed(1)}
                  </div>
                  <div className={`text-xs mt-1 ${(water.pH >= 6.5 && water.pH <= 7.5) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {(water.pH >= 6.5 && water.pH <= 7.5) ? 'Good' : 'Adjust'}
                  </div>
                </div>
                
                <div className="bg-white/60 dark:bg-slate-700/30 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">Ammonia</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {water.ammonia}
                  </div>
                  <div className={`text-xs mt-1 ${water.ammonia === 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {water.ammonia === 0 ? 'Safe' : 'Danger'}
                  </div>
                </div>
                
                <div className="bg-white/60 dark:bg-slate-700/30 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">Nitrates</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {water.nitrate}
                  </div>
                  <div className={`text-xs mt-1 ${water.nitrate <= 20 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                    {water.nitrate <= 20 ? 'Good' : 'Change Water'}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Health Metrics Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="lg:col-span-6"
          >
            <div className="bg-gradient-to-br from-yellow-50/80 via-white/90 to-orange-50/80 dark:from-yellow-900/20 dark:via-slate-800/50 dark:to-orange-900/20 backdrop-blur-sm border border-yellow-100 dark:border-yellow-800/30 rounded-3xl p-6 shadow-xl shadow-yellow-100/50 dark:shadow-yellow-900/20 hover:shadow-2xl hover:shadow-yellow-200/60 dark:hover:shadow-yellow-900/30 transition-all duration-300 min-h-[240px]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl shadow-lg">
                  <HeartIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Health Status</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Behavioral indicators</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: 'Appetite', value: fish.appetite, icon: '🍽️' },
                  { label: 'Activity', value: fish.activity, icon: '🏊‍♂️' },
                  { label: 'Fins', value: fish.finCondition, icon: '🐟' },
                  { label: 'Color', value: fish.colorCondition, icon: '🌈' },
                ].map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/60 dark:bg-slate-700/30 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{metric.icon}</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{metric.label}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      (metric.value === 'Normal' || metric.value === 'Eating well' || metric.value === 'Healthy' || metric.value === 'Vibrant') 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}>
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          {/* BettaScore Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.9 }}
            className="lg:col-span-8"
          >
            <div className="bg-gradient-to-br from-purple-50/80 via-white/90 to-pink-50/80 dark:from-purple-900/20 dark:via-slate-800/50 dark:to-pink-900/20 backdrop-blur-sm border border-purple-100 dark:border-purple-800/30 rounded-3xl p-6 shadow-xl shadow-purple-100/50 dark:shadow-purple-900/20 hover:shadow-2xl hover:shadow-purple-200/60 dark:hover:shadow-purple-900/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                  <BarIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">BettaScore</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Overall health rating</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {score}%
                  </div>
                  <div className={`text-sm font-medium ${score > 80 ? 'text-green-600 dark:text-green-400' : score > 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                    {score > 80 ? 'Excellent' : score > 60 ? 'Good' : 'Needs Care'}
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full rounded-full shadow-sm"
                    style={{ 
                      background: score > 80 
                        ? 'linear-gradient(90deg, #22c55e, #16a34a)' 
                        : score > 60 
                          ? 'linear-gradient(90deg, #f59e0b, #d97706)' 
                          : 'linear-gradient(90deg, #ef4444, #dc2626)'
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                  <span>Poor</span>
                  <span>Good</span>
                  <span>Excellent</span>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-slate-600 dark:text-slate-400">
                  {happy ? 'Your betta is thriving! 🎉' : 'Some areas need attention 🤔'}
                </p>
              </div>
            </div>
          </motion.div>
          {/* Quick Actions Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1.0 }}
            className="lg:col-span-4"
          >
            <div className="bg-gradient-to-br from-slate-50/80 via-white/90 to-slate-100/80 dark:from-slate-700/50 dark:via-slate-800/50 dark:to-slate-700/50 backdrop-blur-sm border border-slate-200 dark:border-slate-600/30 rounded-3xl p-6 shadow-xl shadow-slate-100/50 dark:shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-200/60 dark:hover:shadow-slate-900/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl shadow-lg">
                  <PencilIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Quick Actions</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Update your betta's info</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <button 
                  className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  onClick={() => setShowUpdateMenu(v => !v)}
                >
                  Update Tank / Fish / Water
                </button>
                
                {showUpdateMenu && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-300 dark:border-slate-600 rounded-2xl shadow-xl p-4 space-y-3"
                  >
                    <div className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Choose what to update:</div>
                    <button 
                      className="w-full px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors duration-200"
                      onClick={() => { setShowUpdateMenu(false); navigate('/tank', { state: { fromDashboard: true } }); }}
                    >
                      🏠 Tank Setup
                    </button>
                    <button 
                      className="w-full px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors duration-200"
                      onClick={() => { setShowUpdateMenu(false); navigate('/fish', { state: { fromDashboard: true } }); }}
                    >
                      🐠 Fish Health
                    </button>
                    <button 
                      className="w-full px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-colors duration-200"
                      onClick={() => { setShowUpdateMenu(false); navigate('/water', { state: { fromDashboard: true } }); }}
                    >
                      💧 Water Quality
                    </button>
                    <button 
                      className="w-full px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium transition-colors duration-200"
                      onClick={() => setShowUpdateMenu(false)}
                    >
                      Cancel
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
        {/* Health Alerts and Recommendations Section */}
        {allAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1 }}
            className="mt-8"
          >
            <div className="bg-gradient-to-br from-amber-50/80 via-white/90 to-yellow-50/80 dark:from-amber-900/20 dark:via-slate-800/50 dark:to-yellow-900/20 backdrop-blur-sm border border-amber-200 dark:border-amber-800/30 rounded-3xl p-6 shadow-xl shadow-amber-100/50 dark:shadow-amber-900/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl shadow-lg">
                  <AlertTriangleIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Health Alerts</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {`${allAlerts.length} alert${allAlerts.length !== 1 ? 's' : ''} detected - ${healthDescription}`}
                  </p>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                {allAlerts.slice(0, 6).map((alert) => (
                  <div key={alert.id} className={`rounded-2xl p-4 backdrop-blur-sm border ${
                    alert.type === 'critical' 
                      ? 'bg-red-50/60 dark:bg-red-900/30 border-red-200 dark:border-red-800/30' 
                      : alert.type === 'warning'
                      ? 'bg-yellow-50/60 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800/30'
                      : 'bg-blue-50/60 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800/30'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100">{alert.title}</h3>
                      <span className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 ${
                        alert.type === 'critical' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' 
                          : alert.type === 'warning'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                      }`}>
                        {alert.type === 'critical' ? '🚨' : alert.type === 'warning' ? '⚠️' : 'ℹ️'}
                        {alert.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      <span className="font-medium">Category:</span> {alert.category}
                    </div>
                    <div className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                      {alert.message}
                    </div>
                    <div className="text-sm text-slate-700 dark:text-slate-300 mb-3 italic bg-white/50 dark:bg-slate-800/50 p-2 rounded-lg">
                      💡 {alert.recommendation}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Quick Action Buttons for Common Issues */}
              <div className="mt-6 pt-4 border-t border-amber-200 dark:border-amber-800/30">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Quick Fixes</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <button 
                    onClick={() => navigate('/water')}
                    className="flex items-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors duration-200"
                  >
                    <DropIcon className="w-4 h-4" />
                    Test Water
                  </button>
                  <button 
                    onClick={() => navigate('/fish')}
                    className="flex items-center gap-2 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-xl transition-colors duration-200"
                  >
                    <FishIcon className="w-4 h-4" />
                    Update Fish Health
                  </button>
                  <button 
                    onClick={() => navigate('/care')}
                    className="flex items-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors duration-200"
                  >
                    <ClockIcon className="w-4 h-4" />
                    Care Schedule
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Success State - Show when no alerts */}
        {allAlerts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1 }}
            className="mt-8"
          >
            <div className="bg-gradient-to-br from-green-50/80 via-white/90 to-emerald-50/80 dark:from-green-900/20 dark:via-slate-800/50 dark:to-emerald-900/20 backdrop-blur-sm border border-green-200 dark:border-green-800/30 rounded-3xl p-6 shadow-xl shadow-green-100/50 dark:shadow-green-900/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg">
                  <CheckCircleIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Excellent Health!</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {`Your betta is thriving - Health Score: ${healthScore}/100 (${healthDescription})`}
                  </p>
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <button 
                  onClick={() => navigate('/care')}
                  className="flex items-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors duration-200"
                >
                  <ClockIcon className="w-4 h-4" />
                  View Care Schedule
                </button>
                <button 
                  onClick={() => navigate('/settings')}
                  className="flex items-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors duration-200"
                >
                  <UserIcon className="w-4 h-4" />
                  Settings
                </button>
                <button 
                  onClick={() => setShowUpdateMenu(true)}
                  className="flex items-center gap-2 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-xl transition-colors duration-200"
                >
                  <PencilIcon className="w-4 h-4" />
                  Update Info
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}



