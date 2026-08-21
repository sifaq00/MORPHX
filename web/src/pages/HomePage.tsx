import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Sparkles,
  ArrowRight,
  Rocket,
  TrendingUp,
  History,
  Zap,
  Check,
  Copy,
  Cpu,
  Layers,
  Terminal,
  Activity,
  Compass,
  FileText,
  Tag,
  Hash,
  Sparkle,
  Shuffle,
} from 'lucide-react';
import { Route } from '../hooks/useHashRoute';
import { loadConcepts } from '../lib/concepts';
import { FlipCounter } from '../components/FlipCounter';
import { Hero3DBackground } from '../components/Hero3DBackground';
import { playClick, playSuccessChime, playShuffle } from '../lib/sound-fx';

gsap.registerPlugin(ScrollTrigger);

const HEADLINE = 'Turn one idea into a launch-ready token.';
const SUBTEXT =
  'Type the idea. We handle the ticker, the name, the lore, and the pump.fun link. No roadmap. No promises. Just vibes.';

const CONTRACT_ADDRESS = 'HKxpGGAfN3dE7AjQrJXbxUPf3eeAmGC6kwiGFFVbpump';

const INSPIRATION_CHIPS = [
  'When in doubt, ape it out',
  'A cyborg frog in parallel universe',
  'Quantum AI trading speedcat',
  'The dog that forgot how to bark',
  'Pepe astronaut forging galactic yields',
  'Cyber monk finding enlightenment on Solana',
];

const PROMPT_SUGGESTIONS = [
  'A cyborg frog in a neon cyber diner…',
  'Quantum AI trading speedcat on Solana…',
  'When in doubt, ape it out…',
  'The dog that forgot how to bark…',
  'Pepe astronaut forging galactic yields…',
];

const TICKER_DEFAULTS = [
  { ticker: '$WAGMI', generatedFrom: 'When in doubt, ape it out.', vibeScore: 10 },
  { ticker: '$PEPE2', generatedFrom: 'Frog king returns to Solana', vibeScore: 10 },
  { ticker: '$QUANTUM', generatedFrom: 'Parallel timeline degen yields', vibeScore: 9 },
  { ticker: '$SPEEDCAT', generatedFrom: 'Fastest cat on Solana block', vibeScore: 10 },
  { ticker: '$CHAD', generatedFrom: 'Built different probably not', vibeScore: 10 },
  { ticker: '$POUNCE', generatedFrom: 'Autonomous Token Synthesizer', vibeScore: 10 },
  { ticker: '$CYBERDOGE', generatedFrom: 'Solana lightning velocity', vibeScore: 10 },
];

const MASCOT_ICONS = [
  '/mascots/mascot-cyber.png',
  '/mascots/mascot-crown.png',
  '/mascots/mascot-laser.png',
  '/mascots/mascot-astro.png',
  '/mascots/mascot-shades.png',
  '/mascots/mascot-ninja.png',
  '/mascots/mascot-default.png',
];

/**
 * 3D Parallax Tilt Card with Dynamic Cursor Specular Glare (60/120 FPS RAF Batched)
 */
