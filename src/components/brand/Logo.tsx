import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: number;
  wordmark?: boolean;
  to?: string | null;
  inverted?: boolean;
}

export function Mark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="16" fill="url(#bm-bg)" />
      <path
        d="M14 34c8-11 16-16 26-15 4 .4 8 2 11 6-6 1-11 4-14 9 6-1 12 1 18 6-8 2-16 1-22-3-3 5-4 10-3 16-7-6-11-12-16-19z"
        fill="url(#bm-fin)"
      />
      <ellipse cx="28" cy="32" rx="10" ry="7" fill="#fff1f2" />
      <circle cx="24.5" cy="31" r="1.6" fill="#0b1220" />
      <defs>
        <linearGradient id="bm-bg" x1="8" y1="4" x2="60" y2="60">
          <stop stopColor="#0f766e" />
          <stop offset="1" stopColor="#042f2e" />
        </linearGradient>
        <linearGradient id="bm-fin" x1="14" y1="20" x2="54" y2="52">
          <stop stopColor="#fb7185" />
          <stop offset="1" stopColor="#e11d48" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Logo({
  className = '',
  size = 36,
  wordmark = true,
  to = '/',
  inverted = false,
}: LogoProps) {
  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark size={size} />
      {wordmark && (
        <span className="leading-none">
          <span className={`block font-display text-xl font-semibold tracking-tight ${inverted ? 'text-white' : 'text-ink-900 dark:text-cream-50'}`}>
            Betta Me
          </span>
          <span className={`block text-[10px] font-semibold uppercase tracking-[0.18em] ${inverted ? 'text-white/70' : 'text-brand-700 dark:text-brand-300'}`}>
            Care platform
          </span>
        </span>
      )}
    </span>
  );

  if (to === null) return content;
  return (
    <Link to={to} className="inline-flex items-center" aria-label="Betta Me home">
      {content}
    </Link>
  );
}
