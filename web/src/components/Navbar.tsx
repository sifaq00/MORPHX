import { useState, useEffect } from 'react';
import { Route } from '../hooks/useHashRoute';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Menu, X, Sparkles, Home, Zap, Layers, Trophy, Users, HelpCircle } from 'lucide-react';
import { isSoundMuted, toggleSound, playClick } from '../lib/sound-fx';
import { WalletButton } from './WalletButton';

const LINKS: { route: Route; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { route: 'home', label: 'Home', icon: Home },
  { route: 'generate', label: 'Generate', icon: Zap },
  { route: 'concepts', label: 'My Concepts', icon: Layers },
  { route: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { route: 'community', label: 'Community', icon: Users },
  { route: 'how-it-works', label: 'How it works', icon: HelpCircle },
];

export function Navbar({ route, onNavigate }: { route: Route; onNavigate: (r: Route) => void }) {
  const [isMuted, setIsMuted] = useState(isSoundMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (r: Route) => {
    playClick();
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    onNavigate(r);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/10 bg-[#0D100A]/90 backdrop-blur-md px-2.5 sm:px-6 md:px-8 flex items-center justify-between">
      <div className="w-full max-w-[1520px] mx-auto flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Brand Logo & Title */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 sm:gap-3 text-left shrink-0 group transition min-w-0"
        >
          <img
            src="/logo.webp"
            alt="Pounce Daemon Logo"
            onError={(e) => {
              e.currentTarget.src = '/logo.png';
            }}
            className="h-8 w-8 sm:h-9 sm:w-9 object-contain shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform -translate-y-[2.5px]"
          />
          <div className="min-w-0 flex flex-col justify-center">
            <div className="font-display font-extrabold text-[14.5px] sm:text-[17px] tracking-tight text-white leading-none truncate">
              POUNCE DAEMON
            </div>
            <div className="hidden sm:block font-mono text-[9px] uppercase tracking-[0.14em] text-[#C6E07A] font-semibold mt-1">
              TOKEN CONCEPT GENERATOR
            </div>
          </div>
        </button>

        {/* Center Nav Links (Visible on Large Screens >= 1024px) */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {LINKS.map((link) => {
            const isActive = route === link.route;
            return (
              <button
                key={link.route}
                onClick={() => handleNavClick(link.route)}
                className={`relative whitespace-nowrap rounded-full px-3.5 xl:px-4 py-1.5 text-xs xl:text-sm font-medium transition-colors shrink-0 ${
                  isActive
                    ? 'text-[#C6F250] font-bold'
                    : 'text-[#E4EBE0] hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-capsule"
                    className="absolute inset-0 -z-10 rounded-full bg-[#273319] border border-[#556D2C]/60 shadow-[0_0_12px_rgba(198,242,80,0.15)]"
                    transition={{ type: 'spring', stiffness: 420, damping: 35 }}
                  />
                )}
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Nav: Sound Toggle, Wallet Connect & Mobile Menu Button */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Sound Toggle (Visible on Desktop/Tablet, on mobile accessible in drawer) */}
          <button
            onClick={() => {
              toggleSound();
              setIsMuted(isSoundMuted());
            }}
            aria-label="Toggle Sound"
            title={isMuted ? 'Unmute UI Audio' : 'Mute UI Audio'}
            className={`hidden sm:flex rounded-full p-2 transition ${
              isMuted
                ? 'text-white/40 hover:text-white hover:bg-white/5'
                : 'text-[#C6F250] bg-[#C6F250]/10 hover:bg-[#C6F250]/20 shadow-[0_0_10px_rgba(198,242,80,0.2)]'
            }`}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          {/* Solana Wallet Connect Button */}
          <WalletButton />

          {/* Mobile Hamburger Menu Toggle Button (Visible on < 1024px) */}
          <button
            onClick={() => {
              playClick();
              setMobileMenuOpen((prev) => !prev);
            }}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden rounded-lg border border-white/10 bg-white/5 p-1.5 sm:p-2 text-white/80 transition hover:bg-white/10 hover:text-white hover:border-[#C6F250]/40 shrink-0"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden absolute top-16 left-0 right-0 border-b border-white/15 bg-[#0D100A]/95 backdrop-blur-md shadow-2xl overflow-hidden z-40"
          >
            <div className="px-4 py-4 space-y-1.5 max-w-md mx-auto">
              {LINKS.map((link) => {
                const isActive = route === link.route;
                const IconComponent = link.icon;
                return (
                  <button
                    key={link.route}
                    onClick={() => handleNavClick(link.route)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#273319] text-[#C6F250] font-bold border border-[#556D2C]/60 shadow-[0_0_12px_rgba(198,242,80,0.15)]'
                        : 'text-white/80 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <IconComponent className={`h-4 w-4 ${isActive ? 'text-[#C6F250]' : 'text-white/50'}`} />
                      <span>{link.label}</span>
                    </span>
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#C6F250] shadow-[0_0_6px_#C6F250]" />}
                  </button>
                );
              })}

              {/* Sound Toggle inside Mobile Menu */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    toggleSound();
                    setIsMuted(isSoundMuted());
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-xs font-medium text-white/70 bg-white/5 border border-white/5 hover:bg-white/10"
                >
                  <span className="flex items-center gap-3">
                    {isMuted ? <VolumeX className="h-4 w-4 text-white/40" /> : <Volume2 className="h-4 w-4 text-[#C6F250]" />}
                    <span>Sound Effects</span>
                  </span>
                  <span className="font-mono text-[10px] text-[#A8C27E]">
                    {isMuted ? 'OFF' : 'ON'}
                  </span>
                </button>
              </div>

              {/* Mobile Menu Footer Info */}
              <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#A8C27E]">
                <span>Meme Engine</span>
                <span className="text-white/40">v0.1.0</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
