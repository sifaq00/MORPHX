import { useState } from 'react';
import { Token } from '../pages/GeneratePage';

type Props = {
  token: Token | null;
  status: 'idle' | 'loading' | 'error';
  error: string;
};

export function ConceptDetail({ token, status, error }: Props) {
  const [copied, setCopied] = useState(false);

  const copyDesc = async () => {
    if (!token) return;
    const text = `${token.tagline ? token.tagline + ' | ' : ''}${token.description}\n\n${token.lore}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <aside className="rounded-2xl border border-line bg-[#151922] p-5">
      <p className="font-mono text-[10px] uppercase tracking-widest text-paper/40">Generated Concept</p>

      {error && (
        <p className="mt-3 rounded-lg border border-coral/40 bg-coral/10 px-4 py-3 font-mono text-sm text-coral">
          {error}
        </p>
      )}

      {!token && status !== 'loading' && (
        <p className="mt-6 text-sm text-paper/40">
          Generate a concept to see the full details here.
        </p>
      )}

      {token && (
        <div className="mt-4">
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2"
              style={{
                borderColor: token.brandColors?.[0] ?? '#50E0A0',
                background: token.brandColors?.[0] ?? '#1a1f2b',
              }}
            >
              <img src="/logo.png" alt="Token mascot" className="h-full w-full object-contain" />
            </div>
            <div>
              <p className="font-mono text-lg font-bold text-mint">{token.ticker}</p>
              <p className="text-sm font-semibold text-white">{token.name}</p>
            </div>
          </div>

          <dl className="mt-5 space-y-3 text-sm">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-paper/40">Tagline</dt>
              <dd className="mt-0.5 text-paper/80">{token.tagline}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-paper/40">Description</dt>
              <dd className="mt-0.5 leading-relaxed text-paper/80">{token.description}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-paper/40">Lore</dt>
              <dd className="mt-0.5 whitespace-pre-wrap italic leading-relaxed text-paper/60">{token.lore}</dd>
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-line pt-3">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-paper/40">Est. Launch Cost</dt>
                <dd className="mt-0.5 text-mint">~0.02 SOL</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-paper/40">Network</dt>
                <dd className="mt-0.5 text-paper/80">Solana</dd>
              </div>
              <div className="col-span-2">
                <dt className="font-mono text-[10px] uppercase tracking-widest text-paper/40">Launch Platform</dt>
                <dd className="mt-0.5 text-paper/80">pump.fun</dd>
              </div>
            </div>
          </dl>

          <div className="mt-5 flex flex-col gap-2">
            <a
              href={token.pumpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-mint px-5 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-black transition hover:brightness-110"
            >
              Launch on pump.fun →
            </a>
            <button
              onClick={copyDesc}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 font-mono text-xs font-medium uppercase tracking-widest text-white transition hover:bg-white/10"
            >
              {copied ? 'Copied!' : 'Copy Description'}
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}