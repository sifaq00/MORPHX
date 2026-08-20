export function Tag({ children }: { children: string }) {
  return (
    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-[#A6B09D]">
      {children}
    </span>
  );
}

export function HotBadge() {
  return (
    <span className="rounded bg-coral px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-black">
      Hot
    </span>
  );
}

export function Stars({ count }: { count: number }) {
  const label = count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count);
  return <span className="font-mono text-xs text-lime/80">★ {label}</span>;
}
