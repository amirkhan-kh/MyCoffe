/**
 * Botanical outlines shared by the canvas particles and the SVG decorations.
 * Coordinates: petiole joint at (0, 26), leaf tip at (0, -54); right half only, mirrored.
 */
export type P = [number, number];

/** Sugar-maple style: five pointed lobes with coarse teeth and deep rounded sinuses. */
export const MAPLE_HALF: P[] = [
  [0, 26],
  [7, 27],
  [15, 31],
  [21, 26],
  [33, 29],
  [27, 18],
  [39, 13],
  [43, 3],
  [53, -4],
  [41, -6],
  [43, -15],
  [34, -14],
  [21, -8],
  [24, -22],
  [31, -31],
  [22, -30],
  [19, -39],
  [11, -36],
  [7, -46],
  [0, -55],
];

/** Lobe tips the primary veins run to (right half; mirrored for the left). */
export const MAPLE_VEIN_TIPS: P[] = [
  [33, 29],
  [53, -4],
  [31, -31],
];

/** Oak: rounded lobes. */
export const OAK_HALF: P[] = [
  [0, 26],
  [6, 24],
  [12, 26],
  [17, 19],
  [14, 13],
  [23, 10],
  [26, 2],
  [18, -2],
  [25, -9],
  [26, -18],
  [16, -19],
  [20, -28],
  [17, -38],
  [9, -36],
  [9, -46],
  [0, -52],
];

export function mirrored(half: P[]): P[] {
  const left = half
    .slice(1, -1)
    .reverse()
    .map(([x, y]) => [-x, y] as P);
  return [...half, ...left];
}

/** Concave edges between points make crisp, natural-looking teeth. */
export function svgPath(points: P[], scale = 1, concave = 0.1) {
  const s = (v: number) => +(v * scale).toFixed(2);
  let d = `M${s(points[0][0])} ${s(points[0][1])}`;
  for (let i = 1; i <= points.length; i++) {
    const [x, y] = points[i % points.length];
    const [px, py] = points[i - 1];
    const cx = (px + x) / 2 + (y - py) * concave;
    const cy = (py + y) / 2 - (x - px) * concave;
    d += ` Q${s(cx)} ${s(cy)} ${s(x)} ${s(y)}`;
  }
  return `${d} Z`;
}
