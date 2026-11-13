"use client";

import { useState } from "react";
import { translateAction } from "@/app/admin/actions";
import { LANGS, type I18n, type Lang } from "@/lib/types";
import { Field, Icons, inputClass } from "./ui";

const LABEL: Record<Lang, string> = { uz: "O‘zbekcha", ru: "Русский", en: "English" };
const FROM: Record<Lang, string> = { uz: "O‘zbekchadan", ru: "Ruschadan", en: "Inglizchadan" };

export function I18nEditor({
  name,
  onName,
  description,
  onDescription,
  nameLabel = "Nomi",
}: {
  name: I18n;
  onName: (v: I18n) => void;
  description?: I18n;
  onDescription?: (v: I18n) => void;
  nameLabel?: string;
}) {
  const [lang, setLang] = useState<Lang>("uz");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filled = (l: Lang) => !!name[l].trim() && (!description || !!description[l].trim());

  const translate = async () => {
    const sourceName = name[lang].trim();
    const sourceDesc = description?.[lang].trim() ?? "";
    if (!sourceName && !sourceDesc) {
      setError("Avval shu tilda matn yozing.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const [n, d] = await Promise.all([
        sourceName ? translateAction(sourceName, "name") : null,
        sourceDesc && description ? translateAction(sourceDesc, "description") : null,
      ]);
      if (n) onName({ ...n, [lang]: name[lang] });
      if (d && description && onDescription) onDescription({ ...d, [lang]: description[lang] });
    } catch {
      setError("Tarjima xizmati javob bermadi. Birozdan so‘ng qayta urinib ko‘ring.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-espresso-950/40 p-3.5">
      <div className="flex items-center gap-1.5">
        {LANGS.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            className={`relative rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition ${
              lang === l ? "bg-caramel-400 text-espresso-950" : "text-crema-200/80 hover:bg-espresso-800"
            }`}
          >
            {LABEL[l]}
            <span
              className={`absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full ${filled(l) ? "bg-emerald-400" : "bg-crema-300/30"}`}
            />
          </button>
        ))}
      </div>

      <div className="mt-3.5 space-y-3">
        <Field label={`${nameLabel} (${lang.toUpperCase()})`}>
          <input
            value={name[lang]}
            onChange={(e) => onName({ ...name, [lang]: e.target.value })}
            className={inputClass}
            placeholder="Masalan: Kapuchino"
          />
        </Field>
        {description && onDescription && (
          <Field label={`Tavsif (${lang.toUpperCase()})`}>
            <textarea
              value={description[lang]}
              onChange={(e) => onDescription({ ...description, [lang]: e.target.value })}
              rows={4}
              className={`${inputClass} resize-y leading-relaxed`}
              placeholder="Mahsulot haqida qisqacha…"
            />
          </Field>
        )}
      </div>

      <button
        type="button"
        onClick={translate}
        disabled={busy}
        className="mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-caramel-400/40 bg-caramel-400/10 py-2.5 text-[13px] font-semibold text-caramel-300 transition hover:bg-caramel-400/20 disabled:opacity-60"
      >
        {busy ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-caramel-300/30 border-t-caramel-300" />
        ) : (
          Icons.sparkle
        )}
        {busy ? "Tarjima qilinmoqda…" : `AI: ${FROM[lang]} boshqa tillarga tarjima`}
      </button>
      {error && <p className="mt-2 text-[12.5px] text-red-300">{error}</p>}
      <p className="mt-2 text-[12px] leading-relaxed text-crema-300/55">
        Istalgan bitta tilda yozing yoki o‘zgartiring — saqlaganda qolgan tillar shu matndan avtomatik yangilanadi. Bir
        nechta tilni qo‘lda tahrirlasangiz, ular yozganingizdek saqlanadi.
      </p>
    </div>
  );
}
