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
          <linearGradient id="shape1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="shape2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="shape3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
          </linearGradient>
          <filter id="blur" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="40" />
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#bgGradient)" opacity="0.1" />
        <g filter="url(#blur)">
          {/* Geometric shapes instead of circles */}
          <g>
            <polygon points="15,25 25,15 35,25 25,35" fill="url(#shape1)" transform="scale(8)">
              <animateTransform attributeName="transform" attributeType="XML" type="scale" values="8; 12; 8" dur="12s" repeatCount="indefinite" />
            </polygon>
            <animateTransform attributeName="transform" attributeType="XML" type="translate" values="0,0; 50,20; 0,0" dur="18s" repeatCount="indefinite" />
          </g>
          <rect x="80%" y="65%" width="20" height="20" fill="url(#shape2)" transform="rotate(45)">
            <animate attributeName="y" values="65%; 55%; 65%" dur="20s" repeatCount="indefinite" />
            <animate attributeName="x" values="80%; 70%; 80%" dur="25s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" attributeType="XML" type="rotate" values="45; 90; 45" dur="15s" repeatCount="indefinite" />
          </rect>
          <polygon points="45,15 55,15 60,25 55,35 45,35 40,25" fill="url(#shape3)" transform="scale(6)">
            <animate attributeName="points" values="45,15 55,15 60,25 55,35 45,35 40,25; 42,12 58,12 65,25 58,38 42,38 35,25; 45,15 55,15 60,25 55,35 45,35 40,25" dur="22s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" attributeType="XML" type="translate" values="0,0; 30,20; 0,0" dur="16s" repeatCount="indefinite" />
          </polygon>
          <rect x="15%" y="75%" width="15" height="15" fill="url(#shape1)" transform="rotate(30)">
            <animate attributeName="width" values="15; 25; 15" dur="14s" repeatCount="indefinite" />
            <animate attributeName="height" values="15; 25; 15" dur="14s" repeatCount="indefinite" />
            <animate attributeName="x" values="15%; 25%; 15%" dur="19s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" attributeType="XML" type="rotate" values="30; 150; 30" dur="18s" repeatCount="indefinite" />
          </rect>
          <polygon points="70,20 80,20 85,30 80,40 70,40 65,30" fill="url(#shape3)" transform="scale(4)">
            <animate attributeName="points" values="70,20 80,20 85,30 80,40 70,40 65,30; 68,18 82,18 88,30 82,42 68,42 62,30; 70,20 80,20 85,30 80,40 70,40 65,30" dur="21s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" attributeType="XML" type="scale" values="4; 7; 4" dur="17s" repeatCount="indefinite" />
          </polygon>
        </g>
        {/* Geometric mesh overlay instead of circles */}
        <defs>
          <pattern id="meshPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect x="48" y="48" width="4" height="4" fill="#3b82f6" fillOpacity="0.1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#meshPattern)" opacity="0.3" />
      </svg>
    </div>
  );
}



