import { MAPLE_HALF, MAPLE_VEIN_TIPS, OAK_HALF, mirrored, type P } from "../leafShapes";

export type Sprite = HTMLCanvasElement;

export interface LeafSprite {
  face: Sprite;
  /** underside: paler, flatter */
  back: Sprite;
  /** out-of-focus copy for leaves drifting right past the lens */
  soft: Sprite;
}

function canvas(size: number) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  return c;
}

function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

/** Extra canvas around a softened sprite, so the blur fades out instead of being clipped square. */
export const SOFT_PAD = 1.6;

/** Cheap, portable blur: shrink then scale back up with smoothing (two passes for a rounder falloff). */
export function soften(src: Sprite, factor = 5): Sprite {
  const size = Math.round(src.width * SOFT_PAD);
  const small = canvas(Math.max(10, Math.round(size / factor)));
  const sg = small.getContext("2d")!;
  sg.imageSmoothingQuality = "high";
  const inset = (small.width * (1 - 1 / SOFT_PAD)) / 2;
  sg.drawImage(src, inset, inset, small.width - inset * 2, small.height - inset * 2);
  const mid = canvas(Math.round(size / 2));
  const mg = mid.getContext("2d")!;
  mg.imageSmoothingQuality = "high";
  mg.drawImage(small, 0, 0, mid.width, mid.height);
  const out = canvas(size);
  const og = out.getContext("2d")!;
  og.imageSmoothingQuality = "high";
  og.drawImage(mid, 0, 0, size, size);
  return out;
}

type Tones = [inner: string, outer: string, edge: string];

const MAPLE_TONES: Tones[] = [
  ["#f4c653", "#d4561f", "#7a2410"],
  ["#f6d76c", "#c8321b", "#62150c"],
  ["#f9e08b", "#e6a42a", "#8f5614"],
  ["#eba849", "#a8261c", "#4d0f0c"],
  ["#bdb44c", "#dc8a2c", "#6e4418"],
  ["#d69853", "#8c4a26", "#3f2111"],
  ["#f1b95a", "#b8402a", "#5a1a14"],
];
const BIRCH_TONES: Tones[] = [
  ["#fbe58c", "#e9b836", "#9a7417"],
  ["#f3d163", "#d39a26", "#7f5512"],
  ["#e9d77a", "#c9a23a", "#6f5a1c"],
];
const OAK_TONES: Tones[] = [
  ["#c9a159", "#8f5a2a", "#4a2a14"],
  ["#dba147", "#a3561f", "#5a2c12"],
];

function birchHalf(rnd: () => number): P[] {
  const pts: P[] = [[0, 26]];
  const n = 22;
  for (let i = 1; i < n; i++) {
    const u = i / n;
    const y = 26 - u * 80;
    const w = 24 * Math.pow(Math.sin(Math.PI * Math.min(1, u * 1.08)), 0.75) * (1 - 0.3 * u);
    pts.push([w + (i % 2 ? 1.8 + rnd() * 0.8 : 0), y]);
  }
  pts.push([0, -55]);
  return pts;
}

function outline(g: CanvasRenderingContext2D, pts: P[], concave: number) {
  g.beginPath();
  g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i <= pts.length; i++) {
    const [x, y] = pts[i % pts.length];
    const [px, py] = pts[i - 1];
    g.quadraticCurveTo((px + x) / 2 + (y - py) * concave, (py + y) / 2 - (x - px) * concave, x, y);
  }
  g.closePath();
}

function vein(g: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, bend: number) {
  g.moveTo(x0, y0);
  g.quadraticCurveTo((x0 + x1) / 2 + (y1 - y0) * bend, (y0 + y1) / 2 - (x1 - x0) * bend, x1, y1);
}

