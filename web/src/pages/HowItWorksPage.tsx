import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  TerminalSquare,
  Server,
  KeyRound,
  MessageSquare,
  Lightbulb,
  Sparkles,
  Rocket,
  Cpu,
  ArrowRight,
  Zap,
  Terminal,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { HotBadge, Stars, Tag as TagComponent } from '../components/Tag';
import { MCP_SERVERS } from '../data/mcpServers';
import { playClick } from '../lib/sound-fx';

/**
 * Micro-Compact Widget 1: Live Idea Streamer (Step 1)
 */
function CompactStep1Visual() {
  const [index, setIndex] = useState(0);
  const ideas = [
    'When in doubt, ape it out…',
    'A cyborg frog in parallel matrix…',
    'Quantum speedcat on Solana…',
    'Pepe astronaut forging yields…',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ideas.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [ideas.length]);

  return (
    <div className="mt-3 relative overflow-hidden rounded-xl border border-white/10 bg-black/60 p-2.5 font-mono text-xs shadow-inner backdrop-blur-sm">
      <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1.5 pb-1 border-b border-white/5">
        <span className="flex items-center gap-1 text-[#C6F250] font-bold">
          <Sparkles className="h-2.5 w-2.5" /> Prompt Stream
        </span>
        <span className="text-[9px] font-semibold text-zinc-400">Raw Input</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={ideas[index]}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-1.5 text-[11px] text-white truncate"
        >
          <span className="text-[#C6F250] font-bold">&gt;</span>
          <span className="truncate">{ideas[index]}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/**
 * Micro-Compact Widget 2: Live Synthesis Terminal (Step 2)
 */
function CompactStep2Visual() {
  const [stepIndex, setStepIndex] = useState(0);
  const steps = [
    { ticker: '$QUANTUM', vibe: 10, time: '<1.4s' },
    { ticker: '$WAGMI', vibe: 10, time: '<1.2s' },
    { ticker: '$SPEEDCAT', vibe: 9, time: '<1.6s' },
    { ticker: '$PEPE2', vibe: 10, time: '<1.1s' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [steps.length]);

  const cur = steps[stepIndex];

  return (
    <div className="mt-3 relative overflow-hidden rounded-xl border border-white/10 bg-black/60 p-2.5 font-mono text-xs shadow-inner backdrop-blur-sm">
      {/* Laser Sweep line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#C6F250] to-transparent opacity-50 animate-pulse" />
      <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1.5 pb-1 border-b border-white/5">
        <span className="flex items-center gap-1 text-[#C6F250] font-bold">
          <Terminal className="h-2.5 w-2.5" /> Engine
        </span>
        <span className="flex items-center gap-1 text-[#C6F250] text-[9px] font-bold">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C6F250] animate-ping" /> {cur.time}
        </span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={cur.ticker}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-between"
        >
          <span className="font-display font-black text-[#C6F250] text-xs sm:text-sm">{cur.ticker}</span>
          <span className="rounded bg-[#C6F250]/15 px-1.5 py-0.5 text-[9px] font-bold text-[#C6F250] border border-[#C6F250]/30">
            {cur.vibe}/10 Vibe
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/**
 * Micro-Compact Widget 3: Live Deploy Capsule (Step 3)
 */
function CompactStep3Visual() {
  return (
    <div className="mt-3 relative overflow-hidden rounded-xl border border-white/10 bg-black/60 p-2.5 font-mono text-xs shadow-inner backdrop-blur-sm">
      <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1.5 pb-1 border-b border-white/5">
        <span className="flex items-center gap-1 text-[#00FFA3] font-bold">
          <Rocket className="h-2.5 w-2.5" /> Solana Node
        </span>
        <span className="text-[9px] font-bold text-[#C6F250]">Pre-filled ✓</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-[#121412] border border-[#C6F250] shadow-[0_0_6px_rgba(198,242,80,0.5)] p-0.5"
          >
            <img
              src="/logo.webp"
              alt="MORPHX"
              className="h-full w-full object-contain rounded-full"
              onError={(e) => {
                e.currentTarget.src = '/logo.png';
              }}
            />
          </motion.div>
          <span className="font-display font-extrabold text-white text-xs">pump.fun</span>
        </div>
        <span className="font-mono text-[9px] bg-white/10 px-2 py-0.5 rounded text-zinc-300 font-semibold">
          1-Click Ready
        </span>
      </div>
    </div>
  );
}

const PIPELINE_STEPS = [
  {
    step: '01',
    icon: Lightbulb,
    title: 'One-Line Idea',
    desc: 'You provide a raw thought, a meme, or a viral phrase. No complex briefing required.',
    badge: 'Input',
    renderVisual: () => <CompactStep1Visual />,
  },
  {
    step: '02',
    icon: Cpu,
    title: 'Autonomous Synthesis',
    desc: 'MegaLLM & heuristics craft a Ticker, Name, Tagline, Description, Lore, & Vibe Score.',
    badge: 'AI Engine',
    renderVisual: () => <CompactStep2Visual />,
  },
  {
    step: '03',
    icon: Rocket,
    title: 'Instant pump.fun Launch',
    desc: 'Get a 1-click pre-filled link to launch directly on Solana via pump.fun & JSON specs.',
    badge: 'Deploy',
    renderVisual: () => <CompactStep3Visual />,
  },
];

const FAQS = [
  {
    q: 'What does MORPHX actually generate?',
    a: 'A complete, launch-ready token concept derived from your one-line prompt: a ticker symbol (e.g. $WAGMI, $APE), full token name, punchy tagline, pump.fun-styled hype description copy, rich frog/degen lore, a vibe score (1–10), and a direct deep link to pump.fun/create.',
  },
  {
    q: 'Does MORPHX automatically deploy the contract on-chain?',
    a: 'No. MORPHX generates the creative identity, copy, and pre-fills the parameters. The actual transaction signing, funding, and contract deployment are executed directly on pump.fun by your own Solana wallet.',
  },
  {
    q: 'Can I integrate MORPHX with Claude Code or terminal AI agents?',
    a: 'Yes! MORPHX includes MCP (Model Context Protocol) servers and Claude Code skill instruction files located in the codebase, enabling autonomous AI agents to forge memecoin concepts directly through CLI prompts.',
  },
  {
    q: 'Is MORPHX free to use?',
    a: 'Yes, the web generator is 100% free to browse and use. If you choose to self-host the repository, you can simply plug in your own MegaLLM API key or use the built-in heuristic smart generator.',
  },
  {
    q: 'What happens if the AI API is unavailable?',
    a: 'MORPHX features a robust Heuristic Smart Concept Generator fallback that algorithmically constructs unique, viral memecoin names, tickers, and lore locally so generation never fails.',
  },
];

const CORE_ADVANTAGES = [
  {
    icon: Zap,
    title: 'Sub-2s Instant Synthesis',
    text: 'From a single sentence to a full memecoin identity with ticker, lore, and vibe score in under two seconds flat.',
  },
  {
    icon: ShieldCheck,
    title: '100% Non-Custodial & Fair Launch',
    text: 'Zero presales, zero dev allocation. All launches link directly to pump.fun fair-launch bonding curves.',
  },
  {
    icon: TrendingUp,
    title: 'Deterministic Virality Heuristics',
    text: 'Algorithmic evaluation scoring that grades ticker punchiness, memetic hook strength, and Solana degen appeal.',
  },
  {
    icon: Terminal,
    title: 'Agent SDK & MCP Native',
    text: 'Built-in Model Context Protocol servers allow terminal AI agents (e.g. Claude Code) to forge tokens autonomously.',
  },
];

type Props = {
  onNavigate?: (route: any) => void;
};

export function HowItWorksPage({ onNavigate }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    playClick();
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="relative z-10 px-3.5 sm:px-6 md:px-8 pt-20 sm:pt-24 pb-16 font-sans">
      <div className="mx-auto max-w-5xl xl:max-w-6xl space-y-10 sm:space-y-14">
        
        {/* Header Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C6F250]/30 bg-[#C6F250]/10 px-3.5 py-1 font-mono text-[10.5px] font-bold text-[#C6F250] shadow-[0_0_12px_rgba(198,242,80,0.15)] mb-3">
            <Zap className="h-3 w-3 fill-current" /> SYSTEM ARCHITECTURE & PIPELINE
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white select-none [text-shadow:_0_2px_10px_rgba(0,0,0,0.55)]">
            From Idea to Memecoin in Seconds
          </h1>
          <p className="mt-3 max-w-2xl mx-auto font-sans text-xs sm:text-sm md:text-base text-zinc-200 leading-relaxed [text-shadow:_0_1px_6px_rgba(0,0,0,0.5)]">
            MORPHX bridges raw human creativity with viral crypto copywriting, turning a single sentence into a full pump.fun-ready token identity.
          </p>
        </motion.div>

        {/* =========================================================================
            MICRO-COMPACT & SLEEK 3-STEP PIPELINE CARDS (WITH LIVE ANIMATED WIDGETS)
           ========================================================================= */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#C6F250] animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#C6F250] font-bold">
                The 3-Step Process
              </span>
            </div>
            <span className="text-xs text-zinc-400 font-mono">End-to-End Pipeline</span>
          </div>

          <div className="grid gap-3.5 sm:gap-4 md:grid-cols-3">
            {PIPELINE_STEPS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.08 * idx }}
                  whileHover={{ y: -4, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
                  className="glass-panel-card p-4 sm:p-5 flex flex-col justify-between relative group hover:border-[#C6F250]/40 transition-all duration-300 overflow-hidden h-full"
                >
                  {/* Subtle Sheen */}
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
                    <motion.div
                      animate={{ x: ['-200%', '300%'] }}
                      transition={{
                        repeat: Infinity,
                        repeatDelay: 2.5 + idx * 0.8,
                        duration: 3.0,
                        ease: 'easeInOut',
                      }}
                      className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent skew-x-12"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C6F250]/15 text-[#C6F250] group-hover:scale-105 transition-transform duration-300">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="rounded border border-white/10 bg-black/40 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-[#C6F250] font-bold">
                          {item.badge}
                        </span>
                      </div>
                      <span className="font-display text-xl font-black text-white/20 group-hover:text-[#C6F250]/40 transition-colors">
                        {item.step}
                      </span>
                    </div>

                    <h3 className="mt-3 font-display text-sm sm:text-base font-bold text-white group-hover:text-[#C6F250] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-1 font-sans text-xs leading-relaxed text-zinc-300">
                      {item.desc}
                    </p>

                    {/* Micro-Compact Live Animated Widget */}
                    {item.renderVisual()}
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400 group-hover:text-white transition-colors">
                    <span>Explore pipeline</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform text-[#C6F250]" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div>
          <div className="mb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#C6F250] font-bold">
              Frequently Asked Questions
            </span>
            <h2 className="mt-1 font-display text-xl sm:text-2xl font-bold text-white">
              Questions & Answers
            </h2>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {FAQS.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <motion.div
                  key={item.q}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.04 * i }}
                  className={`glass-panel-card overflow-hidden transition-colors duration-300 ${
                    isOpen ? 'border-[#C6F250]/40 shadow-[0_0_20px_rgba(198,242,80,0.1)]' : ''
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-4 sm:px-5 py-3.5 sm:py-4 text-left group"
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
                        <div className="border-t border-white/5 px-4 sm:px-5 pb-4 pt-2.5 font-sans text-xs leading-relaxed text-zinc-300">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Core Advantages & Superpowers Section */}
        <div>
          <div className="mb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#C6F250] font-bold">
              Autonomous Superpowers
            </span>
            <h2 className="mt-1 font-display text-xl sm:text-2xl font-bold text-white">
              Why Builders & Degens Choose MORPHX
            </h2>
          </div>

          <div className="grid gap-3.5 sm:gap-4 sm:grid-cols-2">
            {CORE_ADVANTAGES.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 * i }}
                  whileHover={{ y: -4, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
                  className="glass-panel-card p-4 sm:p-5 group hover:border-[#C6F250]/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C6F250]/15 text-[#C6F250] group-hover:scale-105 transition-transform duration-300">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="mt-2.5 font-display text-sm font-bold text-white group-hover:text-[#C6F250] transition-colors">{item.title}</h3>
                    <p className="mt-1 font-sans text-xs leading-relaxed text-zinc-300">{item.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* MCP Servers Directory */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#C6F250] font-bold">
                Extensibility & AI Tooling
              </span>
              <h2 className="mt-1 font-display text-xl sm:text-2xl font-bold text-white">
                MCP Tooling Directory
              </h2>
            </div>
            <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 font-mono text-xs text-zinc-300 font-bold">
              {MCP_SERVERS.length} Servers
            </span>
          </div>

          <div className="grid gap-3.5 sm:gap-4 md:grid-cols-2">
            {MCP_SERVERS.map((server, i) => (
              <motion.div
                key={server.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.04 * i }}
                whileHover={{ y: -4, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
                className="glass-panel-card p-4 sm:p-5 group hover:border-[#C6F250]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#C6F250] font-bold bg-[#C6F250]/10 px-2 py-0.5 rounded border border-[#C6F250]/20">
                      {server.namespace}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-[#C6F250]/30 bg-[#C6F250]/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#C6F250]">
                        HTTP
                      </span>
                      {server.hot && <HotBadge />}
                      <Stars count={server.stars} />
                    </div>
                  </div>
                  <h3 className="mt-2.5 font-display text-base font-bold text-white group-hover:text-[#C6F250] transition-colors">
                    {server.name}
                  </h3>
                  <p className="mt-1 font-sans text-xs leading-relaxed text-zinc-300">{server.description}</p>
                </div>
                <div className="mt-3.5 flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                  {server.tools.map((t) => (
                    <TagComponent key={t}>{t}</TagComponent>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <motion.div
          whileHover={{ scale: 1.01, transition: { duration: 0.3, ease: 'easeOut' } }}
          className="glass-panel-card p-6 sm:p-10 text-center border-white/15 shadow-2xl relative overflow-hidden"
        >
          <div className="relative z-10 max-w-xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C6F250]/30 bg-[#C6F250]/10 px-3.5 py-1 font-mono text-[10.5px] font-bold text-[#C6F250] mb-3">
              <Sparkles className="h-3 w-3" /> INSTANT SYNTHESIS
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              Ready to Mint Your Next Viral Memecoin?
            </h2>
            <p className="mt-2.5 text-xs sm:text-sm text-zinc-200 leading-relaxed">
              Input your one-line thought and let MORPHX generate the complete identity in under 2 seconds.
            </p>
            <div className="mt-6 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  playClick();
                  if (onNavigate) {
                    onNavigate('generate');
                  } else {
                    window.location.hash = '#generate';
                  }
                }}
                className="relative btn-brand-lime px-8 py-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(198,242,80,0.25)] overflow-hidden"
              >
                {/* Moving Sheen */}
                <motion.div
                  animate={{ x: ['-150%', '250%'] }}
                  transition={{ repeat: Infinity, repeatDelay: 0.8, duration: 2.8, ease: 'easeInOut' }}
                  className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/45 to-transparent skew-x-12 pointer-events-none"
                />
                <Sparkles className="h-4 w-4 relative z-10" />
                <span className="relative z-10">Launch Generator</span>
                <ArrowRight className="h-4 w-4 relative z-10" />
              </motion.button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}