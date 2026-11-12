"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";
import { buttonClass } from "@/components/ui/Button";
import { inputClass, labelClass } from "./styles";

export function LoginForm() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="mt-6 space-y-4 rounded-lg border border-line bg-surface p-5">
      <label className="block">
        <span className={labelClass}>Email</span>
        <input name="email" type="email" autoComplete="email" required className={inputClass} />
      </label>
      <label className="block">
        <span className={labelClass}>Contraseña</span>
        <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </label>
      {error && <p role="alert" className="text-sm font-medium text-danger">{error}</p>}
      <button type="submit" disabled={pending} className={buttonClass("primary", "md", "w-full")}>
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
