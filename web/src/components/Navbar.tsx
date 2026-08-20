import { Route } from '../hooks/useHashRoute';
import { motion } from 'framer-motion';
import { ShoppingCart, ChevronDown } from 'lucide-react';

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
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/10 bg-[#0D100A]/75 backdrop-blur-md px-6 md:px-8 flex items-center justify-between">
      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between">
        {/* Brand Logo & Subtitle */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left shrink-0 group transition"
        >
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-[#C6F250]/15">
            <img src="/logo.png" alt="Pounce Daemon Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <div className="font-sans font-extrabold text-[17px] tracking-wide text-white leading-tight">
              POUNCE DAEMON
            </div>
            <div className="font-sans text-[9.5px] uppercase tracking-[0.06em] text-[#A8C27E] font-medium">
              TOKEN CONCEPT GENERATOR
            </div>
          </div>
        </button>

        {/* Center Nav Links */}
        <nav className="flex items-center gap-1.5 max-w-[55vw] overflow-x-auto scrollbar-none md:max-w-none">
          {LINKS.map((link) => {
            const isActive = route === link.route;
            return (
              <button
                key={link.route}
                onClick={() => onNavigate(link.route)}
                className={`relative whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors shrink-0 ${
                  isActive
                    ? 'text-[#C6F250] font-semibold'
                    : 'text-[#D0D8C8]/80 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-capsule"
                    className="absolute inset-0 -z-10 rounded-full bg-[#273319] border border-[#556D2C]/60 shadow-sm"
                    transition={{ type: 'spring', stiffness: 420, damping: 35 }}
                  />
                )}
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Nav: Cart & Avatar Profile */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            aria-label="Cart"
            className="rounded-full p-2 text-white/70 transition hover:text-[#C6F250] hover:bg-white/5"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>

          <button
            aria-label="Profile"
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 p-0.5 pr-2 transition hover:border-[#C6F250]/50"
          >
            <img
              src="/pepe-badge.png"
              alt="User profile"
              className="h-7 w-7 rounded-full object-cover"
            />
            <ChevronDown className="h-3 w-3 text-white/60" />
          </button>
        </div>
      </div>
    </header>
  );
}
