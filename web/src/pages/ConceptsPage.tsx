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