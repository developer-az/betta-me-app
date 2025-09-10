import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from './DataProvider';
import { FishIcon, DropIcon, PlusIcon, XIcon } from './Icons';

interface QuickUpdateFishProps {
  isOpen: boolean;
  onClose: () => void;
}

function QuickUpdateFish({ isOpen, onClose }: QuickUpdateFishProps) {
  const { fish, setFish } = useData();
  const [tempFish, setTempFish] = useState(fish);

  const handleSave = () => {
    setFish(tempFish);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FishIcon className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Quick Fish Update</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">How is {fish.name || 'your betta'} doing today?</label>
            <div className="grid grid-cols-2 gap-3">
              <select 
                className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                value={tempFish.appetite}
                onChange={e => setTempFish({ ...tempFish, appetite: e.target.value })}
              >
                <option>Eating well</option>
                <option>Not eating</option>
              </select>
              <select 
                className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                value={tempFish.activity}
                onChange={e => setTempFish({ ...tempFish, activity: e.target.value })}
              >
                <option>Normal</option>
                <option>Lethargic</option>
                <option>Hyperactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Any health concerns?</label>
            <div className="grid grid-cols-2 gap-3">
              <select 
                className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                value={tempFish.finCondition}
                onChange={e => setTempFish({ ...tempFish, finCondition: e.target.value })}
              >
                <option>Healthy</option>
                <option>Fin rot</option>
                <option>Torn</option>
                <option>Clamped</option>
              </select>
              <select 
                className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                value={tempFish.colorCondition}
                onChange={e => setTempFish({ ...tempFish, colorCondition: e.target.value })}
              >
                <option>Vibrant</option>
                <option>Faded</option>
                <option>Spots</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors"
          >
            Update
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface QuickUpdateWaterProps {
  isOpen: boolean;
  onClose: () => void;
}

function QuickUpdateWater({ isOpen, onClose }: QuickUpdateWaterProps) {
  const { water, setWater } = useData();
  const [tempWater, setTempWater] = useState(water);

  const handleSave = () => {
    setWater(tempWater);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <DropIcon className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Quick Water Test</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Temperature: {tempWater.temperature}°F</label>
            <input 
              type="range" 
              min={70} 
              max={88} 
              value={tempWater.temperature} 
              onChange={e => setTempWater({ ...tempWater, temperature: Number(e.target.value) })} 
              className="w-full accent-blue-500" 
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>70°F</span>
              <span className="text-green-600">75-82°F optimal</span>
              <span>88°F</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">pH: {tempWater.pH.toFixed(1)}</label>
            <input 
              type="range" 
              min={5} 
              max={9} 
              step={0.1} 
              value={tempWater.pH} 
              onChange={e => setTempWater({ ...tempWater, pH: Number(e.target.value) })} 
              className="w-full accent-blue-500" 
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>5.0</span>
              <span className="text-green-600">6.5-7.5 optimal</span>
              <span>9.0</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Ammonia: {tempWater.ammonia}</label>
              <input 
                type="range" 
                min={0} 
                max={2} 
                step={0.1} 
                value={tempWater.ammonia} 
                onChange={e => setTempWater({ ...tempWater, ammonia: Number(e.target.value) })} 
                className="w-full accent-blue-500" 
              />
              <div className="text-xs text-slate-500 mt-1">Should be 0</div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Nitrate: {tempWater.nitrate}</label>
              <input 
                type="range" 
                min={0} 
                max={40} 
                step={1} 
                value={tempWater.nitrate} 
                onChange={e => setTempWater({ ...tempWater, nitrate: Number(e.target.value) })} 
                className="w-full accent-blue-500" 
              />
              <div className="text-xs text-slate-500 mt-1">Keep &lt; 20</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
          >
            Update
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface LogFeedingProps {
  isOpen: boolean;
  onClose: () => void;
}

function LogFeeding({ isOpen, onClose }: LogFeedingProps) {
  const [feedingData, setFeedingData] = useState({
    foodType: 'Pellets',
    amount: '2-3 pellets',
    notes: ''
  });

  const handleSave = () => {
    // In a real app, this would save to the database
    console.log('Feeding logged:', {
      ...feedingData,
      timestamp: new Date().toISOString()
    });
    onClose();
    // Reset form
    setFeedingData({
      foodType: 'Pellets',
      amount: '2-3 pellets',
      notes: ''
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <PlusIcon className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Log Feeding</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Food Type</label>
            <select 
              className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              value={feedingData.foodType}
              onChange={e => setFeedingData({ ...feedingData, foodType: e.target.value })}
            >
              <option>Pellets</option>
              <option>Flakes</option>
              <option>Frozen Bloodworms</option>
              <option>Live Food</option>
              <option>Treats</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Amount</label>
            <select 
              className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              value={feedingData.amount}
              onChange={e => setFeedingData({ ...feedingData, amount: e.target.value })}
            >
              <option>1-2 pellets</option>
              <option>2-3 pellets</option>
              <option>3-4 pellets</option>
              <option>Small pinch</option>
              <option>Medium pinch</option>
              <option>Large pinch</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Notes (optional)</label>
            <textarea 
              className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              rows={2}
              placeholder="How did they respond? Any observations..."
              value={feedingData.notes}
              onChange={e => setFeedingData({ ...feedingData, notes: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors"
          >
            Log Feeding
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface LogWaterChangeProps {
  isOpen: boolean;
  onClose: () => void;
}

function LogWaterChange({ isOpen, onClose }: LogWaterChangeProps) {
  const [changeData, setChangeData] = useState({
    percentage: 25,
    notes: ''
  });

  const handleSave = () => {
    // In a real app, this would save to the database
    console.log('Water change logged:', {
      ...changeData,
      timestamp: new Date().toISOString()
    });
    onClose();
    // Reset form
    setChangeData({
      percentage: 25,
      notes: ''
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <DropIcon className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Log Water Change</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Water Changed: {changeData.percentage}%</label>
            <input 
              type="range" 
              min={10} 
              max={50} 
              step={5} 
              value={changeData.percentage} 
              onChange={e => setChangeData({ ...changeData, percentage: Number(e.target.value) })} 
              className="w-full accent-blue-500" 
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>10%</span>
              <span className="text-green-600">25% recommended</span>
              <span>50%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Notes (optional)</label>
            <textarea 
              className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              rows={3}
              placeholder="Water condition, cleaning done, any observations..."
              value={changeData.notes}
              onChange={e => setChangeData({ ...changeData, notes: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
          >
            Log Change
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export interface QuickActionsProps {
  className?: string;
}

export default function QuickActions({ className = '' }: QuickActionsProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <div className={className}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <button 
          onClick={() => setActiveModal('fish')}
          className="flex items-center gap-3 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          <FishIcon className="w-5 h-5" />
          <span>Update Fish</span>
        </button>
        
        <button 
          onClick={() => setActiveModal('water')}
          className="flex items-center gap-3 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          <DropIcon className="w-5 h-5" />
          <span>Test Water</span>
        </button>
        
        <button 
          onClick={() => setActiveModal('feeding')}
          className="flex items-center gap-3 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Log Feeding</span>
        </button>
        
        <button 
          onClick={() => setActiveModal('waterchange')}
          className="flex items-center gap-3 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          <DropIcon className="w-5 h-5" />
          <span>Log Water Change</span>
        </button>
      </div>

      <AnimatePresence>
        <QuickUpdateFish isOpen={activeModal === 'fish'} onClose={() => setActiveModal(null)} />
        <QuickUpdateWater isOpen={activeModal === 'water'} onClose={() => setActiveModal(null)} />
        <LogFeeding isOpen={activeModal === 'feeding'} onClose={() => setActiveModal(null)} />
        <LogWaterChange isOpen={activeModal === 'waterchange'} onClose={() => setActiveModal(null)} />
      </AnimatePresence>
    </div>
  );
}