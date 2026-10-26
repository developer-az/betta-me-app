import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { TankSVG } from '../components/Visuals';
import { useData } from '../components/DataProvider';
import { PageSkeleton } from '../components/ui';
import { useDraft } from '../hooks/useDraft';

export default function TankPage() {
  const { tank, setTank, loading } = useData();
  const [draft, setDraft, dirty] = useDraft(tank);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const persistAndGo = async (path: string) => {
    if (!dirty) {
      navigate(path);
      return;
    }
    setSaving(true);
    const ok = await setTank(draft);
    setSaving(false);
    if (ok) navigate(path);
  };

  if (loading) {
    return (
      <Layout>
        <PageSkeleton />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-2xl">
        <div className="eyebrow">Habitat</div>
        <h1 className="display mt-2 text-4xl">Tank setup</h1>
        <p className="mt-2 text-ink-600 dark:text-cream-100/70">
          Five gallons is the floor. Heat and filtration are not optional if you want stable chemistry.
        </p>

        <div className="mt-8 flex justify-center">
          <TankSVG size={draft.size} />
        </div>

        <div className="surface-card mt-8 p-6">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Volume</span>
            <span className="font-display text-2xl">{draft.size} gal</span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            value={draft.size}
            aria-label="Tank volume in gallons"
            onChange={(event) => setDraft({ ...draft, size: Number(event.target.value) })}
            className="slider mt-4 w-full"
          />
          <div className="mt-2 flex justify-between text-xs text-ink-500">
            <span>1 gal</span>
            <span>20 gal</span>
          </div>
          {draft.size < 5 && (
            <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-900/20 dark:text-amber-100">
              {draft.size < 3
                ? 'Tanks under 3 gallons crash quickly and are not recommended.'
                : 'Five gallons is the minimum we recommend for a single betta.'}
            </div>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <label className="choice">
              <span className="font-medium">Heater</span>
              <input
                type="checkbox"
                checked={draft.heater}
                onChange={(event) => setDraft({ ...draft, heater: event.target.checked })}
              />
            </label>
            <label className="choice">
              <span className="font-medium">Filter</span>
              <input
                type="checkbox"
                checked={draft.filter}
                onChange={(event) => setDraft({ ...draft, filter: event.target.checked })}
              />
            </label>
          </div>
          {dirty && <p className="mt-4 text-sm text-ink-500">Unsaved habitat changes.</p>}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            className="btn-primary"
            disabled={saving}
            onClick={() => persistAndGo('/fish')}
          >
            {saving ? 'Saving…' : 'Save and continue'}
          </button>
          <button
            className="btn-secondary"
            disabled={saving}
            onClick={() => persistAndGo('/dashboard')}
          >
            Overview
          </button>
        </div>
      </div>
    </Layout>
  );
}
