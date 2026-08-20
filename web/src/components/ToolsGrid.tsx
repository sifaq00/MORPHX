import { TOOLS } from '../data/tools';
import { FadeUp } from './FadeUp';

export function ToolsGrid({ className }: { className?: string }) {
  return (
    <section className={`${className ?? ''}`}>
      <p className="font-mono text-[10px] uppercase tracking-widest text-paper/40">Tools</p>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {TOOLS.map((tool, i) => (
          <FadeUp key={tool.id} delay={0.03 * i}>
            <div className="h-full premium-card p-5">
              <div className="flex items-center justify-between">
                <span className="font-sans text-sm font-bold text-white">{tool.title}</span>
                {tool.status === 'live' ? (
                  <span className="rounded-full bg-mint/10 border border-mint/30 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-mint">
                    Live
                  </span>
                ) : (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white/40">
                    Soon
                  </span>
                )}
              </div>
              <p className="mt-3 font-sans text-xs leading-relaxed text-white/60">{tool.description}</p>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}