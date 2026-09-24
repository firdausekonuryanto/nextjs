"use client";

import { useActionState } from "react";
import { Button, ButtonLink } from "@/app/components/ui/button";
import {
  createUserAction,
  updateUserAction,
  type UserFormState,
} from "./actions";
import type { User } from "@/lib/users";

const inputClass = (error?: string) =>
  `w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${
    error ? "border-red-500" : "border-slate-300"
  }`;

// Satu form untuk Tambah & Edit. Kalau `user` ada → mode edit.
export default function UserForm({ user }: { user?: User }) {
  const action = user ? updateUserAction.bind(null, user.id) : createUserAction;
  const [state, formAction, pending] = useActionState<UserFormState, FormData>(
    action,
    {},
  );

  const v = state.values ?? {
    name: user?.name ?? "",
    email: user?.email ?? "",
    role: user?.role ?? "staff",
  };
  const e = state.errors ?? {};

  return (
    <form
      action={formAction}
      className={`rounded-xl border bg-white p-5 shadow-sm ${user ? "border-blue-300 ring-2 ring-blue-100" : ""}`}
    >
      <h2 className="mb-4 font-semibold">
        {user ? (
          <>
            Edit User <span className="text-slate-400">#{user.id}</span>
          </>
        ) : (
          "Tambah User"
        )}
      </h2>

      {/* Desktop: Nama | Email | Role | Password | Tombol dalam 1 baris */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:items-start">
        <label className="block lg:col-span-3">
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

        <label className="block lg:col-span-3">
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

        <label className="block lg:col-span-2">
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

        <label className="block lg:col-span-2">
          <span className="mb-1 block text-sm font-medium">Password</span>
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder={user ? "Kosong = tetap" : "Min. 6 huruf"}
            className={inputClass(e.password)}
          />
          {e.password && (
            <span className="mt-1 block text-sm text-red-600">
              {e.password}
            </span>
          )}
        </label>

        <div className="flex gap-2 sm:col-span-2 lg:col-span-2 lg:pt-6">
          <Button type="submit" loading={pending} className="flex-1">
            {user ? "Update" : "Simpan"}
          </Button>
          {user && (
            <ButtonLink href="/users" variant="secondary">
              Batal
            </ButtonLink>
          )}
        </div>
      </div>
    </form>
  );
}
