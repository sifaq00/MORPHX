import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShieldAlert, Sparkles, Rocket } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from './components/Navbar';
import { AmbientAtmosphere } from './components/AmbientAtmosphere';
import { CursorRing } from './components/CursorRing';
import { HomePage } from './pages/HomePage';
import { GeneratePage } from './pages/GeneratePage';
import { ConceptsPage } from './pages/ConceptsPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { CommunityPage } from './pages/CommunityPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { useHashRoute } from './hooks/useHashRoute';
import { BACKGROUNDS, nextBackground } from './lib/backgrounds';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [route, setRoute] = useHashRoute();
  const [bgId, setBgId] = useState(BACKGROUNDS[0].id);
  const background = BACKGROUNDS.find((b) => b.id === bgId) ?? BACKGROUNDS[0];
  const bgRef = useRef<HTMLDivElement>(null);

  // Smooth, subtle background parallax with GSAP ScrollTrigger tuned per route
  useEffect(() => {
    if (!bgRef.current) return;
    const ctx = gsap.context(() => {
      // Clearly perceptible, punchy full-page smooth parallax mapped from top to bottom
      const targetPercent = route === 'generate' ? 6.0 : route === 'home' ? 8.5 : 7.0;
      gsap.to(bgRef.current, {
        yPercent: targetPercent,
        ease: 'none',
        scrollTrigger: {
          id: 'global-bg-parallax',
          start: 0,
          end: () => ScrollTrigger.maxScroll(window) || (document.documentElement.scrollHeight - window.innerHeight),
          scrub: 1.0,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => ctx.revert();
  }, [route]);

  // Seamless tab switching: reset scroll position immediately and smoothly settle background
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    // Smoothly settle background transform to 0 when tab changes
    if (bgRef.current) {
      gsap.to(bgRef.current, { yPercent: 0, duration: 0.2, ease: 'power1.out' });
    }

    const t1 = setTimeout(() => ScrollTrigger.refresh(), 80);
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 240);
    const t3 = setTimeout(() => ScrollTrigger.refresh(), 480);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [route]);

  return (
    <div className="font-sans text-white relative min-h-screen selection:bg-[#C6F250]/30 selection:text-white flex flex-col justify-between">
      {/* Full-screen atmospheric background scene with GSAP Parallax & Framer Motion Crossfade */}
      <div className="bg-room-container">
        <div ref={bgRef} className="w-full h-full relative will-change-transform">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={background.id}
              initial={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="bg-room-image"
              style={background.style}
            />
          </AnimatePresence>
        </div>
      </div>

      {/* Unified 60fps Ambient Atmosphere Canvas (Threads + Dust Particles in 1 pass) */}
      <AmbientAtmosphere />

      {/* Interactive Cursor Ring with Lerp Motion */}
      <CursorRing />

      {/* Fixed Glassmorphic Navbar */}
      <Navbar route={route} onNavigate={setRoute} />

      {/* Main Pages Content with Seamless Silky Crossfade */}
      <main className="relative z-10 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={route}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onAnimationComplete={() => {
              ScrollTrigger.refresh();
            }}
            className="w-full"
          >
            {route === 'home' && <HomePage onNavigate={setRoute} />}
            {route === 'generate' && (
              <GeneratePage background={background} onChangeBackground={() => setBgId(nextBackground(bgId))} />
            )}
            {route === 'concepts' && <ConceptsPage onNavigate={setRoute} />}
            {route === 'leaderboard' && <LeaderboardPage onNavigate={setRoute} />}
            {route === 'community' && <CommunityPage onNavigate={setRoute} />}
            {route === 'how-it-works' && <HowItWorksPage onNavigate={setRoute} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modern High-Visibility Glassmorphic Footer */}
      <footer className="relative z-10 py-6 px-4">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/15 bg-[#0E130A]/85 backdrop-blur-md px-5 py-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.6)] flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
          {/* Left: Built with 💚 for the meme economy */}
          <div className="flex items-center justify-center flex-wrap gap-2 font-mono text-[11.5px] text-[#A8C27E] text-center">
            <span>Built with</span>
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#C6F250]/15 text-[#C6F250] border border-[#C6F250]/30 shadow-[0_0_8px_rgba(198,242,80,0.25)]">
              <Heart className="h-3 w-3 fill-[#C6F250]" />
            </div>
            <span>for the <span className="text-white font-bold">meme economy</span></span>
          </div>

          {/* Center: Social Links (X & GitHub) */}
          <div className="flex items-center justify-center gap-2">
            <a
              href="https://x.com/morphxlabs?s=11"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 font-mono text-[11px] text-[#A8C27E] hover:text-[#C6F250] transition-colors bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full border border-white/10"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>X (Twitter)</span>
            </a>

            <a
              href="https://github.com/sifaq00/MORPHX"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 font-mono text-[11px] text-[#A8C27E] hover:text-[#C6F250] transition-colors bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full border border-white/10"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </a>
          </div>

          {/* Right: Not financial advice. DYOR. */}
          <div className="flex items-center justify-center gap-2 font-mono text-[11px] text-[#A8C27E]/90 bg-white/5 border border-white/10 px-3.5 py-1 rounded-full text-center shrink-0">
            <ShieldAlert className="h-3.5 w-3.5 text-[#C6F250] shrink-0" />
            <span>Not financial advice. <strong className="text-white font-bold">DYOR.</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}