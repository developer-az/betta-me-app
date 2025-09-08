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
        <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={color} floodOpacity="0.4" />
        <feDropShadow dx="0" dy="0" stdDeviation="1" floodColor="#ffffff" floodOpacity="0.6" />
      </filter>
      <linearGradient id="fishGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} />
        <stop offset="50%" stopColor={color} stopOpacity="0.9" />
        <stop offset="100%" stopColor={color} stopOpacity="0.7" />
      </linearGradient>
      <linearGradient id="finGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={color} stopOpacity="0.8" />
        <stop offset="100%" stopColor={color} stopOpacity="0.4" />
      </linearGradient>
      <radialGradient id="eyeGradient" cx="50%" cy="30%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="70%" stopColor="#4a90e2" />
        <stop offset="100%" stopColor="#1f2937" />
      </radialGradient>
    </defs>
    
    {/* Cute rounded fish body */}
    <ellipse 
      cx="30" 
      cy="20" 
      rx="18" 
      ry="10" 
      fill="url(#fishGradient)" 
      filter="url(#fishGlow)" 
    />
    
    {/* Flowing tail fin */}
    <path 
      d="M48 20 Q58 12 68 8 Q70 10 68 14 Q65 16 60 18 Q65 20 70 22 Q70 26 68 28 Q58 28 48 20" 
      fill="url(#finGradient)" 
    />
    
    {/* Top dorsal fin */}
    <path 
      d="M25 10 Q30 6 35 8 Q32 12 28 14 Q25 12 25 10" 
      fill="url(#finGradient)" 
      opacity="0.8"
    />
    
    {/* Bottom fin */}
    <path 
      d="M25 30 Q30 34 35 32 Q32 28 28 26 Q25 28 25 30" 
      fill="url(#finGradient)" 
      opacity="0.8"
    />
    
    {/* Cute big eye */}
    <circle cx="22" cy="17" r="4" fill="url(#eyeGradient)" />
    <circle cx="22" cy="17" r="3" fill="#4a90e2" />
    <circle cx="23" cy="16" r="1.5" fill="#ffffff" />
    <circle cx="23.5" cy="15.5" r="0.5" fill="#ffffff" opacity="0.8" />
    
    {/* Cute eyelash */}
    <path d="M18 14 Q19 13 20 14" stroke="#1f2937" strokeWidth="0.5" fill="none" opacity="0.6" />
    
    {/* Expression based on mood */}
    {mood === 'happy' && (
      <g>
        <path d="M28 22 Q30 20 32 22" stroke="#ff6b9d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Blush */}
        <circle cx="16" cy="22" r="1.5" fill="#ff6b9d" opacity="0.3" />
        <circle cx="38" cy="22" r="1.5" fill="#ff6b9d" opacity="0.3" />
      </g>
    )}
    {mood === 'sad' && <path d="M28 24 Q30 26 32 24" stroke="#6b7280" strokeWidth="1" fill="none" />}
    
    {/* Cute sparkles around the fish */}
    <g opacity="0.7">
      <circle cx="8" cy="8" r="0.5" fill="#ffd700">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="65" cy="6" r="0.8" fill="#ffd700">
        <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="72" cy="32" r="0.6" fill="#ffd700">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="5" cy="35" r="0.4" fill="#ffd700">
        <animate attributeName="opacity" values="1;0.2;1" dur="2.5s" repeatCount="indefinite" />
      </circle>
    </g>
    
    {/* Cute air bubbles */}
    <g opacity="0.6">
      <circle cx="45" cy="12" r="1" fill="#87ceeb">
        <animate attributeName="cy" values="12;8;12" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="42" cy="28" r="0.8" fill="#87ceeb">
        <animate attributeName="cy" values="28;32;28" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
      </circle>
    </g>
  </svg>
);



