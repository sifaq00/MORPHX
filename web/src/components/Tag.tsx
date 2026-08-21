export function Tag({ children }: { children: string }) {
  return (
    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-[#A6B09D] transition-colors hover:border-[#C6F250]/40 hover:text-white">
      {children}
    </span>
  );
}

export function HotBadge() {
  return (
    <span className="rounded bg-[#FF5733] px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
      Hot
    </span>
  );
}

export function Stars({ count }: { count: number }) {
  const label = count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count);
  return <span className="font-mono text-xs text-[#C6F250] font-semibold">★ {label}</span>;
}
