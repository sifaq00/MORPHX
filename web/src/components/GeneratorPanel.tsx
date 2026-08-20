import { useState } from 'react';

const MAX_LENGTH = 120;

const INSPIRATIONS = [
  'When in doubt, ape it out.',
  'Exit liquidity? No, I am.',
  'Built different, Probably not.',
  'One more candle won\'t hurt.',
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
    const pool = [...INSPIRATIONS, 'A token for the ones who never shut up about crypto at parties.', 'An AI that only trades on vibes, literally.', 'A meme coin for people who sold too early. Again.', 'The coin for people who read the whole whitepaper. Nobody.'];
    setIdea(pool[Math.floor(Math.random() * pool.length)]);
  };

  const copy = async (text: string, msg: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(msg);
    } catch {
      showToast('Copy failed — select and copy manually.');
    }
  };

  return (
    <aside className="rounded-2xl border border-line bg-[#151922] p-5">
      <label htmlFor="idea" className="font-mono text-xs uppercase tracking-widest text-paper/50">
        One Line Idea
      </label>
      <p className="mt-1 text-xs text-paper/40">
        Give us the idea. One sentence is enough: a mood, a meme, a headline.
      </p>
      <textarea
        id="idea"
        value={idea}
        onChange={(e) => setIdea(e.target.value.slice(0, MAX_LENGTH))}
        placeholder="When in doubt, ape it out."
        rows={3}
        maxLength={MAX_LENGTH}
        className="mt-3 w-full resize-none rounded-lg border border-line bg-transparent px-4 py-3 font-body text-base text-paper placeholder:text-paper/30"
      />
      <div className="mt-1 text-right font-mono text-xs text-paper/40">
        {idea.length} / {MAX_LENGTH}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => onGenerate(idea)}
          disabled={status === 'loading' || !idea.trim()}
          className="flex-1 rounded-full bg-mint px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === 'loading' ? 'Generating…' : 'Generate Concept'}
        </button>
        <button
          onClick={pickRandom}
          disabled={status === 'loading'}
          className="rounded-full border border-white/20 px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-white/70 transition hover:border-mint hover:text-mint disabled:opacity-40"
        >
          Random Idea
        </button>
      </div>

      <div className="mt-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-paper/40">Need Inspiration?</p>
        <ul className="mt-2 space-y-1">
          {INSPIRATIONS.map((item) => (
            <li key={item}>
              <button
                onClick={() => setIdea(item)}
                className="group flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-paper/60 transition hover:bg-white/5 hover:text-mint"
              >
                <span className="text-mint opacity-0 transition group-hover:opacity-100">→</span>
                <span>{item}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-xl border border-mint/20 bg-mint/5 p-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-mint">Launch on pump.fun</p>
        <p className="mt-1 text-xs leading-relaxed text-paper/50">
          Generate your token concept and launch it directly on pump.fun in one click.
        </p>
      </div>

      {toast && (
        <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full border border-mint/30 bg-[#151922]/95 px-6 py-3 font-mono text-xs text-mint shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md">
          {toast}
        </div>
      )}

      <p className="sr-only">Inspiration and launch helper panel</p>
      {/* keep copy() available for future use (ponytail: only used when needed) */}
    </aside>
  );
}
