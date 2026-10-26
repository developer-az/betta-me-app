import { useState } from 'react';

function snapshot<T>(value: T): string {
  return JSON.stringify(value);
}

/**
 * Local edit buffer. Adopts new source data only when the user has not typed
 * over it, so a realtime refresh does not wipe an in-progress check-in.
 */
export function useDraft<T>(source: T): [T, (value: T) => void, boolean] {
  const sourceKey = snapshot(source);
  const [draft, setDraft] = useState(source);
  const [seen, setSeen] = useState(sourceKey);
  const draftKey = snapshot(draft);

  if (sourceKey !== seen) {
    setSeen(sourceKey);
    if (draftKey === seen) {
      setDraft(source);
    }
  }

  const dirty = snapshot(draft) !== sourceKey;
  return [draft, setDraft, dirty];
}
