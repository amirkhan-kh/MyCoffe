"use client";

import { useState } from "react";
import type { Settings } from "@/lib/types";
import { Button, Field, inputClass, Switch } from "./ui";

const SEASONS: { v: Settings["seasonMode"]; t: string }[] = [
  { v: "auto", t: "Avto (sanaga qarab)" },
  { v: "autumn", t: "Kuz 🍂" },
  { v: "winter", t: "Qish ❄️" },
  { v: "spring", t: "Bahor 🌸" },
  { v: "summer", t: "Yoz ☀️" },
];

const PREVIEWS = [
  { t: "Kuz · yomg‘ir · shom", q: "season=autumn&weather=rain&time=dusk" },
  { t: "Kuz · ochiq · oltin soat", q: "season=autumn&weather=clear&time=golden" },
  { t: "Qish · qor bo‘roni · tun", q: "season=winter&weather=snow&time=night" },
  { t: "Qish · ochiq · tong", q: "season=winter&weather=clear&time=sunrise" },
  { t: "Bahor · ochiq · tong", q: "season=spring&weather=clear&time=morning" },
  { t: "Bahor · momaqaldiroq", q: "season=spring&weather=storm&time=day" },
  { t: "Yoz · jazirama kun", q: "season=summer&weather=clear&time=day&temp=38" },
  { t: "Yoz · quyosh botishi", q: "season=summer&weather=clear&time=sunset" },
  { t: "Tuman · tong oldi", q: "season=autumn&weather=fog&time=dawn" },
];

export function SettingsPanel({ settings, onSave }: { settings: Settings; onSave: (s: Settings) => Promise<boolean> }) {
  const [draft, setDraft] = useState(settings);
  const [saving, setSaving] = useState(false);

  const dirty = JSON.stringify(draft) !== JSON.stringify(settings);
  const setHours = (day: "weekdays" | "sunday", k: "open" | "close", v: string) =>
    setDraft((d) => ({ ...d, hours: { ...d.hours, [day]: { ...d.hours[day], [k]: v } } }));

  return (
    <div className="space-y-5">
      <section className="glass-card space-y-4 rounded-3xl p-5">
        <h3 className="font-display text-[22px] font-semibold text-crema-50">Qahvaxona ma’lumotlari</h3>
        <Field label="Telefon raqam">
          <input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className={inputClass} inputMode="tel" />
        </Field>
        <Field label="Instagram havolasi">
          <input value={draft.instagram} onChange={(e) => setDraft({ ...draft, instagram: e.target.value })} className={inputClass} />
        </Field>
        {(["weekdays", "sunday"] as const).map((day) => (
          <div key={day}>
            <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-crema-300/80">
              {day === "weekdays" ? "Dushanba — Shanba" : "Yakshanba"}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <input type="time" value={draft.hours[day].open} onChange={(e) => setHours(day, "open", e.target.value)} className={inputClass} />
              <input type="time" value={draft.hours[day].close} onChange={(e) => setHours(day, "close", e.target.value)} className={inputClass} />
            </div>
          </div>
        ))}
      </section>

      <section className="glass-card space-y-4 rounded-3xl p-5">
        <h3 className="font-display text-[22px] font-semibold text-crema-50">Fasl va ob-havo effektlari</h3>
        <Field label="Fasl dizayni" hint="«Avto» — Andijon sanasiga qarab fasl o‘zi almashadi.">
          <select
            value={draft.seasonMode}
            onChange={(e) => setDraft({ ...draft, seasonMode: e.target.value as Settings["seasonMode"] })}
            className={inputClass}
          >
            {SEASONS.map((s) => (
              <option key={s.v} value={s.v}>
                {s.t}
              </option>
            ))}
          </select>
        </Field>
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-espresso-950/40 px-4 py-3">
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-crema-50">Jonli ob-havo</p>
            <p className="text-[12px] text-crema-300/60">Andijonda yomg‘ir yoki qor yog‘sa, saytda ham ko‘rinadi</p>
          </div>
          <Switch checked={draft.weatherEffects} onChange={(v) => setDraft({ ...draft, weatherEffects: v })} label="Jonli ob-havo" />
        </div>
      </section>

      <div className="sticky bottom-3 z-10">
        <Button
          variant="primary"
          disabled={!dirty || saving}
          className="w-full py-3.5"
          onClick={async () => {
            setSaving(true);
            await onSave(draft);
            setSaving(false);
          }}
        >
          {saving ? "Saqlanmoqda…" : dirty ? "O‘zgarishlarni saqlash" : "Saqlangan"}
        </Button>
      </div>

      <section className="glass-card rounded-3xl p-5">
        <h3 className="font-display text-[22px] font-semibold text-crema-50">Ko‘rinishni sinab ko‘rish</h3>
        <p className="mt-1 text-[13px] text-crema-300/65">Har qanday fasl, ob-havo va vaqtni oldindan ko‘ring. Mijozlarga ta’sir qilmaydi.</p>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {PREVIEWS.map((p) => (
            <a
              key={p.q}
              href={`/?${p.q}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-espresso-950/40 px-4 py-3 text-[13.5px] text-crema-100 transition hover:border-caramel-400/50 hover:bg-espresso-800/60"
            >
              {p.t}
              <span aria-hidden className="text-caramel-300">↗</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
