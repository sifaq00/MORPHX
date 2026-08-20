# Pounce Daemon Frontend Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Pounce Daemon web frontend to match the user's mockup (3-column generator layout, new navbar, green accent, workflow card) while keeping every existing core function working.

**Architecture:** Same stack (React 18 + Vite + Tailwind + framer-motion), same hash router, same `/api/generate` backend. Only `web/` frontend files change. The generator becomes a 3-column page: left input panel, center preview over a swappable background, right generated-concept detail panel, bottom workflow card + tools grid. Old catalog pages (Tools/Skills/Bundles/MCP/FAQ) are replaced by new pages per the route map; their data files are reused as content sources.

**Tech Stack:** React 18.3, Vite 5.3, Tailwind 3.4, framer-motion 12, TypeScript (web), plain JS for shared lib.

## Global Constraints

- Brand stays **Pounce Daemon** (never rebrand to PUMP.FUN/Pepe).
- Accent color: `#50E0A0` (pump.fun green). Dark background `#0E1116` stays.
- Backend/API untouched: `web/src/lib/generate-token.js`, `web/api/generate.js`, `web/vite-api-plugin.js`, `web/vite.config.js` are NOT modified.
- No new dependencies. No new assets beyond what exists.
- Hash routing preserved; shareable refresh-safe URLs.
- Footer on every page: `Built with 💚 for the meme economy. Not financial advice. DYOR.` (replaces old CA disclaimer footer).
- Contract address (CA) still displayed in header/hero badge.
- Core functions that must keep working: generate token, launch on pump.fun (new tab), copy to clipboard, error display, loading state.
- Inspiration list items are exactly: "When in doubt, ape it out.", "Exit liquidity? No, I am.", "Built different, Probably not.", "One more candle won't hurt.", "This is financial advice." — clicking fills the input.
- Char counter format: `N / 120` (max 120 chars).
- Static metrics added in frontend: `estLaunchCost: "~0.02 SOL"`, `network: "Solana"`, `platform: "pump.fun"`.

---

## File Structure

**Created:**
- `web/src/components/GeneratorPanel.tsx` — left panel: idea input, char counter, generate/random buttons, inspiration list, launch info card
- `web/src/components/ConceptPreview.tsx` — center: background layer + result overlay cards (Ticker/Name/Tagline/Lore)
- `web/src/components/ConceptDetail.tsx` — right panel: avatar, all fields, static metrics, launch button
- `web/src/components/WorkflowCard.tsx` — bottom: "Your Token Concept" workflow + Download Concept + Change Background
- `web/src/components/ToolsGrid.tsx` — bottom: grid of `TOOLS` with live/soon badges
- `web/src/pages/GeneratePage.tsx` — assembles the 3-column layout + owns the generate state machine
- `web/src/pages/ConceptsPage.tsx` — My Concepts placeholder
- `web/src/pages/LeaderboardPage.tsx` — renders `BUNDLES`
- `web/src/pages/CommunityPage.tsx` — renders `SKILLS` (with search/category filter reused from old SkillsPage)
- `web/src/pages/HowItWorksPage.tsx` — renders FAQ content + `MCP_SERVERS`
- `web/src/lib/backgrounds.ts` — list of selectable generator backgrounds + helpers

**Modified:**
- `web/src/hooks/useHashRoute.ts` — new route list: home, generate, concepts, leaderboard, community, how-it-works
- `web/src/App.tsx` — route mapping, new footer, keep PlexusBg global
- `web/src/components/Navbar.tsx` — full rewrite (mockup nav + cart/profile icons, CA badge)
- `web/src/components/Hero.tsx` — slim landing hero for Home
- `web/src/pages/HomePage.tsx` — rewrite (Hero + CTA to generate)
- `web/tailwind.config.js` — add `mint` color, adjust fonts if needed
- `web/src/index.css` — restyle `.premium-card`, add green accents, keep reduced-motion/focus styles
- `web/index.html` — title/description/meta language sync

**Deleted:**
- `web/src/components/TickerTape.tsx`
- `web/src/components/TerminalDemo.tsx`
- `web/src/components/ClosingCta.tsx`
- `web/src/components/DirectoryOverview.tsx`
- `web/src/components/Faq.tsx`
- `web/src/pages/ToolsPage.tsx`
- `web/src/pages/SkillsPage.tsx`
- `web/src/pages/BundlesPage.tsx`
- `web/src/pages/McpPage.tsx`
- `web/src/pages/FaqPage.tsx`

**Reused unchanged:** `web/src/data/tools.ts`, `web/src/data/skills.ts`, `web/src/data/bundles.ts`, `web/src/data/mcpServers.ts`, `web/src/components/FadeUp.tsx`, `web/src/components/Tag.tsx`, `web/src/components/PlexusBg.tsx`, `web/src/lib/generate-token.js`.

---

### Task 1: Theme & Global Styles

**Files:**
- Modify: `web/tailwind.config.js`
- Modify: `web/src/index.css`
- Modify: `web/index.html`

