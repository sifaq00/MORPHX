import { FadeUp } from '../components/FadeUp';
import { HotBadge, Stars, Tag } from '../components/Tag';
import { BUNDLES } from '../data/bundles';

export function LeaderboardPage() {
  return (
    <div className="relative z-10 bg-transparent px-6 pb-16 pt-36 font-body text-paper md:px-12">
      <div className="mx-auto max-w-5xl">
        <FadeUp as="h1" className="font-sans text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
          Leaderboard
        </FadeUp>
        <FadeUp as="p" delay={0.05} className="mt-3 font-sans text-sm text-white/60 max-w-xl leading-relaxed">
          Top bundles and workflows, ranked by the community.
        </FadeUp>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {BUNDLES.map((bundle, i) => (
            <FadeUp key={bundle.id} delay={0.05 * i}>
              <div className="h-full premium-card p-6">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">{bundle.namespace}</span>
                  <div className="flex items-center gap-2">
                    {bundle.hot && <HotBadge />}
                    <Stars count={bundle.stars} />
                  </div>
                </div>
                <p className="mt-3 font-sans text-lg font-bold text-white">{bundle.name}</p>
                <p className="mt-2 max-w-md font-sans text-sm leading-relaxed text-white/60">{bundle.description}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {bundle.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </div>
  );
}