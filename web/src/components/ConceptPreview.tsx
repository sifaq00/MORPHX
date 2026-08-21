import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Check, Sparkles, Lightbulb, Rocket, ChevronRight, Download, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Token } from '../pages/GeneratePage';
import { playClick, playSuccessChime } from '../lib/sound-fx';

type Props = {
  token: Token | null;
  status: 'idle' | 'loading' | 'error';
  background: { id: string; name: string };
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

export function ConceptPreview({ token, status, background, onChangeBackground }: Props) {
  const [downloaded, setDownloaded] = useState(false);
  const currentToken = token || DEFAULT_TOKEN;

  useEffect(() => {
    // Subtle chime when concept is received
  }, [token]);

  const download = () => {
    playClick();

    // Trigger celebratory confetti burst
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#C6F250', '#00FFA3', '#FFFFFF', '#DC1FFF'],
    });

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

  const handleChangeBg = () => {
    playClick();
    onChangeBackground();
  };

  const cleanTicker = currentToken.ticker.replace('$', '');
  const oneLineLore = currentToken.lore.split('\n\n')[0];

  return (
    <div className="relative flex flex-col justify-between gap-4 p-1 sm:p-2">
      {/* 4 Floating Pin Cards over the scene with spring physics & organic float */}
      <div className="relative h-[440px] sm:h-[460px] md:h-[480px] w-full overflow-hidden rounded-2xl">
        {/* Terminal scan-laser ASCII decoration (FelineCraft style) */}
        {status !== 'loading' && (
          <motion.pre
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden font-mono text-[6px] leading-[6px] text-[#C6F250] select-none pointer-events-none"
          >
            {`      .---.
     /     \\
     | o o |
     \\  ^  /
      |===|
      |___|`}
          </motion.pre>
        )}

        {/* Pin 1: Ticker */}
        <motion.div
          key={`ticker-${cleanTicker}`}
          initial={{ scale: 0.6, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 24, delay: 0.05 }}
          whileHover={{ scale: 1.08, y: -4, transition: { duration: 0.2 } }}
          className="pin-cream-card absolute top-[6%] left-[2%] sm:top-[10%] sm:left-[6%] md:left-[8%] flex items-center gap-2.5 p-2 pr-3.5 sm:pr-4 z-10 cursor-pointer select-none shadow-[0_8px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_30px_rgba(198,242,80,0.3)] transition-shadow max-w-[calc(100%-16px)]"
        >
          <motion.div
            animate={{ y: [0, -5, 0], rotate: [-0.5, 0.5, -0.5] }}
            transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut' }}
            className="flex items-center gap-2 sm:gap-2.5"
          >
            <img
              key={currentToken.logoUrl || 'default-badge'}
              src={currentToken.logoUrl || '/pepe-badge.webp'}
              alt="Token Badge"
              onError={(e) => {
                e.currentTarget.src = '/pepe-badge.webp';
              }}
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-md object-cover border border-black/10 shrink-0 transition-opacity duration-300 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-1 font-mono text-[8.5px] sm:text-[9px] text-[#556345] uppercase tracking-wider font-bold">
                <span>Ticker</span>
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#7C8F67] text-[#425034]">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </span>
              </div>
              <p className="font-display text-xs font-extrabold tracking-tight text-[#0D1208]">{cleanTicker}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Pin 2: Name */}
        <motion.div
          key={`name-${currentToken.name}`}
          initial={{ scale: 0.6, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 24, delay: 0.12 }}
          whileHover={{ scale: 1.08, y: -4, transition: { duration: 0.2 } }}
          className="pin-cream-card absolute top-[24%] right-[2%] sm:top-[18%] sm:right-[6%] md:right-[8%] flex items-center gap-2.5 p-2 pr-3.5 sm:pr-4 z-10 cursor-pointer select-none shadow-[0_8px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_30px_rgba(198,242,80,0.3)] transition-shadow max-w-[calc(100%-16px)] sm:max-w-[240px] md:max-w-[260px]"
        >
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [0.5, -0.5, 0.5] }}
            transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut', delay: 0.5 }}
            className="flex items-center gap-2 sm:gap-2.5"
          >
            <img
              key={currentToken.logoUrl || 'default-badge'}
              src={currentToken.logoUrl || '/pepe-badge.webp'}
              alt="Token Badge"
              onError={(e) => {
                e.currentTarget.src = '/pepe-badge.webp';
              }}
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-md object-cover border border-black/10 shrink-0 transition-opacity duration-300 shadow-sm"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 font-mono text-[8.5px] sm:text-[9px] text-[#556345] uppercase tracking-wider font-bold">
                <span>Name</span>
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#7C8F67] text-[#425034]">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </span>
              </div>
              <p className="font-display text-xs font-bold text-[#0D1208] truncate">{currentToken.name}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Pin 3: Tagline */}
        <motion.div
          key={`tagline-${currentToken.tagline}`}
          initial={{ scale: 0.6, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 24, delay: 0.18 }}
          whileHover={{ scale: 1.06, y: -4, transition: { duration: 0.2 } }}
          className="pin-cream-card absolute top-[47%] left-[2%] sm:left-auto sm:right-[4%] sm:top-[44%] flex items-center gap-2.5 p-2 pr-3.5 sm:pr-4 z-10 max-w-[calc(100%-16px)] sm:max-w-[250px] md:max-w-[270px] cursor-pointer select-none shadow-[0_8px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_30px_rgba(198,242,80,0.3)] transition-shadow"
        >
          <motion.div
            animate={{ y: [0, -5, 0], rotate: [-0.4, 0.4, -0.4] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 1 }}
            className="flex items-center gap-2 sm:gap-2.5"
          >
            <img
              key={currentToken.logoUrl || 'default-badge'}
              src={currentToken.logoUrl || '/pepe-badge.webp'}
              alt="Token Badge"
              onError={(e) => {
                e.currentTarget.src = '/pepe-badge.webp';
              }}
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-md object-cover border border-black/10 shrink-0 transition-opacity duration-300 shadow-sm"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 font-mono text-[8.5px] sm:text-[9px] text-[#556345] uppercase tracking-wider font-bold">
                <span>Tagline</span>
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#7C8F67] text-[#425034]">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </span>
              </div>
              <p className="font-sans text-[11px] font-semibold leading-tight text-[#0D1208] line-clamp-2">{currentToken.tagline}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Pin 4: Lore */}
        <motion.div
          key={`lore-${oneLineLore}`}
          initial={{ scale: 0.6, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 24, delay: 0.24 }}
          whileHover={{ scale: 1.06, y: -4, transition: { duration: 0.2 } }}
          className="pin-cream-card absolute top-[71%] right-[2%] sm:right-auto sm:left-[4%] sm:top-[58%] flex items-center gap-2.5 p-2 pr-3.5 sm:pr-4 z-10 max-w-[calc(100%-16px)] sm:max-w-[260px] md:max-w-[290px] cursor-pointer select-none shadow-[0_8px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_30px_rgba(198,242,80,0.3)] transition-shadow"
        >
          <motion.div
            animate={{ y: [0, -5.5, 0], rotate: [0.4, -0.4, 0.4] }}
            transition={{ repeat: Infinity, duration: 5.2, ease: 'easeInOut', delay: 1.4 }}
            className="flex items-center gap-2 sm:gap-2.5"
          >
            <img
              key={currentToken.logoUrl || 'default-badge'}
              src={currentToken.logoUrl || '/pepe-badge.webp'}
              alt="Token Badge"
              onError={(e) => {
                e.currentTarget.src = '/pepe-badge.webp';
              }}
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-md object-cover border border-black/10 shrink-0 transition-opacity duration-300 shadow-sm"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 font-mono text-[8.5px] sm:text-[9px] text-[#556345] uppercase tracking-wider font-bold">
                <span>Lore (one line)</span>
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#7C8F67] text-[#425034]">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </span>
              </div>
              <p className="font-sans text-[11px] font-semibold leading-tight text-[#0D1208] line-clamp-2">{oneLineLore}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Loading Overlay with Laser Scanning Line */}
        <AnimatePresence>
          {status === 'loading' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-20 overflow-hidden"
            >
              {/* Scan-line sweep (Markcowk style) */}
              <div className="scan-line scan-line-slow" />

              <div className="glass-panel-card px-6 py-4 flex flex-col items-center gap-3 text-[#C6F250] font-mono text-xs border border-[#C6F250]/40 shadow-[0_0_40px_rgba(198,242,80,0.3)] backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <Loader2 className="animate-spin h-5 w-5 text-[#C6F250]" />
                  <span className="tracking-wide">Forging your token concept…</span>
                </div>
                {/* Skeleton shimmer rows */}
                <div className="flex flex-col gap-2 w-56">
                  <div className="shimmer h-2.5 w-3/4 rounded-full" />
                  <div className="shimmer h-2.5 w-1/2 rounded-full" />
                  <div className="shimmer h-2.5 w-2/3 rounded-full" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Center Card: YOUR TOKEN CONCEPT */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-panel-card p-4 text-white w-full max-w-xl mx-auto z-10"
      >
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
          <div className="flex flex-1 flex-col items-center text-center group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black/40 border border-white/5 text-[#C6E07A] transition-transform group-hover:scale-105">
              <Lightbulb className="h-3.5 w-3.5" />
            </div>
            <span className="mt-1 font-sans text-[11px] font-bold text-white">Idea</span>
            <span className="text-[9.5px] text-[#A8C27E]">Your one line input</span>
          </div>

          <ChevronRight className="text-white/30 h-3.5 w-3.5" />

          {/* Step 2 (Active/Highlighted) */}
          <div className="flex flex-1 flex-col items-center text-center">
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#C6F250]/20 border border-[#C6F250]/40 text-[#C6F250] shadow-[0_0_12px_rgba(198,242,80,0.25)]"
            >
              <Sparkles className="h-3.5 w-3.5" />
            </motion.div>
            <span className="mt-1 font-sans text-[11px] font-bold text-[#C6F250]">Generate</span>
            <span className="text-[9.5px] text-[#A8C27E]">We craft the full concept</span>
          </div>

          <ChevronRight className="text-white/30 h-3.5 w-3.5" />

          {/* Step 3 */}
          <div className="flex flex-1 flex-col items-center text-center group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black/40 border border-white/5 text-[#C6E07A] transition-transform group-hover:scale-105">
              <Rocket className="h-3.5 w-3.5" />
            </div>
            <span className="mt-1 font-sans text-[11px] font-bold text-white">Launch</span>
            <span className="text-[9.5px] text-[#A8C27E]">Take it to pump.fun</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3.5 flex items-center justify-center gap-2.5 pt-1">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={download}
            className="btn-dark-pill flex items-center gap-1.5 px-3.5 py-1.5 font-sans text-xs font-semibold"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{downloaded ? 'Downloaded! 🎉' : 'Download Concept'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleChangeBg}
            className="btn-dark-pill relative overflow-hidden flex items-center gap-1.5 px-3.5 py-1.5 font-sans text-xs font-semibold hover:border-[#C6F250]/50 hover:shadow-[0_0_15px_rgba(198,242,80,0.2)] transition-all"
          >
            <motion.div
              key={background.id}
              initial={{ rotate: -120, scale: 0.7 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 450, damping: 18 }}
            >
              <ImageIcon className="h-3.5 w-3.5 text-[#C6F250]" />
            </motion.div>
            <span>Scene: <strong className="text-[#C6F250]">{background.name}</strong></span>
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
}
