import { useEffect, useRef, useState } from 'react';

export function CursorRing() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    // Disable on touch devices or reduced motion
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let rafId: number;
    const mouse = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };

    const handlePointerMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.opacity = '1';
        dotRef.current.style.transform = `translate3d(${mouse.x - 3}px, ${mouse.y - 3}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.opacity = '1';
      }

      // Check if hovering interactive target
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = Boolean(
          target.closest('button, a, input, textarea, [role="button"], .cursor-pointer')
        );
        if (isHoveredRef.current !== interactive) {
          isHoveredRef.current = interactive;
          setIsHovered(interactive);
        }
      }
    };

    const handlePointerLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    // Smooth spring/lerp loop for trailing ring
    const loop = () => {
      ring.x += (mouse.x - ring.x) * 0.2;
      ring.y += (mouse.y - ring.y) * 0.2;

      if (ringRef.current) {
        const size = isHoveredRef.current ? 44 : 28;
        const scale = isHoveredRef.current ? 1.35 : 1.0;
        ringRef.current.style.transform = `translate3d(${ring.x - size / 2}px, ${ring.y - size / 2}px, 0) scale(${scale})`;
      }

      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Precision Core Dot */}
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-1.5 w-1.5 rounded-full bg-[#C6F250] shadow-[0_0_8px_#C6F250] transition-opacity duration-200"
        style={{ opacity: 0, willChange: 'transform' }}
      />

      {/* Trailing Spring Ring */}
      <div
        ref={ringRef}
        aria-hidden
        className={`pointer-events-none fixed top-0 left-0 z-[9998] rounded-full border border-[#C6F250]/70 transition-[width,height,border-color,background-color] duration-200 ${
          isHovered
            ? 'h-11 w-11 bg-[#C6F250]/15 border-[#C6F250] shadow-[0_0_15px_rgba(198,242,80,0.3)]'
            : 'h-7 w-7 bg-transparent border-[#C6F250]/50'
        }`}
        style={{ opacity: 0, willChange: 'transform' }}
      />
    </>
  );
}