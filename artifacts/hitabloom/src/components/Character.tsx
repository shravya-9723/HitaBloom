import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Sparkles, MessageCircle, Globe } from 'lucide-react';

export type CharacterId = 'bri' | 'cora' | 'luma' | 'bony' | 'milo' | 'dr-maya' | 'cultural-guide';

export type CharacterMeta = {
  id: CharacterId;
  name: string;
  roleTitle: string;
  bodyArea: string;
  image: string;
  videoUrl: string;
  posterImage: string;
  themeColor: string;
  glowColor: string;
  badgeEmoji: string;
};

export const CHARACTER_REGISTRY: Record<string, CharacterMeta> = {
  Bri: {
    id: 'bri',
    name: 'Bri',
    roleTitle: 'Brain Explorer',
    bodyArea: 'Brain Garden',
    image: '/assets/characters/bri.png',
    videoUrl: '/assets/characters/bri.mp4',
    posterImage: '/assets/characters/bri.png',
    themeColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    badgeEmoji: '🧠',
  },
  Cora: {
    id: 'cora',
    name: 'Cora',
    roleTitle: 'Heart Guardian',
    bodyArea: 'Heart Garden',
    image: '/assets/characters/cora.png',
    videoUrl: '/assets/characters/cora.mp4',
    posterImage: '/assets/characters/cora.png',
    themeColor: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.45)',
    badgeEmoji: '❤️',
  },
  Luma: {
    id: 'luma',
    name: 'Luma',
    roleTitle: 'Lung Explorer',
    bodyArea: 'Lung Valley',
    image: '/assets/characters/luma.png',
    videoUrl: '/assets/characters/luma video.mp4',
    posterImage: '/assets/characters/luma.png',
    themeColor: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.45)',
    badgeEmoji: '🫁',
  },
  Bony: {
    id: 'bony',
    name: 'Bony',
    roleTitle: 'Bone Protector',
    bodyArea: 'Bone Mountains',
    image: '/assets/characters/bony.png',
    videoUrl: '/assets/characters/bony.mp4',
    posterImage: '/assets/characters/bony.png',
    themeColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    badgeEmoji: '🦴',
  },
  Milo: {
    id: 'milo',
    name: 'Milo',
    roleTitle: 'Muscle Sprout',
    bodyArea: 'Muscle Meadow',
    image: '/assets/characters/milo.png',
    videoUrl: '/assets/characters/milo.mp4',
    posterImage: '/assets/characters/milo.png',
    themeColor: '#22c55e',
    glowColor: 'rgba(34, 197, 94, 0.45)',
    badgeEmoji: '💪',
  },
  'Dr. Maya': {
    id: 'dr-maya',
    name: 'Dr. Maya',
    roleTitle: 'Doctor & Administrator',
    bodyArea: 'Care & Supervision',
    image: '/assets/characters/dr-maya.png',
    videoUrl: '/assets/characters/dr-maya.mp4',
    posterImage: '/assets/characters/dr-maya.png',
    themeColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.45)',
    badgeEmoji: '🩺',
  },
  'Cultural Guide': {
    id: 'cultural-guide',
    name: 'Cultural Guide',
    roleTitle: 'Cultural Wellness Guide',
    bodyArea: 'Cultural Garden',
    image: '/assets/characters/cultural-guide.png',
    videoUrl: '/assets/characters/cultural-guide.mp4',
    posterImage: '/assets/characters/cultural-guide.png',
    themeColor: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.45)',
    badgeEmoji: '🌿',
  },
};

