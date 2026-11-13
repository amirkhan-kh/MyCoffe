"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

export const inputClass =
  "w-full rounded-xl border border-[var(--line-strong)] bg-espresso-950/60 px-3.5 py-2.5 text-[15px] text-crema-50 placeholder:text-crema-300/40 outline-none transition focus:border-caramel-400/80 focus:ring-2 focus:ring-caramel-400/20";

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-crema-300/80">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[12px] text-crema-300/55">{hint}</span>}
    </label>
  );
}

export function Switch({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 disabled:opacity-50 ${
        checked ? "bg-caramel-400" : "bg-espresso-700"
      }`}
    >
      <motion.span
        className="absolute top-0.5 h-5 w-5 rounded-full bg-crema-50 shadow"
        initial={false}
        animate={{ left: checked ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 34 }}
      />
    </button>
  );
}

export function Button({
  variant = "ghost",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  const styles = {
    primary:
      "bg-gradient-to-b from-caramel-300 to-caramel-400 text-espresso-950 font-bold shadow-[0_10px_24px_-12px_rgb(201_148_96/0.9)]",
    ghost: "border border-[var(--line-strong)] bg-espresso-900/60 text-crema-100 hover:bg-espresso-800",
    danger: "border border-red-400/30 bg-red-500/10 text-red-200 hover:bg-red-500/20",
  }[variant];
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[13.5px] font-semibold transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${styles} ${className}`}
    />
  );
}

export function IconButton({ label, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...props}
      className={`grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] bg-espresso-900/60 text-crema-200 transition hover:bg-espresso-800 hover:text-crema-50 active:scale-95 disabled:pointer-events-none disabled:opacity-35 ${className}`}
    />
  );
}

export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-[28px] border border-[var(--line-strong)] bg-espresso-900 shadow-2xl sm:rounded-[28px]"
          >
            <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
              <h2 className="font-display text-[22px] font-semibold text-crema-50">{title}</h2>
              <IconButton label="Yopish" onClick={onClose}>
                <svg viewBox="0 0 24 24" className="h-4 w-4" stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </IconButton>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
            {footer && (
              <div className="flex gap-3 border-t border-[var(--line)] px-5 py-4 pb-[calc(env(safe-area-inset-bottom)+16px)]">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export const Icons = {
  up: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="m6 14 6-6 6 6" />
    </svg>
  ),
  down: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="m6 10 6 6 6-6" />
    </svg>
  ),
  edit: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M4 20h4L19 9l-4-4L4 16v4Z" />
      <path d="m13.5 6.5 4 4" />
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V4h6v3" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12 2c.7 5 3 7.3 8 8-5 .7-7.3 3-8 8-.7-5-3-7.3-8-8 5-.7 7.3-3 8-8Z" />
      <path d="M19 15c.3 2 1.1 2.7 3 3-1.9.3-2.7 1-3 3-.3-2-1.1-2.7-3-3 1.9-.3 2.7-1 3-3Z" opacity=".7" />
    </svg>
  ),
};
