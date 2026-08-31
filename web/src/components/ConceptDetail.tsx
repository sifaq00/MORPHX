import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Rocket, Download, RefreshCw, Loader2, Copy, Check, Sparkles } from 'lucide-react';
import { Token } from '../pages/GeneratePage';
import { playClick, playSuccessChime, playLaunchCelebration } from '../lib/sound-fx';
import { formatPitchDeck } from '../lib/concepts';

type Props = {
  token: Token | null;
  status: 'idle' | 'loading' | 'error';
  error: string;
  onUpdateToken?: (token: Token) => void;
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
  logoPrompt: 'An iconic green crypto frog wearing a gold chain and sunglasses, triumphant expression, vector sticker',
  logoUrl: '',
};

export function ConceptDetail({ token, status, error, onUpdateToken }: Props) {
  const currentToken = token || DEFAULT_TOKEN;
  const cleanTicker = currentToken.ticker.replace('$', '');

  const emblemRef = useRef<HTMLDivElement | null>(null);
  const [isForgingLogo, setIsForgingLogo] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState(currentToken.logoUrl || '/pepe-badge.webp');
  const [logoDownloaded, setLogoDownloaded] = useState(false);
  const [copiedLogoPrompt, setCopiedLogoPrompt] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showLaunchNotification, setShowLaunchNotification] = useState(false);

  const copySingleField = async (fieldName: string, value: string) => {
    playClick();
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 1800);
    } catch {
      setCopiedField(null);
    }
  };

  const handleCopyPitch = async () => {
    playClick();
    try {
      await navigator.clipboard.writeText(formatPitchDeck(currentToken));
      setCopiedPitch(true);
      setTimeout(() => setCopiedPitch(false), 2200);
    } catch {
      setCopiedPitch(false);
    }
  };

  const handleCopyLogoPrompt = async () => {
    if (!currentToken.logoPrompt) return;
    playClick();
    try {
      await navigator.clipboard.writeText(currentToken.logoPrompt);
      setCopiedLogoPrompt(true);
      setTimeout(() => setCopiedLogoPrompt(false), 2200);
    } catch {
      setCopiedLogoPrompt(false);
    }
  };

  // Trigger localized confetti burst right around the logo emblem
  const triggerEmblemBurst = () => {
    playSuccessChime();
    if (!emblemRef.current) {
      confetti({
        particleCount: 26,
        spread: 45,
        origin: { x: 0.85, y: 0.3 },
        colors: ['#C6F250', '#00FFA3', '#FFFFFF', '#FFD700'],
        startVelocity: 16,
        scalar: 0.75,
        ticks: 90,
      });
      return;
    }

    const rect = emblemRef.current.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 26,
      spread: 50,
      origin: { x, y },
      colors: ['#C6F250', '#00FFA3', '#FFFFFF', '#FFD700'],
      startVelocity: 17,
      scalar: 0.75,
      ticks: 90,
    });
  };

  // Preload and verify image with guaranteed 2.5s timeout (fixing stale closure)
  useEffect(() => {
    const targetUrl = currentToken.logoUrl;

    if (!targetUrl || targetUrl === '/pepe-badge.webp' || targetUrl === '/pepe-badge.png') {
      setCurrentImageSrc('/pepe-badge.webp');
      setIsImageLoading(false);
      return;
    }

    setIsImageLoading(true);
    let isCancelled = false;
    let isDone = false;

    const fastFallbackUrl = `https://api.dicebear.com/9.x/bottts/png?seed=${encodeURIComponent(
      cleanTicker
    )}&backgroundColor=0e140a&size=400`;

    const finish = (finalSrc: string) => {
      if (isDone || isCancelled) return;
      isDone = true;
      clearTimeout(timeoutId);
      setCurrentImageSrc(finalSrc);
      setIsImageLoading(false);
      if (onUpdateToken && currentToken.logoUrl !== finalSrc) {
        onUpdateToken({ ...currentToken, logoUrl: finalSrc });
      }
      triggerEmblemBurst();
    };

    // Generous 7.5s timeout: gives Pollinations plenty of time to render custom diffusion art
    const timeoutId = setTimeout(() => {
      finish(fastFallbackUrl);
    }, 7500);

    const img = new Image();
    img.onload = () => {
      finish(targetUrl);
    };
    img.onerror = () => {
      finish(fastFallbackUrl);
    };
    img.src = targetUrl;

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
      img.onload = null;
      img.onerror = null;
    };
  }, [currentToken.logoUrl, cleanTicker]);

  const handleLaunch = async () => {
    playLaunchCelebration();
    try {
      // Automatically copy token info to clipboard for seamless pasting in pump.fun
      await navigator.clipboard.writeText(formatPitchDeck(currentToken));
    } catch {}

    setShowLaunchNotification(true);
    setTimeout(() => setShowLaunchNotification(false), 5000);

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.75, x: 0.85 },
      colors: ['#C6F250', '#00FFA3', '#FFFFFF', '#DC1FFF'],
    });
  };

  // 100% Reliable Re-roll that automatically syncs the middle cards
  const handleReRollLogo = async () => {
    if (isForgingLogo || isImageLoading) return;
    playClick();
    setIsForgingLogo(true);
    setIsImageLoading(true);

    const newSeed = Math.floor(Math.random() * 10000000);
    const fastFallback = `https://api.dicebear.com/9.x/bottts/png?seed=${encodeURIComponent(
      cleanTicker + '-' + newSeed
    )}&backgroundColor=0e140a&size=400`;

    let resolved = false;
    const finishWithUrl = (validUrl: string) => {
      if (resolved) return;
      resolved = true;
      setCurrentImageSrc(validUrl);
      setIsImageLoading(false);
      setIsForgingLogo(false);
      if (onUpdateToken) {
        onUpdateToken({
          ...currentToken,
          logoUrl: validUrl,
        });
      }
      triggerEmblemBurst();
    };

    // Generous 7.5s timeout for re-roll
    const timer = setTimeout(() => {
      finishWithUrl(fastFallback);
    }, 7500);

    try {
      const res = await fetch('/api/generate-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: currentToken.name,
          ticker: cleanTicker,
          logoPrompt: currentToken.logoPrompt,
          idea: currentToken.generatedFrom,
          seed: newSeed,
        }),
      });

      const data = await res.json();
      const primaryUrl = data.logoUrl || fastFallback;

      const img = new Image();
      img.onload = () => {
        clearTimeout(timer);
        finishWithUrl(primaryUrl);
      };
      img.onerror = () => {
        clearTimeout(timer);
        finishWithUrl(fastFallback);
      };
      img.src = primaryUrl;
    } catch (e) {
      clearTimeout(timer);
      finishWithUrl(fastFallback);
    }
  };

  const handleDownloadLogo = async () => {
    playClick();
    const downloadSrc = currentImageSrc || currentToken.logoUrl;
    if (!downloadSrc) return;

    try {
      const response = await fetch(downloadSrc);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${cleanTicker.toLowerCase()}-logo.png`;
      link.click();
      URL.revokeObjectURL(blobUrl);

      setLogoDownloaded(true);
      setTimeout(() => setLogoDownloaded(false), 2000);
    } catch (err) {
      window.open(downloadSrc, '_blank');
    }
  };

  const showLoadingOverlay = status === 'loading' || isForgingLogo || isImageLoading;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="glass-panel-card p-5 text-white flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between font-sans text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#C6E07A]">
          <span>GENERATED CONCEPT</span>
          <span className="flex items-center gap-1 font-mono text-[10px] text-[#C6F250] bg-[#C6F250]/10 px-2 py-0.5 rounded-full border border-[#C6F250]/20">
            ★ {currentToken.vibeScore || 10}/10 Vibe
          </span>
        </div>

        {error && (
          <p className="mt-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 font-mono text-xs text-red-400">
            {error}
          </p>
        )}

        {/* Circular Mascot Emblem with Rotating Halo Glow & Idle Breathing Pulse */}
        <div className="mt-3 flex flex-col items-center">
          <motion.div
            ref={emblemRef}
            animate={{
              scale: [1, 1.025, 1],
              boxShadow: [
                '0 0 25px rgba(198,242,80,0.25)',
                '0 0 20px rgba(198,242,80,0.25)',
                '0 0 35px rgba(198,242,80,0.5)',
                '0 0 20px rgba(198,242,80,0.25)',
              ],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-[#C6F250] bg-black/60 shadow-[0_0_25px_rgba(198,242,80,0.35)] group z-10"
          >
            {/* Spinning ambient sunburst backdrop */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
              className="absolute -inset-4 bg-[conic-gradient(from_0deg,transparent_0deg,#C6F25033_90deg,transparent_180deg,#C6F25033_270deg,transparent_360deg)] pointer-events-none"
            />

            {/* Mascot Image Preview */}
            <img
              key={currentImageSrc}
              src={currentImageSrc}
              alt={currentToken.name}
              onError={() => {
                const fallback = `https://api.dicebear.com/9.x/bottts/png?seed=${encodeURIComponent(
                  cleanTicker
                )}&backgroundColor=0e140a&size=400`;
                setCurrentImageSrc(fallback);
                setIsImageLoading(false);
                if (onUpdateToken) {
                  onUpdateToken({ ...currentToken, logoUrl: fallback });
                }
              }}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />

            {/* Forging Overlay Loading State */}
            <AnimatePresence>
              {showLoadingOverlay && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md z-10"
                >
                  <Loader2 className="animate-spin h-7 w-7 text-[#C6F250]" />
                  <span className="mt-1.5 font-mono text-[9.5px] text-[#C6F250] uppercase tracking-wider font-semibold text-center px-2">
                    {status === 'loading'
                      ? 'Forging Token…'
                      : isImageLoading
                      ? 'Rendering Mascot…'
                      : 'Forging…'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* AI Logo Actions Bar (Download & Re-roll) */}
          {!showLoadingOverlay && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2.5 flex items-center justify-center gap-1.5 w-full"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownloadLogo}
                className="btn-dark-pill flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 font-sans text-[11px] font-semibold text-white"
              >
                <Download className="h-3 w-3" />
                <span>{logoDownloaded ? 'Saved! 🎉' : 'Download Logo'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.08, rotate: 180 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleReRollLogo}
                disabled={showLoadingOverlay}
                title="Re-roll New Artwork"
                className="btn-dark-pill flex h-8 w-8 items-center justify-center p-0 text-[#C6F250] shrink-0"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </motion.button>
            </motion.div>
          )}

          {/* AI Logo Generator Prompt (Copyable for Midjourney / DALL-E / ChatGPT) */}
          {currentToken.logoPrompt && !showLoadingOverlay && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="mt-3 w-full rounded-xl border border-white/10 bg-[#0B0F07]/90 p-2.5 flex flex-col gap-1.5 text-left shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#9EA888] font-bold flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-[#C6F250]" />
                  <span>DALL-E / Midjourney Prompt</span>
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopyLogoPrompt}
                  className="flex items-center gap-1 font-mono text-[10px] text-[#C6F250] hover:text-[#E8FFA6] font-semibold transition-colors bg-[#C6F250]/10 hover:bg-[#C6F250]/20 px-2 py-0.5 rounded border border-[#C6F250]/25"
                  title="Copy prompt for Midjourney / DALL-E"
                >
                  {copiedLogoPrompt ? <Check className="h-3 w-3 text-[#C6F250]" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedLogoPrompt ? 'Copied! 🎉' : 'Copy Prompt'}</span>
                </motion.button>
              </div>
              <p className="font-mono text-[10px] sm:text-[10.5px] leading-relaxed text-zinc-200 select-all bg-black/60 p-2.5 rounded-lg border border-white/10 max-h-36 overflow-y-auto scrollbar-none break-words">
                “{currentToken.logoPrompt}”
              </p>
            </motion.div>
          )}
        </div>

        {/* Data Fields List with Staggered Key Transitions & 1-Click Quick Copy */}
        <motion.div
          key={`fields-${cleanTicker}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-3.5 space-y-2.5 divide-y divide-white/5 text-xs"
        >
          {/* Ticker */}
          <div className="pt-2 first:pt-0 group">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#9EA888] font-bold">
                TICKER
              </span>
              <button
                onClick={() => copySingleField('ticker', cleanTicker)}
                title="Copy Ticker"
                className="opacity-50 group-hover:opacity-100 p-0.5 rounded text-[#C6F250] hover:bg-white/10 transition"
              >
                {copiedField === 'ticker' ? <Check className="h-3 w-3 text-[#C6F250]" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
            <div className="mt-0.5 font-display text-base font-extrabold text-white tracking-tight">
              {cleanTicker}
            </div>
          </div>

          {/* Name */}
          <div className="pt-2 group">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#9EA888] font-bold">
                NAME
              </span>
              <button
                onClick={() => copySingleField('name', currentToken.name)}
                title="Copy Name"
                className="opacity-50 group-hover:opacity-100 p-0.5 rounded text-[#C6F250] hover:bg-white/10 transition"
              >
                {copiedField === 'name' ? <Check className="h-3 w-3 text-[#C6F250]" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
            <div className="mt-0.5 font-display text-xs font-bold text-white">
              {currentToken.name}
            </div>
          </div>

          {/* Tagline */}
          <div className="pt-2 group">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#9EA888] font-bold">
                TAGLINE
              </span>
              <button
                onClick={() => copySingleField('tagline', currentToken.tagline)}
                title="Copy Tagline"
                className="opacity-50 group-hover:opacity-100 p-0.5 rounded text-[#C6F250] hover:bg-white/10 transition"
              >
                {copiedField === 'tagline' ? <Check className="h-3 w-3 text-[#C6F250]" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
            <div className="mt-0.5 font-sans text-xs text-[#E8ECE0] leading-snug">
              {currentToken.tagline}
            </div>
          </div>

          {/* Description */}
          <div className="pt-2 group">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#9EA888] font-bold">
                DESCRIPTION
              </span>
              <button
                onClick={() => copySingleField('description', currentToken.description)}
                title="Copy Description"
                className="opacity-50 group-hover:opacity-100 p-0.5 rounded text-[#C6F250] hover:bg-white/10 transition"
              >
                {copiedField === 'description' ? <Check className="h-3 w-3 text-[#C6F250]" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
            <div className="mt-0.5 font-sans text-[11px] leading-relaxed text-[#C8D2BE]">
              {currentToken.description}
            </div>
          </div>

          {/* Lore (One line) */}
          <div className="pt-2 group">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#9EA888] font-bold">
                LORE (ONE LINE)
              </span>
              <button
                onClick={() => copySingleField('lore', currentToken.lore)}
                title="Copy Full Lore"
                className="opacity-50 group-hover:opacity-100 p-0.5 rounded text-[#C6F250] hover:bg-white/10 transition"
              >
                {copiedField === 'lore' ? <Check className="h-3 w-3 text-[#C6F250]" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
            <div className="mt-0.5 font-sans text-[11px] text-[#C8D2BE] flex items-center gap-1.5 leading-snug">
              <span>{currentToken.lore.split('\n\n')[0]}</span>
              <span>🐸</span>
            </div>
          </div>

          {/* Metrics */}
          <div className="pt-2 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#9EA888] font-bold">
                EST. LAUNCH COST
              </span>
              <span className="font-mono text-white/90 font-medium tabular-nums">~0.02 SOL</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#9EA888] font-bold">
                NETWORK
              </span>
              <span className="flex items-center gap-1.5 font-display text-xs text-white/95 font-bold">
                <img
                  src="/solana-icon.webp"
                  alt="Solana"
                  onError={(e) => {
                    e.currentTarget.src = '/solana-icon.png';
                  }}
                  className="h-3.5 w-3.5 object-contain"
                />
                <span>Solana</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#9EA888] font-bold">
                LAUNCH PLATFORM
              </span>
              <span className="font-mono text-white/90 font-medium">pump.fun</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Compact Action Buttons: Pitch & Launch */}
      <div className="mt-4 pt-1 flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopyPitch}
          className="btn-dark-pill flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 font-display text-xs font-bold uppercase tracking-wider text-white border border-white/15 hover:border-[#C6F250]/40 transition-colors"
        >
          {copiedPitch ? <Check className="h-3.5 w-3.5 text-[#C6F250] stroke-[3]" /> : <Copy className="h-3.5 w-3.5 text-[#C6F250]" />}
          <span className={copiedPitch ? 'text-[#C6F250]' : ''}>{copiedPitch ? 'Copied!' : 'Pitch'}</span>
        </motion.button>

        <motion.a
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLaunch}
          href={currentToken.pumpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-brand-lime flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-center font-display text-xs sm:text-sm font-extrabold tracking-wide uppercase shadow-[0_4px_16px_rgba(198,242,80,0.3)] relative overflow-hidden group"
        >
          {/* Idle Sheen Light Sweep Animation */}
          <motion.div
            animate={{ x: ['-150%', '250%'] }}
            transition={{ repeat: Infinity, repeatDelay: 4, duration: 1.3, ease: 'easeInOut', delay: 1 }}
            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-12 pointer-events-none"
          />
          <Rocket className="h-3.5 w-3.5" />
          <span>Launch</span>
        </motion.a>
      </div>

      {/* Launch Toast Helper */}
      <AnimatePresence>
        {showLaunchNotification && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border border-[#C6F250]/40 bg-[#0B0F07]/95 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#C6F250]/20 text-[#C6F250]">
                <Rocket className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="font-display text-xs font-bold text-white">Opening pump.fun...</div>
                <p className="mt-0.5 text-[11px] leading-relaxed text-[#A8C27E]">
                  Token details auto-copied to clipboard! Paste directly into pump.fun form or use the 1-click copy buttons.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}