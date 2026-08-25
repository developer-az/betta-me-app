export type TemperatureUnit = 'fahrenheit' | 'celsius';

export function fToC(f: number): number {
  return Math.round((((f - 32) * 5) / 9) * 10) / 10;
}

export function cToF(c: number): number {
  return Math.round(((c * 9) / 5 + 32) * 10) / 10;
}

export function formatTemperature(f: number, unit: TemperatureUnit): string {
  if (unit === 'celsius') return `${fToC(f)}°C`;
  return `${f}°F`;
}

export function relativeTime(iso: string | Date): string {
  const date = typeof iso === 'string' ? new Date(iso) : iso;
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}

export function daysSince(iso?: string | null): number | null {
  if (!iso) return null;
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / (24 * 60 * 60 * 1000)));
}
