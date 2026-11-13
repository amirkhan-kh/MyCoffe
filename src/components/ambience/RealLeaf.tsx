import { useId } from "react";
import { MAPLE_HALF, MAPLE_VEIN_TIPS, mirrored, svgPath, type P } from "./leafShapes";

/** Petiole joint at the origin, tip pointing up, 1 unit = 1/81 of the leaf length. */
const MAPLE_D = svgPath(mirrored(MAPLE_HALF).map(([x, y]) => [x, y - 26] as P));

const VEINS_D = (() => {
  let d = "M0 0 Q0.5 -40 0 -76";
  for (const side of [1, -1]) {
    for (const [tx, ty] of MAPLE_VEIN_TIPS) {
      const ex = tx * 0.88 * side;
      const ey = (ty - 26) * 0.88 - 2;
      d += ` M0 -6 Q${(ex * 0.5 + side * 2).toFixed(1)} ${(ey * 0.5 - 6).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
      d += ` M${(ex * 0.5).toFixed(1)} ${(ey * 0.5 - 3).toFixed(1)} l${(side * 6).toFixed(1)} -7`;
    }
  }
  return d;
})();

export const LEAF_TONES: [inner: string, outer: string, edge: string][] = [
  ["#f4c653", "#d4561f", "#7a2410"],
  ["#f6d76c", "#c8321b", "#62150c"],
  ["#f9e08b", "#e6a42a", "#8f5614"],
  ["#eba849", "#a8261c", "#4d0f0c"],
  ["#bdb44c", "#dc8a2c", "#6e4418"],
  ["#f1b95a", "#b8402a", "#5a1a14"],
];

/** Maple leaf with a sun-faded centre, burnt edges, embossed veins and a midrib fold. */
export function RealLeaf({ tone = 0, size = 1, spot = false }: { tone?: number; size?: number; spot?: boolean }) {
  const id = useId().replace(/:/g, "");
  const [inner, outer, edge] = LEAF_TONES[tone % LEAF_TONES.length];
  return (
    <g transform={`scale(${size})`}>
      <defs>
        <radialGradient id={`${id}f`} cx="0.5" cy="0.92" r="0.95">
          <stop offset="0" stopColor={inner} />
          <stop offset="0.4" stopColor={inner} />
          <stop offset="0.78" stopColor={outer} />
          <stop offset="1" stopColor={edge} />
        </radialGradient>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.5" stopColor="#280a00" stopOpacity="0" />
          <stop offset="0.5" stopColor="#280a00" stopOpacity="0.16" />
        </linearGradient>
        <linearGradient id={`${id}l`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff6dc" stopOpacity="0.3" />
          <stop offset="0.5" stopColor="#fff6dc" stopOpacity="0" />
          <stop offset="1" stopColor="#140600" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M0 0 Q1.5 7 -1.5 14" stroke={edge} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d={MAPLE_D} fill={`url(#${id}f)`} stroke={edge} strokeOpacity="0.7" strokeWidth="1.6" strokeLinejoin="round" />
      <path d={VEINS_D} transform="translate(0.7 0.9)" stroke="#320e04" strokeOpacity="0.3" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d={VEINS_D} stroke="#ffecaa" strokeOpacity="0.5" strokeWidth="1" fill="none" strokeLinecap="round" />
      {spot && <circle cx="-12" cy="-38" r="3.4" fill="#2a1006" opacity="0.55" />}
      <path d={MAPLE_D} fill={`url(#${id}s)`} />
      <path d={MAPLE_D} fill={`url(#${id}l)`} />
    </g>
  );
}
