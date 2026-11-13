"use client";

import { useState } from "react";
import type { CategoryInput } from "@/app/admin/actions";
import { CategoryIcon, ICON_KEYS } from "@/components/menu/CategoryIcon";
import type { Category } from "@/lib/types";
import { I18nEditor } from "./I18nEditor";
import { Button, Field, Sheet } from "./ui";

export function CategorySheet({
  open,
  category,
  onClose,
  onSave,
}: {
  open: boolean;
  category: Category | null;
  onClose: () => void;
  onSave: (draft: CategoryInput) => Promise<boolean>;
}) {
  const [draft, setDraft] = useState<CategoryInput>(() =>
    category ? { id: category.id, name: category.name, icon: category.icon } : { name: { uz: "", ru: "", en: "" }, icon: "sparkle" },
  );
  const [saving, setSaving] = useState(false);

  const hasName = !!(draft.name.uz.trim() || draft.name.ru.trim() || draft.name.en.trim());

  const save = async () => {
    setSaving(true);
    const ok = await onSave(draft);
    setSaving(false);
    if (ok) onClose();
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={category ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}
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
        <I18nEditor name={draft.name} onName={(name) => setDraft((d) => ({ ...d, name }))} nameLabel="Kategoriya nomi" />
        <Field label="Belgi (ikonka)">
          <div className="grid grid-cols-6 gap-2">
            {ICON_KEYS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setDraft((d) => ({ ...d, icon }))}
                aria-pressed={draft.icon === icon}
                className={`grid aspect-square place-items-center rounded-xl border transition ${
                  draft.icon === icon
                    ? "border-caramel-400 bg-caramel-400/15 text-caramel-300"
                    : "border-[var(--line)] text-crema-200/70 hover:bg-espresso-800"
                }`}
              >
                <CategoryIcon icon={icon} className="h-6 w-6" />
              </button>
            ))}
          </div>
        </Field>
      </div>
    </Sheet>
  );
}
