export type Ctx = CanvasRenderingContext2D;
type Pal = Record<string, string>;

export const mk = (w: number, h: number, f: (x: Ctx, w: number, h: number) => void): HTMLCanvasElement => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  f(c.getContext("2d") as Ctx, w, h);
  return c;
};

export const rc = (x: Ctx, c: string, a: number, b: number, w: number, h: number): void => {
  x.fillStyle = c;
  x.fillRect(a | 0, b | 0, w, h);
};

export const disc = (x: Ctx, a: number, b: number, r: number, c: string): void => {
  x.fillStyle = c;
  a |= 0;
  b |= 0;
  r = Math.round(r);
  for (let d = -r; d <= r; d++) {
    const w = Math.sqrt(r * r - d * d + r) | 0;
    x.fillRect(a - w, b + d, 2 * w + 1, 1);
  }
};

export const rng = (s: number) => () => (s = (s * 16807) % 2147483647) / 2147483647;

const spr = (rows: string[], pal: Pal, s = 1): HTMLCanvasElement =>
  mk(rows[0].length * s, rows.length * s, (x) =>
    rows.forEach((r, j) =>
      [...r].forEach((ch, i) => {
        if (pal[ch]) rc(x, pal[ch], i * s, j * s, s, s);
      })
    )
  );

const PP: Pal = { k: "#1d1020", h: "#4A2F1F", s: "#f0b27a", e: "#2B1B2E", r: "#A8321F", o: "#D9622B", d: "#a8421f", y: "#F2A541", p: "#3b2a4a", b: "#2B1B2E" };
const BODY = ["..kkkkk..", ".khhhhhk.", ".khsssshk", ".ksessesk", "..krrrk..", ".koooook.", "koooyoook", "kodoooodk", "koooooook", ".kpppppk."];
const LEG = [
  [".kpp.ppk.", ".kbb.bbk.", ".kkk.kkk."],
  ["kpp...ppk", "kbb...bbk", "kkk...kkk"],
  ["..kppkp..", "..kbbkb..", "..kkkkk.."],
];
export const PF: HTMLCanvasElement[] = LEG.map((l) => spr([...BODY, ...l], PP));

const HEART = [".lr.rr.", "rrrrrrr", "rrrrrrr", ".rrrrr.", "..rrr..", "...r..."];
export const heartURL = (): string => spr(HEART, { r: "#D9301E", l: "#ff8a6a" }, 3).toDataURL();

const FP: Pal = {
  c: "#FFF7D6",
  y: "#F2A541",
  o: "#D9622B",
  r: "#A8321F",
  w: "#5A3018",
  l: "#874A25",
  g: "#E04018",
  k: "#1D1020",
};

export const FIRE: HTMLCanvasElement[] = [
  [
    "......y......",
    ".....ycy.....",
    "....ycooy....",
    "...ycoooy....",
    "...yoooroy...",
    "..yorrrrroy..",
    "..orrggrrro..",
    ".oorrgggrroo.",
    "wwkwwwwwkwwwk",
    "llklllllklllk",
    "wwkwwwwwkwwwk",
    "..kkkkkkkkk..",
  ],
  [
    ".....y.......",
    "....ycyy.....",
    "...ycoooy....",
    "...ycoooyy...",
    "..ycooorroy..",
    "..yorrrrroy..",
    "..orrggrrro..",
    ".oorrgggrroo.",
    "wwkwwwwwkwwwk",
    "llklllllklllk",
    "wwkwwwwwkwwwk",
    "..kkkkkkkkk..",
  ],
  [
    ".......y.....",
    ".....ycooy...",
    "....ycoooy...",
    "...yycoooy...",
    "..yorroorroy.",
    "..yorrrrroy..",
    "..orrggrrro..",
    ".oorrgggrroo.",
    "wwkwwwwwkwwwk",
    "llklllllklllk",
    "wwkwwwwwkwwwk",
    "..kkkkkkkkk..",
  ],
  [
    "......y......",
    "....yycy.....",
    "...ycoooy....",
    "...ycoooy....",
    "..yorrrooroy.",
    ".oorrrrroy...",
    "..orrggrrro..",
    ".oorrgggrroo.",
    "wwkwwwwwkwwwk",
    "llklllllklllk",
    "wwkwwwwwkwwwk",
    "..kkkkkkkkk..",
  ],
  [
    ".....yy......",
    "....yccy.....",
    "...ycoooy....",
    "..ycoooyy....",
    "..yorrrrooy..",
    ".yorrrrroy...",
    "..orrggrrro..",
    ".oorrgggrroo.",
    "wwkwwwwwkwwwk",
    "llklllllklllk",
    "wwkwwwwwkwwwk",
    "..kkkkkkkkk..",
  ],
  [
    ".......y.....",
    ".....ycyy....",
    "....ycooy....",
    "...ycoooy....",
    "...yorrrooy..",
    "..yorrrrroy..",
    "..orrggrrro..",
    ".oorrgggrroo.",
    "wwkwwwwwkwwwk",
    "llklllllklllk",
    "wwkwwwwwkwwwk",
    "..kkkkkkkkk..",
  ],
].map((f) => spr(f, FP, 8));