// Map legacy or alternative labels
export function resolveCharacterMeta(labelOrName?: string): CharacterMeta {
  if (!labelOrName) return CHARACTER_REGISTRY.Luma;
  const direct = CHARACTER_REGISTRY[labelOrName];
  if (direct) return direct;

  const normalized = labelOrName.toLowerCase().trim();
  if (normalized.includes('bri') || normalized.includes('brain')) return CHARACTER_REGISTRY.Bri;
  if (normalized.includes('cora') || normalized.includes('heart')) return CHARACTER_REGISTRY.Cora;
  if (normalized.includes('luma') || normalized.includes('lung')) return CHARACTER_REGISTRY.Luma;
  if (normalized.includes('bony') || normalized.includes('bone')) return CHARACTER_REGISTRY.Bony;
  if (normalized.includes('milo') || normalized.includes('muscle')) return CHARACTER_REGISTRY.Milo;
  if (normalized.includes('maya') || normalized.includes('doctor')) return CHARACTER_REGISTRY['Dr. Maya'];
  if (normalized.includes('cultural') || normalized.includes('guide')) return CHARACTER_REGISTRY['Cultural Guide'];

  // Legacy fallback aliases
  if (normalized.includes('moss') || normalized.includes('poppy')) return CHARACTER_REGISTRY.Milo;
  if (normalized.includes('mango')) return CHARACTER_REGISTRY.Luma;

  return CHARACTER_REGISTRY.Luma;
}

export type CharacterProps = {
  name?: string;
  label?: string; // Backwards compatible with existing <Character label="Luma" />
  bodyArea?: string;
  imageSrc?: string;
  videoUrl?: string;
  posterImage?: string;
  dialogue?: string;
  subtitle?: string;
  selectedLanguage?: string;
  isPlaying?: boolean;
  onPlayToggle?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'avatar';
  large?: boolean; // legacy compatibility
  className?: string;
  showCard?: boolean;
  showDialogue?: boolean;
  showSubtitle?: boolean;
  subtleAnimation?: boolean;
};

