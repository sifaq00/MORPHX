import { useState } from 'react';
import type { CSSProperties } from 'react';
import { GeneratorPanel } from '../components/GeneratorPanel';
import { ConceptPreview } from '../components/ConceptPreview';
import { ConceptDetail } from '../components/ConceptDetail';
import { saveConcept } from '../lib/concepts';

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
  logoUrl?: string;
  brandColors?: string[];
  marketingHook?: string;
};

type Props = {
  background: { id: string; name: string; style: CSSProperties };
  onChangeBackground: () => void;
};

export function GeneratePage({ background, onChangeBackground }: Props) {
  const [idea, setIdea] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('pounce-initial-idea');
      if (saved) {
        sessionStorage.removeItem('pounce-initial-idea');
        return saved;
      }
    }
    return 'When in doubt,\nape it out.';
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');
  const [token, setToken] = useState<Token | null>(null);

  async function handleGenerate(prompt: string) {
    if (!prompt.trim() || status === 'loading') return;
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed.');
      setToken(data);
      saveConcept(data);
      setStatus('idle');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Try again.');
      setStatus('error');
    }
  }

  function handleUpdateToken(updated: Token) {
    setToken(updated);
    saveConcept(updated);
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-5 md:px-6 pt-20 sm:pt-24 pb-8">
      <div className="flex flex-col xl:grid xl:grid-cols-[290px_1fr_320px] 2xl:grid-cols-[320px_1fr_350px] gap-4 md:gap-5 items-start">
        {/* Left Column: Generator Inputs, Inspirations & Quick Launch */}
        <div className="generate-col-item w-full xl:sticky xl:top-20">
          <GeneratorPanel
            idea={idea}
            setIdea={setIdea}
            status={status}
            onGenerate={handleGenerate}
          />
        </div>

        {/* Middle Column: 4 Floating Pins & Background Scene */}
        <div className="generate-col-item w-full min-w-0">
          <ConceptPreview
            token={token}
            status={status}
            background={background}
            onChangeBackground={onChangeBackground}
          />
        </div>

        {/* Right Column: Full Token Specs, Logo Forge & Launch Action */}
        <div className="generate-col-item w-full xl:sticky xl:top-20">
          <ConceptDetail
            token={token}
            status={status}
            error={error}
            onUpdateToken={handleUpdateToken}
          />
        </div>
      </div>
    </div>
  );
}
