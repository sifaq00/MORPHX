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

        <WorkflowCard className="mt-6" token={token} />
        <ToolsGrid className="mt-6" />
      </div>
    </div>
  );
}
