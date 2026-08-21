import { useEffect, useRef } from 'react';

// WebThreads: Glowing interactive spiderweb threads that fan from the top
// and bend gracefully toward the cursor position. Lightweight and zero scroll lag.
export function WebThreads() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rafId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      active: false,
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handlePointerMove = (e: PointerEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handlePointerLeave = () => {
      mouse.active = false;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(render);
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 10 subtle glowing spiderweb threads anchored along the top edge
    const COUNT = 10;
    const threads = Array.from({ length: COUNT }, (_, i) => {
      const t = i / (COUNT - 1);
      return {
        x0: t * width,
        phase: (i * 0.6) % (Math.PI * 2),
        speed: 0.25 + (i % 3) * 0.1,
        len: 0.38 + (i % 4) * 0.08,
        color:
          i % 3 === 0
            ? 'rgba(198, 242, 80, 0.36)' // Soft neon lime
            : 'rgba(255, 255, 255, 0.28)', // Soft silver white
      };
    });

    const drawThread = (t: (typeof threads)[number], now: number) => {
      const time = now * t.speed;
      const fx = mouse.active
        ? mouse.x + Math.sin(time + t.phase) * 14
        : width * 0.5 + Math.sin(time * 0.25 + t.phase) * (width * 0.16);
      const fy = mouse.active ? mouse.y : height * 0.3;

      ctx.beginPath();
      ctx.moveTo(t.x0, 0);

      // Smooth Bezier curve converging toward mouse cursor
      const cx1 = t.x0 + (fx - t.x0) * 0.35;
      const cy1 = height * t.len * 0.32;
      const cx2 = fx - (fx - t.x0) * 0.15;
      const cy2 = fy + (height - fy) * 0.12;

      ctx.bezierCurveTo(cx1, cy1, cx2, cy2, fx, fy);
      ctx.strokeStyle = t.color;
      ctx.lineWidth = mouse.active ? 1.0 : 0.8;
      ctx.stroke();
    };

    const render = () => {
      if (document.hidden) return;

      ctx.clearRect(0, 0, width, height);

      // Smooth lerp mouse coordinates
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      const now = performance.now() / 1000;
      for (let i = 0; i < threads.length; i++) {
        drawThread(threads[i], now);
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      style={{ mixBlendMode: 'screen', opacity: 0.58 }}
    />
  );
}