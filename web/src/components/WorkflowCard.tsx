import { useState } from 'react';
import { Token } from '../pages/GeneratePage';

type Props = {
  className?: string;
  token?: Token | null;
};

const STEPS = [
  { n: 'Idea', text: 'Your one line input' },
  { n: 'Generate', text: 'We craft the full concept' },
  { n: 'Launch', text: 'Take it to pump.fun' },
];

export function WorkflowCard({ className, token }: Props) {
  const [downloaded, setDownloaded] = useState(false);

  const download = () => {
    if (!token) return;
    const blob = new Blob([JSON.stringify(token, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${token.ticker.replace('$', '') || 'token'}-concept.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <section className={`rounded-2xl border border-line bg-[#151922] p-6 ${className ?? ''}`}>
      <p className="font-mono text-[10px] uppercase tracking-widest text-mint">Your Token Concept</p>
      <h3 className="mt-1 font-display text-2xl font-semibold text-white">One sentence. Infinite possibilities.</h3>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {STEPS.map((step) => (
          <div key={step.n} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-mint">{step.n}</p>
            <p className="mt-1 text-sm text-paper/60">{step.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={download}
          disabled={!token}
          className="rounded-full bg-mint px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {downloaded ? 'Downloaded!' : 'Download Concept'}
        </button>
        <p className="self-center font-mono text-xs text-paper/40">JSON file with everything you need.</p>
      </div>
    </section>
  );
}