export function Character({
  name,
  label,
  bodyArea,
  imageSrc,
  videoUrl,
  posterImage,
  dialogue,
  subtitle,
  selectedLanguage,
  isPlaying: controlledIsPlaying,
  onPlayToggle,
  size = 'md',
  large,
  className = '',
  showCard = false,
  showDialogue = false,
  showSubtitle = true,
  subtleAnimation = true,
}: CharacterProps) {
  const meta = resolveCharacterMeta(name || label);
  const resolvedName = name || label || meta.name;
  const resolvedArea = bodyArea || meta.bodyArea;
  const resolvedImg = imageSrc || meta.image;
  const resolvedVideo = videoUrl || meta.videoUrl;
  const resolvedPoster = posterImage || meta.posterImage || resolvedImg;

  const effectiveSize = large ? 'lg' : size;

  const [hasVideoError, setHasVideoError] = useState(false);
  const [internalPlaying, setInternalPlaying] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showSubtitlesEn, setShowSubtitlesEn] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isPlaying = controlledIsPlaying !== undefined ? controlledIsPlaying : internalPlaying;

  const togglePlay = () => {
    if (onPlayToggle) {
      onPlayToggle();
    } else {
      if (videoRef.current && !hasVideoError) {
        if (isPlaying) {
          videoRef.current.pause();
          setInternalPlaying(false);
        } else {
          videoRef.current.play().then(() => setInternalPlaying(true)).catch(() => {
            setHasVideoError(true);
            setInternalPlaying(false);
          });
        }
      } else {
        setInternalPlaying(!isPlaying);
      }
    }
  };

  const sizeClasses: Record<string, string> = {
    sm: 'w-10 h-10',
    avatar: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-36 h-36',
    hero: 'w-48 h-48 md:w-56 md:h-56',
  };

  const characterImageElement = (
    <div
      className={`relative rounded-3xl overflow-hidden flex items-center justify-center transition-transform duration-300 ${
        subtleAnimation ? 'animate-hb-float' : ''
      } ${isPlaying ? 'ring-4 ring-pink-400 ring-offset-2' : ''}`}
      style={{
        boxShadow: `0 12px 36px -8px ${meta.glowColor}`,
      }}
    >
      {/* Bioluminescent aura glow */}
      <div
        className="absolute inset-0 rounded-3xl opacity-60 filter blur-xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${meta.glowColor} 0%, transparent 70%)` }}
      />

      {/* Video element if supported and playing */}
      {resolvedVideo && !hasVideoError && (
        <video
          ref={videoRef}
          src={resolvedVideo}
          poster={resolvedPoster}
          playsInline
          className={`absolute inset-0 w-full h-full object-cover z-10 ${isPlaying ? 'block' : 'hidden'}`}
          onError={() => setHasVideoError(true)}
          onEnded={() => setInternalPlaying(false)}
        />
      )}

      {/* Character Image */}
      <img
        src={resolvedImg}
        alt={`${resolvedName} - ${meta.roleTitle}`}
        className={`w-full h-full object-cover relative z-0 transition-opacity duration-300 ${
          imgLoaded ? 'opacity-100' : 'opacity-90'
        }`}
        onLoad={() => setImgLoaded(true)}
        onError={(e) => {
          // If png fails, try jpg
          const target = e.currentTarget;
          if (target.src.endsWith('.png')) {
            target.src = target.src.replace('.png', '.jpg');
          }
        }}
      />

      {/* Playing pulse indicator */}
      {isPlaying && (
        <div className="absolute bottom-2 right-2 z-20 bg-pink-500/90 text-white rounded-full p-1.5 shadow-lg flex items-center gap-1 text-xs">
          <span className="w-2 h-2 bg-white rounded-full animate-ping" />
        </div>
      )}
    </div>
  );

  // If just standalone or compact avatar
  if (!showCard && !showDialogue) {
    return (
      <div
        className={`hb-character-container inline-flex flex-col items-center justify-center ${className}`}
        data-testid={`character-${resolvedName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
      >
        <div className={sizeClasses[effectiveSize] || sizeClasses.md}>
          {characterImageElement}
        </div>
      </div>
    );
  }

  // Full presentation card (Mockup screen 8 & 10 style)
  return (
    <div
      className={`hb-character-card relative rounded-3xl p-6 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl flex flex-col md:flex-row items-center gap-6 ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
      }}
      data-testid={`character-card-${resolvedName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
    >
      {/* Left: Character avatar with glow & video controls */}
      <div className="flex flex-col items-center gap-3 flex-shrink-0">
        <div className="w-36 h-36 md:w-44 md:h-44 relative">
          {characterImageElement}
          <button
            type="button"
            onClick={togglePlay}
            className="absolute bottom-1 right-1 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            aria-label={isPlaying ? 'Pause guide' : 'Play guide speaking'}
            title={isPlaying ? 'Pause' : 'Listen to guide'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5" />}
          </button>
        </div>

        <div className="text-center">
          <h3 className="font-bold text-lg text-white flex items-center justify-center gap-1.5">
            <span>{resolvedName}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white/90">
              {resolvedArea}
            </span>
          </h3>
          <p className="text-xs text-white/70 font-medium">{meta.roleTitle}</p>
        </div>
      </div>

      {/* Right: Dialogue bubble & subtitles */}
      <div className="flex-1 flex flex-col gap-3 w-full">
        {dialogue && (
          <div className="relative p-5 rounded-2xl bg-white/90 text-slate-900 shadow-lg border border-white/40">
            {/* Bubble arrow */}
            <div className="hidden md:block absolute -left-3 top-8 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white/90" />

            <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
              <span className="text-xs font-semibold text-purple-700 flex items-center gap-1">
                <Sparkles size={13} /> {resolvedName}'s Explanation
              </span>
              {selectedLanguage && selectedLanguage !== 'English' && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 flex items-center gap-1 font-medium">
                  <Globe size={12} /> {selectedLanguage}
                </span>
              )}
            </div>

            <p className="text-slate-800 text-sm md:text-base leading-relaxed font-normal">
              {dialogue}
            </p>
          </div>
        )}

        {/* English Subtitles Badge / Accordion */}
        {showSubtitle && subtitle && (
          <div className="p-3 rounded-xl bg-slate-900/40 border border-white/10 text-white/90 text-xs flex flex-col gap-1 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-white/60 font-medium">
              <span className="flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded bg-pink-500/80 text-white font-bold text-[10px]">
                  EN Subtitles
                </span>
                <span>English Reference</span>
              </span>
              <button
                type="button"
                onClick={() => setShowSubtitlesEn(!showSubtitlesEn)}
                className="hover:text-white underline text-[11px]"
              >
                {showSubtitlesEn ? 'Hide' : 'Show'}
              </button>
            </div>
            {showSubtitlesEn && (
              <p className="text-white/80 italic text-xs leading-normal">
                "{subtitle}"
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Character;
