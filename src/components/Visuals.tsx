import React from 'react';

export const TankSVG = ({ size = 20 }: { size?: number }) => (
  <svg width={size * 11} height={size * 6} viewBox="0 0 220 120" aria-label="Aquarium tank">
    <defs>
      <linearGradient id="tankGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#b3e5fc" />
        <stop offset="100%" stopColor="#81d4fa" />
      </linearGradient>
      <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#4fc3f7" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#29b6f6" stopOpacity="0.6" />
      </linearGradient>
      <linearGradient id="plantGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#66bb6a" />
        <stop offset="100%" stopColor="#4caf50" />
      </linearGradient>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="rgba(30,58,138,0.25)"/>
      </filter>
      <filter id="ripple" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="0.5" />
      </filter>
    </defs>
    
    {/* Tank base - rectangular instead of elliptical */}
    <rect x="10" y="95" width="200" height="20" rx="10" fill="#b3e5fc" opacity="0.45" />
    
    {/* Main tank - modern rectangular design */}
    <rect x="10" y="20" width="200" height="80" rx="20" fill="url(#tankGradient)" stroke="#0288d1" strokeWidth="3" filter="url(#softShadow)" />
    
    {/* Water surface - rectangular wave pattern instead of ellipse */}
    <rect x="15" y="25" width="190" height="70" rx="15" fill="url(#waterGradient)" />
    
    {/* Enhanced decorations - geometric aquascaping */}
    <g id="decorations">
      {/* Left plant - geometric leaves */}
      <rect x="20" y="70" width="4" height="30" fill="url(#plantGradient)" rx="2" />
      <polygon points="18,75 24,72 28,78 22,82" fill="#66bb6a" opacity="0.8" />
      <polygon points="16,80 26,77 30,83 20,87" fill="#4caf50" opacity="0.7" />
      
      {/* Right decoration - crystal formation */}
      <polygon points="180,85 185,75 190,85 185,95" fill="#9c27b0" opacity="0.6" />
      <polygon points="185,80 190,70 195,80 190,90" fill="#673ab7" opacity="0.7" />
      
      {/* Center rock - geometric structure */}
      <polygon points="95,90 105,85 115,90 110,95 100,95" fill="#795548" opacity="0.8" />
      <polygon points="100,85 110,80 120,85 115,90 105,90" fill="#8d6e63" opacity="0.6" />
      
      {/* Substrate - geometric pattern */}
      <rect x="15" y="95" width="190" height="5" fill="#8d6e63" opacity="0.5" />
      <rect x="20" y="95" width="5" height="3" fill="#6d4c41" opacity="0.7" />
      <rect x="30" y="96" width="4" height="2" fill="#5d4037" opacity="0.6" />
      <rect x="180" y="95" width="6" height="3" fill="#6d4c41" opacity="0.7" />
      
      {/* Bubbles - geometric shapes instead of circles */}
      <rect x="50" y="85" width="2" height="2" fill="#ffffff" opacity="0.6" rx="1">
        <animate attributeName="y" values="85;25;85" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3s" repeatCount="indefinite" />
      </rect>
      <polygon points="75,80 77,78 79,80 77,82" fill="#ffffff" opacity="0.5">
        <animateTransform attributeName="transform" type="translate" values="0,0; -2,-50; 0,0" dur="4s" repeatCount="indefinite" />
      </polygon>
      <rect x="160" y="88" width="1.5" height="1.5" fill="#ffffff" opacity="0.7" rx="0.5">
        <animate attributeName="y" values="88;30;88" dur="2.5s" repeatCount="indefinite" />
      </rect>
    </g>
    
    {/* Water surface ripples - geometric waves */}
    <rect x="15" y="25" width="190" height="2" fill="#ffffff" opacity="0.2" filter="url(#ripple)">
      <animate attributeName="opacity" values="0.2;0.4;0.2" dur="3s" repeatCount="indefinite" />
    </rect>
  </svg>
);

export const FishSVG = ({ color = '#e57373', mood = 'happy' }: { color?: string; mood?: 'happy' | 'sad' }) => (
  <svg width="80" height="40" viewBox="0 0 80 40" aria-label="Betta fish">
    <defs>
      <filter id="fishGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor={color} floodOpacity="0.65" />
      </filter>
      <linearGradient id="fishGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={color} />
        <stop offset="100%" stopColor={color} stopOpacity="0.8" />
      </linearGradient>
    </defs>
    {/* Modern geometric fish body - diamond/hexagon shape instead of ellipse */}
    <polygon 
      points="12,20 20,12 40,12 48,20 40,28 20,28" 
      fill="url(#fishGradient)" 
      filter="url(#fishGlow)" 
    />
    {/* Fins - more angular */}
    <polygon points="48,20 68,8 70,12 52,20 70,28 68,32" fill={color} />
    <polygon points="20,12 15,5 20,8" fill={color} opacity="0.8" />
    <polygon points="20,28 15,35 20,32" fill={color} opacity="0.8" />
    {/* Eye */}
    <polygon points="20,16 24,14 24,18" fill="#1f2937" />
    <circle cx="21" cy="16" r="1" fill="#ffffff" />
    {/* Expression based on mood */}
    {mood === 'happy' && <path d="M25 25 L28 22 L31 25" stroke="#1f2937" strokeWidth="1" fill="none" />}
    {mood === 'sad' && <path d="M25 21 L28 24 L31 21" stroke="#1f2937" strokeWidth="1" fill="none" />}
  </svg>
);



