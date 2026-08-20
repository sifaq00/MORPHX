import { useState } from 'react';
import type { CSSProperties } from 'react';
import { GeneratorPanel } from '../components/GeneratorPanel';
import { ConceptPreview } from '../components/ConceptPreview';
import { ConceptDetail } from '../components/ConceptDetail';

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

type Props = {
  background: { id: string; name: string; style: CSSProperties };
  onChangeBackground: () => void;
};

export function GeneratePage({ background, onChangeBackground }: Props) {
  const [idea, setIdea] = useState('When in doubt,\nape it out.');
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
      setStatus('idle');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Try again.');
      setStatus('error');
    }
  }

  return (
    <div className="w-full max-w-[1520px] mx-auto px-4 pt-20 pb-4 md:px-6 md:pt-20 font-sans">
      <div className="grid gap-4 lg:grid-cols-[285px_1fr_315px] xl:grid-cols-[290px_1fr_320px] items-stretch min-h-[calc(100vh-150px)]">
        {/* Left Column: Generator Inputs, Inspirations & Quick Launch */}
        <GeneratorPanel
          idea={idea}
          setIdea={setIdea}
          status={status}
          onGenerate={handleGenerate}
        />

        {/* Middle Column: Room Canvas with 4 Floating Pins & Bottom Workflow Card */}
        <ConceptPreview
          token={token}
          status={status}
          background={background}
          onChangeBackground={onChangeBackground}
        />

        {/* Right Column: Generated Concept Specs & Direct Launch Action */}
        <ConceptDetail token={token} status={status} error={error} />
      </div>
    </div>
  );
}
