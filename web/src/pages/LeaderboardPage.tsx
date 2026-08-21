import { motion } from 'framer-motion';
import {
  Trophy,
  Medal,
  Crown,
  Sparkles,
  Rocket,
  ArrowRight,
  ExternalLink,
  TrendingUp,
  Activity,
  Zap,
} from 'lucide-react';
import { HotBadge, Stars, Tag } from '../components/Tag';
import { BUNDLES } from '../data/bundles';
import { loadConcepts } from '../lib/concepts';
import { FlipCounter } from '../components/FlipCounter';
import { playClick, playLaunchCelebration } from '../lib/sound-fx';
import confetti from 'canvas-confetti';

const PODIUM_COLORS = ['#C6F250', '#E4E4E7', '#D97706'];

const MASCOT_ICONS = [
  '/mascots/mascot-cyber.png',
  '/mascots/mascot-crown.png',
  '/mascots/mascot-laser.png',
  '/mascots/mascot-astro.png',
  '/mascots/mascot-shades.png',
  '/mascots/mascot-ninja.png',
  '/mascots/mascot-default.png',
];

const DEFAULT_LEADERBOARD_ITEMS = [
  { ticker: '$WAGMI', name: 'Infinite Ascend', generatedFrom: 'When in doubt, ape it out.', vibeScore: 10, logoUrl: '/mascots/mascot-crown.png', pumpUrl: 'https://pump.fun/create' },
  { ticker: '$PEPE2', name: 'Frog King Reborn', generatedFrom: 'Frog king returns to Solana', vibeScore: 10, logoUrl: '/pepe-badge.png', pumpUrl: 'https://pump.fun/create' },
  { ticker: '$QUANTUM', name: 'Parallel Degen AI', generatedFrom: 'Parallel timeline degen yields', vibeScore: 9, logoUrl: '/mascots/mascot-cyber.png', pumpUrl: 'https://pump.fun/create' },
  { ticker: '$SPEEDCAT', name: 'Solana Mach 10', generatedFrom: 'Fastest cat on Solana block', vibeScore: 9, logoUrl: '/mascots/mascot-ninja.png', pumpUrl: 'https://pump.fun/create' },
  { ticker: '$CHAD', name: 'GigaChad Protocol', generatedFrom: 'Built different probably not', vibeScore: 8, logoUrl: '/mascots/mascot-shades.png', pumpUrl: 'https://pump.fun/create' },
];

type Props = {
  onNavigate?: (route: any) => void;
};