function veinSet(g: CanvasRenderingContext2D, kind: "maple" | "birch" | "oak", rnd: () => number) {
  g.beginPath();
  vein(g, 0, 24, 0, -50, 0.01);
  if (kind === "maple") {
    for (const side of [1, -1]) {
      for (const [tx, ty] of MAPLE_VEIN_TIPS) {
        const ex = tx * 0.9 * side;
        const ey = 20 + (ty - 20) * 0.9;
        vein(g, 0, 20, ex, ey, 0.04 * side);
        for (const k of [0.35, 0.6, 0.8]) {
          const bx = ex * k;
          const by = 20 + (ey - 20) * k;
          const len = 6 + rnd() * 5;
          const ang = Math.atan2(ey - 20, ex) + (rnd() < 0.5 ? 0.7 : -0.7);
          vein(g, bx, by, bx + Math.cos(ang) * len, by + Math.sin(ang) * len, 0.05);
        }
      }
    }
  } else {
    for (let y = 18; y > -44; y -= kind === "oak" ? 11 : 7) {
      const reach = kind === "oak" ? 20 : 17 * Math.sin(Math.PI * ((26 - y) / 80)) + 4;
      vein(g, 0, y, reach, y - reach * 0.55, -0.06);
      vein(g, 0, y, -reach, y - reach * 0.55, 0.06);
    }
  }
}

function paintLeaf(kind: "maple" | "birch" | "oak", tones: Tones, seed: number): LeafSprite {
  const rnd = seeded(seed);
  const [inner, outer, edge] = tones;
  const half = kind === "maple" ? MAPLE_HALF : kind === "oak" ? OAK_HALF : birchHalf(rnd);
  const pts = mirrored(half).map(([x, y]) => [x + (rnd() - 0.5) * 1.8, y + (rnd() - 0.5) * 1.8] as P);
  const concave = kind === "oak" ? -0.18 : kind === "birch" ? 0.02 : 0.1;

  const c = canvas(128);
  const g = c.getContext("2d")!;
  g.translate(64, 76);
  g.scale(1.04, 1.04);

  outline(g, pts, concave);
  const base = g.createRadialGradient(0, 16, 2, 0, -12, 62);
  base.addColorStop(0, inner);
  base.addColorStop(0.42, inner);
  base.addColorStop(0.78, outer);
  base.addColorStop(1, edge);
  g.fillStyle = base;
  g.fill();

  g.save();
  g.clip();

  for (let i = 0; i < 7; i++) {
    const x = (rnd() - 0.5) * 70;
    const y = -50 + rnd() * 70;
    const r = 8 + rnd() * 16;
    const blob = g.createRadialGradient(x, y, 0, x, y, r);
    const col = i % 2 ? outer : inner;
    blob.addColorStop(0, col + "66");
    blob.addColorStop(1, col + "00");
    g.fillStyle = blob;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }

  const spots = kind === "maple" ? (rnd() < 0.45 ? 1 + Math.floor(rnd() * 3) : 0) : rnd() < 0.3 ? 2 : 0;
  for (let i = 0; i < spots; i++) {
    const x = (rnd() - 0.5) * 50;
    const y = -40 + rnd() * 50;
    const r = 1.6 + rnd() * 3.4;
    const sp = g.createRadialGradient(x, y, 0, x, y, r * 1.8);
    sp.addColorStop(0, "rgba(30,14,6,0.75)");
    sp.addColorStop(0.55, "rgba(60,26,8,0.45)");
    sp.addColorStop(1, "rgba(60,26,8,0)");
    g.fillStyle = sp;
    g.fillRect(x - r * 2, y - r * 2, r * 4, r * 4);
  }

  g.lineCap = "round";
  g.translate(0.7, 0.9);
  veinSet(g, kind, seeded(seed + 7));
  g.strokeStyle = "rgba(50,14,4,0.32)";
  g.lineWidth = 1.5;
  g.stroke();
  g.translate(-0.7, -0.9);
  veinSet(g, kind, seeded(seed + 7));
  g.strokeStyle = kind === "oak" ? "rgba(240,210,150,0.32)" : "rgba(255,236,170,0.5)";
  g.lineWidth = 1.05;
  g.stroke();

  g.fillStyle = "rgba(40,10,0,0.13)";
  g.fillRect(0, -80, 80, 140);

  const light = g.createLinearGradient(-50, -60, 40, 30);
  light.addColorStop(0, "rgba(255,246,220,0.28)");
  light.addColorStop(0.5, "rgba(255,246,220,0)");
  light.addColorStop(1, "rgba(20,6,0,0.28)");
  g.fillStyle = light;
  g.fillRect(-64, -80, 128, 128);

  for (let i = 0; i < 420; i++) {
    const x = (rnd() - 0.5) * 112;
    const y = -60 + rnd() * 92;
    g.fillStyle = rnd() < 0.5 ? "rgba(255,240,200,0.07)" : "rgba(30,10,0,0.09)";
    g.fillRect(x, y, 1, 1);
  }

  outline(g, pts, concave);
  g.strokeStyle = edge;
  g.globalAlpha = 0.6;
  g.lineWidth = 4.5;
  g.stroke();
  g.globalAlpha = 1;
  g.restore();

  g.strokeStyle = edge;
  g.lineCap = "round";
  g.lineWidth = 2.2;
  g.beginPath();
  g.moveTo(0, 24);
  g.quadraticCurveTo(1.5, 32, -1.5, 40);
  g.stroke();

  const back = canvas(128);
  const bg = back.getContext("2d")!;
  bg.drawImage(c, 0, 0);
  bg.globalCompositeOperation = "source-atop";
  bg.fillStyle = "rgba(236,214,168,0.3)";
  bg.fillRect(0, 0, 128, 128);

  return { face: c, back, soft: soften(c) };
}

