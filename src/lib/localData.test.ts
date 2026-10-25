import { readGuestFishProfile, writeGuestFishProfile, clearAllLocalData } from './localData';
import { FishState } from '../types';

const profile: FishState = {
  name: 'Indigo',
  color: '#2563eb',
  appetite: 'Not eating',
  activity: 'Lethargic',
  finCondition: 'Clamped',
  colorCondition: 'Faded',
  gillCondition: 'Rapid',
  bodyCondition: 'Thin',
  behavior: 'Hiding',
};

describe('guest fish profile', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('remembers health observations between sessions', () => {
    expect(readGuestFishProfile()).toBeNull();
    writeGuestFishProfile(profile);
    expect(readGuestFishProfile()).toEqual(profile);
  });

  it('clears the health profile with the rest of guest data', () => {
    writeGuestFishProfile(profile);
    clearAllLocalData();
    expect(readGuestFishProfile()).toBeNull();
  });
});
