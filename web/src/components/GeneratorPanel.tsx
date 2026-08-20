import { useState } from 'react';
import { Lightbulb, Sparkles, Dices, ChevronRight, Rocket, ExternalLink } from 'lucide-react';

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
  setIdea: (v: string) => void;
  status: 'idle' | 'loading' | 'error';
  onGenerate: (idea: string) => void;
};

export function GeneratorPanel({ idea, setIdea, status, onGenerate }: Props) {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const pickRandom = () => {
    const pool = [
      ...INSPIRATIONS,
      'A token for the ones who never shut up about crypto at parties.',
      'An AI that only trades on vibes, literally.',
      'A meme coin for people who sold too early. Again.',
      'The coin for people who read the whole whitepaper. Nobody.',
    ];
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setIdea(picked);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Card 1: ONE LINE IDEA */}
      <aside className="glass-panel-card p-5">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-[#C6E07A]" />
          <span className="font-sans text-[13.5px] font-extrabold uppercase tracking-[0.06em] text-[#C6E07A]">
            ONE LINE IDEA
          </span>
        </div>

        <p className="mt-2 text-xs leading-relaxed text-[#A8C27E]">
          Give us the idea. One sentence is enough: a mood, a meme, a headline.
        </p>

        <div className="mt-3.5 rounded-xl border border-white/10 bg-[#0B0F07]/90 p-3.5 shadow-inner transition-all focus-within:border-[#C6F250]/60 focus-within:ring-1 focus-within:ring-[#C6F250]/40">
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
          <div className="mt-1 text-right font-mono text-[11px] text-[#A8C27E]/60 select-none">
            {idea.length} / {MAX_LENGTH}
          </div>
        </div>

        <div className="mt-3.5 flex flex-col gap-2.5">
          <button
            onClick={() => onGenerate(idea || 'When in doubt, ape it out.')}
            disabled={status === 'loading'}
            className="btn-brand-lime w-full py-3 px-4 text-center font-sans text-sm font-bold flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>{status === 'loading' ? 'Generating…' : 'Generate Concept'}</span>
          </button>

          <button
            onClick={pickRandom}
            disabled={status === 'loading'}
            className="btn-dark-pill w-full py-2.5 px-4 text-center font-sans text-xs font-semibold flex items-center justify-center gap-2"
          >
            <Dices className="h-4 w-4" />
            <span>Random Idea</span>
          </button>
        </div>
      </aside>

      {/* Card 2: NEED INSPIRATION? */}
      <aside className="glass-panel-card p-5">
        <p className="font-sans text-[11px] uppercase tracking-[0.06em] text-[#C6E07A] font-bold">
          NEED INSPIRATION?
        </p>
        <div className="mt-2.5 divide-y divide-white/5">
          {INSPIRATIONS.map((item) => (
            <button
              key={item}
              onClick={() => setIdea(item)}
              className="group flex w-full items-center justify-between py-2.5 text-left font-sans text-xs text-[#D8DFD0] transition hover:text-[#C6E07A]"
            >
              <div className="flex items-center gap-2">
                <span className="text-[#A8C27E]">•</span>
                <span>{item}</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-white/40 transition group-hover:translate-x-0.5 group-hover:text-[#C6E07A]" />
            </button>
          ))}
        </div>
      </aside>

      {/* Card 3: Launch on pump.fun */}
      <a
        href="https://pump.fun/create"
        target="_blank"
        rel="noopener noreferrer"
        className="glass-panel-card p-4 flex items-start gap-3 transition hover:border-[#C6F250]/40 group block"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#C6F250]/15 text-[#C6F250] group-hover:scale-105 transition">
          <Rocket className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-1 font-sans text-xs font-bold text-white group-hover:text-[#C6F250] transition">
            <span>Launch on pump.fun</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-[#A8C27E]">
            Generate your token concept and launch it directly on pump.fun in one click.
          </p>
        </div>
      </a>

      {toast && (
        <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full border border-[#C6F250]/30 bg-[#0B0F07]/95 px-6 py-3 font-mono text-xs text-[#C6F250] shadow-2xl backdrop-blur-md">
          {toast}
        </div>
      )}
    </div>
  );
}
