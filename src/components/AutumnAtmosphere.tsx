import { useEffect, useRef } from "react";
import { REDUCE } from "../lib";
import { getWind } from "../wind";

interface Leaf {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseSpeedY: number;
  swayFreq: number;
  swayPhase: number;
  flip: number;
  flipSpeed: number;
  size: number;
  color: string;
  depth: number;
}

const LEAF_COLORS = ["#D9622B", "#A8321F", "#F2A541", "#E0B83A", "#C2563A", "#8F4A1F"];

export default function AutumnAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (REDUCE) return;
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    let W = (cv.width = window.innerWidth);
    let H = (cv.height = window.innerHeight);

    const leaves: Leaf[] = Array.from({ length: 34 }, () => {
      const depth = 0.35 + Math.random() * 0.65;
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: 0,
        vy: 0,
        baseSpeedY: 0.25 + depth * 0.55,
        swayFreq: 0.018 + Math.random() * 0.025,
        swayPhase: Math.random() * Math.PI * 2,
        flip: Math.random() * Math.PI * 2,
        flipSpeed: 0.02 + Math.random() * 0.03,
        size: depth > 0.75 ? 3 : depth > 0.5 ? 2 : 1,
        color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
        depth,
      };
    });

    let raf = 0;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min(3, (currentTime - lastTime) / 16.6 || 1);
      lastTime = currentTime;

      ctx.clearRect(0, 0, W, H);

      leaves.forEach((l) => {
        // Sample global imaginary wind vector at this leaf's position
        const wind = getWind(l.x, l.y, currentTime);

        // Wind pushes the leaf proportionally to its depth plane
        const targetVx = wind.windX * l.depth * 1.35;
        const targetVy = l.baseSpeedY + wind.windY * l.depth * 0.45;

        l.vx += (targetVx - l.vx) * 0.04 * dt;
        l.vy += (targetVy - l.vy) * 0.035 * dt;

        l.swayPhase += l.swayFreq * dt;
        const sway = Math.sin(l.swayPhase) * 0.65 * l.depth;

        l.x += (l.vx + sway) * dt;
        l.y += l.vy * dt;
        l.flip += (l.flipSpeed + wind.gustFactor * 0.03) * dt;

        // Wrap around bounds seamlessly
        if (l.y > H + 18) {
          l.y = -14;
          l.x = Math.random() * W;
        }
        if (l.x > W + 25) {
          l.x = -18;
          l.y = Math.random() * H;
        }

        // Render multi-layer pixel leaf
        ctx.save();
        ctx.globalAlpha = 0.3 + l.depth * 0.45;
        ctx.fillStyle = l.color;
        const w = Math.max(1, Math.round(l.size * (1 + Math.abs(Math.sin(l.flip)) * 1.5)));
        const h = l.size;
        ctx.fillRect(l.x | 0, l.y | 0, w, h);

        if (l.depth > 0.75) {
          ctx.fillRect((l.x + (w >> 1)) | 0, (l.y - 1) | 0, 1, 1);
        }
        ctx.restore();
      });

      raf = requestAnimationFrame(loop);
    };

    const onResize = () => {
      if (!canvasRef.current) return;
      W = canvasRef.current.width = window.innerWidth;
      H = canvasRef.current.height = window.innerHeight;
    };

    addEventListener("resize", onResize);
    raf = requestAnimationFrame(loop);

    return () => {
      removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (REDUCE) return null;

  return (
    <canvas
      ref={canvasRef}
      className="autumn-atmosphere-canvas"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 2,
      }}
    />
  );
}
