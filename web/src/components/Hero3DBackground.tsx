import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function Hero3DBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Scene, Camera, WebGLRenderer with 100% transparent alpha
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Completely transparent
    container.appendChild(renderer.domElement);

    // Dynamic Luminous Cyber Constellation Nodes
    const particleCount = 75;
    const particles = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorLime = new THREE.Color(0xc6f250);
    const colorEmerald = new THREE.Color(0x00ffa3);
    const colorWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      particles[i * 3] = (Math.random() - 0.5) * 36;
      particles[i * 3 + 1] = (Math.random() - 0.5) * 18;
      particles[i * 3 + 2] = (Math.random() - 0.5) * 12;

      velocities[i * 3] = (Math.random() - 0.5) * 0.016;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.016;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.012;

      const rand = Math.random();
      const c = rand > 0.4 ? colorLime : rand > 0.15 ? colorEmerald : colorWhite;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particles, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Pure additive glow points (Original delicate & crisp micro nodes)
    const particleMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.80,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const pointSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(pointSystem);

    // Dynamic Connecting Cyber Lines (Delicate & crisp)
    const maxConnections = particleCount * 4;
    const linePositions = new Float32Array(maxConnections * 6);
    const lineColors = new Float32Array(maxConnections * 6);

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineMesh);

    // Mouse Tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouse.targetX = x * 4;
      mouse.targetY = y * 4;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // IntersectionObserver to pause rendering when scrolled out of view
    let isVisible = true;
    let rafId = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
        if (isVisible) {
          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else if (isVisible) {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(animate);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 60FPS Luminous Animation Loop
    const CONNECT_DIST = 5.2;
    const animate = () => {
      if (!isVisible || document.hidden) return;

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Update Particle Positions
      const pos = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3] += velocities[i * 3];
        pos[i * 3 + 1] += velocities[i * 3 + 1];
        pos[i * 3 + 2] += velocities[i * 3 + 2];

        // Soft boundary reflection
        if (pos[i * 3] < -16 || pos[i * 3] > 16) velocities[i * 3] *= -1;
        if (pos[i * 3 + 1] < -8 || pos[i * 3 + 1] > 8) velocities[i * 3 + 1] *= -1;
        if (pos[i * 3 + 2] < -5 || pos[i * 3 + 2] > 5) velocities[i * 3 + 2] *= -1;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Connect Near Nodes with Glowing Lines
      let lineIdx = 0;
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = pos[i * 3] - pos[j * 3];
          const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
          const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < CONNECT_DIST && lineIdx < maxConnections) {
            const alpha = 1.0 - dist / CONNECT_DIST;

            linePositions[lineIdx * 6] = pos[i * 3];
            linePositions[lineIdx * 6 + 1] = pos[i * 3 + 1];
            linePositions[lineIdx * 6 + 2] = pos[i * 3 + 2];

            linePositions[lineIdx * 6 + 3] = pos[j * 3];
            linePositions[lineIdx * 6 + 4] = pos[j * 3 + 1];
            linePositions[lineIdx * 6 + 5] = pos[j * 3 + 2];

            lineColors[lineIdx * 6] = colorLime.r * alpha;
            lineColors[lineIdx * 6 + 1] = colorLime.g * alpha;
            lineColors[lineIdx * 6 + 2] = colorLime.b * alpha;

            lineColors[lineIdx * 6 + 3] = colorLime.r * alpha;
            lineColors[lineIdx * 6 + 4] = colorLime.g * alpha;
            lineColors[lineIdx * 6 + 5] = colorLime.b * alpha;

            lineIdx++;
          }
        }
      }

      lineGeo.setDrawRange(0, lineIdx * 2);
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate = true;

      // Subtle Scene Parallax Tilt
      scene.rotation.y = mouse.x * 0.08;
      scene.rotation.x = -mouse.y * 0.08;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
      cancelAnimationFrame(rafId);

      // Clean GPU memory
      particleGeo.dispose();
      particleMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="pointer-events-none absolute -inset-6 -z-10 overflow-hidden select-none">
      {/* 100% Transparent Three.js WebGL Canvas (Delicate Cyber Constellation) */}
      <div ref={mountRef} className="h-full w-full opacity-65" style={{ mixBlendMode: 'screen' }} />
    </div>
  );
}

