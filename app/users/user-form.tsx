"use client";

import { useActionState } from "react";
import { Button, ButtonLink } from "@/app/components/ui/button";
import { Field, inputClass } from "@/app/components/ui/form";
import { Icon } from "@/app/components/ui/icons";
import {
  createUserAction,
  updateUserAction,
  type UserFormState,
} from "./actions";
import type { User } from "@/lib/users";

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
      className={`mb-4 rounded-lg border bg-white px-4 py-3 print:hidden ${user ? "border-blue-300 ring-2 ring-blue-100" : ""}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <span
            className={`h-2 w-2 rounded-full ${user ? "bg-blue-500" : "bg-emerald-500"}`}
          />
          {user ? (
            <>
              Edit User <span className="text-slate-400">#{user.id}</span>
            </>
          ) : (
            "Tambah User Baru"
          )}
        </h2>
        <span className="hidden text-xs text-slate-400 sm:block">
          Password disimpan terenkripsi (bcrypt)
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:items-start">
        <Field className="lg:col-span-3" label="Nama" required error={e.name}>
          <input
            key={v.name}
            name="name"
            defaultValue={v.name}
            placeholder="Nama lengkap"
            className={inputClass(e.name)}
          />
        </Field>
        <Field className="lg:col-span-3" label="Email" required error={e.email}>
          <input
            key={v.email}
            name="email"
            type="email"
            defaultValue={v.email}
            placeholder="nama@email.com"
            className={inputClass(e.email)}
          />
        </Field>
        <Field className="lg:col-span-2" label="Role" error={e.role}>
          <select
            key={v.role}
            name="role"
            defaultValue={v.role}
            className={inputClass(e.role)}
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </Field>
        <Field
          className="lg:col-span-2"
          label="Password"
          required={!user}
          error={e.password}
        >
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder={user ? "Kosong = tetap" : "Min. 6 huruf"}
            className={inputClass(e.password)}
          />
        </Field>
        <div className="flex gap-2 sm:col-span-2 lg:col-span-2 lg:pt-5">
          <Button
            type="submit"
            loading={pending}
            size="sm"
            className="h-9 flex-1"
          >
            {!pending && (user ? <Icon.Pencil /> : <Icon.Plus />)}
            {user ? "Update" : "Simpan"}
          </Button>
          {user && (
            <ButtonLink
              href="/users"
              variant="secondary"
              size="sm"
              className="h-9"
            >
              Batal
            </ButtonLink>
          )}
        </div>
      </div>
    </form>
  );
}
