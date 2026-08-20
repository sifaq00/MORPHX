import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Check, Sparkles, Lightbulb, Rocket, ChevronRight, Download, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Token } from '../pages/GeneratePage';

type Props = {
  token: Token | null;
  status: 'idle' | 'loading' | 'error';
  background: { id: string; name: string; style: CSSProperties };
  onChangeBackground: () => void;
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

export function ConceptPreview({ token, status, onChangeBackground }: Props) {
  const [downloaded, setDownloaded] = useState(false);
  const currentToken = token || DEFAULT_TOKEN;

  const download = () => {
    const blob = new Blob([JSON.stringify(currentToken, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentToken.ticker.replace('$', '') || 'token'}-concept.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const cleanTicker = currentToken.ticker.replace('$', '');
  const oneLineLore = currentToken.lore.split('\n\n')[0];

  return (
    <div className="relative flex flex-col justify-between min-h-[640px] p-2">
      {/* 4 Floating Pin Cards over the Bathtub scene */}
      <div className="relative h-[430px] w-full">
        {/* Pin 1: Ticker */}
        <div className="pin-cream-card absolute top-[8%] left-[4%] md:left-[8%] flex items-center gap-2.5 p-2 pr-4 z-10 animate-fade-in">
          <img
            src="/pepe-badge.png"
            alt="Pepe"
            className="h-8 w-8 rounded-md object-cover border border-black/10 shrink-0"
          />
          <div>
            <div className="flex items-center gap-1 font-sans text-[10px] text-[#556345] font-semibold">
              <span>Ticker</span>
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#7C8F67] text-[#425034]">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </span>
            </div>
            <p className="font-sans text-xs font-bold text-[#0D1208]">{cleanTicker}</p>
          </div>
        </div>

        {/* Pin 2: Name */}
        <div className="pin-cream-card absolute top-[16%] right-[4%] md:right-[8%] flex items-center gap-2.5 p-2 pr-4 z-10 animate-fade-in">
          <img
            src="/pepe-badge.png"
            alt="Pepe"
            className="h-8 w-8 rounded-md object-cover border border-black/10 shrink-0"
          />
          <div>
            <div className="flex items-center gap-1 font-sans text-[10px] text-[#556345] font-semibold">
              <span>Name</span>
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#7C8F67] text-[#425034]">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </span>
            </div>
            <p className="font-sans text-xs font-bold text-[#0D1208]">{currentToken.name}</p>
          </div>
        </div>

        {/* Pin 3: Tagline */}
        <div className="pin-cream-card absolute top-[44%] right-[2%] md:right-[4%] flex items-center gap-2.5 p-2 pr-4 z-10 max-w-[270px] animate-fade-in">
          <img
            src="/pepe-badge.png"
            alt="Pepe"
            className="h-8 w-8 rounded-md object-cover border border-black/10 shrink-0"
          />
          <div>
            <div className="flex items-center gap-1 font-sans text-[10px] text-[#556345] font-semibold">
              <span>Tagline</span>
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#7C8F67] text-[#425034]">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </span>
            </div>
            <p className="font-sans text-[11px] font-semibold leading-tight text-[#0D1208]">{currentToken.tagline}</p>
          </div>
        </div>

        {/* Pin 4: Lore */}
        <div className="pin-cream-card absolute top-[58%] left-[2%] md:left-[4%] flex items-center gap-2.5 p-2 pr-4 z-10 max-w-[290px] animate-fade-in">
          <img
            src="/pepe-badge.png"
            alt="Pepe"
            className="h-8 w-8 rounded-md object-cover border border-black/10 shrink-0"
          />
          <div>
            <div className="flex items-center gap-1 font-sans text-[10px] text-[#556345] font-semibold">
              <span>Lore (one line)</span>
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#7C8F67] text-[#425034]">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </span>
            </div>
            <p className="font-sans text-[11px] font-semibold leading-tight text-[#0D1208]">{oneLineLore}</p>
          </div>
        </div>

        {status === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="glass-panel-card px-6 py-3.5 flex items-center gap-3 text-[#C6F250] font-mono text-xs border border-[#C6F250]/40 shadow-2xl">
              <Loader2 className="animate-spin h-4 w-4 text-[#C6F250]" />
              <span>Forging your token concept…</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Center Card: YOUR TOKEN CONCEPT */}
      <section className="glass-panel-card p-4 text-white w-full max-w-xl mx-auto z-10">
        <div className="flex items-center justify-center gap-1.5 font-sans text-xs font-bold uppercase tracking-[0.06em] text-[#C6E07A]">
          <Sparkles className="h-3.5 w-3.5 text-[#C6E07A]" />
          <span>YOUR TOKEN CONCEPT</span>
        </div>
        <p className="mt-0.5 text-center text-xs text-[#A8C27E]">
          One sentence. Infinite possibilities.
        </p>

        {/* 3 Step Workflow */}
        <div className="mt-3.5 flex items-center justify-between gap-1 px-1">
          {/* Step 1 */}
          <div className="flex flex-1 flex-col items-center text-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black/40 border border-white/5 text-[#C6E07A]">
              <Lightbulb className="h-3.5 w-3.5" />
            </div>
            <span className="mt-1 font-sans text-[11px] font-bold text-white">Idea</span>
            <span className="text-[9.5px] text-[#A8C27E]">Your one line input</span>
          </div>

          <ChevronRight className="text-white/30 h-3.5 w-3.5" />

          {/* Step 2 (Active/Highlighted) */}
          <div className="flex flex-1 flex-col items-center text-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#C6F250]/20 border border-[#C6F250]/40 text-[#C6F250]">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="mt-1 font-sans text-[11px] font-bold text-[#C6F250]">Generate</span>
            <span className="text-[9.5px] text-[#A8C27E]">We craft the full concept</span>
          </div>

          <ChevronRight className="text-white/30 h-3.5 w-3.5" />

          {/* Step 3 */}
          <div className="flex flex-1 flex-col items-center text-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black/40 border border-white/5 text-[#C6E07A]">
              <Rocket className="h-3.5 w-3.5" />
            </div>
            <span className="mt-1 font-sans text-[11px] font-bold text-white">Launch</span>
            <span className="text-[9.5px] text-[#A8C27E]">Take it to pump.fun</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3.5 flex items-center justify-center gap-2.5 pt-1">
          <button
            onClick={download}
            className="btn-dark-pill flex items-center gap-1.5 px-3.5 py-1.5 font-sans text-xs font-semibold"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{downloaded ? 'Downloaded!' : 'Download Concept'}</span>
          </button>

          <button
            onClick={onChangeBackground}
            className="btn-dark-pill flex items-center gap-1.5 px-3.5 py-1.5 font-sans text-xs font-semibold"
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Change Background</span>
          </button>
        </div>
      </section>
    </div>
  );
}
