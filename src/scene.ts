import { mk, rc, disc, rng, PF } from "./sprites";

const SKY = ["#2B1B2E", "#3d2340", "#5a2a45", "#7f3547", "#a8453f", "#d2663a", "#ee9444", "#f6bd62"];
const LCOL = ["#D9622B", "#A8321F", "#F2A541", "#E0B83A", "#8f4a1f", "#c2563a"];

interface TreePal { o: string; d: string; m: string; l: string }
const PAL: Record<"fl" | "fr" | "m1" | "m2", TreePal> = {
  fl: { o: "#2b0f1c", d: "#8f2418", m: "#d9531f", l: "#f2a541" },
  fr: { o: "#2b0f1c", d: "#a8431f", m: "#e8842f", l: "#f8cf6e" },
  m1: { o: "#2a1530", d: "#5a2545", m: "#7a3248", l: "#a04a4a" },
  m2: { o: "#2a1530", d: "#7a3224", m: "#a8452a", l: "#c9692f" },
};

interface Tree { c: HTMLCanvasElement; k: HTMLCanvasElement; r: number; th: number; tw: number }

function tree(r: number, P: TreePal, th: number, seed: number): Tree {
  const Rn = rng(seed), cw = r * 4 + 8, ch = r * 3 + 4, tw = Math.max(4, (r / 2.5) | 0);
  const bl = Array.from({ length: 7 }, () => [
    (cw / 2 + (Rn() - 0.5) * r * 2.2) | 0,
    (ch / 2 + (Rn() - 0.5) * r * 1.3) | 0,
    (r * (0.55 + Rn() * 0.4)) | 0,
  ]);
  const c = mk(cw, ch, (x) => {
    bl.forEach(([a, b, q]) => disc(x, a, b, q + 1, P.o));
    bl.forEach(([a, b, q]) => disc(x, a, b, q, P.d));
    bl.forEach(([a, b, q]) => disc(x, a - q * 0.25, b - q * 0.3, q * 0.78, P.m));
    bl.forEach(([a, b, q]) => disc(x, a - q * 0.4, b - q * 0.45, q * 0.4, P.l));
    for (let i = 0; i < r * 3; i++) {
      const [a, b, q] = bl[(Rn() * 7) | 0];
      rc(x, Rn() < 0.6 ? P.l : P.d, a - q * 0.3 + (Rn() - 0.5) * q, b - q * 0.3 + (Rn() - 0.5) * q, 2, 1);
    }
  });
  const k = mk(tw + 6, th, (x, _w, h) => {
    rc(x, P.o, 3, 0, tw, h);
    rc(x, "#5a3018", 4, 0, tw - 2, h);
    rc(x, "#7a4824", 4, 0, 2, h);
    rc(x, "#3a1f18", tw + 1, 0, 2, h);
    rc(x, P.o, 1, h - 3, tw + 4, 3);
    rc(x, "#5a3018", 2, h - 3, tw + 2, 2);
  });
  return { c, k, r, th, tw };
}

const BF = [
  [[0, 1], [1, 0], [2, 1], [3, 0], [4, 1]],
  [[0, 0], [1, 1], [2, 1], [3, 1], [4, 0]],
];

