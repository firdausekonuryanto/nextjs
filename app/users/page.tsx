import Link from "next/link";
import { getUsers } from "@/lib/users";
import DeleteButton from "./delete-button";
import { Button, ButtonLink } from "@/app/components/ui/button";

const messages: Record<string, string> = {
  created: "User berhasil ditambahkan.",
  updated: "User berhasil diperbarui.",
  deleted: "User berhasil dihapus.",
};
const tanggal = (d: Date) =>
  new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(d));

export default async function UsersPage({ searchParams }: PageProps<"/users">) {
  const { q = "", msg } = (await searchParams) as { q?: string; msg?: string };
  const users = await getUsers(q);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Daftar Users</h1>
        <ButtonLink href="/users/new">+ Tambah User</ButtonLink>
      </div>

      {msg && messages[msg] && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
          {messages[msg]}
        </div>
      )}

      <form className="flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Cari nama atau email..."
          className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2"
        />
        <button className="rounded-lg border bg-white px-4 py-2 hover:bg-slate-100">
          Cari
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Dibuat</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-3 text-slate-500">{u.id}</td>
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">
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
                <td className="px-4 py-3 text-slate-500">
                  {tanggal(u.created_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-4">
                    <Link
                      href={`/users/${u.id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteButton id={u.id} name={u.name} />
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
                  {q ? `Tidak ada user dengan kata "${q}".` : "Belum ada user."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