**Interfaces:**
- Produces: Tailwind color token `mint` (`#50E0A0`); global green accent styles; HTML title `Pounce Daemon — Token Concept Generator`, English meta description.

- [ ] **Step 1: Update Tailwind theme**

`web/tailwind.config.js` — add `mint` to colors:

```js
colors: {
  ink: '#0E1116',
  paper: '#F5F3EE',
  amber: '#FFB238',
  coral: '#FF5C5C',
  mint: '#50E0A0',
  line: 'rgba(245,243,238,0.14)',
},
```

- [ ] **Step 2: Update global CSS**

`web/src/index.css` — replace the unused Strat Studio HSL block and gradient vars with a compact green-accent theme:

```css
:root {
  color-scheme: dark;
  --mint: #50e0a0;
  --surface: #0e1116;
  --surface-card: #151922;
  --surface-card-2: #1a1f2b;
  --line-soft: rgba(80, 224, 160, 0.18);
}

html,
body {
  margin: 0;
  background: #0E1116;
}
```

Update `.premium-card` to use the green-tinted border on hover:

```css
.premium-card:hover {
  border-color: rgba(80, 224, 160, 0.35);
  transform: translateY(-2px);
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.9), 0 0 20px 2px rgba(80, 224, 160, 0.05);
}
```

Keep `.hero-bg`, `@keyframes slideUpFadeIn`, `prefers-reduced-motion`, focus-visible, scrollbar-none.

- [ ] **Step 3: Update HTML shell**

`web/index.html` — sync title, make description English to match UI, keep lang="id" if preferred:

```html
<title>Pounce Daemon — Token Concept Generator</title>
<meta
  name="description"
  content="Turn one line into a launch-ready pump.fun token concept. Ticker, name, tagline, lore, and a launch link."
/>
```

- [ ] **Step 4: Verify build**

Run: `npm run build --workspace pounce-daemon`
Expected: build succeeds, no errors.

- [ ] **Step 5: Commit**

```bash
git add web/tailwind.config.js web/src/index.css web/index.html
git commit -m "style: add mint green theme and sync html shell"
```

---

### Task 2: Routing & App Shell

**Files:**
- Modify: `web/src/hooks/useHashRoute.ts`
- Modify: `web/src/App.tsx`
- Modify: `web/src/pages/HomePage.tsx`
- Modify: `web/src/components/Hero.tsx`

**Interfaces:**
- Consumes: Task 1 theme tokens.
- Produces: `Route` union = `'home' | 'generate' | 'concepts' | 'leaderboard' | 'community' | 'how-it-works'`. App renders `<GeneratePage/>` at `generate`, `<ConceptsPage/>` at `concepts`, `<LeaderboardPage/>` at `leaderboard`, `<CommunityPage/>` at `community`, `<HowItWorksPage/>` at `how-it-works`. New footer string. Slim `Hero` that takes an `onNavigate` callback.

- [ ] **Step 1: Extend route list**

`web/src/hooks/useHashRoute.ts`:

```ts
export type Route =
  | 'home'
  | 'generate'
  | 'concepts'
  | 'leaderboard'
  | 'community'
  | 'how-it-works';

const VALID_ROUTES: Route[] = ['home', 'generate', 'concepts', 'leaderboard', 'community', 'how-it-works'];

function readRoute(): Route {
  const hash = window.location.hash.replace('#/', '').replace('#', '');
  return (VALID_ROUTES as string[]).includes(hash) ? (hash as Route) : 'home';
}
```

- [ ] **Step 2: Rewrite App**

`web/src/App.tsx`:

```tsx
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
```

- [ ] **Step 3: Rewrite HomePage**

`web/src/pages/HomePage.tsx`:

```tsx
import { Hero } from '../components/Hero';
import { Route } from '../hooks/useHashRoute';

export function HomePage({ onNavigate }: { onNavigate: (r: Route) => void }) {
  return <Hero onNavigate={onNavigate} />;
}
```

- [ ] **Step 4: Slim Hero**

`web/src/components/Hero.tsx` — replace full-video hero with a clean landing hero. Remove the `<video>`, CA pill stays as a small badge. Keep word-by-word headline motion. Add CTA buttons "Generate Concept" and "How it works" that call `onNavigate`.

