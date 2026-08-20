import { useMemo, useState } from 'react';
import { FadeUp } from '../components/FadeUp';
import { HotBadge, Stars, Tag } from '../components/Tag';
import { SKILLS } from '../data/skills';

const CATEGORIES = ['all', 'tokens', 'dev', 'social', 'image', 'lore'] as const;

export function CommunityPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('all');

  const results = useMemo(() => {
    return SKILLS.filter((s) => {
      if (category !== 'all' && s.category !== category) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const haystack = `${s.name} ${s.description} ${s.tags.join(' ')}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [query, category]);

  return (
    <div className="relative z-10 bg-transparent px-6 pb-16 pt-36 font-body text-paper md:px-12">
      <div className="mx-auto max-w-5xl">
        <FadeUp as="h1" className="font-sans text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
          Community
        </FadeUp>
        <FadeUp as="p" delay={0.05} className="mt-3 font-sans text-sm text-white/60 max-w-xl leading-relaxed">
          Skills shared by the community. Find skills to teach your agent new capabilities.
        </FadeUp>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills…"
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 font-sans text-sm text-white placeholder:text-white/30 outline-none focus:border-mint/50"
          />
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition ${
                  category === c ? 'bg-mint text-black' : 'border border-white/10 text-white/50 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {results.map((skill, i) => (
            <FadeUp key={skill.id} delay={0.03 * i}>
              <div className="h-full premium-card p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">{skill.namespace}</span>
                  <div className="flex items-center gap-2">
                    {skill.hot && <HotBadge />}
                    <Stars count={skill.stars} />
                  </div>
                </div>
                <p className="mt-3 font-sans text-base font-bold text-white">{skill.name}</p>
                <p className="mt-2 font-sans text-sm leading-relaxed text-white/60">{skill.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {skill.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}
          {results.length === 0 && (
            <p className="col-span-full py-16 text-center font-mono text-sm text-white/40">
              No skills match that search yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}