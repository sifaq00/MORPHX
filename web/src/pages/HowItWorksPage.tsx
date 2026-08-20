import { useState } from 'react';
import { FadeUp } from '../components/FadeUp';
import { HotBadge, Stars, Tag } from '../components/Tag';
import { MCP_SERVERS } from '../data/mcpServers';

const FAQS = [
  {
    q: 'What does Pounce Daemon actually generate?',
    a: 'A token concept from your idea: a ticker, a name, a short tagline, hype-style description copy, a piece of lore, and a vibe score from 1–10, plus a link to pump.fun/create.',
  },
  {
    q: 'Does Pounce Daemon launch the token for me?',
    a: 'No. Pounce Daemon only writes the concept and copy. Launching, funding, and everything on-chain happens on pump.fun, and that decision is entirely yours.',
  },
  {
    q: 'Can I use this from Claude Code?',
    a: 'Yes, the Skills and MCP sections list instruction files and server configs you can drop into a Claude Code project so your agent can generate concepts directly from the terminal.',
  },
  {
    q: 'Is this free?',
    a: 'The generator and directory are free to browse and use. You bring your own MegaLLM API key if you self-host the project.',
  },
];

export function HowItWorksPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="relative z-10 bg-transparent px-6 pb-16 pt-36 font-body text-paper md:px-12">
      <div className="mx-auto max-w-3xl">
        <FadeUp as="h1" className="font-sans text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
          How it works
        </FadeUp>
        <FadeUp as="p" delay={0.05} className="mt-3 font-sans text-sm text-white/60">
          From one line to launch-ready concept in seconds.
        </FadeUp>

        <div className="mt-10 space-y-4">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <FadeUp key={item.q} delay={i * 0.05}>
                <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 transition hover:border-mint/30">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 text-left"
                  >
                    <span className="font-sans text-base font-bold text-white">{item.q}</span>
                    <span className="font-mono text-lg text-mint">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <p className="mt-4 border-t border-white/5 pt-4 font-sans text-sm leading-relaxed text-white/70">
                      {item.a}
                    </p>
                  )}
                </div>
              </FadeUp>
            );
          })}
        </div>

        <div className="mt-12">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">MCP Servers</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {MCP_SERVERS.map((server, i) => (
              <FadeUp key={server.id} delay={0.03 * i}>
                <div className="h-full premium-card p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">{server.namespace}</span>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-mint/30 bg-mint/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-mint">HTTP</span>
                      {server.hot && <HotBadge />}
                      <Stars count={server.stars} />
                    </div>
                  </div>
                  <p className="mt-3 font-sans text-lg font-bold text-white">{server.name}</p>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-white/60">{server.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {server.tools.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}