import { FadeUp } from '../components/FadeUp';

export function ConceptsPage() {
  return (
    <div className="relative z-10 bg-transparent px-6 pb-16 pt-28 font-body text-paper md:px-12">
      <div className="mx-auto max-w-3xl">
        <FadeUp as="h1" className="font-sans text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
          My Concepts
        </FadeUp>
        <FadeUp as="p" delay={0.05} className="mt-2 font-sans text-sm text-[#A6B09D]">
          Your saved token concepts will appear here.
        </FadeUp>
        <div className="mt-8 glass-panel p-16 text-center border-dashed border-white/15">
          <p className="font-mono text-sm text-[#A6B09D]">No concepts saved yet. Generate one to get started.</p>
        </div>
      </div>
    </div>
  );
}