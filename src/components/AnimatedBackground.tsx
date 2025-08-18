import React from 'react';

export default function AnimatedBackground() {
  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bgGradient)" opacity="0.12" />
        <g>
          <circle cx="10%" cy="20%" r="140" fill="#38bdf8" opacity="0.18">
            <animate attributeName="cy" values="20%;30%;20%" dur="14s" repeatCount="indefinite" />
          </circle>
          <circle cx="85%" cy="75%" r="200" fill="#a78bfa" opacity="0.16">
            <animate attributeName="cy" values="75%;65%;75%" dur="16s" repeatCount="indefinite" />
          </circle>
          <circle cx="60%" cy="30%" r="120" fill="#60a5fa" opacity="0.16">
            <animate attributeName="cx" values="60%;55%;60%" dur="18s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    </div>
  );
}