function TiltCard({
  children,
  className = '',
  glare = true,
}: {
  children: React.ReactNode;
  className?: string;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
  const rafId = useRef<number | null>(null);

  const onEnter = () => {
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
  };

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || !rectRef.current) return;
    const r = rectRef.current;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      const x = (clientX - r.left) / r.width - 0.5;
      const y = (clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-3px)`;
      el.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`);
    });
  };

  const onLeave = () => {
    const el = ref.current;
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    rectRef.current = null;
    if (!el) return;
    el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)';
  };

  return (
    <div
      ref={ref}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`group relative transition-transform duration-200 ease-out will-change-transform ${className}`}
    >
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100 will-change-transform"
          style={{
            background: `radial-gradient(circle 280px at var(--mx, 50%) var(--my, 50%), rgba(198, 242, 80, 0.14), transparent 70%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}

/**
 * Interactive Heuristic Terminal Simulator for Bento Card 1
 */
function HeuristicTerminalVisual() {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    { ticker: '$QUANTUM', name: 'Parallel Degen AI', vibe: 10, idea: 'Multiverse trading cat' },
    { ticker: '$WAGMI', name: 'Infinite Ascend', vibe: 10, idea: 'When in doubt, ape it out' },
    { ticker: '$SPEEDCAT', name: 'Solana Mach 10', vibe: 9, idea: 'Fastest block sprint' },
    { ticker: '$PEPE2', name: 'Frog King Reborn', vibe: 10, idea: 'Cyber frog parallel matrix' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const current = steps[stepIndex];

  return (
    <div className="relative my-4 flex h-44 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-3.5 font-mono text-xs shadow-inner backdrop-blur-md">
      {/* Laser Scanning Line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#C6F250] to-transparent opacity-30 animate-pulse" />

      <div className="flex items-center justify-between border-b border-white/5 pb-2 text-[10.5px]">
        <div className="flex items-center gap-1.5 text-[#C6F250]">
          <Terminal className="h-3 w-3" />
          <span className="font-bold tracking-wider">SYNTHESIS ENGINE</span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C6F250] animate-ping" />
          <span className="text-[10px] font-semibold text-zinc-300">LIVE &lt;2s</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.ticker}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="space-y-2 py-1 text-left"
        >
          <div className="flex items-center gap-1.5 text-[11.5px] text-zinc-300">
            <span className="text-[#C6F250] font-bold">&gt;</span>
            <span className="truncate text-white font-medium">{current.idea}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-black/50 px-2.5 py-2 border border-white/10">
            <span className="font-display font-black text-[#C6F250] text-sm tracking-tight">
              {current.ticker}
            </span>
            <span className="text-[11px] text-white font-bold truncate max-w-[110px]">{current.name}</span>
            <span className="rounded bg-[#C6F250]/15 px-1.5 py-0.5 text-[9.5px] font-bold text-[#C6F250] border border-[#C6F250]/30">
              {current.vibe}/10
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1.5 border-t border-white/5 font-medium">
        <span>Prompt heuristic: OK</span>
        <span className="text-[#C6F250] font-bold">Deterministic 100%</span>
      </div>
    </div>
  );
}

/**
 * Interactive Orbital Radar for Bento Card 2
 */
function OrbitalRadarVisual() {
  return (
    <div className="relative my-4 flex h-44 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-2 shadow-inner backdrop-blur-md">
      {/* Ring 1: Outer Orbit Ring (Clockwise 360) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 14, ease: 'linear' }}
        className="absolute h-[130px] w-[130px] rounded-full border border-dashed border-white/20 flex items-center justify-center pointer-events-none"
      >
        {/* Node 1: Pounce Daemon Logo (12 o'clock - Exactly centered on stroke) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 14, ease: 'linear' }}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#121412] border-2 border-[#C6F250] shadow-[0_0_12px_rgba(198,242,80,0.7)] overflow-hidden p-0.5"
          >
            <img
              src="/logo.png"
              alt="Pounce Daemon"
              className="h-full w-full object-contain rounded-full"
              onError={(e) => {
                e.currentTarget.src = '/favicon.png';
              }}
            />
          </motion.div>
        </div>

        {/* Node 2: Pepe Avatar Badge (6 o'clock - Exactly centered on stroke) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 14, ease: 'linear' }}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#121412] border-2 border-[#C6F250] shadow-[0_0_12px_rgba(198,242,80,0.7)] overflow-hidden p-0.5"
          >
            <img
              src="/pepe-badge.png"
              alt="Pepe"
              className="h-full w-full object-cover rounded-full"
              onError={(e) => {
                e.currentTarget.src = '/logo.png';
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Ring 2: Inner Orbit Ring (Counter-Clockwise 360) */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 9, ease: 'linear' }}
        className="absolute h-[80px] w-[80px] rounded-full border border-dashed border-white/15 flex items-center justify-center pointer-events-none"
      >
        {/* Orbit Node 1: Rocket Launch (9 o'clock - Exactly centered on stroke) */}
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 9, ease: 'linear' }}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-[#121412] border border-[#00FFA3] shadow-[0_0_8px_rgba(0,255,163,0.6)]"
          >
            <Rocket className="h-2.5 w-2.5 text-[#00FFA3]" />
          </motion.div>
        </div>

        {/* Orbit Node 2: Sparkle Token (3 o'clock - Exactly centered on stroke) */}
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 9, ease: 'linear' }}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-[#121412] border border-[#C6F250] shadow-[0_0_8px_rgba(198,242,80,0.6)]"
          >
            <Sparkles className="h-2.5 w-2.5 text-[#C6F250]" />
          </motion.div>
        </div>
      </motion.div>

      {/* Center Fixed Stationary Launch Capsule (Does NOT spin) */}
      <motion.div
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        onClick={playSuccessChime}
        className="relative z-20 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-white/20 bg-black/80 px-2.5 py-1 shadow-lg backdrop-blur-md transition-all hover:border-[#C6F250] hover:shadow-[0_0_16px_rgba(198,242,80,0.4)] select-none"
      >
        <span className="font-display text-[10px] font-black text-[#C6F250] tracking-tight">pump.fun</span>
        <span className="font-mono text-[7px] uppercase tracking-wider text-white font-bold bg-[#C6F250]/20 px-1 py-0.2 rounded mt-0.5 border border-[#C6F250]/30">
          Pre-filled ✓
        </span>
      </motion.div>
    </div>
  );
}

/**
 * Interactive 4-Pin Matrix for Bento Card 3
 */
function ProofMatrixVisual() {
  const [activePin, setActivePin] = useState<string | null>(null);

  const pins = [
    { id: 'ticker', label: '$WAGMI', icon: Hash, desc: 'Memetic Ticker' },
    { id: 'name', label: 'Ape Out', icon: Tag, desc: 'Verified Name' },
    { id: 'tagline', label: 'Never Fade', icon: Sparkle, desc: 'Viral Hook' },
    { id: 'lore', label: 'Degen Lore', icon: FileText, desc: 'On-chain Story' },
  ];

  return (
    <div className="relative my-4 flex h-44 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-3 font-mono text-xs shadow-inner backdrop-blur-md">
      <div className="flex items-center justify-between text-[10px] border-b border-white/5 pb-1.5 font-bold">
        <span className="text-zinc-300">4-CORNER MATRIX</span>
        <span className="text-[#C6F250]">Hover to Inspect</span>
      </div>

      {/* 4 Interactive Floating Micro Pins */}
      <div className="grid grid-cols-2 gap-2 my-1">
        {pins.map((p) => {
          const Icon = p.icon;
          const isActive = activePin === p.id;
          return (
            <motion.div
              key={p.id}
              onMouseEnter={() => {
                playClick();
                setActivePin(p.id);
              }}
              onMouseLeave={() => setActivePin(null)}
              whileHover={{ scale: 1.04 }}
              className={`flex cursor-pointer items-center gap-1.5 rounded-lg border p-1.5 text-left transition-all ${
                isActive
                  ? 'border-[#C6F250] bg-[#C6F250]/20 shadow-[0_0_10px_rgba(198,242,80,0.3)] text-[#C6F250]'
                  : 'border-white/10 bg-black/50 text-white hover:border-white/30'
              }`}
            >
              <Icon className={`h-3 w-3 shrink-0 ${isActive ? 'text-[#C6F250]' : 'text-zinc-400'}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[10.5px] font-bold text-white">{p.label}</p>
                <p className="truncate text-[8.5px] text-zinc-400">{p.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[9.5px] text-zinc-400 pt-1 border-t border-white/5 font-medium">
        <span>Canvas Pin Status:</span>
        <span className="text-[#C6F250] font-bold">100% Pinned</span>
      </div>
    </div>
  );
}

export function HomePage({ onNavigate }: { onNavigate: (r: Route) => void }) {
  const [concepts, setConcepts] = useState(() => loadConcepts());
  const [mounted, setMounted] = useState(false);
  const [copiedCa, setCopiedCa] = useState(false);
  const [heroPrompt, setHeroPrompt] = useState('');
  const [chipItems, setChipItems] = useState(INSPIRATION_CHIPS);
  const [placeholderText, setPlaceholderText] = useState('');

  // DOM Refs for GSAP ScrollTrigger Parallax
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Live Typewriter Effect for Hero Prompt Bar
  useEffect(() => {
    let suggestionIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId: number;

    const typeLoop = () => {
      const current = PROMPT_SUGGESTIONS[suggestionIndex];

      if (!isDeleting) {
        setPlaceholderText(current.slice(0, charIndex + 1));
        charIndex++;
        if (charIndex === current.length) {
          isDeleting = true;
          timeoutId = window.setTimeout(typeLoop, 2400); // pause at full prompt
          return;
        }
        timeoutId = window.setTimeout(typeLoop, 45); // typing speed
      } else {
        setPlaceholderText(current.slice(0, charIndex - 1));
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          suggestionIndex = (suggestionIndex + 1) % PROMPT_SUGGESTIONS.length;
          timeoutId = window.setTimeout(typeLoop, 450); // pause before next prompt
          return;
        }
        timeoutId = window.setTimeout(typeLoop, 25); // deletion speed
      }
    };

    timeoutId = window.setTimeout(typeLoop, 900);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    setMounted(true);
    const sync = () => setConcepts(loadConcepts());
    window.addEventListener('storage', sync);
    
    const rafId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      window.removeEventListener('storage', sync);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Smooth, Non-Warping GSAP ScrollTrigger Parallax
  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Stats Telemetry: Symmetrical Card Entrance & Smooth Depth
      if (statsRef.current) {
        const statsCards = statsRef.current.querySelectorAll('.stats-tilt-card');
        gsap.from(statsCards, {
          y: 20,
          opacity: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        });
      }

      // 3. Bento Superpower Grid: Symmetrical Reveal & Depth
      if (bentoRef.current) {
        const bentoItems = bentoRef.current.querySelectorAll('.bento-tilt-card');
        gsap.from(bentoItems, {
          y: 25,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: bentoRef.current,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });
      }

      // 5. Massive Bottom CTA Horizon: Clean Reveal
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { y: 35, opacity: 0.7 },
          {
            y: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 90%',
              end: 'bottom 85%',
              scrub: 1,
            },
          }
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const totalVibe = concepts.reduce((acc, c) => acc + (c.vibeScore || 0), 0);
  const top = [...concepts].sort((a, b) => (b.vibeScore || 0) - (a.vibeScore || 0))[0];

  const handleCopyCa = async () => {
    playSuccessChime();
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS);
      setCopiedCa(true);
      setTimeout(() => setCopiedCa(false), 2000);
    } catch {
      setCopiedCa(false);
    }
  };

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    const finalPrompt = heroPrompt.trim() || placeholderText.replace('…', '');
    if (finalPrompt) {
      sessionStorage.setItem('pounce-initial-idea', finalPrompt);
    }
    onNavigate('generate');
  };

  const handleChipClick = (prompt: string) => {
    playShuffle();
    sessionStorage.setItem('pounce-initial-idea', prompt);
    onNavigate('generate');
  };

  const handleShuffleChips = () => {
    playShuffle();
    setChipItems((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  return (
    <div ref={pageRef} className="relative z-10 px-3.5 sm:px-6 md:px-8 pt-20 sm:pt-24 pb-16">
      <div className="mx-auto max-w-5xl xl:max-w-6xl text-center relative">
        
        <div ref={heroRef} className="will-change-transform relative py-1">
          {/* Three.js 3D Cyber Constellation Background */}
          <Hero3DBackground />

          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.05 }}
            onClick={handleCopyCa}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group mb-4 inline-flex max-w-full cursor-pointer items-center gap-2 sm:gap-2.5 rounded-full border border-white/20 bg-black/50 px-2.5 sm:px-3.5 py-1.5 font-mono text-[10.5px] sm:text-[12px] shadow-lg backdrop-blur-md transition-all hover:border-[#C6F250]/70 hover:bg-black/70 hover:shadow-[0_0_20px_rgba(198,242,80,0.25)]"
          >
            {/* Neon CA Pill Label */}
            <span className="flex items-center gap-1 rounded-full bg-[#C6F250] px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#0A0D06] shadow-[0_0_8px_rgba(198,242,80,0.4)] shrink-0">
              <Sparkles className="h-2.5 w-2.5 fill-current" />
              CA
            </span>

            {/* High-Contrast Contract Address (Responsive truncate) */}
            <span className="max-w-[130px] sm:max-w-[260px] md:max-w-none truncate font-mono font-bold tracking-wide text-white group-hover:text-[#E8FFA6]">
              {CONTRACT_ADDRESS}
            </span>

            {/* Interactive Copy Feedback Action */}
            {copiedCa ? (
              <span className="flex items-center gap-1 rounded-full bg-[#00FFA3] px-2 py-0.5 text-[10px] font-bold text-black shadow-[0_0_12px_rgba(0,255,163,0.8)] animate-pulse shrink-0">
                <Check className="h-3 w-3 stroke-[3]" /> Copied!
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/80 transition-all group-hover:bg-[#C6F250] group-hover:text-black group-hover:font-bold shrink-0">
                <Copy className="h-2.5 w-2.5" />
                Copy
              </span>
            )}
          </motion.div>

          {/* Hero Title with Space Grotesk Bold & Snug Tight Line-Height */}
          <h1 className="font-display text-[clamp(30px,5.4vw,68px)] font-extrabold leading-[1.0] sm:leading-[0.98] tracking-tight sm:-tracking-[0.02em] text-white relative z-10 select-none [text-shadow:_0_2px_10px_rgba(0,0,0,0.55)]">
            <motion.span
              initial={{ opacity: 0, y: 22 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="inline-block mr-1.5 sm:mr-0 text-white"
            >
              Turn one idea into a
            </motion.span>
            <br className="hidden sm:inline" />
            <motion.span
              initial={{ opacity: 0, y: 22 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.28 }}
              className="inline-block text-[#C6F250] font-black [text-shadow:_0_2px_10px_rgba(0,0,0,0.55),_0_0_12px_rgba(198,242,80,0.25)]"
            >
              launch-ready token.
            </motion.span>
          </h1>

          {/* Hero Subtitle (Clean & Subtle Shadow) */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.42 }}
            className="mx-auto mt-4 max-w-xl text-xs sm:text-base leading-relaxed text-zinc-200 font-medium relative z-10 [text-shadow:_0_1px_6px_rgba(0,0,0,0.5)] px-2"
          >
            {SUBTEXT}
          </motion.p>

          {/* Hero Interactive Quick Prompt Bar with Scanning Laser Accent */}
          <motion.form
            onSubmit={handleHeroSubmit}
            initial={{ opacity: 0, y: 18 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.56 }}
            className="relative mx-auto mt-6 flex max-w-xl items-center rounded-2xl border border-white/20 bg-black/55 p-1.5 sm:p-2 shadow-2xl backdrop-blur-md transition-all focus-within:border-[#C6F250] focus-within:bg-black/75 focus-within:shadow-[0_0_28px_rgba(198,242,80,0.25)] overflow-hidden z-10 w-full"
          >
            {/* Subtle Ambient Laser Edge Pulse */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#C6F250]/60 to-transparent opacity-60 animate-pulse" />

            <div className="flex items-center gap-1.5 sm:gap-2 pl-2 sm:pl-3 text-[#C6F250]">
              <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 animate-pulse" />
            </div>
            <input
              type="text"
              value={heroPrompt}
              onChange={(e) => setHeroPrompt(e.target.value)}
              placeholder={placeholderText || 'Type one line idea (e.g. Ape who never fades)…'}
              className="flex-1 bg-transparent px-2 sm:px-3 py-2 text-xs sm:text-sm text-white placeholder:text-zinc-400 placeholder:transition-opacity outline-none font-sans min-w-0"
            />
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              className="btn-brand-lime flex items-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs font-bold shrink-0 shadow-[0_0_15px_rgba(198,242,80,0.3)]"
            >
              <span>Forge</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.button>
          </motion.form>

          {/* Quick Inspiration Chips with Shuffle Action */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.70 }}
            className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
          >
            <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] font-bold text-[#C6F250]">
              <span>Need spark?</span>
              <motion.button
                whileHover={{ rotate: 180, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShuffleChips}
                title="Shuffle prompt sparks"
                className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-[#C6F250] hover:text-black transition-all"
              >
                <Shuffle className="h-2.5 w-2.5" />
              </motion.button>
            </div>

            <AnimatePresence>
              {chipItems.slice(0, 4).map((chip) => (
                <motion.button
                  key={chip}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => handleChipClick(chip)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full border border-white/20 bg-black/60 px-2.5 sm:px-3.5 py-1 sm:py-1.5 font-mono text-[10px] sm:text-[11px] font-medium text-white shadow-md transition-all hover:border-[#C6F250]/70 hover:bg-black/80 hover:text-[#E8FFA6]"
                >
                  “{chip}”
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* =========================================================================
            SECTION 2: STATS TELEMETRY (Strictly Symmetrical & Aligned Grid)
           ========================================================================= */}
        <div ref={statsRef} className="mt-8 sm:mt-10 grid gap-4 sm:grid-cols-3 items-stretch">
          <div className="stats-tilt-card h-full">
            <TiltCard className="glass-panel-card p-5 text-left border-white/15 hover:border-white/30 h-full flex flex-col justify-between">
              <div>
                <History className="h-4 w-4 text-[#C6F250]" />
                <FlipCounter
                  value={concepts.length}
                  fontSize={36}
                  className="mt-2 block text-[#C6F250] font-bold"
                  label={`${concepts.length} concepts generated`}
                />
              </div>
              <p className="mt-1 font-sans text-xs uppercase tracking-wider text-zinc-400 font-semibold">Concepts generated</p>
            </TiltCard>
          </div>

          <div className="stats-tilt-card h-full">
            <TiltCard className="glass-panel-card p-5 text-left border-white/15 hover:border-white/30 h-full flex flex-col justify-between">
              <div>
                <TrendingUp className="h-4 w-4 text-[#C6F250]" />
                <FlipCounter
                  value={totalVibe}
                  fontSize={36}
                  className="mt-2 block text-[#C6F250] font-bold"
                  label={`${totalVibe} total vibe score`}
                />
              </div>
              <p className="mt-1 font-sans text-xs uppercase tracking-wider text-zinc-400 font-semibold">Total vibe score</p>
            </TiltCard>
          </div>

          <div className="stats-tilt-card h-full">
            <TiltCard className="glass-panel-card p-5 text-left border-white/15 hover:border-white/30 h-full flex flex-col justify-between">
              <div>
                <Rocket className="h-4 w-4 text-[#C6F250]" />
                <p className="mt-2 truncate font-display text-2xl sm:text-3xl font-extrabold text-white">
                  {top ? top.ticker : '—'}
                </p>
              </div>
              <p className="truncate font-sans text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                {top ? `Top: ${top.name}` : 'No concepts yet'}
              </p>
            </TiltCard>
          </div>
        </div>

        {/* Continuous Live Marquee Ticker Feed */}
        <div className="ticker-mask mt-6 sm:mt-8 py-3.5 border-y border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              repeat: Infinity,
              ease: 'linear',
              duration: 22,
            }}
            className="flex gap-8 whitespace-nowrap font-mono w-max will-change-transform"
          >
            {[
              ...(concepts.length > 0 ? concepts : TICKER_DEFAULTS),
              ...TICKER_DEFAULTS,
              ...(concepts.length > 0 ? concepts : TICKER_DEFAULTS),
              ...TICKER_DEFAULTS,
            ].map((c, idx) => {
              const mascotImg = MASCOT_ICONS[idx % MASCOT_ICONS.length];
              return (
                <span key={`${c.ticker}-${idx}`} className="flex items-center gap-2.5 shrink-0 select-none">
                  {/* Raw Dynamic Pixel Mascot Icon (Enlarged & High Visibility) */}
                  <img
                    src={mascotImg}
                    alt="Pounce Mascot"
                    className="h-7 w-7 sm:h-8 sm:w-8 object-contain shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                    onError={(e) => {
                      e.currentTarget.src = '/logo.png';
                    }}
                  />
                  <span className="font-display font-extrabold text-white tracking-tight text-sm">{c.ticker}</span>
                  <span className="text-[#C6F250] text-[10.5px] font-bold bg-[#C6F250]/15 border border-[#C6F250]/30 px-1.5 py-0.5 rounded">
                    Forged ✓
                  </span>
                  <span className="text-zinc-300 text-[11px] font-medium tabular-nums">Vibe {c.vibeScore || 10}/10</span>
                  <span className="text-white/30 font-bold">///</span>
                </span>
              );
            })}
          </motion.div>
        </div>

        {/* =========================================================================
            SECTION 3: CORE SUPERPOWERS (Strictly Aligned Symmetrical Bento Grid)
           ========================================================================= */}
        <div ref={bentoRef} className="mt-12 sm:mt-14 text-left">
          <div className="mb-6 text-center sm:text-left">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#C6F250] font-bold">
              — ARCHITECTURE & SUPERPOWERS
            </p>
            <h2 className="mt-2 font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Engineered for Pure Meme Velocity
            </h2>
            <p className="mt-1.5 max-w-xl font-sans text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Deterministic AI synthesis, instant pump.fun payloading, and visual 4-pin proof matrix.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3 items-stretch">
            {/* Bento Card 1: Autonomous Synthesis */}
            <div className="bento-tilt-card h-full">
              <TiltCard className="glass-panel-card p-6 flex flex-col justify-between border-white/15 hover:border-white/30 h-full">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#C6F250] shadow-sm">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-[10px] text-[#C6F250] font-bold bg-[#C6F250]/15 px-2 py-0.5 rounded-full border border-[#C6F250]/30">
                      &lt; 2S SPEED
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-white">
                    Autonomous Synthesis
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-zinc-300">
                    Smart heuristics forge viral ticker, full name, lore, and 1–10 vibe score.
                  </p>

                  {/* Live Animated Terminal Simulator */}
                  <HeuristicTerminalVisual />
                </div>
                <div className="mt-2 border-t border-white/10 pt-3 flex items-center justify-between font-mono text-[11px] text-zinc-400">
                  <span className="text-zinc-400">Pipeline</span>
                  <span className="font-bold text-[#C6F250]">Deterministic</span>
                </div>
              </TiltCard>
            </div>

            {/* Bento Card 2: 1-Click pump.fun Launch */}
            <div className="bento-tilt-card h-full">
              <TiltCard className="glass-panel-card p-6 flex flex-col justify-between border-white/15 hover:border-white/30 h-full">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#C6F250] shadow-sm">
                      <Rocket className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-[10px] text-[#00FFA3] font-bold bg-[#00FFA3]/15 px-2 py-0.5 rounded-full border border-[#00FFA3]/30">
                      PRE-FILLED
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-white">
                    1-Click pump.fun Launch
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-zinc-300">
                    Direct deep-link integration pre-fills symbol, name, and description.
                  </p>

                  {/* Live Animated Orbital Radar */}
                  <OrbitalRadarVisual />
                </div>
                <div className="mt-2 border-t border-white/10 pt-3 flex items-center justify-between font-mono text-[11px] text-zinc-400">
                  <span className="text-zinc-400">Launchpad</span>
                  <span className="font-bold text-[#00FFA3]">Zero Friction</span>
                </div>
              </TiltCard>
            </div>

            {/* Bento Card 3: 4-Pin Matrix */}
            <div className="bento-tilt-card h-full">
              <TiltCard className="glass-panel-card p-6 flex flex-col justify-between border-white/15 hover:border-white/30 h-full">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#C6F250] shadow-sm">
                      <Layers className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-[10px] text-[#C6F250] font-bold bg-[#C6F250]/15 px-2 py-0.5 rounded-full border border-[#C6F250]/30">
                      4-PIN PROOF
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-white">
                    4-Pin Proof Matrix
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-zinc-300">
                    Visual floating pins previewing Ticker, Name, Tagline, and Lore.
                  </p>

                  {/* Live Interactive 4-Pin Canvas */}
                  <ProofMatrixVisual />
                </div>
                <div className="mt-2 border-t border-white/10 pt-3 flex items-center justify-between font-mono text-[11px] text-zinc-400">
                  <span className="text-zinc-400">Architecture</span>
                  <span className="font-bold text-[#C6F250]">4 Verified Pins</span>
                </div>
              </TiltCard>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 4: MASSIVE BOTTOM CTA HORIZON (Neutral Frosted Glass)
           ========================================================================= */}
        <div
          ref={ctaRef}
          className="glass-panel-card mt-12 sm:mt-14 p-6 sm:p-10 md:p-12 text-center relative overflow-hidden border-white/15 shadow-2xl will-change-transform"
        >
          <div className="relative z-10 mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C6F250]/30 bg-[#C6F250]/10 px-3.5 py-1 font-mono text-[10px] sm:text-[10.5px] font-bold text-[#C6F250]">
              <Sparkles className="h-3 w-3" /> READY FOR TAKE OFF
            </span>

            <h2 className="mt-4 font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Turn your wildest idea into the next viral meme token.
            </h2>

            <p className="mt-3 sm:mt-4 text-xs sm:text-base text-zinc-300 leading-relaxed">
              No technical barriers. No designer required. Generate complete identity, logo prompts, lore, and launch directly on pump.fun in seconds.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  playClick();
                  onNavigate('generate');
                }}
                className="btn-brand-lime flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 text-xs sm:text-sm font-bold shadow-lg w-full sm:w-auto"
              >
                <Zap className="h-4 w-4" />
                <span>Launch Generator Now</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  playClick();
                  onNavigate('how-it-works');
                }}
                className="btn-dark-pill flex items-center justify-center px-6 py-3.5 text-xs font-semibold w-full sm:w-auto"
              >
                How It Works
              </motion.button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}