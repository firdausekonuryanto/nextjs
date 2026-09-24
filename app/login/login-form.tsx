"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import { Button } from "@/app/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, {});

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Email</span>
        <input
          key={state.email}
          name="email"
          type="email"
          autoComplete="email"
          autoFocus
          defaultValue={state.email}
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          className={inputClass}
        />
      </label>
      <Button type="submit" loading={pending} className="w-full">
        {pending ? "Memproses..." : "Masuk"}
      </Button>
    </form>
  );
}
