import { Route } from '../hooks/useHashRoute';
import { motion } from 'framer-motion';

const LINKS: { route: Route; label: string }[] = [
  { route: 'home', label: 'Home' },
  { route: 'generate', label: 'Generate' },
  { route: 'concepts', label: 'My Concepts' },
  { route: 'leaderboard', label: 'Leaderboard' },
  { route: 'community', label: 'Community' },
  { route: 'how-it-works', label: 'How it works' },
];

export function Navbar({ route, onNavigate }: { route: Route; onNavigate: (r: Route) => void }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-12 flex justify-center">
      <div className="w-full flex items-center justify-between px-4 py-2.5 md:px-6 md:py-3">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-white shrink-0"
        >
          <div className="relative flex h-[44px] w-[44px] items-center justify-center overflow-hidden rounded-lg bg-transparent">
            <img src="/logo.png" alt="Pounce Daemon Logo" className="h-full w-full object-contain" />
          </div>
          <span className="hidden text-xs font-extrabold tracking-[0.25em] sm:inline">POUNCE DAEMON</span>
        </button>

        <nav className="flex items-center gap-0.5 rounded-full border border-white/10 bg-white/5 p-1 shadow-inner backdrop-blur-xl scrollbar-none max-w-[55vw] overflow-x-auto md:max-w-none">
          {LINKS.map((link) => {
            const isActive = route === link.route;
            return (
              <button
                key={link.route}
                onClick={() => onNavigate(link.route)}
                className={`relative whitespace-nowrap rounded-full px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300 md:px-4 md:text-xs shrink-0 ${isActive ? 'text-black' : 'text-white/60 hover:text-white'}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-mint shadow"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {link.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://github.com/sifaq00/pounce-daemon"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-white/10 lg:flex"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            Github
          </a>

          <a
            href="https://pump.fun/coin/HKxpGGAfN3dE7AjQrJXbxUPf3eeAmGC6kwiGFFVbpump"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-amber px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-black shadow-md transition hover:scale-[1.02] md:px-5"
          >
            Buy $PNCE
          </a>

          <button
            aria-label="Cart"
            className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:text-mint"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </button>

          <button
            aria-label="Profile"
            className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:text-mint"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
