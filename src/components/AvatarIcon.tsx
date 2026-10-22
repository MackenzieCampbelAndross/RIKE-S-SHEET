import React from 'react';

export interface AvatarOption {
  id: string;
  name: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'geometric-mountain', name: 'Summit' },
  { id: 'minimal-user', name: 'Minimalist' },
  { id: 'monogram-m', name: 'Monogram' },
  { id: 'developer-terminal', name: 'Developer' },
  { id: 'abstract-cube', name: 'Hexagon' },
  { id: 'pure-focus', name: 'Zenith' },
];

export interface AvatarIconProps {
  id: string;
  className?: string;
  strokeWidth?: number;
}

export const AvatarIcon: React.FC<AvatarIconProps> = ({ id, className = "w-full h-full", strokeWidth = 1.25 }) => {
  switch (id) {
    case 'geometric-mountain':
    default:
      // Exact iconic clean geometric minimalist profile emblem matching the reference image
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Main outer clean mountain / chevron */}
          <path
            d="M50 22L20 74H36L50 48L64 74H80L50 22Z"
            stroke="currentColor"
            strokeWidth={strokeWidth * 3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Inner accent ridge */}
          <path
            d="M50 48L40 65H60L50 48Z"
            stroke="currentColor"
            strokeWidth={strokeWidth * 2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'minimal-user':
      // Conventional minimal user / avatar silhouette
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );

    case 'monogram-m':
      // Clean modern monogram
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path
            d="M26 72V28L50 54L74 28V72"
            stroke="currentColor"
            strokeWidth={strokeWidth * 4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'developer-terminal':
      // Terminal prompt avatar
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      );

    case 'abstract-cube':
      // Geometric isometric polygon
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );

    case 'pure-focus':
      // Concentric focus aperture
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3" />
          <line x1="12" y1="3" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="21" />
          <line x1="3" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="21" y2="12" />
        </svg>
      );
  }
};
