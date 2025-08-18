import React from 'react';

export const TankSVG = ({ size = 20 }: { size?: number }) => (
  <svg width={size * 11} height={size * 6} viewBox="0 0 220 120" aria-label="Aquarium tank">
    <defs>
      <linearGradient id="tankGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#b3e5fc" />
        <stop offset="100%" stopColor="#81d4fa" />
      </linearGradient>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="rgba(30,58,138,0.25)"/>
      </filter>
    </defs>
    <ellipse cx="110" cy="100" rx="100" ry="15" fill="#b3e5fc" opacity="0.45" />
    <rect x="10" y="20" width="200" height="80" rx="20" fill="url(#tankGradient)" stroke="#0288d1" strokeWidth="3" filter="url(#softShadow)" />
    <ellipse cx="110" cy="100" rx="100" ry="15" fill="#4fc3f7" opacity="0.25" />
  </svg>
);

export const FishSVG = ({ color = '#e57373', mood = 'happy' }: { color?: string; mood?: 'happy' | 'sad' }) => (
  <svg width="80" height="40" viewBox="0 0 80 40" aria-label="Betta fish">
    <defs>
      <filter id="fishGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor={color} floodOpacity="0.65" />
      </filter>
    </defs>
    <ellipse cx="30" cy="20" rx="18" ry="10" fill={color} filter="url(#fishGlow)" />
    <polygon points="48,20 70,10 70,30" fill={color} />
    <circle cx="22" cy="18" r="2" fill="#1f2937" />
    {mood === 'happy' && <path d="M25 25 Q28 28 31 25" stroke="#1f2937" strokeWidth="1" fill="none" />}
    {mood === 'sad' && <path d="M25 28 Q28 25 31 28" stroke="#1f2937" strokeWidth="1" fill="none" />}
  </svg>
);



