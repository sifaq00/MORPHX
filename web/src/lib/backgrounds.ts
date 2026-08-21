import type { CSSProperties } from 'react';

export type Background = {
  id: string;
  name: string;
  style: CSSProperties;
};

export const BACKGROUNDS: Background[] = [
  {
    id: 'vintage-bath',
    name: 'Vintage Clawfoot Bath',
    style: {
      backgroundImage: 'url(/bg-room.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center 30%',
      backgroundRepeat: 'no-repeat',
    },
  },
  {
    id: 'botanical-greenhouse',
    name: 'Misty Botanical Solarium',
    style: {
      backgroundImage: 'url(/bg-greenhouse.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
    },
  },
  {
    id: 'rainy-neon-alley',
    name: 'Rainy Neon Alley',
    style: {
      backgroundImage: 'url(/bg-neon-alley.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
    },
  },
  {
    id: 'mountain-shrine',
    name: 'Misty Pine Shrine',
    style: {
      backgroundImage: 'url(/bg-mountain-shrine.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
    },
  },
  {
    id: 'midnight-diner',
    name: 'Midnight Retro Diner',
    style: {
      backgroundImage: 'url(/bg-cyber-diner.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
    },
  },
];

export const DEFAULT_BACKGROUND_ID = 'vintage-bath';

export function nextBackground(currentId: string): string {
  const currentIndex = BACKGROUNDS.findIndex((b) => b.id === currentId);
  const nextIndex = (currentIndex + 1) % BACKGROUNDS.length;
  return BACKGROUNDS[nextIndex].id;
}