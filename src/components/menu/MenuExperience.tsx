"use client";

import { Fragment, useCallback, useMemo, useState } from "react";
import { AmbienceProvider, useAmbience } from "@/components/ambience/AmbienceProvider";
import { CinematicStage } from "@/components/ambience/CinematicStage";
import { ParticleField } from "@/components/ambience/ParticleField";
import { DICT } from "@/lib/i18n";
import type { MenuDoc } from "@/lib/types";
import { CategoryNav } from "./CategoryNav";
import { CategorySection } from "./CategorySection";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { SectionDivider } from "./SectionDivider";
import { useLang } from "./useLang";
import { useLiveMenu } from "./useLiveMenu";

function Menu({ doc }: { doc: MenuDoc }) {
  const [lang, setLang] = useLang();
  const [openId, setOpenId] = useState<string | null>(null);
  const { ambience } = useAmbience();

  const sections = useMemo(() => {
    const visible = doc.items.filter((i) => i.available);
    return doc.categories
      .map((c) => ({ category: c, items: visible.filter((i) => i.categoryId === c.id) }))
      .filter((s) => s.items.length > 0);
  }, [doc]);

  const toggle = useCallback((id: string) => setOpenId((cur) => (cur === id ? null : id)), []);

  return (
    <>
      <CinematicStage />
      <ParticleField />
      <div data-lang-gate className="relative z-10 mx-auto w-full max-w-[560px]">
        <Header lang={lang} onLang={setLang} />
        <CategoryNav categories={sections.map((s) => s.category)} lang={lang} />
        <p className="px-6 pb-1 pt-2 text-center font-display text-[15px] italic text-crema-200/75 [text-shadow:0_1px_10px_rgb(0_0_0/0.6)]">
          {DICT[lang].tapHint}
        </p>
        <main className="flex flex-col gap-3 px-3.5 pb-4 pt-5">
          {sections.map((s, i) => (
            <Fragment key={s.category.id}>
              {i > 0 && <SectionDivider />}
              <CategorySection
                category={s.category}
                items={s.items}
                index={i}
                total={sections.length}
                lang={lang}
                season={ambience?.season ?? null}
                openId={openId}
                onToggle={toggle}
              />
            </Fragment>
          ))}
        </main>
        <Footer lang={lang} settings={doc.settings} />
      </div>
    </>
  );
}

export function MenuExperience({ doc: initial }: { doc: MenuDoc }) {
  const doc = useLiveMenu(initial);
  return (
    <AmbienceProvider settings={doc.settings}>
      <Menu doc={doc} />
    </AmbienceProvider>
  );
}
