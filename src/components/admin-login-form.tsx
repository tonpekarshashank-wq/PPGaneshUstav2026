"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { loginAdmin, type LoginState } from "@/app/admin/actions";

const initialState: LoginState = {};

export function AdminLoginForm({ disabled }: { disabled: boolean }) {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  return (
    <form action={formAction} className="grid gap-4 rounded-lg border border-maroon-800/10 bg-white p-5 shadow-soft">
      <label className="grid gap-1 text-sm font-bold text-maroon-800">
        Admin email
        <input name="email" type="email" required disabled={disabled || pending} className="min-h-11 rounded-lg border border-maroon-800/20 px-3 text-base text-zinc-900 disabled:bg-zinc-100" />
      </label>
      <label className="grid gap-1 text-sm font-bold text-maroon-800">
        Password
        <input name="password" type="password" required disabled={disabled || pending} className="min-h-11 rounded-lg border border-maroon-800/20 px-3 text-base text-zinc-900 disabled:bg-zinc-100" />
      </label>
      <button type="submit" disabled={disabled || pending} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-maroon-600 px-5 font-extrabold text-white hover:bg-maroon-800 disabled:cursor-not-allowed disabled:bg-zinc-400">
        <LogIn size={18} aria-hidden="true" />
        {pending ? "Signing in..." : "Sign in"}
      </button>
      {state.error ? <p role="alert" className="rounded-lg bg-maroon-50 px-3 py-2 text-sm font-bold text-maroon-800">{state.error}</p> : null}
    </form>
  );
}
