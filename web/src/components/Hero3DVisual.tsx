import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function Hero3DVisual({ className = '' }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 1. Inner Core: High-Tech Icosahedron Wireframe
    const coreGeo = new THREE.IcosahedronGeometry(1.25, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xc6f250,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // 2. Inner Crystal: Solid facet core with subtle dark translucency
    const innerCrystalGeo = new THREE.OctahedronGeometry(0.75, 0);
    const innerCrystalMat = new THREE.MeshBasicMaterial({
      color: 0x182210,
      wireframe: false,
      transparent: true,
      opacity: 0.85,
    });
    const innerCrystal = new THREE.Mesh(innerCrystalGeo, innerCrystalMat);
    scene.add(innerCrystal);

    // Inner Crystal Wireframe Accent
    const innerWireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const innerWire = new THREE.Mesh(innerCrystalGeo, innerWireMat);
    scene.add(innerWire);

    // 3. Dual Gimbal Orbital Rings
    const ringGeo1 = new THREE.TorusGeometry(1.9, 0.012, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xc6f250,
      transparent: true,
      opacity: 0.6,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.15, 0.01, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xe4ebe0,
      transparent: true,
      opacity: 0.35,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // 4. Orbiting Cyber Quantum Data Points
    const particleCount = 100;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.8 + Math.random() * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xc6f250,
      size: 0.045,
      transparent: true,
      opacity: 0.85,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Tracking for Smooth Parallax Tilt
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouse.targetX = x * 1.2;
      mouse.targetY = y * 1.2;
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

    // 60FPS Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      if (!isVisible || document.hidden) return;

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerping
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Rotate geometries gracefully
      coreMesh.rotation.x += delta * 0.45;
      coreMesh.rotation.y += delta * 0.55;

      innerCrystal.rotation.x -= delta * 0.3;
      innerCrystal.rotation.y += delta * 0.4;
      innerWire.rotation.x -= delta * 0.3;
      innerWire.rotation.y += delta * 0.4;

      ring1.rotation.z += delta * 0.6;
      ring1.rotation.x = Math.PI / 3 + Math.sin(elapsedTime * 0.8) * 0.15;

      ring2.rotation.z -= delta * 0.5;
      ring2.rotation.y = Math.PI / 4 + Math.cos(elapsedTime * 0.7) * 0.18;

      particles.rotation.y += delta * 0.18;
      particles.rotation.x += delta * 0.1;

      // Subtle breath pulsing scale
      const pulse = 1 + Math.sin(elapsedTime * 1.5) * 0.04;
      coreMesh.scale.set(pulse, pulse, pulse);

      // Camera tilt parallax
      scene.rotation.y = mouse.x * 0.6;
      scene.rotation.x = -mouse.y * 0.6;

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
      coreGeo.dispose();
      coreMat.dispose();
      innerCrystalGeo.dispose();
      innerCrystalMat.dispose();
      innerWireMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`relative w-full h-[220px] sm:h-[260px] md:h-[280px] flex items-center justify-center pointer-events-none select-none ${className}`}>
      {/* Background Soft Neon Radial Aura */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-40 w-40 sm:h-52 sm:w-52 rounded-full bg-[#C6F250]/15 blur-3xl" />
      </div>

      {/* WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full relative z-10" />
    </div>
  );
}
