import { FadeUp } from '../components/FadeUp';
import { HotBadge, Stars, Tag } from '../components/Tag';
import { BUNDLES } from '../data/bundles';

export function LeaderboardPage() {
  return (
    <div className="relative z-10 bg-transparent px-6 pb-16 pt-28 font-body text-paper md:px-12">
      <div className="mx-auto max-w-5xl">
        <FadeUp as="h1" className="font-sans text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
          Leaderboard
        </FadeUp>
        <FadeUp as="p" delay={0.05} className="mt-2 font-sans text-sm text-[#A6B09D] max-w-xl leading-relaxed">
          Top bundles and workflows, ranked by the community.
        </FadeUp>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {BUNDLES.map((bundle, i) => (
            <FadeUp key={bundle.id} delay={0.05 * i}>
              <div className="h-full glass-panel p-6 hover:border-lime/40 transition">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-lime">{bundle.namespace}</span>
                  <div className="flex items-center gap-2">
                    {bundle.hot && <HotBadge />}
                    <Stars count={bundle.stars} />
                  </div>
                </div>
                <p className="mt-3 font-sans text-lg font-bold text-white">{bundle.name}</p>
                <p className="mt-2 max-w-md font-sans text-sm leading-relaxed text-[#A6B09D]">{bundle.description}</p>
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