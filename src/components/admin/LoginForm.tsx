"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/actions";
import { Field, inputClass } from "./ui";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form action={action} className="mt-7 space-y-4">
      <Field label="Login">
        <input key={state.login} name="login" defaultValue={state.login} autoComplete="username" required className={inputClass} />
      </Field>
      <Field label="Parol">
        <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </Field>
      {state.error && (
        <p role="alert" className="rounded-xl border border-red-400/30 bg-red-500/10 px-3.5 py-2.5 text-[13px] text-red-200">
          {state.error}
        </p>
      )}
      <button
        disabled={pending}
        className="mt-2 w-full rounded-full bg-gradient-to-b from-caramel-300 to-caramel-400 py-3.5 text-[14px] font-bold text-espresso-950 shadow-[0_14px_30px_-12px_rgb(201_148_96/0.8)] transition active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "Tekshirilmoqda…" : "Kirish"}
      </button>
    </form>
  );
}
