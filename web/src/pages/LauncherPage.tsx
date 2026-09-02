import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Layers,
  Check,
  ChevronDown,
  Mail,
  Lock,
  RefreshCw,
  Coins,
  Activity,
  Zap,
} from 'lucide-react';
import { Route } from '../hooks/useHashRoute';
import { TiltCard } from '../components/TiltCard';
import { playClick, playSuccessChime } from '../lib/sound-fx';

// 10 Static illustrative placeholder tokens for Basket Preview
const BASKET_PLACEHOLDERS = [
  { rank: '#01', ticker: '$TBD', name: 'Blue-Chip Meme Alpha', icon: '/mascots/mascot-crown.webp' },
  { rank: '#02', ticker: '$TBD', name: 'Top Volume Proven', icon: '/mascots/mascot-cyber.webp' },
  { rank: '#03', ticker: '$TBD', name: 'Consensus Liquidity Pillar', icon: '/mascots/mascot-laser.webp' },
  { rank: '#04', ticker: '$TBD', name: 'High-Velocity Asset', icon: '/mascots/mascot-astro.webp' },
  { rank: '#05', ticker: '$TBD', name: 'Market Benchmark', icon: '/mascots/mascot-shades.webp' },
  { rank: '#06', ticker: '$TBD', name: 'Solana Cultural Core', icon: '/mascots/mascot-ninja.webp' },
  { rank: '#07', ticker: '$TBD', name: 'Perpetual Depth Index', icon: '/mascots/mascot-default.webp' },
  { rank: '#08', ticker: '$TBD', name: 'Community Bastion', icon: '/mascots/mascot-crown.webp' },
  { rank: '#09', ticker: '$TBD', name: 'Velocity Heavyweight', icon: '/mascots/mascot-cyber.webp' },
  { rank: '#10', ticker: '$TBD', name: 'Index Anchor', icon: '/mascots/mascot-laser.webp' },
];

const FAQS = [
  {
    q: 'Is this live?',
    a: 'No. This is an early direction we are actively designing and building toward, tracked openly with our community. No smart contracts or automated fee routes are currently active.',
  },
  {
    q: 'Does this replace $MORPHX?',
    a: 'No. $MORPHX stays exactly where it has always been — trading strictly on pump.fun.',
  },
  {
    q: 'How is the top 10 basket chosen?',
    a: 'The index methodology is being designed to balance sustained volume spikes, verified bonding curve graduation, and liquidity depth on pump.fun to capture genuine high-conviction meme exposure.',
  },
  {
    q: 'Is this financial advice?',
    a: 'No. None of this is financial or investment advice. Crypto and memecoins carry substantial risk. DYOR applies here just like everywhere else in Web3.',
  },
];

const WAITLIST_STORAGE_KEY = 'morphx-launcher-waitlist';

