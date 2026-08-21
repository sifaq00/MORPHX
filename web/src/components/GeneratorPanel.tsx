import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Sparkles, Dices, ChevronRight, Rocket, ExternalLink } from 'lucide-react';
import { playClick, playShuffle } from '../lib/sound-fx';

const MAX_LENGTH = 120;

const INSPIRATIONS = [
  'When in doubt, ape it out.',
  'Exit liquidity? No, I am.',
  'Built different. Probably not.',
  'One more candle won’t hurt.',
  'This is financial advice.',
];

type Props = {
  idea: string;
  setIdea: (val: string) => void;
  status: 'idle' | 'loading' | 'error';
  onGenerate: (prompt: string) => void;
};

export function GeneratorPanel({ idea, setIdea, status, onGenerate }: Props) {
  const [toast, setToast] = useState<string | null>(null);
  const [diceRotation, setDiceRotation] = useState(0);
  const [isTypingEffect, setIsTypingEffect] = useState(false);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const animateTextChange = (targetText: string) => {
    setIsTypingEffect(true);
    let i = 0;
    setIdea('');
    const interval = setInterval(() => {
      i += 3;
      if (i >= targetText.length) {
        setIdea(targetText);
        setIsTypingEffect(false);
        clearInterval(interval);
      } else {
        setIdea(targetText.slice(0, i));
      }
    }, 15);
  };

  const pickRandom = () => {
    playShuffle();
    setDiceRotation((prev) => prev + 360);
    const pool = [
      ...INSPIRATIONS,
      'A token for the ones who never shut up about crypto at parties.',
      'An AI that only trades on vibes, literally.',
      'A meme coin for people who sold too early. Again.',
      'The coin for people who read the whole whitepaper. Nobody.',
    ];
    const picked = pool[Math.floor(Math.random() * pool.length)];
    animateTextChange(picked);
  };

  const handleSelectInspiration = (item: string) => {
    playClick();
    animateTextChange(item);
  };

  const handleGenerateClick = () => {
    playClick();
    onGenerate(idea || 'When in doubt, ape it out.');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col gap-4"
    >
      {/* Card 1: ONE LINE IDEA */}
      <aside className="glass-panel-card p-5 relative overflow-hidden transition-shadow hover:shadow-[0_20px_40px_rgba(0,0,0,0.55)]">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, repeatDelay: 6, duration: 1 }}
          >
            <Lightbulb className="h-4 w-4 text-[#C6E07A]" />
          </motion.div>
          <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#C6E07A]">
            ONE LINE IDEA
          </span>
        </div>

        <p className="mt-2 text-xs leading-relaxed text-[#A8C27E]">
          Give us the idea. One sentence is enough: a mood, a meme, a headline.
        </p>

        <div className="mt-3.5 rounded-xl border border-white/10 bg-[#0B0F07]/90 p-3.5 shadow-inner transition-all focus-within:border-[#C6F250]/70 focus-within:shadow-[0_0_15px_rgba(198,242,80,0.2)]">
          <textarea
            id="idea"
            value={idea}
            onChange={(e) => setIdea(e.target.value.slice(0, MAX_LENGTH))}
            placeholder="When in doubt,&#10;ape it out."
            rows={4}
            maxLength={MAX_LENGTH}
            className="w-full resize-none bg-transparent font-sans text-[13.5px] leading-relaxed text-white placeholder:text-white/35 outline-none focus:outline-none focus:ring-0 border-none scrollbar-none"
            style={{ outline: 'none', boxShadow: 'none' }}
          />
          <div className="mt-1 flex items-center justify-between text-right font-mono text-[11px] text-[#A8C27E]/60 select-none tabular-nums">
            <span className="text-[10px] text-[#A8C27E]/40">
              {isTypingEffect ? '⚡ generating prompt…' : ''}
            </span>
            <span>{idea.length} / {MAX_LENGTH}</span>
          </div>
        </div>

        <div className="mt-3.5 flex flex-col gap-2.5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGenerateClick}
            disabled={status === 'loading'}
            className="btn-brand-lime w-full py-3 px-4 text-center font-display text-sm font-extrabold uppercase tracking-wide flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50 relative overflow-hidden group shadow-[0_0_20px_rgba(198,242,80,0.25)]"
          >
            {/* Idle Sheen Light Sweep Animation */}
            {status !== 'loading' && (
              <motion.div
                animate={{ x: ['-150%', '250%'] }}
                transition={{ repeat: Infinity, repeatDelay: 3.5, duration: 1.2, ease: 'easeInOut' }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-12 pointer-events-none"
              />
            )}
            <motion.div
              animate={{
                rotate: 360,
                scale: status === 'loading' ? [1, 1.2, 1] : [1, 1.12, 1],
              }}
              transition={{
                rotate: {
                  repeat: Infinity,
                  duration: status === 'loading' ? 0.8 : 6,
                  ease: 'linear',
                },
                scale: {
                  repeat: Infinity,
                  duration: status === 'loading' ? 0.8 : 3,
                  ease: 'easeInOut',
                },
              }}
              className="text-[#0D1208]"
            >
              <Sparkles className="h-4 w-4" />
            </motion.div>
            <span>{status === 'loading' ? 'Forging Concept…' : 'Generate Concept'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={pickRandom}
            disabled={status === 'loading'}
            className="btn-dark-pill w-full py-2.5 px-4 text-center font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <motion.div
              animate={{ rotate: diceRotation }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <Dices className="h-4 w-4" />
            </motion.div>
            <span>Random Idea</span>
          </motion.button>
        </div>
      </aside>

      {/* Card 2: NEED INSPIRATION? */}
      <aside className="glass-panel-card p-5">
        <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#C6E07A]">
          NEED INSPIRATION?
        </p>
        <div className="mt-2.5 divide-y divide-white/5">
          {INSPIRATIONS.map((item) => (
            <motion.button
              key={item}
              whileHover={{ x: 4 }}
              onClick={() => handleSelectInspiration(item)}
              className="group flex w-full items-center justify-between py-2.5 text-left font-sans text-xs text-[#D8DFD0] transition-colors hover:text-[#C6E07A]"
            >
              <div className="flex items-center gap-2">
                <span className="text-[#A8C27E] transition-transform group-hover:scale-125">•</span>
                <span>{item}</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-[#C6E07A]" />
            </motion.button>
          ))}
        </div>
      </aside>

      {/* Card 3: Launch on pump.fun */}
      <motion.a
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        href="https://pump.fun/create"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => playClick()}
        className="glass-panel-card p-4 flex items-start gap-3 transition-colors hover:border-[#C6F250]/40 group block"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#C6F250]/15 text-[#C6F250] group-hover:scale-110 transition-transform">
          <Rocket className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-1 font-sans text-xs font-bold text-white group-hover:text-[#C6F250] transition-colors">
            <span>Launch on pump.fun</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-[#A8C27E]">
            Generate your token concept and launch it directly on pump.fun in one click.
          </p>
        </div>
      </motion.a>

      {toast && (
        <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full border border-[#C6F250]/30 bg-[#0B0F07]/95 px-6 py-3 font-mono text-xs text-[#C6F250] shadow-2xl backdrop-blur-md">
          {toast}
        </div>
      )}
    </motion.div>
  );
}
