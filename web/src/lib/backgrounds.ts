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
      backgroundImage: 'url(/bg-room.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center 30%',
      backgroundRepeat: 'no-repeat',
    },
  },
  {
    id: 'botanical-greenhouse',
    name: 'Misty Botanical Solarium',
    style: {
      backgroundImage: 'url(/bg-greenhouse.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
    },
  },
  {
    id: 'rainy-neon-alley',
    name: 'Rainy Neon Alley',
    style: {
      backgroundImage: 'url(/bg-neon-alley.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
    },
  },
  {
    id: 'mountain-shrine',
    name: 'Misty Pine Shrine',
    style: {
      backgroundImage: 'url(/bg-mountain-shrine.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
    },
  },
  {
    id: 'midnight-diner',
    name: 'Midnight Retro Diner',
    style: {
      backgroundImage: 'url(/bg-cyber-diner.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
    },
  },
];

export function nextBackground(currentId: string): string {
  const idx = BACKGROUNDS.findIndex((b) => b.id === currentId);
  return BACKGROUNDS[(idx + 1) % BACKGROUNDS.length].id;
}