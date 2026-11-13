import Image from "next/image";
import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Admin — MY COFFEE", robots: { index: false } };

export default function LoginPage() {
  return (
    <main className="grain relative grid min-h-dvh place-items-center overflow-hidden bg-espresso-950 px-5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 50% at 50% 0%, rgb(201 148 96 / 0.18), transparent 70%), radial-gradient(60% 40% at 50% 100%, rgb(96 56 32 / 0.25), transparent 70%)",
        }}
      />
      <div className="glass-card relative w-full max-w-sm rounded-[28px] px-7 pb-8 pt-9">
        <div className="mx-auto h-20 w-20 overflow-hidden rounded-full shadow-[0_12px_30px_-10px_rgb(0_0_0/0.8)]">
          <Image src="/brand/logo-round.png" alt="MY COFFEE by Dilim" width={80} height={80} priority />
        </div>
        <h1 className="mt-5 text-center font-display text-[28px] font-semibold text-crema-50">Boshqaruv paneli</h1>
        <p className="mt-1 text-center text-[13px] text-crema-300/70">Menyuni tahrirlash uchun tizimga kiring</p>
        <LoginForm />
      </div>
    </main>
  );
}
