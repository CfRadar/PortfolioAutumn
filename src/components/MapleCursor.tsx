import { useEffect, useRef, useState } from "react";
import { getWind } from "../wind";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity: number;
  drag: number;
  rot: number;
  vRot: number;
  swayPhase: number;
  swaySpeed: number;
  flutterStrength: number;
  size: number;
  color: string;
  shape: "leaf" | "ember" | "flake";
  opacity: number;
  decay: number;
}

const AUTUMN_COLORS = ["#D9622B", "#A8321F", "#F2A541", "#E0B83A", "#C2563A", "#FFF7D6"];

export default function MapleCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const pos = useRef({
    x: -100,
    y: -100,
    targetX: -100,
    targetY: -100,
    angle: 0,
    distMoved: 0,
  });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");

    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - pos.current.targetX;
      const dy = e.clientY - pos.current.targetY;
      const dist = Math.hypot(dx, dy);

      pos.current.targetX = e.clientX;
      pos.current.targetY = e.clientY;

      const targetAngle = Math.max(-30, Math.min(30, dx * 1.6));
      pos.current.angle += (targetAngle - pos.current.angle) * 0.25;

      pos.current.distMoved += dist;

      // Shed falling particles as cursor moves through space
      if (pos.current.distMoved > 16) {
        pos.current.distMoved = 0;
        const count = Math.random() < 0.65 ? 1 : 2;
        for (let i = 0; i < count; i++) {
          if (particlesRef.current.length > 130) break;
          particlesRef.current.push({
            x: e.clientX + (Math.random() - 0.5) * 10,
            y: e.clientY + (Math.random() - 0.5) * 10,
            // Inherit reverse momentum & dispersion
            vx: -dx * 0.08 + (Math.random() - 0.5) * 0.9,
            vy: -dy * 0.06 + Math.random() * 0.6,
            gravity: 0.045 + Math.random() * 0.04,
            drag: 0.985,
            rot: Math.random() * 360,
            vRot: (Math.random() - 0.5) * 10,
            swayPhase: Math.random() * Math.PI * 2,
            swaySpeed: 0.03 + Math.random() * 0.04,
            flutterStrength: 0.35 + Math.random() * 0.45,
            size: Math.random() < 0.4 ? 4 : Math.random() < 0.75 ? 3 : 2,
            color: AUTUMN_COLORS[Math.floor(Math.random() * AUTUMN_COLORS.length)],
            shape: Math.random() < 0.5 ? "leaf" : Math.random() < 0.8 ? "flake" : "ember",
            opacity: 0.9 + Math.random() * 0.1,
            decay: 0.009 + Math.random() * 0.012,
          });
        }
      }

      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest("a, button, [role='button'], [role='tab'], .q, .sq, .slot, .dlg, .ev, .cd, input")
        );
        setHovered(isInteractive);
      }
    };

    let idleTimer = 0;

    const onClick = (e: MouseEvent) => {
      // Explosive click burst of leaves caught by the wind
      const burstCount = 11;
      for (let i = 0; i < burstCount; i++) {
        const rad = (Math.PI * 2 * i) / burstCount + (Math.random() - 0.5) * 0.4;
        const spd = 1.6 + Math.random() * 2.6;
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(rad) * spd,
          vy: Math.sin(rad) * spd - 1.4,
          gravity: 0.05 + Math.random() * 0.04,
          drag: 0.97,
          rot: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 16,
          swayPhase: Math.random() * Math.PI * 2,
          swaySpeed: 0.04 + Math.random() * 0.04,
          flutterStrength: 0.4 + Math.random() * 0.5,
          size: Math.random() < 0.5 ? 4 : 3,
          color: AUTUMN_COLORS[Math.floor(Math.random() * AUTUMN_COLORS.length)],
          shape: Math.random() < 0.6 ? "leaf" : "ember",
          opacity: 1,
          decay: 0.013 + Math.random() * 0.01,
        });
      }
    };

    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("click", onClick, { passive: true });

    let raf = 0;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min(3, (currentTime - lastTime) / 16.6 || 1);
      lastTime = currentTime;

      pos.current.x += (pos.current.targetX - pos.current.x) * 0.8;
      pos.current.y += (pos.current.targetY - pos.current.y) * 0.8;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.current.x - 14}px, ${pos.current.y - 14}px, 0) rotate(${pos.current.angle}deg)`;
      }

      // Idle shedding while hovering
      idleTimer += dt;
      if (idleTimer > 8 && pos.current.targetX > 0 && particlesRef.current.length < 110) {
        idleTimer = 0;
        particlesRef.current.push({
          x: pos.current.x + (Math.random() - 0.5) * 10,
          y: pos.current.y + 12,
          vx: (Math.random() - 0.5) * 0.35,
          vy: 0.2 + Math.random() * 0.35,
          gravity: 0.035,
          drag: 0.985,
          rot: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 6,
          swayPhase: Math.random() * Math.PI * 2,
          swaySpeed: 0.025,
          flutterStrength: 0.38,
          size: Math.random() < 0.5 ? 3 : 2,
          color: AUTUMN_COLORS[Math.floor(Math.random() * AUTUMN_COLORS.length)],
          shape: "flake",
          opacity: 0.85,
          decay: 0.012,
        });
      }

      const cv = canvasRef.current;
      if (cv) {
        const ctx = cv.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, cv.width, cv.height);

          particlesRef.current.forEach((p) => {
            // Apply imaginary wind physics!
            const wind = getWind(p.x, p.y, currentTime);

            p.vx += (wind.windX - p.vx) * 0.04 * dt;
            p.vy += (wind.windY + p.gravity * 16 - p.vy) * 0.038 * dt;

            p.swayPhase += p.swaySpeed * dt;
            const flutter = Math.sin(p.swayPhase) * p.flutterStrength;

            p.x += (p.vx + flutter) * dt;
            p.y += p.vy * dt;

            p.vx *= Math.pow(p.drag, dt);
            p.vy *= Math.pow(p.drag, dt);
            p.rot += (p.vRot + flutter * 4) * dt;
            p.opacity -= p.decay * dt;

            if (p.opacity > 0) {
              ctx.save();
              ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));
              ctx.fillStyle = p.color;
              ctx.translate(p.x, p.y);
              ctx.rotate((p.rot * Math.PI) / 180);

              if (p.shape === "leaf") {
                ctx.fillRect(-p.size, -p.size / 2, p.size * 2, p.size);
                ctx.fillRect(-p.size / 2, -p.size, p.size, p.size * 2);
              } else if (p.shape === "ember") {
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.fillStyle = "#FFF7D6";
                ctx.fillRect(-0.5, -0.5, 1, 1);
              } else {
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
              }
              ctx.restore();
            }
          });

          particlesRef.current = particlesRef.current.filter(
            (p) => p.opacity > 0 && p.y < cv.height + 20 && p.x < cv.width + 40
          );
        }
      }

      raf = requestAnimationFrame(loop);
    };

    const onResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    onResize();
    addEventListener("resize", onResize);
    raf = requestAnimationFrame(loop);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      removeEventListener("pointermove", onMove);
      removeEventListener("click", onClick);
      removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="maple-particle-canvas"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 99998,
        }}
      />
      <div
        ref={cursorRef}
        className={`maple-cursor ${hovered ? "hovered" : ""}`}
        aria-hidden="true"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stem */}
          <rect x="11" y="18" width="2" height="5" fill="#4A2F1F" />
          <rect x="10" y="20" width="1" height="2" fill="#2B1B2E" />

          {/* Top lobe */}
          <rect x="10" y="2" width="4" height="4" fill="#A8321F" />
          <rect x="11" y="1" width="2" height="2" fill="#D9622B" />
          <rect x="11" y="0" width="2" height="1" fill="#F2A541" />

          {/* Main blade */}
          <rect x="8" y="5" width="8" height="5" fill="#D9622B" />
          <rect x="9" y="6" width="6" height="4" fill="#F2A541" />
          <rect x="11" y="5" width="2" height="9" fill="#FFF7D6" />

          {/* Left lobe */}
          <rect x="3" y="9" width="3" height="3" fill="#A8321F" />
          <rect x="2" y="10" width="2" height="2" fill="#D9622B" />
          <rect x="5" y="8" width="4" height="6" fill="#D9622B" />
          <rect x="6" y="9" width="3" height="3" fill="#F2A541" />

          {/* Right lobe */}
          <rect x="18" y="9" width="3" height="3" fill="#A8321F" />
          <rect x="20" y="10" width="2" height="2" fill="#D9622B" />
          <rect x="15" y="8" width="4" height="6" fill="#D9622B" />
          <rect x="15" y="9" width="3" height="3" fill="#F2A541" />

          {/* Lower Lobes */}
          <rect x="5" y="14" width="4" height="3" fill="#A8321F" />
          <rect x="4" y="15" width="2" height="2" fill="#8F2418" />
          <rect x="15" y="14" width="4" height="3" fill="#A8321F" />
          <rect x="18" y="15" width="2" height="2" fill="#8F2418" />

          {/* Central Heart */}
          <rect x="9" y="10" width="6" height="7" fill="#D9622B" />
          <rect x="10" y="11" width="4" height="5" fill="#F2A541" />
          <rect x="11" y="12" width="2" height="4" fill="#E0B83A" />

          {/* Outline / Shading */}
          <rect x="9" y="17" width="6" height="2" fill="#7A321F" />
          <rect x="7" y="14" width="2" height="2" fill="#7A321F" />
          <rect x="15" y="14" width="2" height="2" fill="#7A321F" />
        </svg>
      </div>
    </>
  );
}