```tsx
import { motion } from 'framer-motion';
import { FadeUp } from './FadeUp';
import { Route } from '../hooks/useHashRoute';

const HEADLINE = 'TURN ONE IDEA INTO A LAUNCH-READY TOKEN.';
const SUBTEXT = 'Type the idea. We handle the ticker, the name, the lore, and the pump.fun link.';

export function Hero({ onNavigate }: { onNavigate: (r: Route) => void }) {
  const words = HEADLINE.split(' ');
  return (
    <section className="relative z-10 flex min-h-screen items-center justify-center px-6 md:px-12">
      <div className="max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-mint/30 bg-mint/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-mint">
          <span>CA: HKxpGGAfN3dE7AjQrJXbxUPf3eeAmGC6kwiGFFVbpump</span>
        </div>
        <h2
          className="hero-font flex flex-wrap justify-center gap-[0.25em] text-[clamp(28px,4vw,56px)] font-bold uppercase leading-[1.05] tracking-[-0.01em] text-white"
        >
          {words.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              {word}
            </motion.span>
          ))}
        </h2>
        <FadeUp as="p" delay={0.9} y={24} className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-white/70">
          {SUBTEXT}
        </FadeUp>
        <FadeUp delay={1} className="mt-10 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => onNavigate('generate')}
            className="rounded-full bg-mint px-8 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-black transition hover:brightness-110"
          >
            Generate Concept
          </button>
          <button
            onClick={() => onNavigate('how-it-works')}
            className="rounded-full border border-white/20 px-8 py-3 font-mono text-xs uppercase tracking-widest text-white/70 transition hover:border-mint hover:text-mint"
          >
            How it works
          </button>
        </FadeUp>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Verify build**

Run: `npm run build --workspace pounce-daemon`
Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add web/src/hooks/useHashRoute.ts web/src/App.tsx web/src/pages/HomePage.tsx web/src/components/Hero.tsx
git commit -m "feat: new route map, app shell, and slim home hero"
```

---

### Task 3: Navbar

**Files:**
- Modify: `web/src/components/Navbar.tsx`

**Interfaces:**
- Consumes: `Route` from `useHashRoute`, Task 2 routes.
- Produces: `<Navbar route onNavigate>` rendering mockup-style nav: logo, links (Home, Generate, My Concepts, Leaderboard, Community, How it works), cart icon, profile icon, Buy $PNCE link, GitHub link.

- [ ] **Step 1: Rewrite Navbar**

`web/src/components/Navbar.tsx`:

```tsx
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
```

- [ ] **Step 2: Verify build**

Run: `npm run build --workspace pounce-daemon`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add web/src/components/Navbar.tsx
git commit -m "feat: mockup-style navbar with green active pill"
```

---

### Task 4: Backgrounds lib

**Files:**
- Create: `web/src/lib/backgrounds.ts`

**Interfaces:**
- Produces: `export type Background = { id: string; name: string; style: CSSProperties }` and `export const BACKGROUNDS: Background[]` plus `export function nextBackground(currentId: string): string`. No new asset files — CSS gradients only (matches mockup's changeable background without adding heavy images).

- [ ] **Step 1: Create backgrounds lib**

`web/src/lib/backgrounds.ts`:

```ts
import type { CSSProperties } from 'react';

export type Background = {
  id: string;
  name: string;
  style: CSSProperties;
};

export const BACKGROUNDS: Background[] = [
  {
    id: 'night-grid',
    name: 'Night Grid',
    style: {
      background:
        'radial-gradient(circle at 20% 20%, rgba(80,224,160,0.15), transparent 45%), linear-gradient(135deg, #0e1116 0%, #1a1f2b 100%)',
      backgroundSize: 'cover',
    },
  },
  {
    id: 'mint-haze',
    name: 'Mint Haze',
    style: {
      background:
        'radial-gradient(circle at 80% 10%, rgba(80,224,160,0.25), transparent 55%), radial-gradient(circle at 10% 90%, rgba(80,224,160,0.1), transparent 50%), #0e1116',
    },
  },
  {
    id: 'amber-glow',
    name: 'Amber Glow',
    style: {
      background:
        'radial-gradient(circle at 50% 0%, rgba(255,178,56,0.18), transparent 60%), linear-gradient(180deg, #0e1116 0%, #15100a 100%)',
    },
  },
  {
    id: 'grid-lines',
    name: 'Grid Lines',
    style: {
      backgroundImage:
        'linear-gradient(rgba(80,224,160,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(80,224,160,0.06) 1px, transparent 1px)',
      backgroundSize: '48px 48px',
      backgroundColor: '#0e1116',
    },
  },
  {
    id: 'deep-space',
    name: 'Deep Space',
    style: {
      background:
        'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.06), transparent 40%), radial-gradient(circle at 70% 70%, rgba(80,224,160,0.08), transparent 45%), #0a0d12',
    },
  },
];

