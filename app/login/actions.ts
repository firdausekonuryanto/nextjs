"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getUserForLogin } from "@/lib/users";
import { createSession, deleteSession } from "@/lib/session";

export type LoginState = { error?: string; email?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password)
    return { error: "Email dan password wajib diisi.", email };

  const user = await getUserForLogin(email);
  const valid = user && (await bcrypt.compare(password, user.password)); // = Hash::check()
  if (!valid) return { error: "Email atau password salah.", email };

  await createSession({ userId: user.id, role: user.role });
  redirect("/");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}
