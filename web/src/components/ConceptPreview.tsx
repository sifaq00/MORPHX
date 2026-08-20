import type { CSSProperties } from 'react';
import { Token } from '../pages/GeneratePage';

type Props = {
  token: Token | null;
  status: 'idle' | 'loading' | 'error';
  background: { id: string; name: string; style: CSSProperties };
  onChangeBackground: () => void;
};

export function ConceptPreview({ token, status, background, onChangeBackground }: Props) {
  return (
    <section
      className="relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-line"
      style={background.style}
    >
      <div className="absolute inset-0 bg-black/30" />

      {status === 'loading' && (
        <div className="relative z-10 flex flex-col gap-3 p-8 text-center">
          <div className="h-5 w-24 animate-pulse rounded bg-white/20" />
          <div className="h-5 w-40 animate-pulse rounded bg-white/10" />
          <div className="h-3 w-64 animate-pulse rounded bg-white/10" />
          <p className="mt-2 font-mono text-xs text-mint">forging concept…</p>
        </div>
      )}

      {status !== 'loading' && !token && (
        <p className="relative z-10 px-8 text-center font-mono text-sm text-white/60">
          Your token concept appears here.
        </p>
      )}

      {token && (
        <div className="relative z-10 grid w-full max-w-md gap-3 p-6">
          <div className="rounded-xl border border-white/15 bg-black/50 p-4 backdrop-blur-sm">
            <span className="font-mono text-[10px] uppercase tracking-widest text-mint">Ticker</span>
            <p className="mt-1 text-2xl font-bold text-white">{token.ticker}</p>
          </div>
          <div className="rounded-xl border border-white/15 bg-black/50 p-4 backdrop-blur-sm">
            <span className="font-mono text-[10px] uppercase tracking-widest text-mint">Name</span>
            <p className="mt-1 text-xl font-semibold text-white">{token.name}</p>
          </div>
          <div className="rounded-xl border border-white/15 bg-black/50 p-4 backdrop-blur-sm">
            <span className="font-mono text-[10px] uppercase tracking-widest text-mint">Tagline</span>
            <p className="mt-1 text-sm text-white/90">{token.tagline}</p>
          </div>
          <div className="rounded-xl border border-white/15 bg-black/50 p-4 backdrop-blur-sm">
            <span className="font-mono text-[10px] uppercase tracking-widest text-mint">Lore</span>
            <p className="mt-1 text-sm italic text-white/80">{token.lore.split('\n\n')[0]}</p>
          </div>
        </div>
      )}

      <button
        onClick={onChangeBackground}
        className="absolute right-3 top-3 z-20 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white/70 backdrop-blur-sm transition hover:border-mint hover:text-mint"
      >
        Change Background
      </button>
    </section>
  );
}
