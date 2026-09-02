import { useState, useEffect } from 'react';
import { Route } from '../hooks/useHashRoute';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Menu, X, Sparkles, Home, Zap, Layers, Trophy, Users, HelpCircle, Rocket } from 'lucide-react';
import { isSoundMuted, toggleSound, playClick } from '../lib/sound-fx';
import { WalletButton } from './WalletButton';

const LINKS: { route: Route; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
  { route: 'home', label: 'Home', icon: Home },
  { route: 'generate', label: 'Generate', icon: Zap },
  { route: 'launcher', label: 'Launcher', icon: Rocket, badge: 'NEW' },
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
            alt="MORPHX Logo"
            onError={(e) => {
              e.currentTarget.src = '/logo.png';
            }}
            className="h-[30px] sm:h-[34px] w-auto max-w-[46px] object-contain shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] group-hover:scale-105 group-hover:drop-shadow-[0_0_12px_rgba(198,242,80,0.4)] transition-all duration-200"
          />
          <div className="min-w-0 flex flex-col justify-center">
            <div className="font-display font-extrabold text-[15px] sm:text-[18px] tracking-wider text-white leading-none truncate group-hover:text-[#C6F250] transition-colors duration-200">
              MORPHX
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
              <motion.button
                key={link.route}
                onClick={() => handleNavClick(link.route)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative whitespace-nowrap rounded-full px-3.5 xl:px-4 py-1.5 text-xs xl:text-sm font-medium transition-all shrink-0 select-none ${
                  isActive
                    ? 'text-[#C6F250] font-bold'
                    : 'text-[#E4EBE0] hover:text-[#C6F250] hover:bg-white/[0.08] hover:shadow-[0_0_10px_rgba(198,242,80,0.12)]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-capsule"
                    className="absolute inset-0 -z-10 rounded-full bg-[#273319] border border-[#556D2C]/60 shadow-[0_0_12px_rgba(198,242,80,0.15)]"
                    transition={{ type: 'spring', stiffness: 420, damping: 35 }}
                  />
                )}
                <span className="inline-flex items-center gap-1.5">
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="rounded-full bg-[#C6F250] text-[#0A0D06] px-1.5 py-0.5 text-[8.5px] font-mono font-black uppercase tracking-wider shadow-[0_0_8px_rgba(198,242,80,0.5)]">
                      {link.badge}
                    </span>
                  )}
                </span>
              </motion.button>
            );
          })}
        </nav>

        {/* Right Nav: GitHub Link, Sound Toggle, Wallet Connect & Mobile Menu Button */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* X (Twitter) Link Button */}
          <motion.a
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            href="https://x.com/morphxlabs?s=11"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playClick()}
            aria-label="X (Twitter)"
            title="Follow MORPHX on X"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 hover:text-[#C6F250] hover:bg-white/10 border border-white/10 hover:border-[#C6F250]/40 hover:shadow-[0_0_12px_rgba(198,242,80,0.25)] transition"
          >
            <svg
              className="h-3.5 w-3.5 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </motion.a>

          {/* GitHub Repository Link Button */}
          <motion.a
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            href="https://github.com/sifaq00/MORPHX"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playClick()}
            aria-label="GitHub Repository"
            title="View MORPHX on GitHub"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 hover:text-[#C6F250] hover:bg-white/10 border border-white/10 hover:border-[#C6F250]/40 hover:shadow-[0_0_12px_rgba(198,242,80,0.25)] transition"
          >
            <svg
              className="h-3.5 w-3.5 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
          </motion.a>

          {/* Sound Toggle (Visible on Desktop/Tablet, on mobile accessible in drawer) */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              toggleSound();
              setIsMuted(isSoundMuted());
            }}
            aria-label="Toggle Sound"
            title={isMuted ? 'Unmute UI Audio' : 'Mute UI Audio'}
            className={`hidden sm:flex rounded-full p-2 transition ${
              isMuted
                ? 'text-white/40 hover:text-white hover:bg-white/10 hover:shadow-[0_0_10px_rgba(255,255,255,0.15)]'
                : 'text-[#C6F250] bg-[#C6F250]/10 hover:bg-[#C6F250]/25 hover:shadow-[0_0_15px_rgba(198,242,80,0.35)] shadow-[0_0_10px_rgba(198,242,80,0.2)]'
            }`}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </motion.button>

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
                      <span className="flex items-center gap-2">
                        <span>{link.label}</span>
                        {link.badge && (
                          <span className="rounded-full bg-[#C6F250] text-[#0A0D06] px-1.5 py-0.5 text-[8.5px] font-mono font-black uppercase tracking-wider shadow-[0_0_8px_rgba(198,242,80,0.4)]">
                            {link.badge}
                          </span>
                        )}
                      </span>
                    </span>
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#C6F250] shadow-[0_0_6px_#C6F250]" />}
                  </button>
                );
              })}

              {/* X (Twitter) Link inside Mobile Menu */}
              <div className="pt-1">
                <a
                  href="https://x.com/morphxlabs?s=11"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playClick()}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-xs font-medium text-white/80 bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white transition"
                >
                  <span className="flex items-center gap-3">
                    <svg className="h-4 w-4 fill-current text-[#C6F250]" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>Follow on X</span>
                  </span>
                  <span className="font-mono text-[10px] text-[#A8C27E]">FOLLOW</span>
                </a>
              </div>

              {/* GitHub Link inside Mobile Menu */}
              <div className="pt-1">
                <a
                  href="https://github.com/sifaq00/MORPHX"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playClick()}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-xs font-medium text-white/80 bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white transition"
                >
                  <span className="flex items-center gap-3">
                    <svg className="h-4 w-4 fill-current text-[#C6F250]" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    <span>GitHub Repository</span>
                  </span>
                  <span className="font-mono text-[10px] text-[#A8C27E]">OPEN</span>
                </a>
              </div>

              {/* Sound Toggle inside Mobile Menu */}
              <div className="pt-1">
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
