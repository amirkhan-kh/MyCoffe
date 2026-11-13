"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import {
  deleteCategoryAction,
  deleteItemAction,
  logoutAction,
  moveCategoryAction,
  moveItemAction,
  saveCategoryAction,
  saveItemAction,
  saveSettingsAction,
  setItemAvailableAction,
  type CategoryInput,
  type ItemInput,
} from "@/app/admin/actions";
import { CategoryIcon } from "@/components/menu/CategoryIcon";
import { formatPrice, formatPriceRange } from "@/lib/format";
import { announceMenuChange } from "@/lib/live";
import type { Category, MenuDoc, MenuItem, Settings } from "@/lib/types";
import { CategorySheet } from "./CategorySheet";
import { ItemSheet } from "./ItemSheet";
import { QrPanel } from "./QrPanel";
import { SettingsPanel } from "./SettingsPanel";
import { Button, IconButton, Icons, Switch } from "./ui";

type Tab = "menu" | "settings" | "qr";
type Toast = { id: number; text: string; tone: "ok" | "error" };

export function Dashboard({ initialDoc }: { initialDoc: MenuDoc }) {
  const [doc, setDoc] = useState(initialDoc);
  const [tab, setTab] = useState<Tab>("menu");
  const [catId, setCatId] = useState(initialDoc.categories[0]?.id ?? "");
  const [itemSheet, setItemSheet] = useState<{ open: boolean; item: MenuItem | null; key: number }>({ open: false, item: null, key: 0 });
  const [catSheet, setCatSheet] = useState<{ open: boolean; category: Category | null; key: number }>({ open: false, category: null, key: 0 });
  const openItem = (item: MenuItem | null) => setItemSheet((s) => ({ open: true, item, key: s.key + 1 }));
  const openCategory = (category: Category | null) => setCatSheet((s) => ({ open: true, category, key: s.key + 1 }));
  const [toast, setToast] = useState<Toast | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const notify = useCallback((text: string, tone: Toast["tone"] = "ok") => {
    const id = Date.now();
    setToast({ id, text, tone });
    window.setTimeout(() => setToast((t) => (t?.id === id ? null : t)), 2600);
  }, []);

  const run = useCallback(
    async (fn: () => Promise<MenuDoc>, success: string, key?: string) => {
      if (key) setBusyId(key);
      try {
        const saved = await fn();
        setDoc(saved);
        announceMenuChange(saved.updatedAt);
        notify(success);
        return true;
      } catch (err) {
        notify(err instanceof Error && err.message !== "Unauthorized" ? err.message : "Xatolik yuz berdi. Qayta kiring.", "error");
        return false;
      } finally {
        if (key) setBusyId(null);
      }
    },
    [notify],
  );

  const category = doc.categories.find((c) => c.id === catId) ?? doc.categories[0];
  const items = useMemo(() => doc.items.filter((i) => i.categoryId === category?.id), [doc.items, category?.id]);
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const i of doc.items) m.set(i.categoryId, (m.get(i.categoryId) ?? 0) + 1);
    return m;
  }, [doc.items]);

  const saveItem = (draft: ItemInput) => run(() => saveItemAction(draft), "Mahsulot saqlandi");
  const saveCategory = (draft: CategoryInput) => run(() => saveCategoryAction(draft), "Kategoriya saqlandi");
  const saveSettings = (s: Settings) => run(() => saveSettingsAction(s), "Sozlamalar saqlandi");

  return (
    <div className="grain relative min-h-dvh bg-espresso-950 pb-24">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{ background: "radial-gradient(80% 40% at 50% 0%, rgb(201 148 96 / 0.14), transparent 70%)" }}
      />

      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-espresso-950/80 backdrop-blur-xl print:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <div className="h-10 w-10 overflow-hidden rounded-full">
            <Image src="/brand/logo-round.png" alt="" width={40} height={40} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[19px] font-semibold leading-none text-crema-50">Boshqaruv paneli</p>
            <p className="mt-1 text-[11.5px] text-crema-300/60">
              {doc.items.length} ta mahsulot · {doc.categories.length} ta kategoriya
            </p>
          </div>
          <a href="/" target="_blank" rel="noreferrer" className="hidden rounded-full border border-[var(--line-strong)] px-3.5 py-2 text-[12.5px] font-semibold text-crema-100 hover:bg-espresso-800 sm:block">
            Saytni ko‘rish ↗
          </a>
          <form action={logoutAction}>
            <button className="rounded-full border border-[var(--line-strong)] px-3.5 py-2 text-[12.5px] font-semibold text-crema-100 hover:bg-espresso-800">
              Chiqish
            </button>
          </form>
        </div>
        <div className="mx-auto flex max-w-3xl gap-1 px-4 pb-3">
          {(
            [
              ["menu", "Menyu"],
              ["settings", "Sozlamalar"],
              ["qr", "QR kod"],
            ] as [Tab, string][]
          ).map(([k, t]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`relative isolate flex-1 rounded-full py-2 text-[13px] font-semibold transition-colors ${
                tab === k ? "text-espresso-950" : "text-crema-200/80"
              }`}
            >
              {tab === k && (
                <motion.span layoutId="admin-tab" className="absolute inset-0 -z-10 rounded-full bg-caramel-400" transition={{ type: "spring", stiffness: 420, damping: 36 }} />
              )}
              {t}
            </button>
          ))}
        </div>
      </header>

      <main className="relative mx-auto max-w-3xl px-4 pt-5">
        {tab === "menu" && category && (
          <div className="space-y-4">
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
              {doc.categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCatId(c.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition ${
                    c.id === category.id
                      ? "border-caramel-400 bg-caramel-400/15 text-caramel-300"
                      : "border-[var(--line)] bg-espresso-900/60 text-crema-200/80 hover:text-crema-50"
                  }`}
                >
                  <CategoryIcon icon={c.icon} className="h-4 w-4" />
                  {c.name.uz}
                  <span className="rounded-full bg-espresso-950/60 px-1.5 text-[11px] tabular-nums text-crema-300/70">{counts.get(c.id) ?? 0}</span>
                </button>
              ))}
              <button
                onClick={() => openCategory(null)}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-dashed border-caramel-400/50 px-3.5 py-2 text-[13px] font-semibold text-caramel-300"
              >
                {Icons.plus} Kategoriya
              </button>
            </div>

            <section className="glass-card rounded-3xl p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-gold/35 text-gold">
                  <CategoryIcon icon={category.icon} className="h-[22px] w-[22px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-display text-[24px] font-semibold leading-tight text-crema-50">{category.name.uz}</h2>
                  <p className="truncate text-[12px] text-crema-300/60">
                    {category.name.ru} · {category.name.en}
                  </p>
                </div>
              </div>
              <div className="mt-3.5 flex flex-wrap gap-2">
                <IconButton label="Yuqoriga" disabled={doc.categories[0]?.id === category.id} onClick={() => run(() => moveCategoryAction(category.id, -1), "Tartib o‘zgardi")}>
                  {Icons.up}
                </IconButton>
                <IconButton label="Pastga" disabled={doc.categories.at(-1)?.id === category.id} onClick={() => run(() => moveCategoryAction(category.id, 1), "Tartib o‘zgardi")}>
                  {Icons.down}
                </IconButton>
                <Button onClick={() => openCategory(category)}>{Icons.edit} Tahrirlash</Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    const n = counts.get(category.id) ?? 0;
                    if (!window.confirm(`«${category.name.uz}» kategoriyasi${n ? ` va undagi ${n} ta mahsulot` : ""} o‘chirilsinmi?`)) return;
                    run(() => deleteCategoryAction(category.id), "Kategoriya o‘chirildi");
                  }}
                >
                  {Icons.trash} O‘chirish
                </Button>
              </div>
            </section>

            <Button variant="primary" className="w-full py-3.5 text-[14px]" onClick={() => openItem(null)}>
              {Icons.plus} Mahsulot qo‘shish
            </Button>

            <ul className="space-y-2.5">
              <AnimatePresence initial={false}>
                {items.map((item, idx) => (
                  <motion.li
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={`glass-card rounded-2xl p-3.5 ${item.available ? "" : "opacity-60"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <p className="font-serif text-[16px] font-medium text-crema-50">{item.name.uz}</p>
                          {item.seasonal && <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10.5px] font-bold text-amber-300">Mavsumiy</span>}
                          {item.addon && <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-[10.5px] font-bold text-sky-300">Qo‘shimcha</span>}
                          {!item.available && <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10.5px] font-bold text-red-300">Yashirin</span>}
                        </div>
                        <p className="mt-0.5 truncate text-[12px] text-crema-300/60">
                          {item.name.ru} · {item.name.en}
                        </p>
                        {item.description.uz && <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-snug text-crema-200/70">{item.description.uz}</p>}
                      </div>
                      <p className="whitespace-nowrap font-serif text-[15px] font-semibold tabular-nums text-caramel-300">
                        {item.addon ? `+ ${formatPrice(item.price)}` : formatPriceRange(item.price, item.priceMax)}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-2 border-t border-[var(--line)] pt-3">
                      <Switch
                        checked={item.available}
                        disabled={busyId === item.id}
                        label="Menyuda ko‘rinadi"
                        onChange={(v) => run(() => setItemAvailableAction(item.id, v), v ? "Menyuga qaytarildi" : "Menyudan yashirildi", item.id)}
                      />
                      <span className="text-[12px] text-crema-300/70">{item.available ? "Ko‘rinadi" : "Yashirin"}</span>
                      <div className="ml-auto flex gap-1.5">
                        <IconButton label="Yuqoriga" disabled={idx === 0} onClick={() => run(() => moveItemAction(item.id, -1), "Tartib o‘zgardi")}>
                          {Icons.up}
                        </IconButton>
                        <IconButton label="Pastga" disabled={idx === items.length - 1} onClick={() => run(() => moveItemAction(item.id, 1), "Tartib o‘zgardi")}>
                          {Icons.down}
                        </IconButton>
                        <IconButton label="Tahrirlash" onClick={() => openItem(item)}>
                          {Icons.edit}
                        </IconButton>
                        <IconButton
                          label="O‘chirish"
                          className="hover:!bg-red-500/20 hover:!text-red-200"
                          onClick={() => window.confirm(`«${item.name.uz}» o‘chirilsinmi?`) && run(() => deleteItemAction(item.id), "Mahsulot o‘chirildi")}
                        >
                          {Icons.trash}
                        </IconButton>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
              {items.length === 0 && (
                <li className="rounded-2xl border border-dashed border-[var(--line-strong)] px-4 py-10 text-center text-[13.5px] text-crema-300/70">
                  Bu kategoriyada hali mahsulot yo‘q
                </li>
              )}
            </ul>
          </div>
        )}

        {tab === "settings" && <SettingsPanel key={doc.updatedAt} settings={doc.settings} onSave={saveSettings} />}
        {tab === "qr" && <QrPanel />}
      </main>

      <ItemSheet
        key={`item-${itemSheet.key}`}
        open={itemSheet.open}
        item={itemSheet.item}
        categories={doc.categories}
        defaultCategoryId={category?.id ?? ""}
        onClose={() => setItemSheet((s) => ({ ...s, open: false }))}
        onSave={saveItem}
      />
      <CategorySheet
        key={`cat-${catSheet.key}`}
        open={catSheet.open}
        category={catSheet.category}
        onClose={() => setCatSheet((s) => ({ ...s, open: false }))}
        onSave={saveCategory}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 12, x: "-50%" }}
            className={`fixed bottom-[calc(env(safe-area-inset-bottom)+20px)] left-1/2 z-[60] rounded-full px-5 py-3 text-[13.5px] font-semibold shadow-2xl ${
              toast.tone === "ok" ? "bg-crema-50 text-espresso-900" : "bg-red-500 text-white"
            }`}
          >
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
