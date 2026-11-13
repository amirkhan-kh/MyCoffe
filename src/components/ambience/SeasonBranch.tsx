import type { Season } from "@/lib/types";
import { RealLeaf } from "./RealLeaf";

const STEM = [
  { d: "M-14 18 C 20 22, 46 26, 72 36", w: 5.2 },
  { d: "M72 36 C 104 50, 132 62, 160 66", w: 3.6 },
  { d: "M160 66 C 182 68, 200 67, 222 62", w: 2.2 },
];
const TWIGS = [
  "M52 29 C 60 16, 72 10, 90 6",
  "M100 48 C 108 64, 108 82, 100 100",
  "M146 63 C 156 50, 170 44, 190 42",
  "M182 67 C 192 78, 196 90, 194 106",
];

type Anchor = [x: number, y: number, rot: number, scale: number];
const ANCHORS: Anchor[] = [
  [90, 6, 60, 1],
  [76, 12, 20, 0.85],
  [100, 100, 170, 1],
  [106, 80, 120, 0.85],
  [190, 42, 70, 1],
  [172, 46, 20, 0.8],
  [194, 106, 175, 0.95],
  [222, 62, 95, 0.9],
  [128, 58, 140, 0.75],
  [34, 22, -10, 0.7],
  [150, 66, 160, 0.7],
];

const LEAF = "M0 0 C 6 -6, 7 -18, 0 -30 C -7 -18, -6 -6, 0 0 Z";

function Flutter({ a, i, children }: { a: Anchor; i: number; children: React.ReactNode }) {
  return (
    <g transform={`translate(${a[0]} ${a[1]}) rotate(${a[2]}) scale(${a[3]})`}>
      <g
        style={{
          transformOrigin: "0 0",
          animation: `flutter ${3.2 + (i % 4) * 0.9}s ease-in-out ${-(i * 0.7)}s infinite alternate`,
        }}
      >
        {children}
      </g>
    </g>
  );
}

function Autumn() {
  return (
    <>
      {ANCHORS.map((a, i) => (
        <Flutter key={i} a={a} i={i}>
          <RealLeaf tone={i} size={i % 4 === 3 ? 0.32 : 0.4} spot={i % 3 === 0} />
        </Flutter>
      ))}
    </>
  );
}

function Blossom({ r = 7 }: { r?: number }) {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx="0" cy={-r} rx={r * 0.62} ry={r * 0.82} transform={`rotate(${deg})`} fill="#fdf1f3" stroke="#eab5c4" strokeWidth="0.5" />
      ))}
      <circle r={r * 0.36} fill="#e88aa3" />
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <circle key={deg} cx="0" cy={-r * 0.55} r="0.7" fill="#c7584f" transform={`rotate(${deg})`} />
      ))}
    </g>
  );
}

function Spring() {
  return (
    <>
      {ANCHORS.map((a, i) =>
        i % 3 === 2 ? (
          <Flutter key={i} a={a} i={i}>
            <path d={LEAF} fill="#7fa45a" transform="scale(0.7)" />
          </Flutter>
        ) : (
          <g key={i} transform={`translate(${a[0]} ${a[1]}) scale(${a[3]})`}>
            <g style={{ animation: `breathe ${4 + (i % 3)}s ease-in-out ${-i}s infinite` }}>
              <Blossom r={i % 2 ? 6 : 7.5} />
            </g>
          </g>
        ),
      )}
      <circle cx="62" cy="31" r="2.4" fill="#f3b9c8" />
      <circle cx="118" cy="56" r="2.2" fill="#f3b9c8" />
      <circle cx="166" cy="64" r="2" fill="#f3b9c8" />
    </>
  );
}

