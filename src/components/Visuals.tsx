import React from 'react';

export const TankSVG = ({ size = 20 }: { size?: number }) => {
  const width = Math.max(180, size * 14);
  const height = Math.max(110, size * 8);
  return (
    <svg width={width} height={height} viewBox="0 0 280 160" aria-label="Aquarium habitat">
      <defs>
        <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d7f6f3" />
          <stop offset="100%" stopColor="#7ec8c3" />
        </linearGradient>
        <linearGradient id="waterFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5ec4c8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0f766e" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d6c09a" />
          <stop offset="100%" stopColor="#b0895a" />
        </linearGradient>
        <filter id="tankShadow" x="-10%" y="-10%" width="120%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="rgba(7,11,20,0.18)" />
        </filter>
      </defs>
      <rect x="18" y="22" width="244" height="118" rx="8" fill="url(#glass)" stroke="#115e59" strokeWidth="3" filter="url(#tankShadow)" />
      <rect x="24" y="30" width="232" height="102" rx="4" fill="url(#waterFill)" />
      <path d="M24 118h232v14c0 4-3 8-8 8H32c-5 0-8-4-8-8v-14z" fill="url(#sand)" />
      <path d="M40 118c8-28 12-48 10-70" stroke="#0f766e" strokeWidth="3" fill="none" />
      <ellipse cx="50" cy="52" rx="10" ry="16" fill="#147a6e" opacity="0.9" />
      <ellipse cx="62" cy="60" rx="8" ry="14" fill="#0d9488" opacity="0.8" />
      <path d="M210 118c-6-24-4-46 8-68" stroke="#115e59" strokeWidth="3" fill="none" />
      <ellipse cx="226" cy="56" rx="9" ry="15" fill="#0f766e" />
      <ellipse cx="214" cy="68" rx="7" ry="12" fill="#14b8a6" />
      <ellipse cx="140" cy="122" rx="22" ry="8" fill="#8d6e4c" />
      <ellipse cx="148" cy="116" rx="12" ry="6" fill="#a9845a" />
      <circle cx="70" cy="100" r="2" fill="#ffffff" opacity="0.7">
        <animate attributeName="cy" values="100;40;100" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="190" cy="108" r="1.6" fill="#ffffff" opacity="0.6">
        <animate attributeName="cy" values="108;46;108" dur="5s" repeatCount="indefinite" />
      </circle>
      <rect x="24" y="30" width="232" height="6" fill="#ffffff" opacity="0.18" />
    </svg>
  );
};

export const FishSVG = ({ color = '#e11d48', mood = 'happy' }: { color?: string; mood?: 'happy' | 'sad' }) => (
  <svg width="108" height="58" viewBox="0 0 108 58" aria-label="Betta fish">
    <defs>
      <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={color} />
        <stop offset="100%" stopColor="#7f1d1d" />
      </linearGradient>
      <linearGradient id="veil" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={color} stopOpacity="0.95" />
        <stop offset="100%" stopColor={color} stopOpacity="0.2" />
      </linearGradient>
      <filter id="finBlur">
        <feGaussianBlur stdDeviation="0.4" />
      </filter>
    </defs>
    <path d="M58 29 C72 6 92 4 104 10 C96 18 90 24 84 29 C96 32 104 40 102 50 C86 46 70 42 58 29Z" fill="url(#veil)" filter="url(#finBlur)" />
    <path d="M28 16 C40 4 54 8 58 18 C50 16 40 18 32 24Z" fill="url(#veil)" />
    <path d="M30 40 C42 54 56 50 60 40 C50 46 40 44 32 38Z" fill="url(#veil)" />
    <ellipse cx="38" cy="29" rx="22" ry="12" fill="url(#bodyGrad)" />
    <circle cx="26" cy="26" r="4.2" fill="#f8fafc" />
    <circle cx="26.6" cy="26" r="2.1" fill="#0b1220" />
    <circle cx="27.4" cy="25.2" r="0.8" fill="#ffffff" />
    {mood === 'happy' ? (
      <path d="M32 33c2.4-1.6 5.2-1.4 7 0" stroke="#7f1d1d" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    ) : (
      <path d="M32 35c2.4 1.4 5.2 1.2 7 0" stroke="#4b5563" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    )}
  </svg>
);
