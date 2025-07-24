import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { useState as useDrawerState } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Avatar from '@mui/material/Avatar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import PetsIcon from '@mui/icons-material/Pets';
import ScienceIcon from '@mui/icons-material/Science';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BarChartIcon from '@mui/icons-material/BarChart';
import EditNoteIcon from '@mui/icons-material/EditNote';

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

// Layout component
function Layout({ children, currentStep }: { children: React.ReactNode; currentStep: string }) {
  const [drawerOpen, setDrawerOpen] = useDrawerState(false);
  const navigate = useNavigate();
  const steps = [
    { label: 'Welcome', path: '/', icon: <HomeWorkIcon /> },
    { label: 'Tank', path: '/tank', icon: <ScienceIcon /> },
    { label: 'Fish', path: '/fish', icon: <PetsIcon /> },
    { label: 'Water', path: '/water', icon: <WaterDropIcon /> },
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  ];
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'linear-gradient(135deg, #e0eafc 0%, #b3e5fc 100%)', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" elevation={8} sx={{
        bgcolor: 'rgba(255,255,255,0.7)',
        background: 'linear-gradient(90deg, #e0eafc 0%, #b3e5fc 100%)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1.5px solid #e3e8ee',
      }}>
        <Toolbar>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1 }}>
              <PetsIcon sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: 1, color: 'primary.main', fontFamily: 'Inter, Segoe UI, Arial, sans-serif' }}>Betta Me</Typography>
          </Box>
          <Stack direction="row" spacing={2} sx={{ flexGrow: 1, ml: 4, display: { xs: 'none', sm: 'flex' } }}>
            {steps.map(step => (
              <Button
                key={step.path}
                color="inherit"
                startIcon={step.icon}
                onClick={() => navigate(step.path)}
                sx={{
                  fontWeight: currentStep === step.path ? 700 : 400,
                  color: currentStep === step.path ? 'primary.main' : '#222',
                  borderBottom: currentStep === step.path ? '3px solid #FFD700' : '3px solid transparent',
                  borderRadius: 0,
                  px: 2,
                  py: 1,
                  transition: 'all 0.2s',
                  '&:hover': {
                    color: 'primary.main',
                    background: 'rgba(33,150,243,0.07)',
                  },
                }}
              >
                {step.label}
              </Button>
            ))}
          </Stack>
          {/* User Avatar */}
          <Avatar sx={{ bgcolor: 'primary.main', ml: 2, width: 40, height: 40, fontWeight: 700 }}>BK</Avatar>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)} sx={{ display: { sm: 'none' } }}>
        <Box sx={{ width: 220 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          <List>
            {steps.map(step => (
              <ListItem disablePadding key={step.path}>
                <ListItemButton onClick={() => navigate(step.path)} selected={currentStep === step.path}>
                  <ListItemIcon>{step.icon}</ListItemIcon>
                  <ListItemText primary={step.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', p: { xs: 1, sm: 3 }, minHeight: 'calc(100vh - 64px)' }}>
        <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', borderRadius: 6, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)', bgcolor: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(18px)', p: { xs: 2, sm: 4 }, minHeight: 500 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

// Welcome Screen
function Welcome() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <Stack spacing={4} alignItems="center" justifyContent="center" sx={{ minHeight: 400 }}>
        <Typography variant="h2" fontWeight={700} color="primary" gutterBottom>
          <span role="img" aria-label="betta">🐠</span> Betta Adventure
        </Typography>
        <Typography variant="h5" color="text.secondary" maxWidth={420}>
          Welcome to your virtual betta fish journey! Ready to create your dream tank and care for your fish?
        </Typography>
        <motion.div
          animate={{ y: [0, -12, 0, 12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <FishSVG color="#64b5f6" mood="happy" />
        </motion.div>
        <Button variant="contained" size="large" onClick={() => navigate('/tank')} sx={{ borderRadius: 6, fontWeight: 700, fontSize: 20, px: 5, py: 1.5, bgcolor: 'primary.main', boxShadow: 3 }}>
        Start Your Adventure
        </Button>
      </Stack>
    </motion.div>
  );
}

// Tank Creation Screen
type TankStepProps = { tank: TankState; setTank: (t: TankState) => void };
function TankStep({ tank, setTank }: TankStepProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const fromDashboard = location.state && location.state.fromDashboard;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Stack spacing={4} alignItems="center" justifyContent="center">
        <Typography variant="h4" fontWeight={700} color="primary" mb={1}>
          <span role="img" aria-label="tank">🛁</span> Step 1: Create Your Tank
        </Typography>
        <motion.div
          animate={{ y: [0, -8, 0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
      <TankSVG size={tank.size} />
        </motion.div>
        <Card sx={{ maxWidth: 400, width: '100%', borderRadius: 4, bgcolor: 'rgba(224,247,250,0.7)', boxShadow: 6 }} elevation={0}>
          <CardContent>
            <Stack spacing={3}>
              <Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography fontWeight={600}>Tank Size (gallons): {tank.size} gal</Typography>
                  <Tooltip title="A larger tank provides a more stable environment for your betta."><InfoOutlinedIcon color="info" fontSize="small" /></Tooltip>
                </Stack>
                <Slider min={1} max={20} value={tank.size} onChange={(_, v) => setTank({ ...tank, size: v as number })} valueLabelDisplay="auto" sx={{ mt: 2, color: 'primary.main' }} />
        {tank.size < 3 && (
                  <Paper sx={{ mt: 2, p: 1.5, bgcolor: '#fff3e0', color: 'error.main', fontWeight: 600, borderRadius: 2 }}>
            Warning: A tank smaller than 3 gallons is not recommended for bettas. Consider upgrading for better health and happiness.
                  </Paper>
        )}
              </Box>
              <FormGroup row sx={{ justifyContent: 'center' }}>
                <FormControlLabel control={<Checkbox checked={tank.heater} onChange={e => setTank({ ...tank, heater: e.target.checked })} />} label={<><span>Heater</span> <Tooltip title="A heater keeps water at a stable, healthy temperature."><InfoOutlinedIcon color="info" fontSize="small" /></Tooltip></>} />
                <FormControlLabel control={<Checkbox checked={tank.filter} onChange={e => setTank({ ...tank, filter: e.target.checked })} />} label={<><span>Filter</span> <Tooltip title="A filter helps keep water clean and safe for your betta."><InfoOutlinedIcon color="info" fontSize="small" /></Tooltip></>} />
              </FormGroup>
            </Stack>
          </CardContent>
        </Card>
        <Stack direction="row" spacing={2}>
      {fromDashboard ? (
            <Button variant="outlined" size="large" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      ) : (
            <Button variant="contained" size="large" onClick={() => navigate('/fish')} disabled={tank.size < 1}>Next: Add Your Betta</Button>
      )}
        </Stack>
      </Stack>
    </motion.div>
  );
}

// Fish Creation Screen
type FishStepProps = { fish: FishState; setFish: (f: FishState) => void };
function FishStep({ fish, setFish }: FishStepProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const fromDashboard = location.state && location.state.fromDashboard;
  const colors = ['#e57373', '#64b5f6', '#81c784', '#ffd54f', '#ba68c8', '#ff8a65'];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Stack spacing={4} alignItems="center" justifyContent="center">
        <Typography variant="h4" fontWeight={700} color="primary" mb={1}>
          <span role="img" aria-label="fish">🐟</span> Step 2: Add Your Betta
        </Typography>
        <motion.div
          animate={{ y: [0, -10, 0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <FishSVG color={fish.color} mood="happy" />
        </motion.div>
        <Card sx={{ maxWidth: 420, width: '100%', borderRadius: 4, bgcolor: 'rgba(243,246,250,0.7)', boxShadow: 6 }} elevation={0}>
          <CardContent>
            <Stack spacing={3}>
              <Box>
                <Typography fontWeight={700} mb={1}>General</Typography>
                <TextField label="Name" value={fish.name} onChange={e => setFish({ ...fish, name: e.target.value })} placeholder="Your betta's name" fullWidth sx={{ mb: 2 }} />
                <Typography fontWeight={600} mb={1}>Color:</Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
            {colors.map(c => (
                    <Button key={c} variant={fish.color === c ? 'contained' : 'outlined'} onClick={() => setFish({ ...fish, color: c })} sx={{ minWidth: 0, width: 36, height: 36, borderRadius: '50%', p: 0, bgcolor: c, borderColor: fish.color === c ? '#222' : '#ccc', borderWidth: 2, borderStyle: 'solid', '&:hover': { bgcolor: c } }} aria-label={c} />
            ))}
                </Stack>
              </Box>
              <Box>
                <Typography fontWeight={700} mb={1}>Appearance</Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel>Fin Condition <Tooltip title="Check for signs of fin rot or damage."><InfoOutlinedIcon color="info" fontSize="small" /></Tooltip></FormLabel>
                  <Select value={fish.finCondition} onChange={e => setFish({ ...fish, finCondition: e.target.value })}>
                    <MenuItem value="Healthy">Healthy</MenuItem>
                    <MenuItem value="Fin rot">Fin rot</MenuItem>
                    <MenuItem value="Torn">Torn</MenuItem>
                    <MenuItem value="Clamped">Clamped</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel>Coloration <Tooltip title="Vibrant color is a sign of health."><InfoOutlinedIcon color="info" fontSize="small" /></Tooltip></FormLabel>
                  <Select value={fish.colorCondition} onChange={e => setFish({ ...fish, colorCondition: e.target.value })}>
                    <MenuItem value="Vibrant">Vibrant</MenuItem>
                    <MenuItem value="Faded">Faded</MenuItem>
                    <MenuItem value="Spots">Spots</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel>Gills/Breathing <Tooltip title="Rapid or gasping breathing can indicate water issues."><InfoOutlinedIcon color="info" fontSize="small" /></Tooltip></FormLabel>
                  <Select value={fish.gillCondition} onChange={e => setFish({ ...fish, gillCondition: e.target.value })}>
                    <MenuItem value="Normal">Normal</MenuItem>
                    <MenuItem value="Rapid">Rapid</MenuItem>
                    <MenuItem value="Gasping">Gasping</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel>Body Condition <Tooltip title="Look for signs of bloating or thinness."><InfoOutlinedIcon color="info" fontSize="small" /></Tooltip></FormLabel>
                  <Select value={fish.bodyCondition} onChange={e => setFish({ ...fish, bodyCondition: e.target.value })}>
                    <MenuItem value="Normal">Normal</MenuItem>
                    <MenuItem value="Bloated">Bloated</MenuItem>
                    <MenuItem value="Thin">Thin</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <Typography fontWeight={700} mb={1}>Behavior</Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel>Appetite <Tooltip title="Loss of appetite can indicate stress or illness."><InfoOutlinedIcon color="info" fontSize="small" /></Tooltip></FormLabel>
                  <Select value={fish.appetite} onChange={e => setFish({ ...fish, appetite: e.target.value })}>
                    <MenuItem value="Eating well">Eating well</MenuItem>
                    <MenuItem value="Not eating">Not eating</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel>Activity <Tooltip title="Lethargy or hyperactivity can be signs of water or health issues."><InfoOutlinedIcon color="info" fontSize="small" /></Tooltip></FormLabel>
                  <Select value={fish.activity} onChange={e => setFish({ ...fish, activity: e.target.value })}>
                    <MenuItem value="Normal">Normal</MenuItem>
                    <MenuItem value="Lethargic">Lethargic</MenuItem>
                    <MenuItem value="Hyperactive">Hyperactive</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel>Behavior <Tooltip title="Unusual behavior can indicate stress or tank issues."><InfoOutlinedIcon color="info" fontSize="small" /></Tooltip></FormLabel>
                  <Select value={fish.behavior} onChange={e => setFish({ ...fish, behavior: e.target.value })}>
                    <MenuItem value="Normal">Normal</MenuItem>
                    <MenuItem value="Hiding">Hiding</MenuItem>
                    <MenuItem value="Aggressive">Aggressive</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Stack>
          </CardContent>
        </Card>
        <Stack direction="row" spacing={2}>
      {fromDashboard ? (
            <Button variant="outlined" size="large" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      ) : (
            <Button variant="contained" size="large" onClick={() => navigate('/water')} disabled={!fish.name}>Next: Test Water</Button>
      )}
        </Stack>
      </Stack>
    </motion.div>
  );
}

// Water Testing Screen
type WaterStepProps = { water: WaterState; setWater: (w: WaterState) => void; fishColor: string };
function WaterStep({ water, setWater, fishColor }: WaterStepProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const fromDashboard = location.state && location.state.fromDashboard;
  const happy =
    water.temperature >= 75 && water.temperature <= 82 &&
    water.pH >= 6.5 && water.pH <= 7.5 &&
    water.ammonia === 0 &&
    water.nitrite === 0 &&
    water.nitrate <= 20;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Stack spacing={4} alignItems="center" justifyContent="center">
        <Typography variant="h4" fontWeight={700} color="primary" mb={1}>
          <span role="img" aria-label="water">💧</span> Step 3: Test Your Water
        </Typography>
        <motion.div
          animate={{ y: [0, -8, 0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
      <TankSVG />
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <FishSVG color={fishColor} mood={happy ? 'happy' : 'sad'} />
        </motion.div>
        <Card sx={{ maxWidth: 340, width: '100%', borderRadius: 4, bgcolor: 'rgba(224,247,250,0.7)', boxShadow: 6 }} elevation={0}>
          <CardContent>
            <Stack spacing={3}>
              <Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography fontWeight={600}>Temperature (°F): {water.temperature}°F</Typography>
                  <Tooltip title="Optimal range: 75–82°F."><InfoOutlinedIcon color="info" fontSize="small" /></Tooltip>
                </Stack>
                <Slider min={70} max={88} value={water.temperature} onChange={(_, v) => setWater({ ...water, temperature: v as number })} valueLabelDisplay="auto" sx={{ color: 'primary.main' }} />
              </Box>
              <Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography fontWeight={600}>pH: {water.pH.toFixed(1)}</Typography>
                  <Tooltip title="Optimal range: 6.5–7.5."><InfoOutlinedIcon color="info" fontSize="small" /></Tooltip>
                </Stack>
                <Slider min={5} max={9} step={0.1} value={water.pH} onChange={(_, v) => setWater({ ...water, pH: v as number })} valueLabelDisplay="auto" sx={{ color: 'primary.main' }} />
              </Box>
              <Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography fontWeight={600}>Ammonia (ppm): {water.ammonia}</Typography>
                  <Tooltip title="Ammonia should always be 0."><InfoOutlinedIcon color="info" fontSize="small" /></Tooltip>
                </Stack>
                <Slider min={0} max={2} step={0.1} value={water.ammonia} onChange={(_, v) => setWater({ ...water, ammonia: v as number })} valueLabelDisplay="auto" sx={{ color: 'primary.main' }} />
              </Box>
              <Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography fontWeight={600}>Nitrite (ppm): {water.nitrite}</Typography>
                  <Tooltip title="Nitrite should always be 0."><InfoOutlinedIcon color="info" fontSize="small" /></Tooltip>
                </Stack>
                <Slider min={0} max={2} step={0.1} value={water.nitrite} onChange={(_, v) => setWater({ ...water, nitrite: v as number })} valueLabelDisplay="auto" sx={{ color: 'primary.main' }} />
              </Box>
              <Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography fontWeight={600}>Nitrate (ppm): {water.nitrate}</Typography>
                  <Tooltip title="Keep nitrate below 20 ppm."><InfoOutlinedIcon color="info" fontSize="small" /></Tooltip>
                </Stack>
                <Slider min={0} max={40} step={1} value={water.nitrate} onChange={(_, v) => setWater({ ...water, nitrate: v as number })} valueLabelDisplay="auto" sx={{ color: 'primary.main' }} />
              </Box>
            </Stack>
          </CardContent>
        </Card>
        <Stack direction="row" spacing={2}>
      {fromDashboard ? (
            <Button variant="outlined" size="large" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      ) : (
            <Button variant="contained" size="large" onClick={() => navigate('/dashboard')}>Finish: See Your Tank</Button>
      )}
        </Stack>
      </Stack>
    </motion.div>
  );
}

// Dashboard/Virtual Tank
type DashboardProps = {
  tank: TankState;
  fish: FishState;
  water: WaterState;
  setTank: (t: TankState) => void;
  setFish: (f: FishState) => void;
  setWater: (w: WaterState) => void;
};
function Dashboard({ tank, fish, water, setTank, setFish, setWater }: DashboardProps) {
  const navigate = useNavigate();
  const [showUpdateMenu, setShowUpdateMenu] = useState(false);
  const [fishPos, setFishPos] = useState(0.5); // 0 to 1, percent across tank
  const [fishDir, setFishDir] = useState(1); // 1 = right, -1 = left
  const [fishPause, setFishPause] = useState(false);
  const [fishTime, setFishTime] = useState(0); // for vertical sine
  // Animate fish position with Framer Motion
  React.useEffect(() => {
    if (fishPause) return;
    const interval = setInterval(() => {
      setFishTime(t => t + 0.03);
      setFishPos(pos => {
        let next = pos + 0.005 * fishDir * (Math.random() * 0.7 + 0.3);
        if (next > 1) {
          setFishDir(-1);
          next = 1;
        } else if (next < 0) {
          setFishDir(1);
          next = 0;
        } else if (Math.random() < 0.005) {
          setFishDir(d => -d);
        }
        if (Math.random() < 0.01) {
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
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Welcome back, Betta Keeper!
      </Typography>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          md: 'repeat(3, 1fr)' 
        }, 
        gap: 3 
      }}>
        {/* Tank Card */}
        <Box sx={{ display: 'flex' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 6, bgcolor: 'rgba(227,242,253,0.95)', minHeight: 180 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <ScienceIcon color="primary" />
                <Typography fontWeight={700} fontSize={18}>Tank</Typography>
              </Stack>
              <Typography variant="body2"><strong>Size:</strong> {tank.size} gal</Typography>
              <Typography variant="body2"><strong>Heater:</strong> {tank.heater ? 'Yes' : 'No'}</Typography>
              <Typography variant="body2"><strong>Filter:</strong> {tank.filter ? 'Yes' : 'No'}</Typography>
            </Paper>
          </motion.div>
        </Box>
        {/* Betta Card */}
        <Box sx={{ display: 'flex' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 6, bgcolor: 'rgba(243,246,250,0.95)', minHeight: 180, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <PetsIcon color="primary" />
                <Typography fontWeight={700} fontSize={18}>Betta</Typography>
              </Stack>
              <Box position="relative" width={tankWidth} height={tankHeight} mb={0.5}>
                <TankSVG size={tank.size} />
                <motion.div
                  animate={{
                    x: fishLeft,
                    y: Math.max(0, tankHeight * 0.15 + 0.2 * tankHeight * Math.sin(fishTime * 2)),
                    scaleX: fishDir === 1 ? 1 : -1,
                    opacity: fishPause ? 0.7 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 60, damping: 20 }}
                  style={{ position: 'absolute', width: fishWidth, height: fishHeight, pointerEvents: 'none' }}
                >
                  <FishSVG color={fish.color} mood={happy ? 'happy' : 'sad'} />
                </motion.div>
                <Typography variant="body2" sx={{ position: 'absolute', left: 0, bottom: 0, width: '100%', textAlign: 'center', fontWeight: 600 }}>{fish.name}</Typography>
              </Box>
              <Typography variant="body2"><strong>Color:</strong> <span style={{ color: fish.color }}>{fish.color}</span></Typography>
            </Paper>
          </motion.div>
        </Box>
        {/* Water Card */}
        <Box sx={{ display: 'flex' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 6, bgcolor: 'rgba(232,245,233,0.95)', minHeight: 180 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <WaterDropIcon color="primary" />
                <Typography fontWeight={700} fontSize={18}>Water</Typography>
              </Stack>
              <Typography variant="body2"><strong>Temp:</strong> {water.temperature}°F</Typography>
              <Typography variant="body2"><strong>pH:</strong> {water.pH.toFixed(1)}</Typography>
              <Typography variant="body2"><strong>NH₃:</strong> {water.ammonia}</Typography>
              <Typography variant="body2"><strong>NO₂⁻:</strong> {water.nitrite}</Typography>
              <Typography variant="body2"><strong>NO₃⁻:</strong> {water.nitrate}</Typography>
            </Paper>
          </motion.div>
        </Box>
        {/* Health Card */}
        <Box sx={{ display: 'flex' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 6, bgcolor: 'rgba(255,253,231,0.95)', minHeight: 180 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <FavoriteIcon color="primary" />
                <Typography fontWeight={700} fontSize={18}>Health</Typography>
              </Stack>
              <Typography variant="body2"><strong>Appetite:</strong> {fish.appetite}</Typography>
              <Typography variant="body2"><strong>Activity:</strong> {fish.activity}</Typography>
              <Typography variant="body2"><strong>Fin:</strong> {fish.finCondition}</Typography>
              <Typography variant="body2"><strong>Color:</strong> {fish.colorCondition}</Typography>
              <Typography variant="body2"><strong>Gills:</strong> {fish.gillCondition}</Typography>
              <Typography variant="body2"><strong>Body:</strong> {fish.bodyCondition}</Typography>
              <Typography variant="body2"><strong>Behavior:</strong> {fish.behavior}</Typography>
            </Paper>
          </motion.div>
        </Box>
        {/* BettaScore Card */}
        <Box sx={{ display: 'flex' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 6, bgcolor: 'rgba(227,232,238,0.95)', minHeight: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <BarChartIcon color="primary" />
                <Typography fontWeight={700} fontSize={18}>BettaScore</Typography>
              </Stack>
              <Box sx={{ width: '100%', backgroundColor: '#e3e8ee', borderRadius: 2, height: 18, mb: 1, position: 'relative' }}>
                <Box sx={{ width: `${score}%`, background: score > 80 ? '#4caf50' : score > 60 ? '#ff9800' : '#f44336', height: '100%', borderRadius: 2, transition: 'width 0.5s', position: 'absolute', left: 0, top: 0 }} />
                <Typography variant="body2" sx={{ position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', fontWeight: 600, color: '#222', fontSize: 14, lineHeight: '18px', width: '100%' }}>{score}%</Typography>
              </Box>
            </Paper>
          </motion.div>
        </Box>
        {/* Update Button Card */}
        <Box sx={{ display: 'flex' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0 }}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 6, bgcolor: 'rgba(255,255,255,0.95)', minHeight: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<EditNoteIcon />}
                sx={{ fontWeight: 700, fontSize: 18, px: 4, py: 1.5, borderRadius: 3, boxShadow: 3 }}
                onClick={() => setShowUpdateMenu(v => !v)}
              >
                Update Tank / Fish / Water
              </Button>
              {showUpdateMenu && (
                <Paper sx={{ backgroundColor: '#fff', border: '1px solid #cfd8dc', borderRadius: 2, boxShadow: 6, p: 2, mt: 2, zIndex: 10, position: 'relative', width: 220, mx: 'auto' }} elevation={0}>
                  <Typography fontWeight={600} mb={0.5}>Update:</Typography>
                  <Button variant="contained" sx={{ width: '100%', m: 0.5, fontSize: 16, p: '0.5em 0' }} onClick={() => { setShowUpdateMenu(false); navigate('/tank', { state: { fromDashboard: true } }); }}>Step 1: Tank</Button>
                  <Button variant="contained" sx={{ width: '100%', m: 0.5, fontSize: 16, p: '0.5em 0' }} onClick={() => { setShowUpdateMenu(false); navigate('/fish', { state: { fromDashboard: true } }); }}>Step 2: Fish</Button>
                  <Button variant="contained" sx={{ width: '100%', m: 0.5, fontSize: 16, p: '0.5em 0' }} onClick={() => { setShowUpdateMenu(false); navigate('/water', { state: { fromDashboard: true } }); }}>Step 3: Water</Button>
                  <Button sx={{ width: '100%', m: 0.5, fontSize: 14, background: '#eee', border: 'none', borderRadius: 2, p: '0.4em 0', cursor: 'pointer' }} onClick={() => setShowUpdateMenu(false)}>Cancel</Button>
                </Paper>
              )}
            </Paper>
          </motion.div>
        </Box>
      </Box>
      {/* Feedback and issues below the grid, as before */}
      <Box mt={4}>
        <Typography variant="body1">{happy ? 'Your betta is happy and healthy!' : 'See below for possible reasons and tips.'}</Typography>
        {(
          !tank.heater || !tank.filter || tank.size < 5
        ) && (
          <Paper sx={{ backgroundColor: '#fffde7', border: '1px solid #ffe082', borderRadius: 2, boxShadow: 6, p: 2, mb: 2, maxWidth: 420, mx: 'auto' }} elevation={0}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>Tank & Equipment Feedback:</Typography>
          {tank.size < 3 && (
              <Typography variant="body2" color="error.main" fontWeight={600} mb={0.5}>
              Your tank is smaller than 3 gallons. This is not recommended for bettas and will lower your BettaScore.
              </Typography>
          )}
          {tank.size >= 3 && tank.size < 5 && (
              <Typography variant="body2" color="warning.main" fontWeight={600} mb={0.5}>
              Tanks between 3 and 5 gallons are okay, but 5+ gallons is best for betta health and will improve your BettaScore.
              </Typography>
          )}
          {!tank.heater && (
              <Typography variant="body2" color="warning.main" fontWeight={600} mb={0.5}>
              No heater detected. Bettas need stable, warm water (75–82°F). Add a heater for optimal conditions and a higher BettaScore.
              </Typography>
          )}
          {!tank.filter && (
              <Typography variant="body2" color="warning.main" fontWeight={600}>
              No filter detected. A filter helps keep water clean and safe, and improves your BettaScore.
              </Typography>
          )}
          </Paper>
      )}
      {/* Water Condition Feedback */}
      {(
        water.temperature < 75 || water.temperature > 82 ||
        water.pH < 6.5 || water.pH > 7.5 ||
        water.ammonia > 0 ||
        water.nitrite > 0 ||
        water.nitrate > 20
      ) && (
          <Paper sx={{ backgroundColor: '#e3f2fd', border: '1px solid #90caf9', borderRadius: 2, boxShadow: 6, p: 2, mb: 2, maxWidth: 420, mx: 'auto' }} elevation={0}>
            <Typography variant="body2" fontWeight={600} mb={0.5}>Water Condition Feedback:</Typography>
          {water.temperature < 75 || water.temperature > 82 ? (
              <Typography variant="body2" color="info.main" fontWeight={600} mb={0.5}>
              <span role="img" aria-label="warning">⚠️</span> <b>Warning:</b> Temperature is {water.temperature}°F. Keep between 75–82°F for bettas.
              </Typography>
          ) : null}
          {water.pH < 6.5 || water.pH > 7.5 ? (
              <Typography variant="body2" color="info.main" fontWeight={600} mb={0.5}>
              <span role="img" aria-label="warning">⚠️</span> <b>Warning:</b> pH is {water.pH.toFixed(1)}. Aim for 6.5–7.5. Sudden changes can stress your betta.
              </Typography>
          ) : null}
          {water.ammonia > 0 ? (
              <Typography variant="body2" color="error.main" fontWeight={600} mb={0.5}>
              <span role="img" aria-label="warning">⚠️</span> <b>Warning:</b> Ammonia detected ({water.ammonia}). Do a water change and check your filter. Ammonia should always be 0.
              </Typography>
          ) : null}
          {water.nitrite > 0 ? (
              <Typography variant="body2" color="error.main" fontWeight={600} mb={0.5}>
              <span role="img" aria-label="warning">⚠️</span> <b>Warning:</b> Nitrite detected ({water.nitrite}). Do a water change and check your filter. Nitrite should always be 0.
              </Typography>
          ) : null}
          {water.nitrate > 20 ? (
              <Typography variant="body2" color="warning.main" fontWeight={600} mb={0.5}>
              <span role="img" aria-label="warning">⚠️</span> <b>Warning:</b> Nitrate is high ({water.nitrate}). Do a partial water change to reduce nitrate.
              </Typography>
          ) : null}
          </Paper>
      )}
      {!happy && groupedIssues.length > 0 && (
          <Box sx={{ mb: 2, width: 220, mx: 'auto', boxShadow: 6 }}>
            <Typography fontWeight={700} mb={0.5}>Possible Issues & Causes:</Typography>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {groupedIssues.map((issue, i) => (
              <li key={i} style={{ marginBottom: 12 }}>
                  <Typography variant="body2" fontWeight={600}><strong>{issue.label}</strong> <span style={{ color: issue.likelihood === 'Very likely' ? '#d32f2f' : '#b28704', fontWeight: 600 }}>({issue.likelihood})</span></Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, mb: 0.5 }}>Affects: {issue.symptoms.join(', ')}</Typography>
                  <Typography variant="body2" className="tip">Tip: {issue.tip}</Typography>
              </li>
            ))}
          </ul>
          </Box>
      )}
      </Box>
    </Box>
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
        <Route path="/tank" element={<Layout currentStep="/tank"><TankStep tank={tank} setTank={setTank} /></Layout>}>
          <Route index element={<TankStep tank={tank} setTank={setTank} />} />
        </Route>
        <Route path="/fish" element={<Layout currentStep="/fish"><FishStep fish={fish} setFish={setFish} /></Layout>}>
          <Route index element={<FishStep fish={fish} setFish={setFish} />} />
        </Route>
        <Route path="/water" element={<Layout currentStep="/water"><WaterStep water={water} setWater={setWater} fishColor={fish.color} /></Layout>}>
          <Route index element={<WaterStep water={water} setWater={setWater} fishColor={fish.color} />} />
        </Route>
        <Route path="/dashboard" element={<Layout currentStep="/dashboard"><Dashboard tank={tank} fish={fish} water={water} setTank={setTank} setFish={setFish} setWater={setWater} /></Layout>}>
          <Route index element={<Dashboard tank={tank} fish={fish} water={water} setTank={setTank} setFish={setFish} setWater={setWater} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
