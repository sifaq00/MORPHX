import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { GeneratePage } from './pages/GeneratePage';
import { ConceptsPage } from './pages/ConceptsPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { CommunityPage } from './pages/CommunityPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { PlexusBg } from './components/PlexusBg';
import { useHashRoute } from './hooks/useHashRoute';

export default function App() {
  const [route, setRoute] = useHashRoute();

  return (
    <div className="font-body text-paper relative min-h-screen">
      <div className="hero-bg">
        <PlexusBg />
      </div>

      <Navbar route={route} onNavigate={setRoute} />

      {route === 'home' && <HomePage onNavigate={setRoute} />}
      {route === 'generate' && <GeneratePage />}
      {route === 'concepts' && <ConceptsPage />}
      {route === 'leaderboard' && <LeaderboardPage />}
      {route === 'community' && <CommunityPage />}
      {route === 'how-it-works' && <HowItWorksPage />}

      <footer className="relative z-10 border-t border-line bg-ink px-6 py-10 text-center font-mono text-xs text-paper/50">
        <p className="mx-auto max-w-xl">
          Built with 💚 for the meme economy. Not financial advice. DYOR.
        </p>
      </footer>
    </div>
  );
}