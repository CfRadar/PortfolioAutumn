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
  const [enabled] = useState(() => {
    if (typeof window === "undefined") return false;
    return !window.matchMedia("(pointer: coarse)").matches;
  });
  const [hovered, setHovered] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasInit = useRef(false);

  const pos = useRef({
    x: -100,
    y: -100,
    targetX: -100,
    targetY: -100,
    angle: 0,
    distMoved: 0,
  });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("custom-cursor-active");

    const cv = canvasRef.current;
    if (cv) {
      cv.width = window.innerWidth;
      cv.height = window.innerHeight;
    }

    const onMove = (e: PointerEvent) => {
      // Clean initial mouse entry: snap to mouse without giant false distance leap
      if (!hasInit.current) {
        hasInit.current = true;
        pos.current.x = e.clientX;
        pos.current.y = e.clientY;
        pos.current.targetX = e.clientX;
        pos.current.targetY = e.clientY;
        pos.current.distMoved = 0;
        return;
      }

      const dx = e.clientX - pos.current.targetX;
      const dy = e.clientY - pos.current.targetY;
      const dist = Math.hypot(dx, dy);

      pos.current.targetX = e.clientX;
      pos.current.targetY = e.clientY;

      const targetAngle = Math.max(-28, Math.min(28, dx * 1.5));
      pos.current.angle += (targetAngle - pos.current.angle) * 0.28;

      pos.current.distMoved += dist;

      // Continuous ribbon trail: spawn particles interpolated along the movement path
      while (pos.current.distMoved >= 10) {
        pos.current.distMoved -= 10;
        if (particlesRef.current.length > 220) break;

        const frac = dist > 0 ? Math.min(1, pos.current.distMoved / dist) : 0;
        const spawnX = e.clientX - dx * frac + (Math.random() - 0.5) * 8;
        const spawnY = e.clientY - dy * frac + (Math.random() - 0.5) * 8;

        particlesRef.current.push({
          x: spawnX,
          y: spawnY,
          vx: -dx * 0.05 + (Math.random() - 0.5) * 0.7,
          vy: -dy * 0.04 + Math.random() * 0.5,
          gravity: 0.038 + Math.random() * 0.03,
          drag: 0.988,
          rot: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 8,
          swayPhase: Math.random() * Math.PI * 2,
          swaySpeed: 0.025 + Math.random() * 0.03,
          flutterStrength: 0.35 + Math.random() * 0.4,
          size: Math.random() < 0.4 ? 4 : Math.random() < 0.75 ? 3 : 2,
          color: AUTUMN_COLORS[Math.floor(Math.random() * AUTUMN_COLORS.length)],
          shape: Math.random() < 0.55 ? "leaf" : Math.random() < 0.82 ? "flake" : "ember",
          opacity: 0.95,
          // Lingers 2.5 - 3.2 seconds floating on the wind
          decay: 0.005 + Math.random() * 0.005,
        });
      }

      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest("a, button, [role='button'], [role='tab'], .q, .sq, .slot, .ev, .cd, input")
        );
        setHovered(isInteractive);
      }
    };

    let idleTimer = 0;

    const onClick = (e: MouseEvent) => {
      // Explosive click burst of leaves caught by the wind
      const burstCount = 14;
      for (let i = 0; i < burstCount; i++) {
        const rad = (Math.PI * 2 * i) / burstCount + (Math.random() - 0.5) * 0.4;
        const spd = 1.8 + Math.random() * 2.8;
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(rad) * spd,
          vy: Math.sin(rad) * spd - 1.2,
          gravity: 0.045 + Math.random() * 0.035,
          drag: 0.975,
          rot: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 14,
          swayPhase: Math.random() * Math.PI * 2,
          swaySpeed: 0.035 + Math.random() * 0.035,
          flutterStrength: 0.4 + Math.random() * 0.4,
          size: Math.random() < 0.55 ? 4 : 3,
          color: AUTUMN_COLORS[Math.floor(Math.random() * AUTUMN_COLORS.length)],
          shape: Math.random() < 0.65 ? "leaf" : "ember",
          opacity: 1,
          decay: 0.007 + Math.random() * 0.006,
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

      if (cursorRef.current && hasInit.current) {
        cursorRef.current.style.transform = `translate3d(${pos.current.x - 14}px, ${pos.current.y - 14}px, 0) rotate(${pos.current.angle}deg)`;
      }

      // Gentle continuous idle shedding so the trail never completely dies while resting
      idleTimer += dt;
      if (idleTimer > 7 && hasInit.current && particlesRef.current.length < 180) {
        idleTimer = 0;
        particlesRef.current.push({
          x: pos.current.x + (Math.random() - 0.5) * 8,
          y: pos.current.y + 12,
          vx: (Math.random() - 0.5) * 0.35,
          vy: 0.18 + Math.random() * 0.35,
          gravity: 0.032,
          drag: 0.988,
          rot: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 5,
          swayPhase: Math.random() * Math.PI * 2,
          swaySpeed: 0.022,
          flutterStrength: 0.36,
          size: Math.random() < 0.5 ? 3 : 2,
          color: AUTUMN_COLORS[Math.floor(Math.random() * AUTUMN_COLORS.length)],
          shape: "flake",
          opacity: 0.85,
          decay: 0.006 + Math.random() * 0.005,
        });
      }

      const activeCv = canvasRef.current;
      if (activeCv) {
        // Guarantee canvas always fills viewport window without 300x150 clipping
        if (activeCv.width !== window.innerWidth || activeCv.height !== window.innerHeight) {
          activeCv.width = window.innerWidth;
          activeCv.height = window.innerHeight;
        }

        const ctx = activeCv.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, activeCv.width, activeCv.height);

          particlesRef.current.forEach((p) => {
            // Apply imaginary wind physics!
            const wind = getWind(p.x, p.y, currentTime);

            p.vx += (wind.windX - p.vx) * 0.038 * dt;
            p.vy += (wind.windY + p.gravity * 16 - p.vy) * 0.036 * dt;

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

          // Cull particles only once fully out of viewport bounds
          const W = activeCv.width;
          const H = activeCv.height;
          particlesRef.current = particlesRef.current.filter(
            (p) => p.opacity > 0 && p.y > -40 && p.y < H + 40 && p.x > -40 && p.x < W + 40
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
    addEventListener("resize", onResize);
    raf = requestAnimationFrame(loop);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      removeEventListener("pointermove", onMove);
      removeEventListener("click", onClick);
      removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

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
        <div className="maple-cursor-icon">
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
      </div>
    </>
  );
}