export function LeaderboardPage({ onNavigate }: Props) {
  const concepts = loadConcepts();
  const ranked = concepts.length > 0 
    ? [...concepts].sort((a, b) => (b.vibeScore || 0) - (a.vibeScore || 0)).slice(0, 10)
    : DEFAULT_LEADERBOARD_ITEMS;
  
  const totalConcepts = concepts.length > 0 ? concepts.length : 128;
  const avgVibe = concepts.length > 0 
    ? Math.round(concepts.reduce((acc, curr) => acc + (curr.vibeScore || 10), 0) / concepts.length)
    : 10;
  const topConcept = ranked[0];

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
          className="text-center sm:text-left"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C6F250]/30 bg-[#C6F250]/10 px-3.5 py-1 font-mono text-[10.5px] font-bold text-[#C6F250] shadow-[0_0_12px_rgba(198,242,80,0.15)] mb-3">
            <Trophy className="h-3 w-3 fill-current" /> HALL OF FAME
          </span>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white select-none [text-shadow:_0_2px_10px_rgba(0,0,0,0.55)]">
            Vibe Leaderboard
          </h1>
          <p className="mt-2 max-w-xl font-sans text-xs sm:text-sm leading-relaxed text-zinc-200 [text-shadow:_0_1px_6px_rgba(0,0,0,0.5)]">
            Top token concepts ranked by deterministic vibe heuristic metrics. Forge your concept to claim the crown.
          </p>
        </motion.div>

        {/* =========================================================================
            ANIMATION 2: MECHANICAL ROLLING FLIP COUNTER STATS TELEMETRY
           ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4"
        >
          {/* Stat 1: Total Concepts Forged */}
          <div className="glass-panel-card p-4 sm:p-5 text-left border-white/15 hover:border-[#C6F250]/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs uppercase tracking-wider text-zinc-400 font-semibold">Total Indexed</span>
              <Activity className="h-4 w-4 text-[#C6F250]" />
            </div>
            <div className="mt-2 flex items-baseline gap-1 text-[#C6F250]">
              <FlipCounter value={totalConcepts} fontSize={28} className="font-bold font-mono" />
              <span className="text-xs font-mono text-zinc-400">tokens</span>
            </div>
          </div>

          {/* Stat 2: Average Vibe Score */}
          <div className="glass-panel-card p-4 sm:p-5 text-left border-white/15 hover:border-[#C6F250]/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs uppercase tracking-wider text-zinc-400 font-semibold">Avg Vibe Score</span>
              <TrendingUp className="h-4 w-4 text-[#C6F250]" />
            </div>
            <div className="mt-2 flex items-baseline gap-1 text-white">
              <FlipCounter value={avgVibe} fontSize={28} className="font-bold font-mono text-[#C6F250]" />
              <span className="text-sm font-mono text-zinc-400">/ 10 Rating</span>
            </div>
          </div>

          {/* Stat 3: Top Rank #1 Token */}
          <div className="glass-panel-card p-4 sm:p-5 text-left border-white/15 hover:border-[#C6F250]/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs uppercase tracking-wider text-zinc-400 font-semibold">Reigning Champion</span>
              <Crown className="h-4 w-4 text-[#C6F250]" />
            </div>
            <p className="mt-2 truncate font-display text-xl sm:text-2xl font-extrabold text-[#C6F250] tracking-tight">
              {topConcept ? topConcept.ticker : '$WAGMI'}
            </p>
          </div>
        </motion.div>

        {/* =========================================================================
            RANKING BOARD LIST
           ========================================================================= */}
        <div className="mt-8 space-y-3">
          {ranked.map((c, i) => (
            <motion.div
              key={c.generatedFrom + i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ x: 4, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
              className={`glass-panel-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4.5 relative overflow-hidden transition-all duration-300 group ${
                i === 0 ? 'border-[#C6F250]/40 shadow-[0_0_25px_rgba(198,242,80,0.12)]' : ''
              }`}
            >
              {/* Moving Sheen for Top #1 Rank */}
              {i === 0 && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
                  <motion.div
                    animate={{ x: ['-200%', '300%'] }}
                    transition={{
                      repeat: Infinity,
                      repeatDelay: 1.5,
                      duration: 3.0,
                      ease: 'easeInOut',
                    }}
                    className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent skew-x-12"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Rank Badge */}
                <div
                  className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl font-display text-base sm:text-lg font-extrabold shadow-md"
                  style={{
                    background:
                      i < 3 ? PODIUM_COLORS[i] : 'rgba(255,255,255,0.08)',
                    color: i === 0 ? '#0B0E08' : i < 3 ? '#18181B' : '#E4E4E7',
                  }}
                >
                  {i === 0 ? <Crown className="h-5 w-5 fill-current" /> : `#${i + 1}`}
                </div>

                {/* Logo Thumbnail with Glow */}
                <div className="relative h-10 w-10 sm:h-11 sm:w-11 shrink-0 overflow-hidden rounded-xl border border-[#C6F250]/30 bg-black/50 shadow-[0_0_10px_rgba(198,242,80,0.15)] group-hover:border-[#C6F250]/60 transition-colors duration-300">
                  <img
                    src={c.logoUrl || '/logo.png'}
                    alt={c.name}
                    onError={(e) => {
                      e.currentTarget.src = '/logo.png';
                    }}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2"
                  />
                </div>

                {/* Ticker & Name */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm sm:text-base font-extrabold text-[#C6F250] tracking-tight">
                      {c.ticker}
                    </span>
                    <span className="truncate font-display text-xs sm:text-sm font-bold text-white leading-snug">
                      {c.name}
                    </span>
                  </div>
                  <p className="truncate font-sans text-[11px] sm:text-xs text-zinc-300 italic">“{c.generatedFrom}”</p>
                </div>
              </div>

              {/* Score & Launch Action */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                <div className="flex items-center gap-1.5 rounded-full border border-[#C6F250]/30 bg-[#C6F250]/15 px-2.5 py-1 text-xs font-mono font-bold text-[#C6F250]">
                  <Medal className="h-3.5 w-3.5" />
                  <span>{c.vibeScore || 10}/10 Vibe</span>
                </div>

                <motion.a
                  whileHover={{ scale: 1.03, transition: { duration: 0.2, ease: 'easeOut' } }}
                  whileTap={{ scale: 0.97 }}
                  href={c.pumpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleLaunch(e, c.pumpUrl)}
                  className="btn-brand-lime flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold shadow-sm shrink-0 transition-all duration-300"
                >
                  <Rocket className="h-3.5 w-3.5" />
                  <span>Launch</span>
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured Bundles Matrix */}
        <div className="mt-12 sm:mt-14">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-[#C6F250]" />
            <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white select-none">
              Featured Skill Bundles
            </h2>
          </div>
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
            {BUNDLES.map((bundle, i) => (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2 + i * 0.06 }}
                whileHover={{ y: -4, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
                className="glass-panel-card p-5 sm:p-6 group hover:border-[#C6F250]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#C6F250] font-bold">
                      {bundle.namespace}
                    </span>
                    <div className="flex items-center gap-2">
                      {bundle.hot && <HotBadge />}
                      <Stars count={bundle.stars} />
                    </div>
                  </div>
                  <h3 className="mt-3 font-display text-base sm:text-lg font-bold text-white group-hover:text-[#C6F250] transition-colors">
                    {bundle.name}
                  </h3>
                  <p className="mt-1.5 font-sans text-xs leading-relaxed text-zinc-300">
                    {bundle.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-1.5">
                  {bundle.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}