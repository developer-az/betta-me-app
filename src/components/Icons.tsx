import React from 'react';

type IconProps = { className?: string };

export const HouseIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3l9-8z" />
  </svg>
);

export const FlaskIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M10 2h4v2h-1v4.586l5.707 5.707A1 1 0 0119 16H5a1 1 0 01-.707-1.707L10 8.586V4h-1V2z" />
  </svg>
);

export const FishIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M2 12s4-6 10-6c3.866 0 6 2.239 6 2.239L22 6l-2 4 2 4-4-2.239S15.866 16 12 16C6 16 2 12 2 12zm10-2a1 1 0 100 2 1 1 0 000-2z"/>
  </svg>
);

export const DropIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2s6 6.5 6 11a6 6 0 11-12 0c0-4.5 6-11 6-11z" />
  </svg>
);

export const GridIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z" />
  </svg>
);

export const MenuIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
  </svg>
);

export const HeartIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 21s-8-5.686-8-11a5 5 0 019-3 5 5 0 019 3c0 5.314-8 11-8 11z" />
  </svg>
);

export const BarIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M4 20h16v2H4v-2zM6 10h3v8H6v-8zm5-4h3v12h-3V6zm5 2h3v10h-3V8z" />
  </svg>
);

export const PencilIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM21.41 6.34a1.25 1.25 0 000-1.77l-1.98-1.98a1.25 1.25 0 00-1.77 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);


