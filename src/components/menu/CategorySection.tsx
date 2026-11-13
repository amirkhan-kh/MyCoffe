"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { formatPrice } from "@/lib/format";
import { DICT } from "@/lib/i18n";
import type { Category, Lang, MenuItem, Season } from "@/lib/types";
import { CardDecor } from "./CardDecor";
import { CategoryIcon } from "./CategoryIcon";
import { sectionId } from "./CategoryNav";
import { CARD_STYLES, CardStyleLayer } from "./CardStyle";
import { MenuItemRow } from "./MenuItemRow";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];

export function CategorySection({
  category,
  items,
  index,
  total,
  lang,
  season,
  openId,
  onToggle,
}: {
  category: Category;
  items: MenuItem[];
  index: number;
  total: number;
  lang: Lang;
  season: Season | null;
  openId: string | null;
  onToggle: (id: string) => void;
}) {
  const main = items.filter((i) => !i.addon);
  const extras = items.filter((i) => i.addon);
  const d = DICT[lang];
  const style = CARD_STYLES[index % CARD_STYLES.length];
  const reduce = useReducedMotion();

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: rise } = useScroll({ target: ref, offset: ["start end", "start 0.62"] });
  const { scrollYProgress: pass } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotateX = useTransform(rise, [0, 1], [32, 0]);
  const y = useTransform(rise, [0, 1], [90, 0]);
  const z = useTransform(rise, [0, 1], [-160, 0]);
  const opacity = useTransform(rise, [0, 0.55], [0, 1]);
  const sweep = useTransform(pass, [0.1, 0.9], ["-60%", "130%"]);

  return (
    <motion.section
      ref={ref}
      id={sectionId(category.id)}
      style={reduce ? undefined : { rotateX, y, z, opacity, transformPerspective: 1100, transformOrigin: "50% 0%" }}
      className={`glass-card style-${style} scroll-mt-[72px] rounded-[28px] px-5 pb-2.5 pt-6`}
    >
      <CardStyleLayer style={style} index={index} total={total} sweep={sweep} />
      {season && <CardDecor season={season} index={index} />}

      <header className="relative mb-2 flex items-center gap-3.5">
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/35 bg-gradient-to-b from-gold/[0.12] to-transparent text-gold shadow-[inset_0_1px_0_rgb(255_240_210/0.12)] ${
            style === "clay" ? "clay-puck" : ""
          } ${style === "future" ? "border-[rgb(140_230_255/0.45)] text-[rgb(190_240_255)] shadow-[0_0_18px_-4px_rgb(120_210_255/0.6)]" : ""}`}
        >
          <CategoryIcon icon={category.icon} className="h-[22px] w-[22px]" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-[27px] font-semibold leading-[1.05] tracking-[0.01em] text-crema-50">
            {category.name[lang]}
          </h2>
          <div aria-hidden className="mt-1.5 flex items-center gap-1.5">
            <span className="h-px w-8 bg-gradient-to-r from-gold/70 to-gold/0" />
            <span className="h-1 w-1 rotate-45 bg-gold/70" />
            <span className="h-px w-16 bg-gradient-to-r from-gold/40 to-gold/0" />
          </div>
        </div>
        <span
          aria-hidden
          className={
            style === "victorian"
              ? "self-start rounded-[50%] border border-gold/40 px-2.5 py-0.5 font-display text-[13px] font-semibold tracking-[0.12em] text-gold/85 shadow-[inset_0_0_0_2px_rgb(14_9_7/0.4),inset_0_0_0_3px_rgb(207_174_116/0.15)]"
              : "self-start pt-1 font-display text-[15px] italic text-crema-300/55"
          }
        >
          {ROMAN[index] ?? index + 1}
        </span>
      </header>

      <ul className="relative">
        {main.map((item) => (
          <MenuItemRow
            key={item.id}
            item={item}
            lang={lang}
            open={openId === item.id}
            onToggle={() => onToggle(item.id)}
          />
        ))}
      </ul>

      {extras.length > 0 && (
        <div
          className={`relative mb-3 mt-2 rounded-2xl border border-[var(--line)] px-4 pb-2 pt-3 ${
            style === "clay"
              ? "bg-espresso-950/30 shadow-[inset_4px_5px_10px_rgb(0_0_0/0.45),inset_-3px_-3px_8px_rgb(255_226_190/0.06)]"
              : "bg-espresso-950/35"
          }`}
        >
          <div className="mb-1 flex items-center gap-3">
            <span className="font-sans text-[10.5px] font-bold uppercase tracking-[0.22em] text-gold/90">{d.extras}</span>
            <span className="h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent" />
          </div>
          <ul>
            {extras.map((x) => (
              <li key={x.id} className="flex items-baseline py-1.5 text-[14.5px]">
                <span className="font-serif text-crema-100/90">{x.name[lang]}</span>
                <span className="leader" />
                <span className="whitespace-nowrap font-serif font-semibold tabular-nums text-caramel-300/90">
                  + {formatPrice(x.price)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.section>
  );
}
