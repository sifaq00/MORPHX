import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Trash2,
  Copy,
  Rocket,
  Check,
  Lightbulb,
  ArrowRight,
  ExternalLink,
  AlertTriangle,
  X,
  Undo2,
  Sparkles,
} from 'lucide-react';
import { loadConcepts, deleteConcept, saveConcept } from '../lib/concepts';
import { playClick, playLaunchCelebration } from '../lib/sound-fx';

type Props = {
  onNavigate?: (route: any) => void;
};

export function ConceptsPage({ onNavigate }: Props) {
  const [concepts, setConcepts] = useState(() => loadConcepts());
  const [copied, setCopied] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [lastDeleted, setLastDeleted] = useState<any | null>(null);
  const [toast, setToast] = useState<{ message: string; undoable?: boolean } | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showClearModal) {
        setShowClearModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showClearModal]);

  const showToast = (message: string, undoable = false) => {
    setToast({ message, undoable });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  const copyDesc = async (generatedFrom: string, text: string) => {
    playClick();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(generatedFrom);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  };

  const remove = (concept: any) => {
    playClick();
    setLastDeleted(concept);
    setConcepts(deleteConcept(concept.generatedFrom));
    showToast(`$${(concept.ticker || 'token').replace('$', '')} removed from vault`, true);
  };

  const handleUndo = () => {
    if (!lastDeleted) return;
    playClick();
    saveConcept(lastDeleted);
    setConcepts(loadConcepts());
    setLastDeleted(null);
    setToast(null);
  };

  const executeClearAll = () => {
    playClick();
    localStorage.removeItem('pounce-concepts');
    setConcepts([]);
    setShowClearModal(false);
    showToast('All concepts cleared from vault');
  };

  const handleLaunch = (e: React.MouseEvent, url: string) => {
    playLaunchCelebration();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x, y },
      colors: ['#C6F250', '#00FFA3', '#FFFFFF', '#DC1FFF', '#FFD700'],
      startVelocity: 18,
      scalar: 0.8,
      ticks: 90,
    });
  };

  return (
    <div className="relative z-10 px-3.5 sm:px-6 md:px-8 pt-20 sm:pt-24 pb-16">
      <div className="mx-auto max-w-5xl xl:max-w-6xl">
        
        {/* Header Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C6F250]/30 bg-[#C6F250]/10 px-3.5 py-1 font-mono text-[10.5px] font-bold text-[#C6F250] shadow-[0_0_12px_rgba(198,242,80,0.15)] mb-3">
              <Sparkles className="h-3 w-3 fill-current" /> LOCAL FORGE VAULT
            </span>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white select-none [text-shadow:_0_2px_10px_rgba(0,0,0,0.55)]">
              My Concepts
            </h1>
            <p className="mt-2 max-w-md font-sans text-xs sm:text-sm text-zinc-200 leading-relaxed [text-shadow:_0_1px_6px_rgba(0,0,0,0.5)]">
              Saved locally in your browser. Generate a concept and it lands here instantly.
            </p>
          </div>
          {concepts.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02, y: -1, transition: { duration: 0.2, ease: 'easeOut' } }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                playClick();
                setShowClearModal(true);
              }}
              className="self-start sm:self-auto flex items-center gap-1.5 rounded-full border border-white/25 bg-black/60 px-4 py-2 font-mono text-xs font-bold text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:border-red-500/60 hover:bg-red-500/20 hover:text-red-400 shrink-0"
            >
              <Trash2 className="h-3.5 w-3.5 text-red-400" />
              <span>Clear all</span>
            </motion.button>
          )}
        </motion.div>

        {/* Empty State */}
        {concepts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative mt-8 sm:mt-12 rounded-2xl border border-dashed border-[#C6F250]/40 hover:border-[#C6F250]/70 transition-colors duration-300 p-8 sm:p-14 md:p-16 text-center group overflow-hidden"
          >
            {/* Ambient Scanning Laser Light Beam */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 overflow-hidden">
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#C6F250] to-transparent opacity-80"
              />
            </div>

            {/* Interactive Pulsing & Floating Lightbulb Emblem */}
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                rotate: [0, 6, -6, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: 'easeInOut',
              }}
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C6F250]/15 border border-[#C6F250]/30 text-[#C6F250] shadow-[0_0_20px_rgba(198,242,80,0.25)]"
            >
              <Lightbulb className="h-7 w-7" />
            </motion.div>

            <p className="mt-4 font-sans text-xs sm:text-sm text-zinc-200 [text-shadow:_0_1px_6px_rgba(0,0,0,0.6)]">
              No concepts saved yet. Generate one to get started.
            </p>
            <div className="mt-6 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.03, y: -1, transition: { duration: 0.2, ease: 'easeOut' } }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  playClick();
                  if (onNavigate) {
                    onNavigate('generate');
                  } else {
                    window.location.hash = '#generate';
                  }
                }}
                className="relative btn-brand-lime flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(198,242,80,0.25)] overflow-hidden transition-all duration-300"
              >
                {/* Moving Light Sheen Sweep */}
                <motion.div
                  animate={{ x: ['-150%', '250%'] }}
                  transition={{ repeat: Infinity, repeatDelay: 0.8, duration: 2.8, ease: 'easeInOut' }}
                  className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/45 to-transparent skew-x-12 pointer-events-none"
                />
                <Rocket className="h-4 w-4 relative z-10" />
                <span className="relative z-10">Generate Concept</span>
                <ArrowRight className="h-4 w-4 relative z-10" />
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {concepts.map((c, i) => (
                <motion.div
                  key={c.generatedFrom + i}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ delay: i * 0.05, type: 'spring', stiffness: 350, damping: 25 }}
                  whileHover={{ y: -4, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
                  className="concept-grid-item glass-panel-card p-4 sm:p-5 flex flex-col justify-between h-full group hover:border-[#C6F250]/40 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(198,242,80,0.12)] relative overflow-hidden"
                >
                  {/* Dynamic Specular Light Sweep on Card */}
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
                    <motion.div
                      animate={{ x: ['-200%', '300%'] }}
                      transition={{
                        repeat: Infinity,
                        repeatDelay: 1.0 + (i % 3) * 0.6,
                        duration: 3.2,
                        ease: 'easeInOut',
                      }}
                      className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent skew-x-12"
                    />
                  </div>

                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                        {/* Token Logo with Interactive Micro-Rotate Hover */}
                        <div className="relative h-11 w-11 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-xl border border-[#C6F250]/30 bg-black/50 shadow-[0_0_12px_rgba(198,242,80,0.15)] group-hover:border-[#C6F250]/60 transition-colors">
                          <img
                            src={c.logoUrl || '/logo.webp'}
                            alt={c.name}
                            onError={(e) => {
                              e.currentTarget.src = '/logo.webp';
                            }}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="font-display text-base sm:text-lg font-extrabold text-[#C6F250] tracking-tight">
                              {c.ticker}
                            </span>
                            <span className="rounded-full border border-[#C6F250]/30 bg-[#C6F250]/10 px-2 py-0.5 font-mono text-[9px] text-[#C6F250] tabular-nums shrink-0 font-bold">
                              ★ {c.vibeScore || 10}/10
                            </span>
                          </div>
                          <p className="truncate font-display text-xs sm:text-sm font-bold text-white leading-snug">{c.name}</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 3, transition: { duration: 0.2, ease: 'easeOut' } }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => remove(c)}
                        aria-label="Delete concept"
                        title="Delete concept"
                        className="rounded-full p-2 text-white/40 transition-colors duration-200 hover:text-red-400 hover:bg-red-500/10 shrink-0 relative z-10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>

                    <p className="mt-2 line-clamp-2 font-sans text-xs leading-snug text-[#A8C27E] font-medium">
                      “{c.tagline}”
                    </p>
                    <p className="mt-2 line-clamp-2 font-sans text-[11px] leading-snug text-zinc-300 italic">
                      “{c.generatedFrom}”
                    </p>
                  </div>

                  <div className="mt-4 flex gap-2 relative z-10">
                    {/* Launch with Interactive Confetti Celebration & Moving Sheen */}
                    <motion.a
                      whileHover={{ scale: 1.02, transition: { duration: 0.2, ease: 'easeOut' } }}
                      whileTap={{ scale: 0.97 }}
                      href={c.pumpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handleLaunch(e, c.pumpUrl)}
                      className="relative btn-brand-lime flex flex-1 items-center justify-center gap-1.5 py-2 sm:py-2.5 text-xs font-bold shadow-sm overflow-hidden transition-all duration-300"
                    >
                      {/* Moving Light Sheen Sweep */}
                      <motion.div
                        animate={{ x: ['-150%', '250%'] }}
                        transition={{
                          repeat: Infinity,
                          repeatDelay: 0.8 + (i % 2) * 0.6,
                          duration: 2.6,
                          ease: 'easeInOut',
                        }}
                        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none"
                      />
                      <Rocket className="h-3.5 w-3.5 relative z-10" />
                      <span className="relative z-10">Launch</span>
                      <ExternalLink className="h-3 w-3 opacity-60 relative z-10" />
                    </motion.a>

                    {/* Copy Pitch with Interactive Feedback Bounce */}
                    <motion.button
                      whileHover={{ scale: 1.02, transition: { duration: 0.2, ease: 'easeOut' } }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => copyDesc(c.generatedFrom, `${c.name} (${c.ticker})\n${c.tagline}\n\n${c.description}`)}
                      className="btn-dark-pill flex flex-1 items-center justify-center gap-1.5 py-2 sm:py-2.5 text-xs font-semibold transition-all duration-300"
                    >
                      {copied === c.generatedFrom ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-[#C6F250] stroke-[3]" />
                          <span className="text-[#C6F250] font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Pitch</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>

      {/* =========================================================================
          CUSTOM GLASSMORPHIC CLEAR ALL CONFIRMATION MODAL
         ========================================================================= */}
      <AnimatePresence>
        {showClearModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Translucent Backdrop Tint (Soft & Ambient) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowClearModal(false)}
              className="absolute inset-0 bg-black/35 backdrop-blur-[2.5px]"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 15 }}
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              className="relative w-full max-w-md glass-panel-card p-6 sm:p-7 border-red-500/40 shadow-[0_0_50px_rgba(239,68,68,0.25)] text-center overflow-hidden z-10"
            >
              {/* Laser Red Beam at Top */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-80" />

              {/* Close Button */}
              <button
                onClick={() => {
                  playClick();
                  setShowClearModal(false);
                }}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition p-1 rounded-full hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Danger Pulsing Icon */}
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                <AlertTriangle className="h-7 w-7" />
              </div>

              <h2 className="mt-4 font-display text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Clear All Concepts?
              </h2>

              <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                All <span className="font-bold text-white font-mono">{concepts.length}</span> saved token concepts will be permanently deleted from your local browser vault.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => {
                    playClick();
                    setShowClearModal(false);
                  }}
                  className="btn-dark-pill flex-1 py-2.5 text-xs font-semibold"
                >
                  Cancel
                </button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={executeClearAll}
                  className="flex-1 py-2.5 rounded-full bg-red-500 hover:bg-red-600 font-mono text-xs font-bold text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Yes, Clear All</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          INTERACTIVE FLOATING ACTION TOAST WITH UNDO ACTION
         ========================================================================= */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 flex items-center gap-3 rounded-full border border-[#C6F250]/30 bg-[#0B0F07]/95 px-5 py-2.5 font-mono text-xs text-white shadow-2xl backdrop-blur-md"
          >
            <span>{toast.message}</span>
            {toast.undoable && (
              <button
                onClick={handleUndo}
                className="flex items-center gap-1 font-bold text-[#C6F250] hover:text-[#E8FFA6] underline underline-offset-2 transition"
              >
                <Undo2 className="h-3 w-3" />
                <span>Undo</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}