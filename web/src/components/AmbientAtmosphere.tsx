import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
}

export function AmbientAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
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

    // 8 optimized subtle spiderweb threads
    const THREAD_COUNT = 8;
    const threads = Array.from({ length: THREAD_COUNT }, (_, i) => {
      const t = i / (THREAD_COUNT - 1);
      return {
        x0: t * width,
        phase: (i * 0.7) % (Math.PI * 2),
        speed: 0.2 + (i % 3) * 0.08,
        len: 0.35 + (i % 4) * 0.06,
        color: i % 3 === 0 ? 'rgba(198, 242, 80, 0.32)' : 'rgba(255, 255, 255, 0.22)',
      };
    });

    // 16 lightweight floating dust particles
    const PARTICLE_COUNT = 16;
    const colors = ['rgba(255, 255, 255, 0.2)', 'rgba(240, 244, 236, 0.16)', 'rgba(198, 242, 80, 0.18)'];
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.4 + 0.6,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: -Math.random() * 0.2 - 0.06,
      color: colors[i % colors.length],
    }));

    const render = () => {
      if (document.hidden) return;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      const now = performance.now() * 0.001;

      // 1. Draw Spiderweb Threads
      for (let i = 0; i < threads.length; i++) {
        const t = threads[i];
        const time = now * t.speed;
        const fx = mouse.active
          ? mouse.x + Math.sin(time + t.phase) * 12
          : width * 0.5 + Math.sin(time * 0.2 + t.phase) * (width * 0.15);
        const fy = mouse.active ? mouse.y : height * 0.3;

        ctx.beginPath();
        ctx.moveTo(t.x0, 0);
        const cx1 = t.x0 + (fx - t.x0) * 0.35;
        const cy1 = height * t.len * 0.32;
        const cx2 = fx - (fx - t.x0) * 0.15;
        const cy2 = fy + (height - fy) * 0.12;

        ctx.bezierCurveTo(cx1, cy1, cx2, cy2, fx, fy);
        ctx.strokeStyle = t.color;
        ctx.lineWidth = 0.85;
        ctx.stroke();
      }

      // 2. Draw Dust Motes in same pass
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < 0) {
          p.y = height + 5;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width + 5;
        if (p.x > width + 5) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
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
      style={{ mixBlendMode: 'screen', opacity: 0.58, willChange: 'transform' }}
    />
  );
}