/** Starts the animated autumn scene. Returns a cleanup function. */
export function startScene(cv: HTMLCanvasElement, host: HTMLElement, reduce: boolean): () => void {
  const g = cv.getContext("2d") as CanvasRenderingContext2D;
  const pad = 60;
  let SC = 3, W = 0, H = 0, gy = 0, mx = 0, tx = 0, t = 0;
  let sky!: HTMLCanvasElement, far!: HTMLCanvasElement, mid!: HTMLCanvasElement, gnd!: HTMLCanvasElement;
  let TR: { T: Tree; x: number; s: number }[] = [];
  let FG: { T: Tree; x: number }[] = [];
  let lv: { x: number; y: number; z: number; p: number; c: string }[] = [];
  let bd: { x: number; y: number; v: number; p: number }[] = [];
  let em: { x: number; y: number; p: number }[] = [];
  let cl: { x: number; y: number; w: number; c: string }[] = [];
  const pl = { x: 0, t: 0, d: 1, f: 0 };

  function gen(): void {
    SC = Math.max(3, Math.round(innerHeight / 150));
    W = Math.ceil(innerWidth / SC);
    H = Math.ceil(innerHeight / SC);
    cv.width = W;
    cv.height = H;
    cv.style.width = W * SC + "px";
    cv.style.height = H * SC + "px";
    const Rn = rng(9), PW = W + pad * 2;
    gy = (H * 0.7) | 0;
    sky = mk(W, H, (x) => {
      const hz = gy, bh = hz / SKY.length;
      for (let y = 0; y < hz; y++) {
        const i = Math.min(7, (y / bh) | 0), f = y - i * bh;
        rc(x, SKY[i], 0, y, W, 1);
        if (i < 7 && f > bh - 4) {
          x.fillStyle = SKY[i + 1];
          for (let X = y & 1; X < W; X += 2) x.fillRect(X, y, 1, 1);
        }
      }
      for (let i = 0; i < 46; i++) {
        let a = Rn() * W;
        const b = Rn() * H * 0.33;
        // Avoid center zone where the hero title sits to prevent typography collision
        if (a > W * 0.22 && a < W * 0.78 && b < H * 0.38) {
          a = Rn() < 0.5 ? a * 0.25 : W - (W - a) * 0.25;
        }
        rc(x, "#F6E7C8", a, b, 1, 1);
        if (i % 7 === 0) {
          rc(x, "#F6E7C8", a - 1, b, 3, 1);
          rc(x, "#F6E7C8", a, b - 1, 1, 3);
        }
      }
      const sx = (W * 0.66) | 0, sy = (H * 0.5) | 0;
      for (let d = -36; d <= 36; d++) {
        const w = Math.sqrt(1296 - d * d) | 0;
        for (let X = -w; X <= w; X++) if ((X + d) & 1) rc(x, "#d2663a", sx + X, sy + d, 1, 1);
      }
      disc(x, sx, sy, 26, "#e8842f");
      disc(x, sx, sy, 22, "#f2a541");
      disc(x, sx, sy, 17, "#f8cf6e");
    });
    const tri = (X: number, p: number, a: number) => a * Math.abs(((X / p) % 2) - 1);
    far = mk(PW, H, (x) => {
      for (let X = 0; X < PW; X++) {
        const y = (gy - 8 - tri(X + 10, 70, 18) - tri(X + 33, 31, 8) - tri(X, 13, 2)) | 0;
        rc(x, "#6b3347", X, y, 1, gy - y + 6);
        rc(x, "#8e4a56", X, y, 1, 1);
        for (let k = 1; k < 4; k++) if ((X + k) & 1) rc(x, "#7e3e50", X, y + k, 1, 1);
      }
    });
    mid = mk(PW, H, (x) => {
      for (let X = 0; X < PW; X += 6) {
        const h = (9 + Rn() * 13) | 0, top = gy - 2 - h;
        for (let j = 0; j < h; j++) {
          const hw = 1 + ((j * 0.42) | 0);
          rc(x, "#3a1f35", X - hw, top + j, 2 * hw + 1, 1);
          rc(x, "#52294a", X - hw, top + j, 1, 1);
        }
      }
      rc(x, "#3a1f35", 0, gy - 3, PW, 8);
    });
    TR = Array.from({ length: 9 }, (_, i) => ({
      T: tree(Math.round(H * 0.065 * (0.9 + Rn() * 0.3)), i % 2 ? PAL.m1 : PAL.m2, (H * 0.09) | 0, 40 + i),
      x: ((i + 0.5) * PW) / 9 - pad + (Rn() - 0.5) * 12,
      s: Rn() * 6,
    }));
    gnd = mk(PW, H - gy + 4, (x, w, h) => {
      rc(x, "#6b4426", 0, 0, w, h);
      rc(x, "#5E6B3A", 0, 4, w, 6);
      rc(x, "#7d8a45", 0, 4, w, 1);
      rc(x, "#46522b", 0, 9, w, 1);
      for (let X = 0; X < w; X += 2 + ((Rn() * 3) | 0)) rc(x, "#7d8a45", X, 2 + ((Rn() * 2) | 0), 1, 2);
      rc(x, "#9b6a3a", 0, 10, w, h);
      for (let y = 10; y < h; y++) {
        const dk = y > h * 0.6;
        for (let X = y & 1; X < w; X += 2) if (Rn() < (dk ? 0.55 : 0.12)) rc(x, dk ? "#7a4a2a" : "#8a5a33", X, y, 1, 1);
      }
      for (let i = 0; i < w / 3; i++) {
        const c = ["#D9622B", "#A8321F", "#F2A541", "#E0B83A"][(Rn() * 4) | 0];
        rc(x, c, Rn() * w, 12 + Rn() * (h - 12), 3, 2);
      }
      for (let i = 0; i < w / 9; i++) rc(x, "#b7814a", Rn() * w, 12 + Rn() * (h - 12), 2, 1);
    });
    const fr = Math.round(H * 0.15 * Math.min(1, W / 230)), fh = (H * 0.42) | 0;
    FG = [{ T: tree(fr, PAL.fl, fh, 3), x: W * 0.05 }, { T: tree(fr, PAL.fr, fh, 5), x: W * 0.95 }];
    lv = Array.from({ length: 45 }, () => ({ x: Rn() * W, y: Rn() * H, z: 0.4 + Rn() * 1.1, p: Rn() * 6, c: LCOL[(Rn() * 6) | 0] }));
    bd = [0, 1, 2].map((i) => ({ x: Rn() * W, y: H * (0.3 + i * 0.06), v: 0.12 + Rn() * 0.08, p: i * 2 }));
    em = Array.from({ length: 9 }, () => ({ x: Rn() * W, y: gy + Rn() * H * 0.2, p: Rn() * 6 }));
    cl = Array.from({ length: 6 }, (_, i) => ({ x: Rn() * W, y: H * (0.12 + i * 0.085), w: (14 + Rn() * 22) | 0, c: i < 3 ? "#8a3a47" : "#e58a3a" }));
    pl.x = pl.t = W * 0.4;
  }

  function put(T: Tree, x: number, b: number, sw: number): void {
    g.drawImage(T.k, (x - (T.tw >> 1) - 3) | 0, b - T.th);
    g.drawImage(T.c, (x - T.c.width / 2 + sw) | 0, (b - T.th - T.r * 0.6 - T.c.height / 2) | 0);
  }

  function draw(dt: number): void {
    mx += (tx - mx) * 0.06 * dt;
    const o = (k: number) => Math.round(-mx * k);
    g.drawImage(sky, 0, 0);
    cl.forEach((c) => {
      c.x += 0.02 * dt;
      if (c.x > W + 30) c.x = -30;
      rc(g, c.c, c.x, c.y, c.w, 2);
      rc(g, c.c, c.x + 3, c.y - 1, c.w - 7, 1);
    });
    bd.forEach((b) => {
      b.x += b.v * dt;
      if (b.x > W + 8) b.x = -8;
      const y = (b.y + Math.sin(t * 0.02 + b.p) * 3) | 0, f = ((t / 9) | 0) % 2;
      BF[f].forEach(([a, c]) => rc(g, "#2B1B2E", b.x + a, y + c, 1, 1));
    });
    g.drawImage(far, -pad + o(4), 0);
    g.drawImage(mid, -pad + o(8), 0);
    TR.forEach((m) => put(m.T, m.x + o(14), gy + 2, Math.round(Math.sin(t * 0.03 + m.s))));
    g.drawImage(gnd, -pad + o(22), gy - 4);
    em.forEach((e) => {
      e.y -= 0.05 * dt;
      e.x += Math.sin(t * 0.03 + e.p) * 0.1 * dt;
      if (e.y < gy - 14) {
        e.y = H * 0.9;
        e.x = Math.random() * W;
      }
      if (Math.sin(t * 0.08 + e.p) > -0.3) rc(g, "#F2A541", e.x, e.y, 1, 1);
    });
    const dx = pl.t - pl.x, mv = Math.abs(dx) > 2;
    if (mv) {
      pl.x += Math.sign(dx) * 0.6 * dt;
      pl.d = dx > 0 ? 1 : -1;
      pl.f += 0.14 * dt;
    } else pl.f = 0;
    const py = (H * 0.8) | 0;
    rc(g, "rgba(29,16,32,.45)", pl.x - 5, py - 1, 11, 2);
    g.save();
    g.translate(Math.round(pl.x), py);
    g.scale(pl.d, 1);
    g.drawImage(PF[mv ? [0, 1, 0, 2][(pl.f | 0) % 4] : 0], -4, -13);
    g.restore();
    FG.forEach((f, i) => put(f.T, f.x + o(40), (H * 0.95) | 0, Math.round(Math.sin(t * 0.025 + i * 2) * 1.2)));
    lv.forEach((l) => {
      l.y += (0.1 + 0.18 * l.z) * dt;
      l.x += (Math.sin(t * 0.04 + l.p) * 0.25 + 0.12) * dt;
      if (l.y > H) {
        l.y = -3;
        l.x = Math.random() * W;
      }
      if (l.x > W + 3) l.x = -3;
      const x = (((l.x + o(l.z * 20)) % W) + W) % W;
      if (l.z > 1) {
        rc(g, l.c, x, l.y, 3, 1);
        rc(g, l.c, x + 1, l.y - 1, 1, 3);
      } else rc(g, l.c, x, l.y, 2, 2);
    });
    [0.4, 0.28, 0.16, 0.08].forEach((a, i) => {
      rc(g, `rgba(29,16,32,${a})`, 0, i * 3, W, 3);
      rc(g, `rgba(29,16,32,${a})`, 0, H - 3 - i * 3, W, 3);
    });
  }

  let last = 0, vis = true, raf = 0;
  const loop = (ts: number): void => {
    const dt = Math.min(3, (ts - last) / 16.7 || 1);
    last = ts;
    if (vis && !document.hidden) {
      t += dt;
      draw(dt);
    }
    raf = requestAnimationFrame(loop);
  };
  const onMove = (e: PointerEvent): void => {
    tx = (e.clientX / innerWidth) * 2 - 1;
    pl.t = Math.min(0.88, Math.max(0.12, e.clientX / innerWidth)) * W;
  };
  let lw = innerWidth;
  const onResize = (): void => {
    if (innerWidth !== lw) {
      lw = innerWidth;
      gen();
      if (reduce) draw(0);
    }
  };
  const io = new IntersectionObserver((e) => {
    vis = e[0].isIntersecting;
  });
  io.observe(host);
  addEventListener("pointermove", onMove);
  addEventListener("resize", onResize);
  gen();
  if (reduce) draw(0);
  else raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    removeEventListener("pointermove", onMove);
    removeEventListener("resize", onResize);
  };
}
