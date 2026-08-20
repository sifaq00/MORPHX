import type { CSSProperties } from 'react';

export type Background = {
  id: string;
  name: string;
  style: CSSProperties;
};

export const BACKGROUNDS: Background[] = [
  {
    id: 'night-grid',
    name: 'Night Grid',
    style: {
      background:
        'radial-gradient(circle at 20% 20%, rgba(80,224,160,0.15), transparent 45%), linear-gradient(135deg, #0e1116 0%, #1a1f2b 100%)',
      backgroundSize: 'cover',
    },
  },
  {
    id: 'mint-haze',
    name: 'Mint Haze',
    style: {
      background:
        'radial-gradient(circle at 80% 10%, rgba(80,224,160,0.25), transparent 55%), radial-gradient(circle at 10% 90%, rgba(80,224,160,0.1), transparent 50%), #0e1116',
    },
  },
  {
    id: 'amber-glow',
    name: 'Amber Glow',
    style: {
      background:
        'radial-gradient(circle at 50% 0%, rgba(255,178,56,0.18), transparent 60%), linear-gradient(180deg, #0e1116 0%, #15100a 100%)',
    },
  },
  {
    id: 'grid-lines',
    name: 'Grid Lines',
    style: {
      backgroundImage:
        'linear-gradient(rgba(80,224,160,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(80,224,160,0.06) 1px, transparent 1px)',
      backgroundSize: '48px 48px',
      backgroundColor: '#0e1116',
    },
  },
  {
    id: 'deep-space',
    name: 'Deep Space',
    style: {
      background:
        'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.06), transparent 40%), radial-gradient(circle at 70% 70%, rgba(80,224,160,0.08), transparent 45%), #0a0d12',
    },
  },
];

export function nextBackground(currentId: string): string {
  const idx = BACKGROUNDS.findIndex((b) => b.id === currentId);
  return BACKGROUNDS[(idx + 1) % BACKGROUNDS.length].id;
}