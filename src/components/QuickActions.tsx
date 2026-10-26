import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from './DataProvider';
import { useAuth } from '../contexts/AuthContext';
import { feedingLogService, waterChangeService, getOrCreateTankId } from '../lib/database';
import { FeedingLogForm, WaterChangeForm } from '../types';
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

  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="surface-card max-h-[90vh] w-full max-w-md overflow-y-auto p-6 shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FishIcon className="w-6 h-6 text-purple-500" />
            <h2 className="font-display text-xl">Quick Fish Update</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-cream-100 dark:hover:bg-ink-700"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">How is {fish.name || 'your betta'} doing today?</label>
            <div className="grid grid-cols-2 gap-3">
              <select 
                className="field"
                value={tempFish.appetite}
                onChange={e => setTempFish({ ...tempFish, appetite: e.target.value })}
              >
                <option>Eating well</option>
                <option>Not eating</option>
              </select>
              <select 
                className="field"
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
                className="field"
                value={tempFish.finCondition}
                onChange={e => setTempFish({ ...tempFish, finCondition: e.target.value })}
              >
                <option>Healthy</option>
                <option>Fin rot</option>
                <option>Torn</option>
                <option>Clamped</option>
              </select>
              <select 
                className="field"
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
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-primary flex-1"
          >
            Update
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
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

  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="surface-card max-h-[90vh] w-full max-w-md overflow-y-auto p-6 shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <DropIcon className="w-6 h-6 text-blue-500" />
            <h2 className="font-display text-xl">Quick Water Test</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-cream-100 dark:hover:bg-ink-700"
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
              className="slider w-full" 
            />
            <div className="flex justify-between mt-1 text-xs text-ink-500">
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
              className="slider w-full" 
            />
            <div className="flex justify-between mt-1 text-xs text-ink-500">
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
                className="slider w-full" 
              />
              <div className="mt-1 text-xs text-ink-500">Should be 0</div>
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
                className="slider w-full" 
              />
              <div className="mt-1 text-xs text-ink-500">Keep &lt; 20</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-primary flex-1"
          >
            Update
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
}

interface LogFeedingProps {
  isOpen: boolean;
  onClose: () => void;
}

