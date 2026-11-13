import { RealLeaf } from "@/components/ambience/RealLeaf";
import type { Season } from "@/lib/types";

function SnowCap({ seed }: { seed: number }) {
  let d = "M0,6";
  let x = 0;
  let s = seed;
  const r = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  while (x < 400) {
    const w = 18 + r() * 26;
    const h = 5 + r() * 9;
    d += ` q${w / 2},${h * 2} ${w},0`;
    x += w;
  }
  d += " V0 H0 Z";
  return (
    <svg viewBox="0 0 400 22" preserveAspectRatio="none" className="absolute inset-x-5 -top-[7px] h-[20px] w-[calc(100%-40px)]" aria-hidden>
      <path d={d} transform="translate(0 2.5)" fill="#9fb4cc" opacity="0.55" />
      <path d={d} fill="#f7fafd" />
    </svg>
  );
}

function RestingLeaf({ index }: { index: number }) {
  return (
    <svg viewBox="-60 -90 120 110" className="absolute -right-3 -top-8 h-[60px] w-[66px] rotate-[24deg] drop-shadow-[0_8px_10px_rgb(0_0_0/0.5)]" aria-hidden>
      <RealLeaf tone={index} size={0.95} spot={index % 4 === 0} />
    </svg>
  );
}

function Sprig() {
  return (
    <svg viewBox="0 0 60 40" className="absolute -right-1 -top-5 h-10 w-16 drop-shadow-[0_6px_8px_rgb(0_0_0/0.4)]" aria-hidden>
      <path d="M4 34 C 20 30, 34 20, 52 10" stroke="#4a2c1d" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {[
        [22, 26, 5.5],
        [40, 15, 6.5],
        [52, 9, 4.5],
      ].map(([cx, cy, r], i) => (
        <g key={i} transform={`translate(${cx} ${cy})`}>
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse key={deg} cy={-r * 0.9} rx={r * 0.6} ry={r * 0.8} transform={`rotate(${deg})`} fill="#fdeff2" />
          ))}
          <circle r={r * 0.35} fill="#e48aa2" />
        </g>
      ))}
    </svg>
  );
}

function CitrusSlice() {
  return (
    <svg viewBox="0 0 40 40" className="absolute -right-1.5 -top-4 h-9 w-9 rotate-[-14deg] drop-shadow-[0_6px_8px_rgb(0_0_0/0.45)]" aria-hidden>
      <circle cx="20" cy="20" r="17" fill="#e7b416" />
      <circle cx="20" cy="20" r="15.4" fill="#fff6d2" />
      {Array.from({ length: 10 }, (_, i) => (
        <path
          key={i}
          d="M20 20 L20 6.4 A 13.6 13.6 0 0 1 28 9 Z"
          fill="#f6d548"
          stroke="#fff6d2"
          strokeWidth="1.1"
          strokeLinejoin="round"
          transform={`rotate(${i * 36} 20 20)`}
        />
      ))}
      <circle cx="20" cy="20" r="2" fill="#fff6d2" />
      <path d="M8 13 A 13 13 0 0 1 16 7" stroke="#fffbe8" strokeWidth="1.2" fill="none" opacity="0.7" strokeLinecap="round" />
    </svg>
  );
}

export function CardDecor({ season, index }: { season: Season; index: number }) {
  if (season === "winter") return <SnowCap seed={index * 97 + 13} />;
  if (index % 2 === 1) return null;
  if (season === "autumn") return <RestingLeaf index={index} />;
  if (season === "spring") return <Sprig />;
  return index % 4 === 0 ? <CitrusSlice /> : null;
}
