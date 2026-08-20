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
    <div className="relative z-10 bg-transparent px-6 pb-16 pt-28 font-body text-paper md:px-12">
      <div className="mx-auto max-w-3xl">
        <FadeUp as="h1" className="font-sans text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
          How it works
        </FadeUp>
        <FadeUp as="p" delay={0.05} className="mt-2 font-sans text-sm text-[#A6B09D]">
          From one line to launch-ready concept in seconds.
        </FadeUp>

        <div className="mt-8 space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <FadeUp key={item.q} delay={i * 0.05}>
                <div className="glass-panel p-5 transition hover:border-lime/30">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 text-left"
                  >
                    <span className="font-sans text-sm font-bold text-white">{item.q}</span>
                    <span className="font-mono text-base text-lime">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <p className="mt-3 border-t border-white/5 pt-3 font-sans text-xs leading-relaxed text-[#A6B09D]">
                      {item.a}
                    </p>
                  )}
                </div>
              </FadeUp>
            );
          })}
        </div>

        <div className="mt-12">
          <p className="font-mono text-[10px] uppercase tracking-widest text-lime">MCP Servers</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {MCP_SERVERS.map((server, i) => (
              <FadeUp key={server.id} delay={0.03 * i}>
                <div className="h-full glass-panel p-5 hover:border-lime/40 transition">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-lime">{server.namespace}</span>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-lime/30 bg-lime/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-lime">HTTP</span>
                      {server.hot && <HotBadge />}
                      <Stars count={server.stars} />
                    </div>
                  </div>
                  <p className="mt-3 font-sans text-base font-bold text-white">{server.name}</p>
                  <p className="mt-2 font-sans text-xs leading-relaxed text-[#A6B09D]">{server.description}</p>
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