function Winter() {
  return (
    <>
      {STEM.map((s, i) => (
        <g key={i}>
          <path d={s.d} transform="translate(0 -2)" stroke="#eef3f9" strokeWidth={s.w * 0.8} strokeLinecap="round" fill="none" />
          <path
            d={s.d}
            transform="translate(0 -3.2)"
            stroke="#fbfdff"
            strokeWidth={s.w + 2.6}
            strokeLinecap="round"
            strokeDasharray={i === 0 ? "34 10 22 16 40 12" : "26 14 30 18"}
            fill="none"
          />
        </g>
      ))}
      {TWIGS.map((d, i) => (
        <path key={i} d={d} transform="translate(0 -1.4)" stroke="#f4f8fc" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="18 9 12 14" fill="none" />
      ))}
      {[ANCHORS[2], ANCHORS[6], ANCHORS[3]].map((a, i) => (
        <g key={i} transform={`translate(${a[0]} ${a[1]})`}>
          <circle cx="-2.5" cy="2" r="3" fill="#b3261e" />
          <circle cx="2.6" cy="2.6" r="2.8" fill="#c4302a" />
          <circle cx="0" cy="6.4" r="2.9" fill="#a61f19" />
          <circle cx="-3.4" cy="1" r="0.8" fill="#ffd9d0" opacity="0.8" />
        </g>
      ))}
      {[ANCHORS[2], ANCHORS[6]].map((a, i) => (
        <path key={`i${i}`} d={`M${a[0] - 8} ${a[1] - 6} l1.5 9 l1.5 -9 M${a[0] + 6} ${a[1] - 4} l1.2 7 l1.2 -7`} fill="#e6f1fb" opacity="0.85" />
      ))}
    </>
  );
}

function Summer() {
  return (
    <>
      {ANCHORS.map((a, i) =>
        i === 2 || i === 6 ? null : (
          <Flutter key={i} a={a} i={i}>
            <path d={LEAF} fill={i % 2 ? "#3f6b35" : "#55843f"} transform="scale(0.95 1.05)" />
            <path d="M0 0 L0 -26" stroke="#2a4a24" strokeWidth="0.8" fill="none" />
          </Flutter>
        ),
      )}
      {[ANCHORS[2], ANCHORS[6]].map((a, i) => (
        <g key={i} transform={`translate(${a[0]} ${a[1]})`}>
          <g style={{ transformOrigin: "0 0", animation: `flutter ${5 + i}s ease-in-out ${-i * 2}s infinite alternate` }}>
            <path d="M0 0 L0 6" stroke="#4a3a1e" strokeWidth="1.2" />
            <ellipse cx="0" cy="15" rx={9 - i} ry={11 - i} fill="url(#lemon)" />
            <ellipse cx="0" cy={26 - i * 2} rx="1.6" ry="1.4" fill="#e9c22f" />
            <ellipse cx="-3" cy="11" rx="2.4" ry="3.6" fill="#fff7c2" opacity="0.5" />
          </g>
        </g>
      ))}
      <g transform="translate(36 22) scale(0.7)">
        <Blossom r={6} />
      </g>
    </>
  );
}

export function SeasonBranch({ season, className, style }: { season: Season; className?: string; style?: React.CSSProperties }) {
  const bark = season === "winter" ? "#3b2c26" : "#3a2418";
  return (
    <svg viewBox="0 0 240 170" className={className} style={style} aria-hidden>
      <defs>
        <radialGradient id="lemon" cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#fff3a0" />
          <stop offset="0.55" stopColor="#f5d33c" />
          <stop offset="1" stopColor="#d7a915" />
        </radialGradient>
      </defs>
      <g style={{ transformOrigin: "0 0", animation: "sway 7s ease-in-out infinite alternate" }}>
        {STEM.map((s, i) => (
          <path key={i} d={s.d} stroke={bark} strokeWidth={s.w} strokeLinecap="round" fill="none" />
        ))}
        {TWIGS.map((d, i) => (
          <path key={i} d={d} stroke={bark} strokeWidth={1.6} strokeLinecap="round" fill="none" />
        ))}
        {season === "autumn" && <Autumn />}
        {season === "spring" && <Spring />}
        {season === "winter" && <Winter />}
        {season === "summer" && <Summer />}
      </g>
    </svg>
  );
}