export function leafSprites(): LeafSprite[] {
  return [
    ...MAPLE_TONES.map((t, i) => paintLeaf("maple", t, 101 + i * 37)),
    ...BIRCH_TONES.map((t, i) => paintLeaf("birch", t, 503 + i * 41)),
    ...OAK_TONES.map((t, i) => paintLeaf("oak", t, 907 + i * 43)),
  ];
}

export function petalSprites(): Sprite[] {
  const tints = [
    ["#fffafb", "#f6c6d4"],
    ["#ffffff", "#f1d6df"],
    ["#fff4f7", "#eaa9bd"],
    ["#fffdf8", "#f3e1e6"],
  ];
  return tints.map(([inner, outer]) => {
    const c = canvas(40);
    const g = c.getContext("2d")!;
    g.translate(20, 20);
    g.beginPath();
    g.moveTo(0, 15);
    g.bezierCurveTo(12, 8, 13, -10, 4, -14);
    g.quadraticCurveTo(0, -10, -4, -14);
    g.bezierCurveTo(-13, -10, -12, 8, 0, 15);
    g.closePath();
    const grad = g.createRadialGradient(0, 10, 1, 0, 0, 18);
    grad.addColorStop(0, outer);
    grad.addColorStop(0.35, inner);
    grad.addColorStop(1, outer);
    g.fillStyle = grad;
    g.fill();
    return c;
  });
}

function softDot(size: number, stops: [number, string][]) {
  const c = canvas(size);
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [o, col] of stops) grad.addColorStop(o, col);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

export function snowSprites() {
  const small = softDot(24, [
    [0, "rgba(255,255,255,1)"],
    [0.4, "rgba(255,255,255,0.85)"],
    [1, "rgba(255,255,255,0)"],
  ]);
  const bokeh = softDot(64, [
    [0, "rgba(240,246,255,0.55)"],
    [0.6, "rgba(240,246,255,0.35)"],
    [1, "rgba(240,246,255,0)"],
  ]);
  const crystal = canvas(48);
  const g = crystal.getContext("2d")!;
  g.translate(24, 24);
  g.strokeStyle = "rgba(255,255,255,0.95)";
  g.lineCap = "round";
  g.shadowColor = "rgba(200,225,255,0.9)";
  g.shadowBlur = 4;
  for (let i = 0; i < 6; i++) {
    g.save();
    g.rotate((i * Math.PI) / 3);
    g.lineWidth = 1.8;
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(0, -19);
    g.moveTo(0, -8);
    g.lineTo(-5, -13);
    g.moveTo(0, -8);
    g.lineTo(5, -13);
    g.moveTo(0, -14);
    g.lineTo(-3.5, -17.5);
    g.moveTo(0, -14);
    g.lineTo(3.5, -17.5);
    g.stroke();
    g.restore();
  }
  return { small, bokeh, crystal };
}

export function moteSprite() {
  return softDot(32, [
    [0, "rgba(255,240,200,1)"],
    [0.25, "rgba(255,214,140,0.7)"],
    [1, "rgba(255,190,110,0)"],
  ]);
}