export function LauncherPage({ onNavigate }: { onNavigate: (route: Route) => void }) {
  const waitlistRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const scrollToWaitlist = () => {
    playClick();
    waitlistRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const val = inputValue.trim();

    if (!val) {
      setErrorMsg('Please enter an email address or Solana wallet.');
      return;
    }

    try {
      const existingRaw = localStorage.getItem(WAITLIST_STORAGE_KEY);
      const list = existingRaw ? JSON.parse(existingRaw) : [];
      if (!list.includes(val)) {
        list.push({ contact: val, joinedAt: new Date().toISOString() });
        localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify(list));
      }
      playSuccessChime();
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
  };

  const toggleFaq = (index: number) => {
    playClick();
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] pt-20 sm:pt-24 pb-20 px-3.5 sm:px-6 md:px-8 max-w-6xl mx-auto text-left">
      {/* Ambient Radial Background Glow */}
      <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-96 sm:w-[650px] h-96 bg-[#C6F250]/12 rounded-full blur-[140px] -z-10 animate-pulse" />

      {/* =========================================================================
          SECTION A: HERO
         ========================================================================= */}
      <section className="text-center pt-2 sm:pt-6 pb-12 sm:pb-16 max-w-3xl mx-auto">
        {/* Early Direction Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#C6F250]/40 bg-[#C6F250]/15 px-3.5 py-1 font-mono text-[10.5px] sm:text-[11.5px] font-bold text-[#C6F250] shadow-[0_0_15px_rgba(198,242,80,0.25)] mb-5 select-none"
        >
          <Sparkles className="h-3.5 w-3.5 fill-[#C6F250] animate-spin" style={{ animationDuration: '6s' }} />
          <span>EARLY DIRECTION</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight select-none [text-shadow:_0_2px_12px_rgba(0,0,0,0.6)]"
        >
          MORPHX <span className="text-[#C6F250] [text-shadow:_0_0_24px_rgba(198,242,80,0.35)]">Launcher</span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          className="mt-4 text-sm sm:text-lg md:text-xl font-medium text-zinc-200 leading-relaxed px-2 [text-shadow:_0_1px_8px_rgba(0,0,0,0.5)]"
        >
          Coins whose creator fees flow back to holders — not stocks, the top 10 proven meme coins already trading on{' '}
          <span className="text-white font-bold underline decoration-[#C6F250]/70 underline-offset-4 decoration-2">pump.fun</span>.
        </motion.p>

        {/* ALWAYS VISIBLE PROMINENT DISCLAIMER WITH SCANNING EDGE ACCENT */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28, ease: 'easeOut' }}
          className="mt-5 mx-auto relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-2.5 text-xs font-mono text-amber-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md"
        >
          {/* Subtle Ambient Laser Line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent opacity-70 animate-pulse" />
          
          <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400" />
          <span className="font-semibold">
            Direction we&apos;re building toward. <strong className="text-white font-bold">Not live.</strong> Not financial advice.
          </span>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.36, ease: 'easeOut' }}
          className="mt-8 flex items-center justify-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToWaitlist}
            className="btn-brand-lime flex items-center gap-2 px-6 sm:px-8 py-3.5 text-xs sm:text-sm font-bold shadow-[0_0_24px_rgba(198,242,80,0.35)]"
          >
            <Mail className="h-4 w-4" />
            <span>Notify Me</span>
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </motion.div>
      </section>

      {/* =========================================================================
          SECTION B: HOW IT WILL WORK (3-Step 3D Tilt Explainer)
         ========================================================================= */}
      <section className="mt-8 sm:mt-12 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-6 text-center sm:text-left"
        >
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#C6F250] font-bold">
            — ARCHITECTURE BLUEPRINT
          </p>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white [text-shadow:_0_2px_10px_rgba(0,0,0,0.55)]">
            How It Will Work
          </h2>
          <p className="mt-1 font-sans text-xs sm:text-sm text-zinc-300">
            A frictionless feedback loop transforming creator trading fees into diversified meme exposure.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3 items-stretch">
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="h-full"
          >
            <TiltCard className="glass-panel-card p-6 flex flex-col justify-between border-white/15 hover:border-[#C6F250]/50 h-full shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_0_24px_rgba(198,242,80,0.2)] transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-extrabold text-[#C6F250] bg-[#C6F250]/15 border border-[#C6F250]/30 px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(198,242,80,0.2)]">
                    STEP 01
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#C6F250] shadow-inner">
                    <Rocket className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-white">
                  Launch
                </h3>
                <p className="mt-2 font-sans text-xs sm:text-[13px] text-zinc-300 leading-relaxed">
                  Forge a concept and launch it through MORPHX, same as today.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-zinc-400">
                <span>Deployment</span>
                <span className="text-[#C6F250] font-bold">Zero Extra Friction</span>
              </div>
            </TiltCard>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="h-full"
          >
            <TiltCard className="glass-panel-card p-6 flex flex-col justify-between border-white/15 hover:border-[#00FFA3]/50 h-full shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_0_24px_rgba(0,255,163,0.2)] transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-extrabold text-[#00FFA3] bg-[#00FFA3]/15 border border-[#00FFA3]/30 px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(0,255,163,0.2)]">
                    STEP 02
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#00FFA3] shadow-inner">
                    <RefreshCw className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-white">
                  Fees Redirect
                </h3>
                <p className="mt-2 font-sans text-xs sm:text-[13px] text-zinc-300 leading-relaxed">
                  A share of that coin&apos;s creator fees permanently routes into a basket of pump.fun&apos;s top 10 proven coins.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-zinc-400">
                <span>Routing</span>
                <span className="text-[#00FFA3] font-bold">Smart Auto-Redirect</span>
              </div>
            </TiltCard>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.19 }}
            className="h-full"
          >
            <TiltCard className="glass-panel-card p-6 flex flex-col justify-between border-white/15 hover:border-[#C6F250]/50 h-full shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_0_24px_rgba(198,242,80,0.2)] transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-extrabold text-[#C6F250] bg-[#C6F250]/15 border border-[#C6F250]/30 px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(198,242,80,0.2)]">
                    STEP 03
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#C6F250] shadow-inner">
                    <Coins className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-white">
                  Holders Get Exposure
                </h3>
                <p className="mt-2 font-sans text-xs sm:text-[13px] text-zinc-300 leading-relaxed">
                  Anyone holding the coin gets pro-rata exposure to that basket, funded entirely by fees the coin itself earns.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-zinc-400">
                <span>Value Accrual</span>
                <span className="text-[#C6F250] font-bold">Self-Sustaining</span>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          SECTION C: BASKET PREVIEW (Static, Placeholder Data with 3D Pop-in)
         ========================================================================= */}
      <section className="mt-10 sm:mt-14 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-[#C6F250] font-bold">
              <Layers className="h-3.5 w-3.5" />
              <span>— BASKET BLUEPRINT</span>
            </div>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-white [text-shadow:_0_2px_10px_rgba(0,0,0,0.55)]">
              Top 10 Proven Index
            </h2>
          </div>
          <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-amber-300/95 bg-amber-500/10 border border-amber-400/30 px-3.5 py-1.5 rounded-full shadow-md backdrop-blur-md shrink-0">
            <Lock className="h-3 w-3 text-amber-400" />
            <span>Preview — basket is not active yet</span>
          </div>
        </motion.div>

        {/* 10-Item High-Contrast Grid with Interactive Hover & Grayscale Glow */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {BASKET_PLACEHOLDERS.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.04 }}
              whileHover={{ scale: 1.04, y: -3 }}
              className="glass-panel-card p-4 rounded-2xl border-white/10 bg-black/45 text-center relative overflow-hidden group hover:border-[#C6F250]/40 shadow-[0_6px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(198,242,80,0.18)] transition-all cursor-default"
            >
              {/* Subtle Scanning Edge on Hover */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#C6F250]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Rank & TBD Badge */}
              <div className="flex items-center justify-between text-[10.5px] font-mono text-zinc-400 mb-2">
                <span className="font-black text-[#C6F250]">{item.rank}</span>
                <span className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-zinc-400 group-hover:text-zinc-200">
                  TBD
                </span>
              </div>

              {/* Mascot Icon */}
              <div className="mx-auto my-2 h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-2 shadow-inner group-hover:border-[#C6F250]/40 group-hover:shadow-[0_0_15px_rgba(198,242,80,0.2)] transition-all duration-300">
                <img
                  src={item.icon}
                  alt="Placeholder Icon"
                  className="h-full w-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                  onError={(e) => {
                    e.currentTarget.src = '/logo.webp';
                  }}
                />
              </div>

              {/* Ticker & Status */}
              <div className="font-display font-black text-sm text-zinc-300 group-hover:text-white transition-colors">
                {item.ticker}
              </div>
              <div className="text-[10px] text-zinc-400 font-sans truncate mt-0.5 font-medium">
                {item.name}
              </div>
              <div className="mt-2 text-[9px] font-mono text-[#C6F250]/80 font-semibold bg-[#C6F250]/10 border border-[#C6F250]/20 rounded py-0.5">
                Awaiting Index Lock
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION D: WAITLIST CAPTURE WITH LASER EDGE ACCENTS
         ========================================================================= */}
      <section ref={waitlistRef} className="mt-10 sm:mt-14 mb-16 scroll-mt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-panel-card p-6 sm:p-10 md:p-12 text-center relative overflow-hidden border-[#C6F250]/35 shadow-[0_12px_40px_rgba(0,0,0,0.7),_0_0_30px_rgba(198,242,80,0.12)] rounded-3xl"
        >
          {/* Laser Pulse Line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#C6F250] to-transparent opacity-60 animate-pulse" />

          <div className="max-w-xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C6F250]/30 bg-[#C6F250]/10 px-3.5 py-1 font-mono text-[10.5px] font-bold text-[#C6F250] shadow-[0_0_12px_rgba(198,242,80,0.2)] mb-3">
              <Sparkles className="h-3 w-3" /> LAUNCHER ALPHA ACCESS
            </span>

            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white [text-shadow:_0_2px_10px_rgba(0,0,0,0.55)]">
              Get Notified When It Goes Live
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Be the first to know when the MORPHX Launcher protocol specifications, smart contract audits, and public testnets open.
            </p>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success-state"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 p-6 rounded-2xl border border-[#00FFA3]/40 bg-[#00FFA3]/10 text-center shadow-[0_0_24px_rgba(0,255,163,0.15)]"
                >
                  <div className="flex h-11 w-11 mx-auto items-center justify-center rounded-full bg-[#00FFA3]/20 text-[#00FFA3] mb-2 shadow-[0_0_16px_rgba(0,255,163,0.5)]">
                    <Check className="h-5 w-5 stroke-[3]" />
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-white">
                    You&apos;re on the list!
                  </h3>
                  <p className="mt-1 text-xs text-zinc-300 font-sans">
                    We&apos;ll ping you directly as soon as the Launcher reaches public milestone status.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form-state"
                  onSubmit={handleWaitlistSubmit}
                  className="mt-6 flex flex-col sm:flex-row items-stretch gap-2.5 max-w-lg mx-auto"
                >
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter email or Solana wallet address…"
                      className="w-full h-11 rounded-xl border border-white/20 bg-black/60 px-4 text-xs sm:text-sm text-white placeholder:text-zinc-500 outline-none font-sans focus:border-[#C6F250] focus:shadow-[0_0_18px_rgba(198,242,80,0.25)] transition-all"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    type="submit"
                    className="btn-brand-lime h-11 px-5 text-xs font-bold shrink-0 flex items-center justify-center gap-1.5 shadow-[0_0_18px_rgba(198,242,80,0.3)]"
                  >
                    <span>Notify Me When It&apos;s Live.</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

            {errorMsg && (
              <p className="mt-2 text-xs font-mono text-red-400">
                {errorMsg}
              </p>
            )}

            <p className="mt-4 font-mono text-[10.5px] text-zinc-500">
              Zero spam. Pure development and release milestones only.
            </p>
          </div>
        </motion.div>
      </section>

      {/* =========================================================================
          SECTION E: FAQ ACCORDION
         ========================================================================= */}
      <section className="mt-10 sm:mt-14 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-6 text-center sm:text-left"
        >
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#C6F250] font-bold">
            — TRANSPARENCY & CLARITY
          </p>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-white [text-shadow:_0_2px_10px_rgba(0,0,0,0.55)]">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = openFaq === i;
            return (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className={`glass-panel-card overflow-hidden transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] ${
                  isOpen ? 'border-[#C6F250]/50 shadow-[0_0_24px_rgba(198,242,80,0.15)]' : 'hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => toggleFaq(i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-4 sm:px-5 py-4 text-left group"
                >
                  <span className="font-display text-xs sm:text-sm font-bold text-white group-hover:text-[#C6F250] transition-colors leading-snug">
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0 text-[#C6F250]"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="border-t border-white/10 px-4 sm:px-5 pb-4 pt-3 font-sans text-xs leading-relaxed text-zinc-300">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
