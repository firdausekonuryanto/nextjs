"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { UserFormState } from "./actions";
import type { User } from "@/lib/users";
import { Button, ButtonLink } from "@/app/components/ui/button"; // ganti import Link

type Props = {
  action: (prev: UserFormState, formData: FormData) => Promise<UserFormState>;
  user?: User;
  submitLabel: string;
};

const inputClass = (error?: string) =>
  `w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${
    error ? "border-red-500" : "border-slate-300"
  }`;

export default function UserForm({ action, user, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const v = state.values ?? {
    name: user?.name ?? "",
    email: user?.email ?? "",
    role: user?.role ?? "staff",
  };
  const e = state.errors ?? {};

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-xl border bg-white p-6 shadow-sm"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Nama</span>
          <input
            key={v.name}
            name="name"
            defaultValue={v.name}
            className={inputClass(e.name)}
          />
          {e.name && (
            <span className="mt-1 block text-sm text-red-600">{e.name}</span>
          )}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Email</span>
          <input
            key={v.email}
            name="email"
            type="email"
            defaultValue={v.email}
            className={inputClass(e.email)}
          />
          {e.email && (
            <span className="mt-1 block text-sm text-red-600">{e.email}</span>
          )}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Role</span>
          <select
            key={v.role}
            name="role"
            defaultValue={v.role}
            className={inputClass(e.role)}
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
          {e.role && (
            <span className="mt-1 block text-sm text-red-600">{e.role}</span>
          )}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Password</span>
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder={
              user ? "Kosongkan jika tidak diganti" : "Minimal 6 karakter"
            }
            className={inputClass(e.password)}
          />
          {e.password && (
            <span className="mt-1 block text-sm text-red-600">
              {e.password}
            </span>
          )}
        </label>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" loading={pending}>
          {pending ? "Menyimpan..." : submitLabel}
        </Button>
        <ButtonLink href="/users" variant="ghost">
          Batal
        </ButtonLink>
      </div>
    </form>
  );
}
