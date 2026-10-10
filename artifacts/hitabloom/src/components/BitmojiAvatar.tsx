import React from 'react';
import type { AvatarStyle } from '../data';

export interface BitmojiAvatarProps {
  style?: AvatarStyle;
  label?: string;
  size?: 'xs' | 'small' | 'medium' | 'large' | 'preview';
  className?: string;
}

const DEFAULT_AVATAR_STYLE: AvatarStyle = {
  skin: '#bd7957',
  hair: 'wavy',
  hairColor: '#49372f',
  face: 'round',
  outfit: 'sage',
  glasses: false,
  accessory: 'flower',
  expression: 'happy',
};

export function BitmojiAvatarSvg({
  style = DEFAULT_AVATAR_STYLE,
  className = '',
}: {
  style?: AvatarStyle;
  className?: string;
}) {
  const {
    skin = '#bd7957',
    hair = 'wavy',
    hairColor = '#49372f',
    face = 'round',
    outfit = 'sage',
    glasses = false,
    accessory = 'flower',
    expression = 'happy',
  } = style;

  // Outfit palettes
  const outfitMap: Record<string, { base: string; accent: string; collar: string }> = {
    sage: { base: '#527c59', accent: '#3d6143', collar: '#78a680' },
    coral: { base: '#e06d53', accent: '#ba5338', collar: '#f08d73' },
    lavender: { base: '#8874b2', accent: '#6a5594', collar: '#aa98d4' },
  };
  const outfitColors = outfitMap[outfit] || outfitMap.sage;

  const shadowColor = 'rgba(0, 0, 0, 0.15)';
  const blushColor = 'rgba(239, 68, 68, 0.24)';

  return (
    <svg
      viewBox="0 0 100 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id={`glow-${outfit}`} cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Hair Behind (for long hair & full curls) */}
      {hair === 'long' && (
        <path
          d="M 23 45 C 19 60, 16 85, 21 98 C 26 88, 29 74, 30 65 L 70 65 C 71 74, 74 88, 79 98 C 84 85, 81 60, 77 45 Z"
          fill={hairColor}
        />
      )}
      {hair === 'curly' && (
        <path
          d="M 21 44 C 15 54, 16 70, 22 78 C 27 72, 28 56, 30 48 L 70 48 C 72 56, 73 72, 78 78 C 84 70, 85 54, 79 44 Z"
          fill={hairColor}
        />
      )}

      {/* Torso / Outfit */}
      <path
        d="M 16 120 C 16 95, 30 81, 40 80 L 60 80 C 70 81, 84 95, 84 120 Z"
        fill={outfitColors.base}
      />
      {/* Outfit Collar Trim */}
      <path
        d="M 40 80 C 44 87, 56 87, 60 80 L 56 90 C 53 93, 47 93, 44 90 Z"
        fill={outfitColors.accent}
      />
      <path
        d="M 38 80 C 43 89, 57 89, 62 80"
        stroke={outfitColors.collar}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Neck */}
      <path
        d="M 43 65 L 43 82 C 46 84, 54 84, 57 82 L 57 65 Z"
        fill={skin}
      />
      {/* Neck Shadow under chin */}
      <path
        d="M 43 66 C 47 71, 53 71, 57 66 L 57 72 C 53 75, 47 75, 43 72 Z"
        fill={shadowColor}
      />

      {/* Ears */}
      <path d="M 27 48 C 24 45, 24 55, 28 56 Z" fill={skin} />
      <path d="M 73 48 C 76 45, 76 55, 72 56 Z" fill={skin} />

      {/* Head / Face */}
      {face === 'oval' ? (
        <path
          d="M 30 44 C 30 25, 70 25, 70 44 C 70 66, 62 74, 50 74 C 38 74, 30 66, 30 44 Z"
          fill={skin}
        />
      ) : (
        <path
          d="M 27 45 C 27 27, 73 27, 73 45 C 73 66, 64 73, 50 73 C 36 73, 27 66, 27 45 Z"
          fill={skin}
        />
      )}

      {/* Cheek Blush */}
      <ellipse cx="36" cy="54" rx="4.5" ry="2.5" fill={blushColor} />
      <ellipse cx="64" cy="54" rx="4.5" ry="2.5" fill={blushColor} />

      {/* Eyebrows */}
      {expression === 'curious' ? (
        <>
          <path d="M 34 37 Q 40 33 46 36" stroke={hairColor} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 54 41 Q 60 40 66 42" stroke={hairColor} strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : expression === 'calm' ? (
        <>
          <path d="M 35 41 Q 40 40 45 41" stroke={hairColor} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 55 41 Q 60 40 65 41" stroke={hairColor} strokeWidth="2.2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M 34 40 Q 40 37 46 40" stroke={hairColor} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 54 40 Q 60 37 66 40" stroke={hairColor} strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}

      {/* Eyes & Catchlights */}
      <g>
        <circle cx="40" cy="46" r="3.4" fill="#1e181c" />
        <circle cx="39" cy="45" r="1.1" fill="#ffffff" />
        <circle cx="60" cy="46" r="3.4" fill="#1e181c" />
        <circle cx="59" cy="45" r="1.1" fill="#ffffff" />
      </g>

      {/* Nose */}
      <path
        d="M 49 48 Q 50 51.5 52 51.5"
        stroke="rgba(80, 35, 25, 0.35)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Mouth */}
      {expression === 'happy' ? (
        <path
          d="M 43 56 Q 50 64 57 56"
          stroke="#991b1b"
          strokeWidth="2.2"
          fill="#b91c1c"
          strokeLinecap="round"
        />
      ) : expression === 'curious' ? (
        <path
          d="M 46 57 Q 50 60 54 57"
          stroke="#991b1b"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M 44 57 Q 50 60 56 57"
          stroke="#991b1b"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}

      {/* Glasses (if enabled) */}
      {glasses && (
        <g>
          {/* Left Lens Frame */}
          <rect
            x="32"
            y="39"
            width="16"
            height="13"
            rx="4"
            fill="rgba(255, 255, 255, 0.22)"
            stroke="#1c1917"
            strokeWidth="1.8"
          />
          <line x1="35" y1="42" x2="39" y2="42" stroke="rgba(255, 255, 255, 0.75)" strokeWidth="1" strokeLinecap="round" />
          {/* Bridge */}
          <path d="M 48 45 Q 50 43 52 45" stroke="#1c1917" strokeWidth="1.8" fill="none" />
          {/* Right Lens Frame */}
          <rect
            x="52"
            y="39"
            width="16"
            height="13"
            rx="4"
            fill="rgba(255, 255, 255, 0.22)"
            stroke="#1c1917"
            strokeWidth="1.8"
          />
          <line x1="55" y1="42" x2="59" y2="42" stroke="rgba(255, 255, 255, 0.75)" strokeWidth="1" strokeLinecap="round" />
          {/* Temples */}
          <path d="M 32 44 L 27 43" stroke="#1c1917" strokeWidth="1.6" />
          <path d="M 68 44 L 73 43" stroke="#1c1917" strokeWidth="1.6" />
        </g>
      )}

      {/* Front Hair */}
      {hair === 'short' && (
        <path
          d="M 26 44 C 26 23, 44 17, 50 17 C 56 17, 74 23, 74 44 C 70 34, 60 32, 50 33 C 40 32, 30 34, 26 44 Z"
          fill={hairColor}
        />
      )}
      {hair === 'wavy' && (
        <path
          d="M 25 46 C 24 24, 42 15, 52 15 C 64 15, 76 24, 75 46 C 71 36, 65 32, 58 34 C 52 32, 45 35, 41 33 C 35 34, 29 38, 25 46 Z"
          fill={hairColor}
        />
      )}
      {hair === 'curly' && (
        <g fill={hairColor}>
          <circle cx="34" cy="24" r="8" />
          <circle cx="48" cy="20" r="9" />
          <circle cx="62" cy="22" r="8.5" />
          <circle cx="72" cy="30" r="7.5" />
          <circle cx="28" cy="32" r="7.5" />
          <path
            d="M 26 42 C 28 30, 42 24, 52 24 C 64 24, 74 30, 74 42 C 70 35, 62 33, 50 34 C 38 33, 30 35, 26 42 Z"
          />
        </g>
      )}
      {hair === 'long' && (
        <path
          d="M 26 46 C 26 22, 44 16, 50 16 C 56 16, 74 22, 74 46 C 70 33, 62 30, 50 31 C 38 30, 30 33, 26 46 Z"
          fill={hairColor}
        />
      )}

      {/* Accessories */}
      {accessory === 'flower' && (
        <g transform="translate(68, 28)">
          <circle cx="-3" cy="0" r="3.5" fill="#f43f5e" />
          <circle cx="3" cy="0" r="3.5" fill="#f43f5e" />
          <circle cx="0" cy="-3" r="3.5" fill="#f43f5e" />
          <circle cx="0" cy="3" r="3.5" fill="#f43f5e" />
          <circle cx="0" cy="0" r="2.2" fill="#fbbf24" />
        </g>
      )}
      {accessory === 'star' && (
        <g transform="translate(68, 28)">
          <path
            d="M 0 -6 L 1.8 -1.8 L 6 0 L 1.8 1.8 L 0 6 L -1.8 1.8 L -6 0 L -1.8 -1.8 Z"
            fill="#facc15"
          />
          <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
        </g>
      )}
    </svg>
  );
}

export function BitmojiAvatar({
  style,
  label = 'Patient',
  size = 'medium',
  className = '',
}: BitmojiAvatarProps) {
  const avatarStyle = style || DEFAULT_AVATAR_STYLE;

  const sizeClasses: Record<string, string> = {
    xs: 'w-6 h-6 min-w-[24px] min-h-[24px] max-w-[24px] max-h-[24px]',
    small: 'w-8 h-8 min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px]',
    medium: 'w-12 h-12 min-w-[48px] min-h-[48px] max-w-[48px] max-h-[48px]',
    large: 'w-16 h-16 min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px]',
    preview: 'w-44 h-52 min-w-[176px] min-h-[208px]',
  };

  const dim = sizeClasses[size] || sizeClasses.medium;
  const isPreview = size === 'preview';

  return (
    <span
      className={`hb-avatar-frame inline-flex items-center justify-center flex-shrink-0 ${
        isPreview ? 'rounded-3xl' : 'rounded-full'
      } overflow-hidden relative shadow-sm border border-white/30 bg-gradient-to-b from-indigo-950/70 to-purple-950/70 ${dim} ${className}`}
      role="img"
      aria-label={`${label}'s personalized avatar`}
      data-testid={`img-avatar-${label.toLowerCase().replaceAll(' ', '-')}`}
    >
      <BitmojiAvatarSvg style={avatarStyle} className="w-full h-full object-contain" />
    </span>
  );
}
