import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TankState, FishState, WaterState } from '../types';

type QueryResult = { data: unknown; error: { code?: string; message: string } | null };

const calls: Array<{ table: string; op: 'insert' | 'update'; payload: unknown }> = [];
let queue: QueryResult[] = [];

const fromMock = vi.hoisted(() => vi.fn());

vi.mock('./supabase', () => ({
  supabase: { from: fromMock },
}));

function installChain() {
  fromMock.mockImplementation((table: string) => {
    const api: Record<string, unknown> = {};
    const passthrough = () => api;
    api.select = passthrough;
    api.eq = passthrough;
    api.order = passthrough;
    api.limit = passthrough;
    api.insert = (payload: unknown) => {
      calls.push({ table, op: 'insert', payload });
      return api;
    };
    api.update = (payload: unknown) => {
      calls.push({ table, op: 'update', payload });
      return api;
    };
    api.single = async () => queue.shift() ?? { data: null, error: null };
    return api;
  });
}

const tank: TankState = { size: 10, heater: true, filter: false };
const fish: FishState = {
  name: 'Indigo',
  color: '#e11d48',
  appetite: 'Eating well',
  activity: 'Normal',
  finCondition: 'Healthy',
  colorCondition: 'Vibrant',
  gillCondition: 'Normal',
  bodyCondition: 'Normal',
  behavior: 'Normal',
};
const water: WaterState = { temperature: 78, pH: 7, ammonia: 0, nitrite: 0, nitrate: 10 };

describe('database writes', () => {
  beforeEach(() => {
    calls.length = 0;
    queue = [];
    installChain();
  });

  it('updates the current habitat instead of inserting another tank', async () => {
    queue = [
      { data: { id: 'tank-1' }, error: null },
      { data: { id: 'tank-1', size: 10 }, error: null },
    ];
    const { tankService } = await import('./database');
    await tankService.saveTank('user-1', tank);

    expect(calls.map((call) => call.op)).toEqual(['update']);
    expect(calls[0]).toMatchObject({
      table: 'tanks',
      payload: { size: 10, heater: true, filter: false },
    });
  });

  it('stores a water test against the current tank', async () => {
    queue = [
      { data: { id: 'tank-1' }, error: null },
      { data: { id: 'reading-1' }, error: null },
    ];
    const { waterService } = await import('./database');
    await waterService.saveWaterReading('user-1', water, tank);

    expect(calls).toEqual([
      {
        table: 'water_readings',
        op: 'insert',
        payload: {
          user_id: 'user-1',
          tank_id: 'tank-1',
          temperature: 78,
          ph: 7,
          ammonia: 0,
          nitrite: 0,
          nitrate: 10,
        },
      },
    ]);
  });

  it('inserts a fish profile with the required tank id', async () => {
    queue = [
      { data: { id: 'tank-1' }, error: null },
      { data: null, error: { code: 'PGRST116', message: 'no rows' } },
      { data: { id: 'fish-1' }, error: null },
    ];
    const { fishService } = await import('./database');
    await fishService.saveFish('user-1', fish, tank);

    expect(calls).toHaveLength(1);
    expect(calls[0]).toMatchObject({
      table: 'fish',
      op: 'insert',
      payload: { user_id: 'user-1', tank_id: 'tank-1', name: 'Indigo' },
    });
  });

  it('updates an existing fish instead of appending a row per edit', async () => {
    queue = [
      { data: { id: 'tank-1' }, error: null },
      { data: { id: 'fish-1' }, error: null },
      { data: { id: 'fish-1' }, error: null },
    ];
    const { fishService } = await import('./database');
    await fishService.saveFish('user-1', fish, tank);

    expect(calls.map((call) => `${call.table}:${call.op}`)).toEqual(['fish:update']);
    expect(calls[0].payload).toMatchObject({ tank_id: 'tank-1', name: 'Indigo' });
  });
});
