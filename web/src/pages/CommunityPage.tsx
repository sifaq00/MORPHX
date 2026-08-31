import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Users,
  Heart,
  Sparkles,
  GitBranch,
  ExternalLink,
} from 'lucide-react';
import { HotBadge, Stars, Tag } from '../components/Tag';
import { SKILLS } from '../data/skills';
import { playClick } from '../lib/sound-fx';

const CATEGORIES = ['all', 'tokens', 'dev', 'social', 'image', 'lore'] as const;

type Props = {
  onNavigate?: (route: any) => void;
};

export function CommunityPage({ onNavigate: _onNavigate }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('all');
  const [liked, setLiked] = useState<Set<string>>(new Set());

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

  const toggleLike = (id: string) => {
    playClick();
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="relative z-10 px-3.5 sm:px-6 md:px-8 pt-20 sm:pt-24 pb-16">
      <div className="mx-auto max-w-6xl">
        
        {/* Header Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center sm:text-left"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C6F250]/30 bg-[#C6F250]/10 px-3.5 py-1 font-mono text-[10.5px] font-bold text-[#C6F250] shadow-[0_0_12px_rgba(198,242,80,0.15)] mb-3">
            <Users className="h-3 w-3 fill-current" /> AGENT SKILL REGISTRY
          </span>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white select-none [text-shadow:_0_2px_10px_rgba(0,0,0,0.55)]">
            Community Skills
          </h1>
          <p className="mt-2 max-w-xl font-sans text-xs sm:text-sm leading-relaxed text-zinc-200 [text-shadow:_0_1px_6px_rgba(0,0,0,0.5)]">
            Autonomous agent capabilities and tools shared by the community. Teach your AI agent new skills to forge, deploy, and analyze memecoins.
          </p>
        </motion.div>

        {/* Search & Filter Control Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 glass-panel-card p-2.5 sm:p-3 border-white/15"
        >
          {/* Search Input */}
          <div className="relative flex-1 flex items-center">
            <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-zinc-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skills by name, tag, or description…"
              className="w-full rounded-xl border border-white/10 bg-black/50 py-2 sm:py-2.5 pl-10 pr-4 font-sans text-xs sm:text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-[#C6F250]/70 focus:bg-black/70"
            />
          </div>

          {/* Category Filter Chips (No Scrollbar Glitch) */}
          <div className="flex flex-wrap items-center gap-1.5 shrink-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => {
                  playClick();
                  setCategory(c);
                }}
                className={`relative rounded-full px-3.5 py-1.5 font-mono text-[10.5px] uppercase tracking-wider transition-colors duration-200 shrink-0 select-none ${
                  category === c
                    ? 'font-black text-[#0A0D06] shadow-[0_0_12px_rgba(198,242,80,0.35)]'
                    : 'border border-white/10 bg-black/40 text-zinc-300 hover:text-white hover:border-white/20'
                }`}
              >
                {category === c && (
                  <motion.span
                    layoutId="community-category-pill"
                    className="absolute inset-0 rounded-full bg-[#C6F250]"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  />
                )}
                <span className="relative z-10">{c}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Skills Cards Grid - Rock Solid Smooth Fade Transition (No Jeglek / No Jumping) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={category + (query ? `_q_${query}` : '')}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-stretch"
          >
            {results.map((skill, idx) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.32,
                  ease: [0.16, 1, 0.3, 1],
                  delay: Math.min(idx * 0.025, 0.1),
                }}
                whileHover={{ y: -4, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
                className="skill-card-item glass-panel-card p-4 sm:p-5 flex flex-col justify-between h-full group hover:border-[#C6F250]/40 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(198,242,80,0.12)] relative overflow-hidden"
              >
                {/* Subtle Light Sheen on Card */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
                  <motion.div
                    animate={{ x: ['-200%', '300%'] }}
                    transition={{
                      repeat: Infinity,
                      repeatDelay: 2.0 + (idx % 3) * 0.8,
                      duration: 3.0,
                      ease: 'easeInOut',
                    }}
                    className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent skew-x-12"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#C6F250] font-bold bg-[#C6F250]/10 px-2 py-0.5 rounded border border-[#C6F250]/20">
                      {skill.namespace}
                    </span>
                    <div className="flex items-center gap-2">
                      {skill.hot && <HotBadge />}
                      <Stars count={skill.stars} />
                    </div>
                  </div>

                  <h3 className="mt-3 font-display text-base font-bold text-white group-hover:text-[#C6F250] transition-colors leading-snug">
                    {skill.name}
                  </h3>
                  <p className="mt-2 font-sans text-xs leading-relaxed text-zinc-300">
                    {skill.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {skill.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => toggleLike(skill.id)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] font-semibold transition ${
                        liked.has(skill.id)
                          ? 'bg-[#C6F250]/20 text-[#C6F250] border border-[#C6F250]/40 shadow-[0_0_10px_rgba(198,242,80,0.2)]'
                          : 'bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <motion.span
                        animate={liked.has(skill.id) ? { scale: [1, 1.35, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        <Heart className={`h-3.5 w-3.5 ${liked.has(skill.id) ? 'fill-[#C6F250]' : ''}`} />
                      </motion.span>
                      <span>{liked.has(skill.id) ? 'Liked ✓' : 'Like'}</span>
                    </button>

                    <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                      v1.0.0
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty Search State */}
        {results.length === 0 && (
          <div className="mt-12 glass-panel-card p-12 text-center rounded-2xl border-white/15">
            <Search className="mx-auto h-8 w-8 text-zinc-500" />
            <p className="mt-3 font-display text-base font-bold text-white">No skills match that query</p>
            <p className="mt-1 text-xs text-zinc-400">Try searching for keywords like "pump", "token", "lore", or "social".</p>
          </div>
        )}

        {/* Bottom Contribution Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 sm:mt-14 rounded-2xl border border-dashed border-[#C6F250]/30 hover:border-[#C6F250]/60 transition-colors p-8 text-center relative overflow-hidden"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#C6F250]/15 border border-[#C6F250]/30 text-[#C6F250] shadow-[0_0_15px_rgba(198,242,80,0.2)]">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="mt-3.5 font-display text-lg font-bold text-white">
            Have an Agent Skill or Tool to Share?
          </h2>
          <p className="mx-auto mt-1.5 max-w-md font-sans text-xs text-zinc-300 leading-relaxed">
            The community registry accepts autonomous subagent prompts, MCP endpoints, and heuristic modules.
          </p>
          <div className="mt-6 flex justify-center">
            <motion.a
              whileHover={{ scale: 1.03, y: -1, transition: { duration: 0.2, ease: 'easeOut' } }}
              whileTap={{ scale: 0.97 }}
              href="https://github.com/sifaq00/MORPHX"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClick()}
              className="relative btn-brand-lime inline-flex items-center gap-2 px-7 py-3 text-xs sm:text-sm font-bold shadow-[0_0_25px_rgba(198,242,80,0.35)] overflow-hidden"
            >
              {/* Moving Light Sheen Sweep */}
              <motion.div
                animate={{ x: ['-150%', '250%'] }}
                transition={{ repeat: Infinity, repeatDelay: 1.0, duration: 2.8, ease: 'easeInOut' }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 pointer-events-none"
              />
              <GitBranch className="h-4 w-4 relative z-10" />
              <span className="relative z-10 font-extrabold tracking-tight">Registry Open on GitHub</span>
              <ExternalLink className="h-3.5 w-3.5 relative z-10 opacity-80" />
            </motion.a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}