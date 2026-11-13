"use client";

import { useState } from "react";
import type { ItemInput } from "@/app/admin/actions";
import { formatPrice } from "@/lib/format";
import type { Category, MenuItem } from "@/lib/types";
import { I18nEditor } from "./I18nEditor";
import { Button, Field, inputClass, Sheet, Switch } from "./ui";

const empty = { uz: "", ru: "", en: "" };

function toDraft(item: MenuItem | null, categoryId: string): ItemInput {
  if (!item) {
    return {
      categoryId,
      name: { ...empty },
      description: { ...empty },
      price: 0,
      priceMax: null,
      seasonal: false,
      addon: false,
      available: true,
    };
  }
  const { id, categoryId: cat, name, description, price, priceMax, seasonal, addon, available } = item;
  return { id, categoryId: cat, name, description, price, priceMax, seasonal, addon, available };
}

function PriceInput({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  return (
    <Field label={label}>
      <div className="relative">
        <input
          inputMode="numeric"
          value={value ? formatPrice(value) : ""}
          onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, "").slice(0, 9)) || 0)}
          className={`${inputClass} pr-14 font-serif text-[17px] tabular-nums`}
          placeholder="0"
        />
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] text-crema-300/60">so‘m</span>
      </div>
    </Field>
  );
}

export function ItemSheet({
  open,
  item,
  categories,
  defaultCategoryId,
  onClose,
  onSave,
}: {
  open: boolean;
  item: MenuItem | null;
  categories: Category[];
  defaultCategoryId: string;
  onClose: () => void;
  onSave: (draft: ItemInput) => Promise<boolean>;
}) {
  const [draft, setDraft] = useState<ItemInput>(() => toDraft(item, defaultCategoryId));
  const [range, setRange] = useState(!!item?.priceMax);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof ItemInput>(k: K, v: ItemInput[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const hasName = !!(draft.name.uz.trim() || draft.name.ru.trim() || draft.name.en.trim());

  const save = async () => {
    setSaving(true);
    const ok = await onSave({ ...draft, priceMax: range ? draft.priceMax : null });
    setSaving(false);
    if (ok) onClose();
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={item ? "Mahsulotni tahrirlash" : "Yangi mahsulot"}
      footer={
        <>
          <Button onClick={onClose} className="flex-1">
            Bekor qilish
          </Button>
          <Button variant="primary" onClick={save} disabled={!hasName || saving} className="flex-[2]">
            {saving ? "Saqlanmoqda…" : "Saqlash"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Kategoriya">
          <select value={draft.categoryId} onChange={(e) => set("categoryId", e.target.value)} className={inputClass}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name.uz} · {c.name.ru}
              </option>
            ))}
          </select>
        </Field>

        <I18nEditor
          name={draft.name}
          onName={(v) => set("name", v)}
          description={draft.addon ? undefined : draft.description}
          onDescription={(v) => set("description", v)}
        />

        <div className="grid grid-cols-2 gap-3">
          <PriceInput label={range ? "Narx (dan)" : "Narx"} value={draft.price} onChange={(v) => set("price", v)} />
          {range ? (
            <PriceInput label="Narx (gacha)" value={draft.priceMax ?? 0} onChange={(v) => set("priceMax", v)} />
          ) : (
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => setRange(true)}
                className="w-full rounded-xl border border-dashed border-[var(--line-strong)] py-2.5 text-[13px] text-crema-300/80 hover:bg-espresso-800/60"
              >
                + Narx oralig‘i
              </button>
            </div>
          )}
        </div>
        {range && (
          <button type="button" onClick={() => setRange(false)} className="-mt-2 text-[12.5px] text-crema-300/70 underline underline-offset-4">
            Bitta narxga qaytarish
          </button>
        )}

        <div className="divide-y divide-[var(--line)] rounded-2xl border border-[var(--line)] bg-espresso-950/40">
          {[
            { k: "available" as const, t: "Menyuda ko‘rinadi", s: "O‘chirsangiz, mahsulot vaqtincha yashiriladi (stop-list)" },
            { k: "seasonal" as const, t: "Mavsumiy", s: "Nomi yonida «mavsumiy» belgisi chiqadi" },
            { k: "addon" as const, t: "Qo‘shimcha (dobavka)", s: "Sirop, espresso kabi — tavsifsiz, alohida ro‘yxatda" },
          ].map((row) => (
            <div key={row.k} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-crema-50">{row.t}</p>
                <p className="text-[12px] text-crema-300/60">{row.s}</p>
              </div>
              <Switch checked={draft[row.k]} onChange={(v) => set(row.k, v)} label={row.t} />
            </div>
          ))}
        </div>
      </div>
    </Sheet>
  );
}
