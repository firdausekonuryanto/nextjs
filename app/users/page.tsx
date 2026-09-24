import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { getUser, getUsers } from "@/lib/users";
import { requireAdmin } from "@/lib/dal";
import DeleteButton from "./delete-button";
import UserForm from "./user-form";

const messages: Record<string, string> = {
  created: "User berhasil ditambahkan.",
  updated: "User berhasil diperbarui.",
  deleted: "User berhasil dihapus.",
};
const errors: Record<string, string> = {
  self: "Anda tidak bisa menghapus akun sendiri.",
};

const tanggal = (d: Date) =>
  new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(d));

export default async function UsersPage({ searchParams }: PageProps<"/users">) {
  const me = await requireAdmin();
  const {
    q = "",
    msg,
    edit,
  } = (await searchParams) as { q?: string; msg?: string; edit?: string };

  const users = await getUsers(q);
  const editing = edit ? await getUser(Number(edit)) : undefined; // ?edit=5 → mode edit

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Users</h1>

      {msg && messages[msg] && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
          {messages[msg]}
        </div>
      )}
      {msg && errors[msg] && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {errors[msg]}
        </div>
      )}

      {/* FORM di atas */}
      <UserForm
        key={editing ? `edit-${editing.id}` : `new-${crypto.randomUUID()}`}
        user={editing}
      />

      {/* LIST di bawah */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
          <h2 className="font-semibold">
            Daftar Users{" "}
            <span className="font-normal text-slate-400">({users.length})</span>
          </h2>
          <form className="flex w-full gap-2 sm:w-auto">
            <input
              name="q"
              defaultValue={q}
              placeholder="Cari nama atau email..."
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm sm:w-64"
            />
            <Button variant="secondary" size="sm">
              Cari
            </Button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-2.5">#</th>
                <th className="px-4 py-2.5">Nama</th>
                <th className="px-4 py-2.5">Email</th>
                <th className="px-4 py-2.5">Role</th>
                <th className="px-4 py-2.5">Dibuat</th>
                <th className="px-4 py-2.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className={`border-t ${editing?.id === u.id ? "bg-blue-50" : "hover:bg-slate-50"}`}
                >
                  <td className="px-4 py-2.5 text-slate-500">{u.id}</td>
                  <td className="px-4 py-2.5 font-medium">{u.name}</td>
                  <td className="px-4 py-2.5">{u.email}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        u.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">
                    {tanggal(u.created_at)}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/users?edit=${u.id}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      {u.id !== me.id && (
                        <DeleteButton id={u.id} name={u.name} />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-slate-500"
                  >
                    {q
                      ? `Tidak ada user dengan kata "${q}".`
                      : "Belum ada user."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
