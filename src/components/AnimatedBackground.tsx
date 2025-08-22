import React from 'react';

export default function AnimatedBackground() {
  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="25%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="75%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="orb1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="orb2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="orb3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
          </linearGradient>
          <filter id="blur" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="60" />
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#bgGradient)" opacity="0.1" />
        <g filter="url(#blur)">
          <circle cx="15%" cy="25%" r="200" fill="url(#orb1)">
            <animate attributeName="cy" values="25%;35%;25%" dur="18s" repeatCount="indefinite" />
            <animate attributeName="r" values="200;250;200" dur="12s" repeatCount="indefinite" />
          </circle>
          <circle cx="85%" cy="70%" r="180" fill="url(#orb2)">
            <animate attributeName="cy" values="70%;60%;70%" dur="20s" repeatCount="indefinite" />
            <animate attributeName="cx" values="85%;75%;85%" dur="25s" repeatCount="indefinite" />
          </circle>
          <circle cx="50%" cy="20%" r="150" fill="url(#orb3)">
            <animate attributeName="cx" values="50%;60%;50%" dur="22s" repeatCount="indefinite" />
            <animate attributeName="cy" values="20%;30%;20%" dur="16s" repeatCount="indefinite" />
          </circle>
          <circle cx="20%" cy="80%" r="120" fill="url(#orb1)">
            <animate attributeName="r" values="120;160;120" dur="14s" repeatCount="indefinite" />
            <animate attributeName="cx" values="20%;30%;20%" dur="19s" repeatCount="indefinite" />
          </circle>
          <circle cx="75%" cy="25%" r="100" fill="url(#orb3)">
            <animate attributeName="cy" values="25%;15%;25%" dur="21s" repeatCount="indefinite" />
            <animate attributeName="r" values="100;140;100" dur="17s" repeatCount="indefinite" />
          </circle>
        </g>
        {/* Subtle mesh overlay */}
        <defs>
          <pattern id="meshPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="50" cy="50" r="1" fill="#3b82f6" fillOpacity="0.1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#meshPattern)" opacity="0.3" />
      </svg>
    </div>
  );
}



