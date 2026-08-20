import { useEffect, useState } from 'react';
import { Rocket, Loader2 } from 'lucide-react';
import { Token } from '../pages/GeneratePage';

type Props = {
  token: Token | null;
  status: 'idle' | 'loading' | 'error';
  error: string;
};

const DEFAULT_TOKEN: Token = {
  ticker: 'WAGMI',
  name: 'We All Gonna Make It',
  tagline: "We don't chase dreams, we mint them.",
  description:
    "WAGMI is the ultimate meme token for believers. No roadmap. No promises. Just vibes, memes, and community. We don't fade, we WAGMI.",
  lore: 'In a world of doubt, one frog believed: "We All Gonna Make It."',
  vibeScore: 10,
  pumpUrl: 'https://pump.fun/create?name=We+All+Gonna+Make+It&symbol=WAGMI',
  generatedFrom: 'When in doubt, ape it out.',
};

export function ConceptDetail({ token, status, error }: Props) {
  const currentToken = token || DEFAULT_TOKEN;
  const cleanTicker = currentToken.ticker.replace('$', '');
  const [imgFailed, setImgFailed] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const logoUrl = currentToken.logoPrompt
    ? `https://image.pollinations.ai/prompt/${encodeURIComponent(currentToken.logoPrompt)}?width=256&height=256`
    : '';

  useEffect(() => {
    setImgFailed(false);
    setImgLoaded(false);
  }, [logoUrl]);

  return (
    <aside className="glass-panel-card p-5 text-white flex flex-col justify-between">
      <div>
        <div className="font-sans text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#C6E07A]">
          GENERATED CONCEPT
        </div>

        {error && (
          <p className="mt-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 font-mono text-xs text-red-400">
            {error}
          </p>
        )}

        {/* Circular Mascot Emblem Graphic */}
        <div className="mt-3 flex justify-center">
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-[#C6F250]/40 bg-black/60 shadow-[0_0_30px_rgba(198,242,80,0.22)] overflow-hidden">
            {logoUrl && !imgFailed ? (
              <>
                {!imgLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Loader2 className="h-6 w-6 animate-spin text-[#C6F250]" />
                  </div>
                )}
                <img
                  key={logoUrl}
                  src={logoUrl}
                  alt={currentToken.name}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgFailed(true)}
                  className="h-full w-full object-cover"
                />
              </>
            ) : (
              <img
                src="/pepe-badge.png"
                alt={currentToken.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Data Fields List */}
        <div className="mt-4 space-y-3 divide-y divide-white/5 text-xs">
          {/* Ticker */}
          <div className="pt-2 first:pt-0">
            <div className="font-sans text-[9.5px] uppercase tracking-[0.06em] text-[#9EA888] font-semibold">
              TICKER
            </div>
            <div className="mt-0.5 font-sans text-sm font-extrabold text-white">
              {cleanTicker}
            </div>
          </div>

          {/* Name */}
          <div className="pt-2.5">
            <div className="font-sans text-[9.5px] uppercase tracking-[0.06em] text-[#9EA888] font-semibold">
              NAME
            </div>
            <div className="mt-0.5 font-sans text-xs font-bold text-white">
              {currentToken.name}
            </div>
          </div>

          {/* Tagline */}
          <div className="pt-2.5">
            <div className="font-sans text-[9.5px] uppercase tracking-[0.06em] text-[#9EA888] font-semibold">
              TAGLINE
            </div>
            <div className="mt-0.5 font-sans text-xs text-[#E8ECE0] leading-snug">
              {currentToken.tagline}
            </div>
          </div>

          {/* Description */}
          <div className="pt-2.5">
            <div className="font-sans text-[9.5px] uppercase tracking-[0.06em] text-[#9EA888] font-semibold">
              DESCRIPTION
            </div>
            <div className="mt-0.5 font-sans text-[11px] leading-relaxed text-[#C8D2BE]">
              {currentToken.description}
            </div>
          </div>

          {/* Lore (One line) */}
          <div className="pt-2.5">
            <div className="font-sans text-[9.5px] uppercase tracking-[0.06em] text-[#9EA888] font-semibold">
              LORE (ONE LINE)
            </div>
            <div className="mt-0.5 font-sans text-[11px] text-[#C8D2BE] flex items-center gap-1.5 leading-snug">
              <span>{currentToken.lore.split('\n\n')[0]}</span>
              <span>🐸</span>
            </div>
          </div>

          {/* Metrics */}
          <div className="pt-2.5 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-sans text-[9.5px] uppercase tracking-[0.06em] text-[#9EA888]">
                EST. LAUNCH COST
              </span>
              <span className="font-mono text-white/90">~0.02 SOL</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-sans text-[9.5px] uppercase tracking-[0.06em] text-[#9EA888]">
                NETWORK
              </span>
              <span className="flex items-center gap-1.5 font-sans text-xs text-white/95 font-medium">
                <img
                  src="/solana-icon.png"
                  alt="Solana"
                  className="h-3.5 w-3.5 object-contain"
                />
                <span>Solana</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-sans text-[9.5px] uppercase tracking-[0.06em] text-[#9EA888]">
                LAUNCH PLATFORM
              </span>
              <span className="font-mono text-white/90">pump.fun</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Launch CTA Button */}
      <div className="mt-4 pt-1">
        <a
          href={currentToken.pumpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-brand-lime flex w-full items-center justify-center gap-2 py-3 px-4 text-center font-sans text-sm font-bold shadow-lg"
        >
          <Rocket className="h-4 w-4" />
          <span>Launch on pump.fun</span>
        </a>
      </div>
    </aside>
  );
}