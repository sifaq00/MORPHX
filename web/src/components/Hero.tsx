import { motion } from 'framer-motion';
import { FadeUp } from './FadeUp';
import { Route } from '../hooks/useHashRoute';

const HEADLINE = 'TURN ONE IDEA INTO A LAUNCH-READY TOKEN.';
const SUBTEXT = 'Type the idea. We handle the ticker, the name, the lore, and the pump.fun link.';

export function Hero({ onNavigate }: { onNavigate: (r: Route) => void }) {
  const words = HEADLINE.split(' ');
  return (
    <section className="relative z-10 flex min-h-screen items-center justify-center px-6 md:px-12">
      <div className="max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-mint/30 bg-mint/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-mint">
          <span>CA: HKxpGGAfN3dE7AjQrJXbxUPf3eeAmGC6kwiGFFVbpump</span>
        </div>
        <h2 className="hero-font flex flex-wrap justify-center gap-[0.25em] text-[clamp(28px,4vw,56px)] font-bold uppercase leading-[1.05] tracking-[-0.01em] text-white">
          {words.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              {word}
            </motion.span>
          ))}
        </h2>
        <FadeUp as="p" delay={0.9} y={24} className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-white/70">
          {SUBTEXT}
        </FadeUp>
        <FadeUp delay={1} className="mt-10 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => onNavigate('generate')}
            className="rounded-full bg-mint px-8 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-black transition hover:brightness-110"
          >
            Generate Concept
          </button>
          <button
            onClick={() => onNavigate('how-it-works')}
            className="rounded-full border border-white/20 px-8 py-3 font-mono text-xs uppercase tracking-widest text-white/70 transition hover:border-mint hover:text-mint"
          >
            How it works
          </button>
        </FadeUp>
      </div>
    </section>
  );
}