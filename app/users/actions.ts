"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteUser,
  emailExists,
  insertUser,
  updateUser,
  type Role,
  type UserInput,
} from "@/lib/users";

export type UserFormState = {
  errors?: Partial<Record<"name" | "email" | "role" | "password", string>>;
  values?: { name: string; email: string; role: string };
};

async function validate(formData: FormData, id?: number) {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "")
      .trim()
      .toLowerCase(),
    role: String(formData.get("role") ?? ""),
  };
  const password = String(formData.get("password") ?? "");
  const errors: UserFormState["errors"] = {};

  if (!values.name) errors.name = "Nama wajib diisi.";
  else if (values.name.length > 100)
    errors.name = "Nama maksimal 100 karakter.";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "Format email tidak valid.";
  else if (await emailExists(values.email, id))
    errors.email = "Email sudah dipakai.";

  if (values.role !== "admin" && values.role !== "staff")
    errors.role = "Pilih role.";

  // Tambah: password wajib. Edit: boleh kosong (tidak diganti).
  if (id === undefined && !password) errors.password = "Password wajib diisi.";
  else if (password && password.length < 6)
    errors.password = "Password minimal 6 karakter.";

  const data: UserInput = {
    ...values,
    role: values.role as Role,
    password: password || undefined,
  };
  return { values, errors, data, ok: Object.keys(errors).length === 0 };
}

export async function createUserAction(
  _prev: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  const { ok, errors, values, data } = await validate(formData);
  if (!ok) return { errors, values };
  await insertUser(data);
  revalidatePath("/users");
  redirect("/users?msg=created");
}

export async function updateUserAction(
  id: number,
  _prev: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  const { ok, errors, values, data } = await validate(formData, id);
  if (!ok) return { errors, values };
  await updateUser(id, data);
  revalidatePath("/users");
  redirect("/users?msg=updated");
}

export async function deleteUserAction(id: number) {
  await deleteUser(id);
  revalidatePath("/users");
  redirect("/users?msg=deleted");
}
