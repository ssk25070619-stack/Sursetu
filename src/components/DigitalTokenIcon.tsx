import React from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { AchievementBadge } from '../types';

interface DigitalTokenIconProps {
  badge: AchievementBadge;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  showProgressRing?: boolean;
  className?: string;
  onClick?: () => void;
}

export const DigitalTokenIcon: React.FC<DigitalTokenIconProps> = ({
  badge,
  size = 'md',
  interactive = false,
  showProgressRing = true,
  className = '',
  onClick,
}) => {
  const { isUnlocked, progress, target, tier, tokenDesign } = badge;
  const { primaryColor, secondaryColor, glowColor, ringColor, olChikiGlyph, iconType } = tokenDesign;

  // Size mapping in pixels
  const dimension = {
    sm: 52,
    md: 76,
    lg: 104,
    xl: 148,
  }[size];

  // SVG radius calculations for progress ring
  const strokeWidth = size === 'xl' ? 5 : size === 'lg' ? 4 : 3;
  const radius = dimension / 2 - strokeWidth - 2;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.min(1, Math.max(0, target > 0 ? progress / target : 0));
  const strokeDashoffset = circumference - progressRatio * circumference;

  // Tier-specific styles & gradients
  const getTierGradients = () => {
    switch (tier) {
      case 'legendary':
        return {
          id: `grad-legendary-${badge.id}`,
          stop1: '#c084fc',
          stop2: '#8b5cf6',
          stop3: '#ec4899',
          borderGrad: ['#f472b6', '#a855f7', '#6366f1'],
          glowStyle: '0 0 24px rgba(168, 85, 247, 0.45)',
          gemBg: 'linear-gradient(135deg, #3b0764 0%, #1e1b4b 50%, #581c87 100%)',
        };
      case 'gold':
        return {
          id: `grad-gold-${badge.id}`,
          stop1: '#fde047',
          stop2: '#f59e0b',
          stop3: '#b45309',
          borderGrad: ['#fef08a', '#eab308', '#ca8a04'],
          glowStyle: '0 0 20px rgba(245, 158, 11, 0.4)',
          gemBg: 'linear-gradient(135deg, #451a03 0%, #78350f 50%, #291203 100%)',
        };
      case 'silver':
        return {
          id: `grad-silver-${badge.id}`,
          stop1: '#34d399',
          stop2: '#10b981',
          stop3: '#047857',
          borderGrad: ['#6ee7b7', '#10b981', '#059669'],
          glowStyle: '0 0 18px rgba(16, 185, 129, 0.35)',
          gemBg: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #022c22 100%)',
        };
      case 'bronze':
      default:
        return {
          id: `grad-bronze-${badge.id}`,
          stop1: '#fbbf24',
          stop2: '#d97706',
          stop3: '#78350f',
          borderGrad: ['#fcd34d', '#d97706', '#92400e'],
          glowStyle: '0 0 16px rgba(217, 119, 6, 0.35)',
          gemBg: 'linear-gradient(135deg, #261608 0%, #451a03 50%, #1c0d02 100%)',
        };
    }
  };

  const tierStyles = getTierGradients();

  // Distinct Motifs rendered via SVG paths
  const renderMotif = () => {
    switch (iconType) {
      case 'bow':
        return (
          <g transform={`translate(${dimension / 2}, ${dimension / 2}) scale(${dimension / 100})`}>
            {/* Recurve Bow Arch */}
            <path
              d="M-22,-24 C-10,-12 -6,12 -22,24"
              fill="none"
              stroke={isUnlocked ? '#fef08a' : '#64748b'}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Bowstring */}
            <line
              x1="-22"
              y1="-24"
              x2="-22"
              y2="24"
              stroke={isUnlocked ? '#ecfdf5' : '#475569'}
              strokeWidth="1.2"
              strokeDasharray="2 1"
            />
            {/* Arrow */}
            <line
              x1="-26"
              y1="0"
              x2="22"
              y2="0"
              stroke={isUnlocked ? primaryColor : '#94a3b8'}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Arrowhead */}
            <polygon
              points="22,0 14,-5 16,0 14,5"
              fill={isUnlocked ? '#fbbf24' : '#64748b'}
            />
            {/* Arrow Fletching */}
            <line x1="-24" y1="-3" x2="-20" y2="0" stroke="#fef08a" strokeWidth="1.5" />
            <line x1="-24" y1="3" x2="-20" y2="0" stroke="#fef08a" strokeWidth="1.5" />
          </g>
        );

      case 'drum':
        return (
          <g transform={`translate(${dimension / 2}, ${dimension / 2}) scale(${dimension / 100})`}>
            {/* Mandar drum barrel */}
            <path
              d="M-18,-18 C-6,-22 6,-22 18,-18 L14,18 C4,22 -4,22 -14,18 Z"
              fill={isUnlocked ? secondaryColor : '#334155'}
              stroke={isUnlocked ? '#fde047' : '#64748b'}
              strokeWidth="2"
            />
            {/* Leather laces criss-cross */}
            <line x1="-14" y1="-17" x2="14" y2="18" stroke="#fef08a" strokeWidth="1" opacity="0.8" />
            <line x1="14" y1="-17" x2="-14" y2="18" stroke="#fef08a" strokeWidth="1" opacity="0.8" />
            {/* Drum head rings */}
            <ellipse cx="0" cy="-18" rx="16" ry="4" fill={isUnlocked ? '#fef08a' : '#475569'} />
            <ellipse cx="0" cy="18" rx="13" ry="3.5" fill={isUnlocked ? '#cbd5e1' : '#1e293b'} />
          </g>
        );

      case 'leaf':
        return (
          <g transform={`translate(${dimension / 2}, ${dimension / 2}) scale(${dimension / 100})`}>
            {/* Sacred Sal Leaf Contour */}
            <path
              d="M0,-26 C16,-16 22,6 0,26 C-22,6 -16,-16 0,-26 Z"
              fill={isUnlocked ? 'url(#salLeafGrad)' : '#1e293b'}
              stroke={isUnlocked ? '#86efac' : '#475569'}
              strokeWidth="2"
            />
            {/* Leaf Veins */}
            <line x1="0" y1="-24" x2="0" y2="24" stroke={isUnlocked ? '#bbf7d0' : '#64748b'} strokeWidth="1.5" />
            <line x1="0" y1="-10" x2="10" y2="-4" stroke={isUnlocked ? '#86efac' : '#64748b'} strokeWidth="1" />
            <line x1="0" y1="-10" x2="-10" y2="-4" stroke={isUnlocked ? '#86efac' : '#64748b'} strokeWidth="1" />
            <line x1="0" y1="4" x2="11" y2="10" stroke={isUnlocked ? '#86efac' : '#64748b'} strokeWidth="1" />
            <line x1="0" y1="4" x2="-11" y2="10" stroke={isUnlocked ? '#86efac' : '#64748b'} strokeWidth="1" />
          </g>
        );

      case 'flame':
        return (
          <g transform={`translate(${dimension / 2}, ${dimension / 2}) scale(${dimension / 100})`}>
            {/* Outer flame */}
            <path
              d="M0,24 C14,24 20,12 14,-2 C10,-10 6,-18 0,-26 C-6,-18 -10,-10 -14,-2 C-20,12 -14,24 0,24 Z"
              fill={isUnlocked ? '#ea580c' : '#334155'}
              opacity="0.9"
            />
            {/* Inner flame */}
            <path
              d="M0,20 C8,20 12,12 8,2 C5,-4 3,-10 0,-16 C-3,-10 -5,-4 -8,2 C-12,12 -8,20 0,20 Z"
              fill={isUnlocked ? '#facc15' : '#475569'}
            />
            {/* Center spark */}
            <circle cx="0" cy="8" r="3" fill="#ffffff" opacity="0.95" />
          </g>
        );

      case 'crown':
        return (
          <g transform={`translate(${dimension / 2}, ${dimension / 2}) scale(${dimension / 100})`}>
            {/* Chieftain Turban / Crown base */}
            <path
              d="M-20,12 L-16,-12 L-4,0 L0,-18 L4,0 L16,-12 L20,12 Z"
              fill={isUnlocked ? '#eab308' : '#334155'}
              stroke={isUnlocked ? '#fef08a' : '#64748b'}
              strokeWidth="2"
            />
            {/* Crown Gemstones */}
            <circle cx="-16" cy="-12" r="2.5" fill={isUnlocked ? '#ef4444' : '#64748b'} />
            <circle cx="0" cy="-18" r="3" fill={isUnlocked ? '#3b82f6' : '#64748b'} />
            <circle cx="16" cy="-12" r="2.5" fill={isUnlocked ? '#10b981' : '#64748b'} />
            <rect x="-18" y="10" width="36" height="5" rx="2" fill={isUnlocked ? '#ca8a04' : '#1e293b'} />
          </g>
        );

      case 'quill':
        return (
          <g transform={`translate(${dimension / 2}, ${dimension / 2}) scale(${dimension / 100})`}>
            {/* Pandit Murmu Sacred Chisel / Quill */}
            <path
              d="M-14,-22 C-12,-20 8,-2 14,14 L12,18 L6,14 C-4,4 -10,-10 -14,-22 Z"
              fill={isUnlocked ? '#f43f5e' : '#334155'}
              stroke={isUnlocked ? '#fecdd3' : '#64748b'}
              strokeWidth="1.5"
            />
            <path d="M12,18 L16,22 L14,14 Z" fill={isUnlocked ? '#fbbf24' : '#94a3b8'} />
            {/* Ink spark */}
            <circle cx="18" cy="24" r="2" fill={isUnlocked ? '#38bdf8' : '#475569'} />
          </g>
        );

      case 'puzzle':
      default:
        return (
          <g transform={`translate(${dimension / 2}, ${dimension / 2}) scale(${dimension / 100})`}>
            <rect
              x="-16"
              y="-16"
              width="32"
              height="32"
              rx="6"
              fill={isUnlocked ? primaryColor : '#334155'}
              stroke={isUnlocked ? '#fef08a' : '#64748b'}
              strokeWidth="2"
              transform="rotate(45)"
            />
            <circle cx="0" cy="0" r="8" fill={isUnlocked ? '#facc15' : '#475569'} opacity="0.6" />
          </g>
        );
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none ${
        interactive ? 'cursor-pointer group transform transition-all duration-300 hover:scale-105 active:scale-95' : ''
      } ${className}`}
      style={{ width: dimension, height: dimension }}
      title={`${badge.title} (${badge.tribalTitle}) — ${badge.tierLabel}: ${badge.description}`}
    >
      {/* Background radial glow when unlocked */}
      {isUnlocked && (
        <div
          className="absolute inset-0 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ background: glowColor }}
        />
      )}

      <svg
        width={dimension}
        height={dimension}
        viewBox={`0 0 ${dimension} ${dimension}`}
        className="relative z-10"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id={`bgGrad-${badge.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isUnlocked ? tierStyles.stop1 : '#1e293b'} />
            <stop offset="50%" stopColor={isUnlocked ? tierStyles.stop2 : '#0f172a'} />
            <stop offset="100%" stopColor={isUnlocked ? tierStyles.stop3 : '#020617'} />
          </linearGradient>

          <linearGradient id="salLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>

          {/* Shimmer sweep effect */}
          <linearGradient id={`shimmer-${badge.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="45%" stopColor="transparent" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.6)" />
            <stop offset="55%" stopColor="transparent" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* Shadow Filter */}
          <filter id={`tokenDropShadow-${badge.id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Outer Circular Progress Track (background) */}
        {showProgressRing && (
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
          />
        )}

        {/* Circular Progress Stroke */}
        {showProgressRing && (
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            fill="none"
            stroke={isUnlocked ? ringColor : primaryColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={isUnlocked ? 0 : strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${dimension / 2} ${dimension / 2})`}
            className="transition-all duration-700 ease-out"
          />
        )}

        {/* Token Inner Medallion Body */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius - strokeWidth - 1}
          fill={`url(#bgGrad-${badge.id})`}
          stroke={isUnlocked ? ringColor : '#334155'}
          strokeWidth="1.5"
          filter={`url(#tokenDropShadow-${badge.id})`}
        />

        {/* Concentric Decorative Tribal Chevron / Beaded Ring */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius - strokeWidth - 4}
          fill="none"
          stroke={isUnlocked ? '#fef08a' : '#475569'}
          strokeWidth="1"
          strokeDasharray="2 3"
          opacity={isUnlocked ? 0.75 : 0.3}
        />

        {/* Motif Rendering */}
        <g opacity={isUnlocked ? 0.85 : 0.25}>{renderMotif()}</g>

        {/* Sacred Central Ol Chiki Glyph (Watermarked / Overlayed in High Contrast) */}
        <text
          x={dimension / 2}
          y={dimension / 2 + (size === 'xl' ? 12 : size === 'lg' ? 9 : size === 'md' ? 6 : 4)}
          fontFamily="'Noto Sans Ol Chiki', sans-serif"
          fontSize={size === 'xl' ? 38 : size === 'lg' ? 26 : size === 'md' ? 20 : 14}
          fontWeight="bold"
          fill={isUnlocked ? '#ffffff' : '#64748b'}
          textAnchor="middle"
          dominantBaseline="central"
          className="select-none pointer-events-none drop-shadow-md font-olchiki"
          opacity={isUnlocked ? 0.95 : 0.4}
        >
          {olChikiGlyph}
        </text>

        {/* Shimmer overlay for unlocked tokens */}
        {isUnlocked && (
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius - strokeWidth - 1}
            fill={`url(#shimmer-${badge.id})`}
            className="pointer-events-none animate-pulse-slow"
            opacity="0.4"
          />
        )}

        {/* Locked Padlock Indicator Overlay */}
        {!isUnlocked && (
          <g transform={`translate(${dimension / 2 - 8}, ${dimension / 2 - 8})`}>
            <circle cx="8" cy="8" r="10" fill="#020617" opacity="0.85" />
            <path
              d="M4,7 C4,5 5.5,3.5 8,3.5 C10.5,3.5 12,5 12,7 L12,8 L13,8 C13.5,8 14,8.5 14,9 L14,13 C14,13.5 13.5,14 13,14 L3,14 C2.5,14 2,13.5 2,13 L2,9 C2,8.5 2.5,8 3,8 L4,8 Z M5.5,7 L10.5,7 C10.5,5.8 9.5,4.8 8,4.8 C6.5,4.8 5.5,5.8 5.5,7 Z"
              fill="#94a3b8"
            />
          </g>
        )}
      </svg>

      {/* Floating Sparkle for Legendary Badges */}
      {isUnlocked && tier === 'legendary' && (
        <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-pink-300 animate-bounce pointer-events-none" />
      )}
    </div>
  );
};