function LogFeeding({ isOpen, onClose }: LogFeedingProps) {
  const { user, isGuestMode } = useAuth();
  const { tank } = useData();
  const [feedingData, setFeedingData] = useState<FeedingLogForm>({
    foodType: 'Pellets',
    amount: '2-3 pellets',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (user && !isGuestMode) {
        // Authenticated user - save to Supabase
        const tankId = await getOrCreateTankId(user.id, tank);
        await feedingLogService.saveFeedingLog(user.id, tankId, feedingData);
      } else {
        // Guest mode - save to localStorage  
        const guestLogs = JSON.parse(localStorage.getItem('guestFeedingLogs') || '[]');
        const newLog = {
          id: Date.now().toString(),
          user_id: 'guest',
          tank_id: 'guest-tank',
          food_type: feedingData.foodType,
          amount: feedingData.amount,
          notes: feedingData.notes,
          created_at: new Date().toISOString()
        };
        guestLogs.unshift(newLog);
        localStorage.setItem('guestFeedingLogs', JSON.stringify(guestLogs.slice(0, 50))); // Keep last 50
      }

      onClose();
      // Reset form
      setFeedingData({
        foodType: 'Pellets',
        amount: '2-3 pellets',
        notes: ''
      });
    } catch (err) {
      console.error('Error saving feeding log:', err);
      setError('Failed to save feeding log. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="surface-card w-full max-w-md p-6 shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <PlusIcon className="w-6 h-6 text-green-500" />
            <h2 className="font-display text-xl">Log Feeding</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-cream-100 dark:hover:bg-ink-700"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold mb-2">Food Type</label>
            <select 
              className="field"
              value={feedingData.foodType}
              onChange={e => setFeedingData({ ...feedingData, foodType: e.target.value })}
              disabled={isLoading}
            >
              <option value="Pellets">Pellets</option>
              <option value="Flakes">Flakes</option>
              <option value="Frozen Bloodworms">Frozen Bloodworms</option>
              <option value="Live Bloodworms">Live Bloodworms</option>
              <option value="Brine Shrimp">Brine Shrimp</option>
              <option value="Daphnia">Daphnia</option>
              <option value="Tubifex Worms">Tubifex Worms</option>
              <option value="Freeze-Dried Treats">Freeze-Dried Treats</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Amount</label>
            <select 
              className="field"
              value={feedingData.amount}
              onChange={e => setFeedingData({ ...feedingData, amount: e.target.value })}
              disabled={isLoading}
            >
              <option value="1-2 pellets">1-2 pellets</option>
              <option value="2-3 pellets">2-3 pellets</option>
              <option value="3-4 pellets">3-4 pellets</option>
              <option value="4-5 pellets">4-5 pellets</option>
              <option value="Small pinch">Small pinch</option>
              <option value="Medium pinch">Medium pinch</option>
              <option value="Large pinch">Large pinch</option>
              <option value="Few flakes">Few flakes</option>
              <option value="1-2 bloodworms">1-2 bloodworms</option>
              <option value="3-4 bloodworms">3-4 bloodworms</option>
              <option value="Small portion">Small portion</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Notes (optional)</label>
            <textarea 
              className="field"
              rows={2}
              placeholder="How did they respond? Any observations..."
              value={feedingData.notes}
              onChange={e => setFeedingData({ ...feedingData, notes: e.target.value })}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Log Feeding'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
}

interface LogWaterChangeProps {
  isOpen: boolean;
  onClose: () => void;
}

function LogWaterChange({ isOpen, onClose }: LogWaterChangeProps) {
  const { user, isGuestMode } = useAuth();
  const { tank } = useData();
  const [changeData, setChangeData] = useState<WaterChangeForm>({
    percentage: 25,
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (user && !isGuestMode) {
        // Authenticated user - save to Supabase
        const tankId = await getOrCreateTankId(user.id, tank);
        await waterChangeService.saveWaterChange(user.id, tankId, changeData);
      } else {
        // Guest mode - save to localStorage
        const guestChanges = JSON.parse(localStorage.getItem('guestWaterChanges') || '[]');
        const newChange = {
          id: Date.now().toString(),
          user_id: 'guest',
          tank_id: 'guest-tank',
          percentage: changeData.percentage,
          notes: changeData.notes,
          created_at: new Date().toISOString()
        };
        guestChanges.unshift(newChange);
        localStorage.setItem('guestWaterChanges', JSON.stringify(guestChanges.slice(0, 50))); // Keep last 50
      }

      onClose();
      // Reset form
      setChangeData({
        percentage: 25,
        notes: ''
      });
    } catch (err) {
      console.error('Error saving water change:', err);
      setError('Failed to save water change. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="surface-card w-full max-w-md p-6 shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <DropIcon className="w-6 h-6 text-blue-500" />
            <h2 className="font-display text-xl">Log Water Change</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-cream-100 dark:hover:bg-ink-700"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold mb-2">Water Changed: {changeData.percentage}%</label>
            <input 
              type="range" 
              min={10} 
              max={50} 
              step={5} 
              value={changeData.percentage} 
              onChange={e => setChangeData({ ...changeData, percentage: Number(e.target.value) })} 
              className="slider w-full" 
              disabled={isLoading}
            />
            <div className="flex justify-between mt-1 text-xs text-ink-500">
              <span>10%</span>
              <span className="text-green-600">25% recommended</span>
              <span>50%</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {[15, 25, 30, 40, 50].map((percent) => (
                <button
                  key={percent}
                  onClick={() => setChangeData({ ...changeData, percentage: percent })}
                  disabled={isLoading}
                  className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                    changeData.percentage === percent
                      ? 'chip-active'
                      : 'chip-idle'
                  }`}
                >
                  {percent}%
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Notes (optional)</label>
            <textarea 
              className="field"
              rows={3}
              placeholder="Water condition, cleaning done, any observations..."
              value={changeData.notes}
              onChange={e => setChangeData({ ...changeData, notes: e.target.value })}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Log Change'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
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
          className="surface-card flex items-center gap-3 px-4 py-3 text-left font-semibold"
        >
          <FishIcon className="h-5 w-5 text-brand-700" />
          <span>Update betta</span>
        </button>

        <button
          onClick={() => setActiveModal('water')}
          className="surface-card flex items-center gap-3 px-4 py-3 text-left font-semibold"
        >
          <DropIcon className="h-5 w-5 text-brand-700" />
          <span>Test water</span>
        </button>

        <button
          onClick={() => setActiveModal('feeding')}
          className="surface-card flex items-center gap-3 px-4 py-3 text-left font-semibold"
        >
          <PlusIcon className="h-5 w-5 text-brand-700" />
          <span>Log feeding</span>
        </button>

        <button
          onClick={() => setActiveModal('waterchange')}
          className="surface-card flex items-center gap-3 px-4 py-3 text-left font-semibold"
        >
          <DropIcon className="h-5 w-5 text-brand-700" />
          <span>Log water change</span>
        </button>
      </div>

      <AnimatePresence>
        {activeModal === 'fish' && <QuickUpdateFish key="fish" isOpen onClose={() => setActiveModal(null)} />}
        {activeModal === 'water' && <QuickUpdateWater key="water" isOpen onClose={() => setActiveModal(null)} />}
        {activeModal === 'feeding' && <LogFeeding key="feeding" isOpen onClose={() => setActiveModal(null)} />}
        {activeModal === 'waterchange' && <LogWaterChange key="waterchange" isOpen onClose={() => setActiveModal(null)} />}
      </AnimatePresence>
    </div>
  );
}