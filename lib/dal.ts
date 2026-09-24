import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { readSession } from "./session";
import { getUser } from "./users";

// User yang sedang login (atau null). cache() = cukup 1x query per request.
export const getCurrentUser = cache(async () => {
  const session = await readSession();
  if (!session) return null;
  return (await getUser(session.userId)) ?? null; // user sudah dihapus → dianggap logout
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/?msg=forbidden");
  return user;
}
