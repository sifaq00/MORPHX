import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { GeneratePage } from './pages/GeneratePage';
import { ConceptsPage } from './pages/ConceptsPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { CommunityPage } from './pages/CommunityPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { useHashRoute } from './hooks/useHashRoute';
import { BACKGROUNDS, nextBackground } from './lib/backgrounds';

export default function App() {
  const [route, setRoute] = useHashRoute();
  const [bgId, setBgId] = useState(BACKGROUNDS[0].id);
  const background = BACKGROUNDS.find((b) => b.id === bgId) ?? BACKGROUNDS[0];

  return (
    <div className="font-sans text-white relative min-h-screen selection:bg-[#C6F250]/30 selection:text-white flex flex-col justify-between">
      {/* Full-screen atmospheric room scene */}
      <div className="bg-room-container" style={background.style} />

      {/* Fixed Glassmorphic Navbar */}
      <Navbar route={route} onNavigate={setRoute} />

      {/* Main Pages Content */}
      <main className="relative z-10 flex-1">
        {route === 'home' && (
          <GeneratePage background={background} onChangeBackground={() => setBgId(nextBackground(bgId))} />
        )}
        {route === 'generate' && (
          <GeneratePage background={background} onChangeBackground={() => setBgId(nextBackground(bgId))} />
        )}
        {route === 'concepts' && <ConceptsPage />}
        {route === 'leaderboard' && <LeaderboardPage />}
        {route === 'community' && <CommunityPage />}
        {route === 'how-it-works' && <HowItWorksPage />}
      </main>

      {/* Footer matching i1lOx (1).jpg */}
      <footer className="relative z-10 py-4 text-center font-sans text-[11px] text-[#A8C27E]">
        <p className="flex items-center justify-center gap-1.5">
          <span>Built with</span>
          <span className="text-[#C6F250]">💚</span>
          <span>for the meme economy</span>
        </p>
        <p className="mt-0.5 text-[10px] text-[#A8C27E]/60">
          Not financial advice. DYOR.
        </p>
      </footer>
    </div>
  );
}