export function nextBackground(currentId: string): string {
  const idx = BACKGROUNDS.findIndex((b) => b.id === currentId);
  return BACKGROUNDS[(idx + 1) % BACKGROUNDS.length].id;
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build --workspace pounce-daemon`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add web/src/lib/backgrounds.ts
git commit -m "feat: swappable background library for generator preview"
```

---

### Task 5: GeneratePage — state machine + layout

**Files:**
- Create: `web/src/pages/GeneratePage.tsx`
- Create: `web/src/components/GeneratorPanel.tsx`
- Create: `web/src/components/ConceptPreview.tsx`
- Create: `web/src/components/ConceptDetail.tsx`
- Create: `web/src/components/WorkflowCard.tsx`
- Create: `web/src/components/ToolsGrid.tsx`

**Interfaces:**
- Consumes: `backgrounds.ts` (Task 4), `generateToken` via `/api/generate` (unchanged), `TOOLS` from `web/src/data/tools.ts`.
- Produces: shared `Token` type (same shape as API response, plus static metrics added at render): `{ ticker, name, tagline, description, lore, vibeScore, pumpUrl, generatedFrom, logoPrompt?, brandColors?, marketingHook? }`. GeneratePage owns state: `idea`, `status`, `error`, `token`, `bgId`. Child components receive props as defined below.

- [ ] **Step 1: Create GeneratePage**

`web/src/pages/GeneratePage.tsx`:

```tsx
import { useState } from 'react';
import { GeneratorPanel } from '../components/GeneratorPanel';
import { ConceptPreview } from '../components/ConceptPreview';
import { ConceptDetail } from '../components/ConceptDetail';
import { WorkflowCard } from '../components/WorkflowCard';
import { ToolsGrid } from '../components/ToolsGrid';
import { BACKGROUNDS, nextBackground } from '../lib/backgrounds';

export type Token = {
  ticker: string;
  name: string;
  tagline: string;
  description: string;
  lore: string;
  vibeScore: number;
  pumpUrl: string;
  generatedFrom: string;
  logoPrompt?: string;
  brandColors?: string[];
  marketingHook?: string;
};

export function GeneratePage() {
  const [idea, setIdea] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');
  const [token, setToken] = useState<Token | null>(null);
  const [bgId, setBgId] = useState(BACKGROUNDS[0].id);

  async function handleGenerate(prompt: string) {
    if (!prompt.trim() || status === 'loading') return;
    setStatus('loading');
    setError('');
    setToken(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed.');
      setToken(data);
      setStatus('idle');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Try again.');
      setStatus('error');
    }
  }

  const background = BACKGROUNDS.find((b) => b.id === bgId) ?? BACKGROUNDS[0];

  return (
    <div className="relative z-10 px-4 pt-24 pb-16 font-body text-paper md:px-6 md:pt-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr_340px]">
          <GeneratorPanel
            idea={idea}
            setIdea={setIdea}
            status={status}
            onGenerate={handleGenerate}
          />
          <ConceptPreview
            token={token}
            status={status}
            background={background}
            onChangeBackground={() => setBgId(nextBackground(bgId))}
          />
          <ConceptDetail token={token} status={status} error={error} />
        </div>

        <WorkflowCard className="mt-6" />
        <ToolsGrid className="mt-6" />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create GeneratorPanel**

`web/src/components/GeneratorPanel.tsx`:

```tsx
import { useState } from 'react';

const MAX_LENGTH = 120;

const INSPIRATIONS = [
  'When in doubt, ape it out.',
  'Exit liquidity? No, I am.',
  'Built different, Probably not.',
  'One more candle won\'t hurt.',
  'This is financial advice.',
];

type Props = {
  idea: string;
  setIdea: (v: string) => void;
  status: 'idle' | 'loading' | 'error';
  onGenerate: (idea: string) => void;
};

export function GeneratorPanel({ idea, setIdea, status, onGenerate }: Props) {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const pickRandom = () => {
    const pool = [...INSPIRATIONS, 'A token for the ones who never shut up about crypto at parties.', 'An AI that only trades on vibes, literally.', 'A meme coin for people who sold too early. Again.', 'The coin for people who read the whole whitepaper. Nobody.'];
    setIdea(pool[Math.floor(Math.random() * pool.length)]);
  };

  const copy = async (text: string, msg: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(msg);
    } catch {
      showToast('Copy failed — select and copy manually.');
    }
  };

  return (
    <aside className="rounded-2xl border border-line bg-[#151922] p-5">
      <label htmlFor="idea" className="font-mono text-xs uppercase tracking-widest text-paper/50">
        One Line Idea
      </label>
      <p className="mt-1 text-xs text-paper/40">
        Give us the idea. One sentence is enough: a mood, a meme, a headline.
      </p>
      <textarea
        id="idea"
        value={idea}
        onChange={(e) => setIdea(e.target.value.slice(0, MAX_LENGTH))}
        placeholder="When in doubt, ape it out."
        rows={3}
        maxLength={MAX_LENGTH}
        className="mt-3 w-full resize-none rounded-lg border border-line bg-transparent px-4 py-3 font-body text-base text-paper placeholder:text-paper/30"
      />
      <div className="mt-1 text-right font-mono text-xs text-paper/40">
        {idea.length} / {MAX_LENGTH}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => onGenerate(idea)}
          disabled={status === 'loading' || !idea.trim()}
          className="flex-1 rounded-full bg-mint px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === 'loading' ? 'Generating…' : 'Generate Concept'}
        </button>
        <button
          onClick={pickRandom}
          disabled={status === 'loading'}
          className="rounded-full border border-white/20 px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-white/70 transition hover:border-mint hover:text-mint disabled:opacity-40"
        >
          Random Idea
        </button>
      </div>

      <div className="mt-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-paper/40">Need Inspiration?</p>
        <ul className="mt-2 space-y-1">
          {INSPIRATIONS.map((item) => (
            <li key={item}>
              <button
                onClick={() => setIdea(item)}
                className="group flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-paper/60 transition hover:bg-white/5 hover:text-mint"
              >
                <span className="text-mint opacity-0 transition group-hover:opacity-100">→</span>
                <span>{item}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-xl border border-mint/20 bg-mint/5 p-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-mint">Launch on pump.fun</p>
        <p className="mt-1 text-xs leading-relaxed text-paper/50">
          Generate your token concept and launch it directly on pump.fun in one click.
        </p>
      </div>

      {toast && (
        <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full border border-mint/30 bg-[#151922]/95 px-6 py-3 font-mono text-xs text-mint shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md">
          {toast}
        </div>
      )}

      <p className="sr-only">Inspiration and launch helper panel</p>
      {/* keep copy() available for future use (ponytail: only used when needed) */}
    </aside>
  );
}
```

- [ ] **Step 3: Create ConceptPreview**

`web/src/components/ConceptPreview.tsx`:

```tsx
import type { CSSProperties } from 'react';
import { Token } from '../pages/GeneratePage';

type Props = {
  token: Token | null;
  status: 'idle' | 'loading' | 'error';
  background: { id: string; name: string; style: CSSProperties };
  onChangeBackground: () => void;
};

export function ConceptPreview({ token, status, background, onChangeBackground }: Props) {
  return (
    <section
      className="relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-line"
      style={background.style}
    >
      <div className="absolute inset-0 bg-black/30" />

      {status === 'loading' && (
        <div className="relative z-10 flex flex-col gap-3 p-8 text-center">
          <div className="h-5 w-24 animate-pulse rounded bg-white/20" />
          <div className="h-5 w-40 animate-pulse rounded bg-white/10" />
          <div className="h-3 w-64 animate-pulse rounded bg-white/10" />
          <p className="mt-2 font-mono text-xs text-mint">forging concept…</p>
        </div>
      )}

      {status !== 'loading' && !token && (
        <p className="relative z-10 px-8 text-center font-mono text-sm text-white/60">
          Your token concept appears here.
        </p>
      )}

      {token && (
        <div className="relative z-10 grid w-full max-w-md gap-3 p-6">
          <div className="rounded-xl border border-white/15 bg-black/50 p-4 backdrop-blur-sm">
            <span className="font-mono text-[10px] uppercase tracking-widest text-mint">Ticker</span>
            <p className="mt-1 text-2xl font-bold text-white">{token.ticker}</p>
          </div>
          <div className="rounded-xl border border-white/15 bg-black/50 p-4 backdrop-blur-sm">
            <span className="font-mono text-[10px] uppercase tracking-widest text-mint">Name</span>
            <p className="mt-1 text-xl font-semibold text-white">{token.name}</p>
          </div>
          <div className="rounded-xl border border-white/15 bg-black/50 p-4 backdrop-blur-sm">
            <span className="font-mono text-[10px] uppercase tracking-widest text-mint">Tagline</span>
            <p className="mt-1 text-sm text-white/90">{token.tagline}</p>
          </div>
          <div className="rounded-xl border border-white/15 bg-black/50 p-4 backdrop-blur-sm">
            <span className="font-mono text-[10px] uppercase tracking-widest text-mint">Lore</span>
            <p className="mt-1 text-sm italic text-white/80">{token.lore.split('\n\n')[0]}</p>
          </div>
        </div>
      )}

      <button
        onClick={onChangeBackground}
        className="absolute right-3 top-3 z-20 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white/70 backdrop-blur-sm transition hover:border-mint hover:text-mint"
      >
        Change Background
      </button>
    </section>
  );
}
```

- [ ] **Step 4: Create ConceptDetail**

`web/src/components/ConceptDetail.tsx`:

```tsx
import { useState } from 'react';
import { Token } from '../pages/GeneratePage';

type Props = {
  token: Token | null;
  status: 'idle' | 'loading' | 'error';
  error: string;
};

export function ConceptDetail({ token, status, error }: Props) {
  const [copied, setCopied] = useState(false);

  const copyDesc = async () => {
    if (!token) return;
    const text = `${token.tagline ? token.tagline + ' | ' : ''}${token.description}\n\n${token.lore}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <aside className="rounded-2xl border border-line bg-[#151922] p-5">
      <p className="font-mono text-[10px] uppercase tracking-widest text-paper/40">Generated Concept</p>

      {error && (
        <p className="mt-3 rounded-lg border border-coral/40 bg-coral/10 px-4 py-3 font-mono text-sm text-coral">
          {error}
        </p>
      )}

      {!token && status !== 'loading' && (
        <p className="mt-6 text-sm text-paper/40">
          Generate a concept to see the full details here.
        </p>
      )}

      {token && (
        <div className="mt-4">
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2"
              style={{
                borderColor: token.brandColors?.[0] ?? '#50E0A0',
                background: token.brandColors?.[0] ?? '#1a1f2b',
              }}
            >
              <img src="/logo.png" alt="Token mascot" className="h-full w-full object-contain" />
            </div>
            <div>
              <p className="font-mono text-lg font-bold text-mint">{token.ticker}</p>
              <p className="text-sm font-semibold text-white">{token.name}</p>
            </div>
          </div>

          <dl className="mt-5 space-y-3 text-sm">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-paper/40">Tagline</dt>
              <dd className="mt-0.5 text-paper/80">{token.tagline}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-paper/40">Description</dt>
              <dd className="mt-0.5 leading-relaxed text-paper/80">{token.description}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-paper/40">Lore</dt>
              <dd className="mt-0.5 whitespace-pre-wrap italic leading-relaxed text-paper/60">{token.lore}</dd>
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-line pt-3">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-paper/40">Est. Launch Cost</dt>
                <dd className="mt-0.5 text-mint">~0.02 SOL</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-paper/40">Network</dt>
                <dd className="mt-0.5 text-paper/80">Solana</dd>
              </div>
              <div className="col-span-2">
                <dt className="font-mono text-[10px] uppercase tracking-widest text-paper/40">Launch Platform</dt>
                <dd className="mt-0.5 text-paper/80">pump.fun</dd>
              </div>
            </div>
          </dl>

          <div className="mt-5 flex flex-col gap-2">
            <a
              href={token.pumpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-mint px-5 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-black transition hover:brightness-110"
            >
              Launch on pump.fun →
            </a>
            <button
              onClick={copyDesc}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 font-mono text-xs font-medium uppercase tracking-widest text-white transition hover:bg-white/10"
            >
              {copied ? 'Copied!' : 'Copy Description'}
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
```

- [ ] **Step 5: Create WorkflowCard**

`web/src/components/WorkflowCard.tsx`:

```tsx
import { useState } from 'react';
import { Token } from '../pages/GeneratePage';

type Props = {
  className?: string;
  token?: Token | null;
};

const STEPS = [
  { n: 'Idea', text: 'Your one line input' },
  { n: 'Generate', text: 'We craft the full concept' },
  { n: 'Launch', text: 'Take it to pump.fun' },
];

export function WorkflowCard({ className, token }: Props) {
  const [downloaded, setDownloaded] = useState(false);

  const download = () => {
    if (!token) return;
    const blob = new Blob([JSON.stringify(token, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${token.ticker.replace('$', '') || 'token'}-concept.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <section className={`rounded-2xl border border-line bg-[#151922] p-6 ${className ?? ''}`}>
      <p className="font-mono text-[10px] uppercase tracking-widest text-mint">Your Token Concept</p>
      <h3 className="mt-1 font-display text-2xl font-semibold text-white">One sentence. Infinite possibilities.</h3>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {STEPS.map((step) => (
          <div key={step.n} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-mint">{step.n}</p>
            <p className="mt-1 text-sm text-paper/60">{step.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={download}
          disabled={!token}
          className="rounded-full bg-mint px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {downloaded ? 'Downloaded!' : 'Download Concept'}
        </button>
        <p className="self-center font-mono text-xs text-paper/40">JSON file with everything you need.</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Create ToolsGrid**

`web/src/components/ToolsGrid.tsx`:

```tsx
import { TOOLS } from '../data/tools';
import { FadeUp } from './FadeUp';

export function ToolsGrid({ className }: { className?: string }) {
  return (
    <section className={`${className ?? ''}`}>
      <p className="font-mono text-[10px] uppercase tracking-widest text-paper/40">Tools</p>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {TOOLS.map((tool, i) => (
          <FadeUp key={tool.id} delay={0.03 * i}>
            <div className="h-full premium-card p-5">
              <div className="flex items-center justify-between">
                <span className="font-sans text-sm font-bold text-white">{tool.title}</span>
                {tool.status === 'live' ? (
                  <span className="rounded-full bg-mint/10 border border-mint/30 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-mint">
                    Live
                  </span>
                ) : (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white/40">
                    Soon
                  </span>
                )}
              </div>
              <p className="mt-3 font-sans text-xs leading-relaxed text-white/60">{tool.description}</p>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Wire download + change background into GeneratePage**

`web/src/pages/GeneratePage.tsx` — pass `token` to `WorkflowCard`:

```tsx
<WorkflowCard className="mt-6" token={token} />
```

- [ ] **Step 8: Verify build**

Run: `npm run build --workspace pounce-daemon`
Expected: build succeeds.

- [ ] **Step 9: Commit**

```bash
git add web/src/pages/GeneratePage.tsx web/src/components/GeneratorPanel.tsx web/src/components/ConceptPreview.tsx web/src/components/ConceptDetail.tsx web/src/components/WorkflowCard.tsx web/src/components/ToolsGrid.tsx
git commit -m "feat: three-column generate page matching mockup"
```

---

### Task 6: New pages (Concepts, Leaderboard, Community, How it works)

**Files:**
- Create: `web/src/pages/ConceptsPage.tsx`
- Create: `web/src/pages/LeaderboardPage.tsx`
- Create: `web/src/pages/CommunityPage.tsx`
- Create: `web/src/pages/HowItWorksPage.tsx`

**Interfaces:**
- Consumes: `BUNDLES` from `data/bundles.ts`, `SKILLS` from `data/skills.ts`, `MCP_SERVERS` from `data/mcpServers.ts`, `Tag`/`HotBadge`/`Stars` from `components/Tag.tsx`, `FadeUp`.
- Produces: four page components matching route names. Reuses the page-shell pattern: `pt-36` header + premium-card grids.

- [ ] **Step 1: Create ConceptsPage**

`web/src/pages/ConceptsPage.tsx`:

```tsx
import { FadeUp } from '../components/FadeUp';

export function ConceptsPage() {
  return (
    <div className="relative z-10 bg-transparent px-6 pb-16 pt-36 font-body text-paper md:px-12">
      <div className="mx-auto max-w-3xl">
        <FadeUp as="h1" className="font-sans text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
          My Concepts
        </FadeUp>
        <FadeUp as="p" delay={0.05} className="mt-3 font-sans text-sm text-white/60">
          Your saved token concepts will appear here.
        </FadeUp>
        <div className="mt-12 rounded-2xl border border-dashed border-white/15 p-16 text-center">
          <p className="font-mono text-sm text-white/40">No concepts saved yet. Generate one to get started.</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create LeaderboardPage**

`web/src/pages/LeaderboardPage.tsx`:

```tsx
import { FadeUp } from '../components/FadeUp';
import { HotBadge, Stars, Tag } from '../components/Tag';
import { BUNDLES } from '../data/bundles';

export function LeaderboardPage() {
  return (
    <div className="relative z-10 bg-transparent px-6 pb-16 pt-36 font-body text-paper md:px-12">
      <div className="mx-auto max-w-5xl">
        <FadeUp as="h1" className="font-sans text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
          Leaderboard
        </FadeUp>
        <FadeUp as="p" delay={0.05} className="mt-3 font-sans text-sm text-white/60 max-w-xl leading-relaxed">
          Top bundles and workflows, ranked by the community.
        </FadeUp>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {BUNDLES.map((bundle, i) => (
            <FadeUp key={bundle.id} delay={0.05 * i}>
              <div className="h-full premium-card p-6">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">{bundle.namespace}</span>
                  <div className="flex items-center gap-2">
                    {bundle.hot && <HotBadge />}
                    <Stars count={bundle.stars} />
                  </div>
                </div>
                <p className="mt-3 font-sans text-lg font-bold text-white">{bundle.name}</p>
                <p className="mt-2 max-w-md font-sans text-sm leading-relaxed text-white/60">{bundle.description}</p>
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
```

- [ ] **Step 3: Create CommunityPage**

`web/src/pages/CommunityPage.tsx` — reuse the search/category filter logic from the old SkillsPage (now with category + search working, officialOnly filter removed):

```tsx
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
```

- [ ] **Step 4: Create HowItWorksPage**

`web/src/pages/HowItWorksPage.tsx` — FAQ accordion + MCP servers:

```tsx
import { useState } from 'react';
import { FadeUp } from '../components/FadeUp';
import { HotBadge, Stars, Tag } from '../components/Tag';
import { MCP_SERVERS } from '../data/mcpServers';

const FAQS = [
  {
    q: 'What does Pounce Daemon actually generate?',
    a: 'A token concept from your idea: a ticker, a name, a short tagline, hype-style description copy, a piece of lore, and a vibe score from 1–10, plus a link to pump.fun/create.',
  },
  {
    q: 'Does Pounce Daemon launch the token for me?',
    a: 'No. Pounce Daemon only writes the concept and copy. Launching, funding, and everything on-chain happens on pump.fun, and that decision is entirely yours.',
  },
  {
    q: 'Can I use this from Claude Code?',
    a: 'Yes, the Skills and MCP sections list instruction files and server configs you can drop into a Claude Code project so your agent can generate concepts directly from the terminal.',
  },
  {
    q: 'Is this free?',
    a: 'The generator and directory are free to browse and use. You bring your own MegaLLM API key if you self-host the project.',
  },
];

export function HowItWorksPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="relative z-10 bg-transparent px-6 pb-16 pt-36 font-body text-paper md:px-12">
      <div className="mx-auto max-w-3xl">
        <FadeUp as="h1" className="font-sans text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
          How it works
        </FadeUp>
        <FadeUp as="p" delay={0.05} className="mt-3 font-sans text-sm text-white/60">
          From one line to launch-ready concept in seconds.
        </FadeUp>

        <div className="mt-10 space-y-4">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <FadeUp key={item.q} delay={i * 0.05}>
                <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 transition hover:border-mint/30">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 text-left"
                  >
                    <span className="font-sans text-base font-bold text-white">{item.q}</span>
                    <span className="font-mono text-lg text-mint">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <p className="mt-4 border-t border-white/5 pt-4 font-sans text-sm leading-relaxed text-white/70">
                      {item.a}
                    </p>
                  )}
                </div>
              </FadeUp>
            );
          })}
        </div>

        <div className="mt-12">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">MCP Servers</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {MCP_SERVERS.map((server, i) => (
              <FadeUp key={server.id} delay={0.03 * i}>
                <div className="h-full premium-card p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">{server.namespace}</span>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-mint/30 bg-mint/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-mint">HTTP</span>
                      {server.hot && <HotBadge />}
                      <Stars count={server.stars} />
                    </div>
                  </div>
                  <p className="mt-3 font-sans text-lg font-bold text-white">{server.name}</p>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-white/60">{server.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {server.tools.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Delete old pages/components**

Delete files:
- `web/src/pages/ToolsPage.tsx`
- `web/src/pages/SkillsPage.tsx`
- `web/src/pages/BundlesPage.tsx`
- `web/src/pages/McpPage.tsx`
- `web/src/pages/FaqPage.tsx`
- `web/src/components/TickerTape.tsx`
- `web/src/components/TerminalDemo.tsx`
- `web/src/components/ClosingCta.tsx`
- `web/src/components/DirectoryOverview.tsx`
- `web/src/components/Faq.tsx`

Run: `Remove-Item` on each file.

- [ ] **Step 6: Verify build**

Run: `npm run build --workspace pounce-daemon`
Expected: build succeeds, no unresolved imports.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add new pages, delete legacy catalog pages"
```

---

### Task 7: End-to-end verification

**Files:**
- None (verification only).

- [ ] **Step 1: Run dev server**

Run: `npm run dev --workspace pounce-daemon` (or reuse running instance).
Verify server serves on http://localhost:5173.

- [ ] **Step 2: Browser check — home**

Open http://localhost:5173/.
Expected: Hero with CA badge, headline, Generate Concept + How it works buttons. Footer shows "Built with 💚 for the meme economy. Not financial advice. DYOR."

- [ ] **Step 3: Browser check — generate page**

Open http://localhost:5173/#/generate.
Expected: 3 columns. Left panel with input, counter, Generate Concept + Random Idea buttons, inspiration list, launch info card. Center preview with background + Change Background button. Right panel empty state. Bottom workflow card + tools grid.

- [ ] **Step 4: Browser check — generate flow**

Type idea, click Generate Concept.
Expected: loading state in center, then concept cards overlay, right panel fills with ticker/name/tagline/description/lore, metrics (0.02 SOL / Solana / pump.fun), Launch button opens pump.fun in new tab, Copy Description works.

- [ ] **Step 5: Browser check — random + inspiration**

Click Random Idea → input fills. Click an inspiration item → input fills with that exact text. Char counter updates to N / 120.

- [ ] **Step 6: Browser check — download + background**

Click Change Background → background cycles. Click Download Concept (after generating) → JSON file downloads.

- [ ] **Step 7: Browser check — other pages**

Visit #/concepts, #/leaderboard, #/community, #/how-it-works. Expected: pages render with migrated content, navbar highlights active route.

- [ ] **Step 8: Build check**

Run: `npm run build --workspace pounce-daemon`
Expected: build passes.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: verify redesign end-to-end"
```

---

## Self-Review

**1. Spec coverage:**
- 3-column generator → Task 5 ✓
- Navbar mockup + icons → Task 3 ✓
- Footer "Built with 💚…" → Task 2 (App) ✓
- Inspiration items exact → Task 5 (GeneratorPanel) ✓
- Char counter N / 120 → Task 5 ✓
- Random Idea → Task 5 ✓
- Download Concept → Task 5 (WorkflowCard) ✓
- Change Background → Tasks 4-5 ✓
- Workflow card → Task 5 ✓
- Metrics SOL/Solana/pump.fun → Task 5 (ConceptDetail) ✓
- CA in header → Task 2-3 ✓
- Route map (Home/Generate/Concepts/Leaderboard/Community/How it works) → Task 2 ✓
- Content distribution (Bundles→Leaderboard, Skills→Community, FAQ+MCP→How it works, Tools→Generate) → Tasks 5-6 ✓
- Core functions kept (generate, launch, copy, error, loading) → Tasks 5-6 ✓
- Backend untouched → Global Constraints ✓

**2. Placeholder scan:** No TBD/TODO. All code blocks complete. The unused `copy` helper in GeneratorPanel is marked with a ponytail comment.

**3. Type consistency:** `Token` type defined once in GeneratePage.tsx and imported by child components. `Route` union defined once in useHashRoute.ts. `Background` type in backgrounds.ts used by ConceptPreview. All consistent.